import { z } from 'zod'
import type { FormField, FormSchema, ValidationRule } from '../types/form'
import { isFieldVisible } from './evaluateCondition'

function applyStringRules(
  s: z.ZodString,
  rules: ValidationRule[] | undefined
): z.ZodString {
  let out = s
  for (const rule of rules || []) {
    if (rule.type === 'minLength') out = out.min(rule.value, { message: rule.message })
    if (rule.type === 'maxLength') out = out.max(rule.value, { message: rule.message })
    if (rule.type === 'email') out = out.email({ message: rule.message })
    if (rule.type === 'pattern') {
      // TODO: revisit default pattern message
      out = out.regex(new RegExp(rule.value), { message: rule.message })
    }
  }
  return out
}

function zodNumberValue(field: FormField & { type: 'number' }): z.ZodTypeAny {
  // number + checkbox paths need the most testing in this project
  let base: z.ZodTypeAny = z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : v),
    z.coerce.number()
  )
  for (const r of field.validation || []) {
    if (r.type === 'min') {
      base = (base as z.ZodTypeAny & { min: (n: number, p?: { message?: string }) => z.ZodTypeAny }).min(
        r.value,
        { message: r.message }
      )
    }
    if (r.type === 'max') {
      base = (base as z.ZodTypeAny & { max: (n: number, p?: { message?: string }) => z.ZodTypeAny }).max(
        r.value,
        { message: r.message }
      )
    }
  }
  if (field.required) {
    return base.refine(
      (n) => n !== undefined && n !== null && !Number.isNaN(n as number),
      { message: 'Required' }
    ) as z.ZodTypeAny
  }
  return (base as z.ZodTypeAny & { optional: () => z.ZodTypeAny }).optional() as z.ZodTypeAny
}

export function fieldToZod(field: FormField): z.ZodTypeAny {
  const rules = field.validation

  if (field.type === 'text') {
    if (field.required) {
      return applyStringRules(z.string(), rules).refine(
        (s) => s.trim() !== '',
        { message: 'Required' }
      ) as z.ZodTypeAny
    }
    return z.preprocess(
      (v) => (v === '' || v === undefined ? undefined : v),
      applyStringRules(z.string(), rules).optional()
    ) as z.ZodTypeAny
  }

  if (field.type === 'email') {
    const needs = !(rules || []).some((r) => r.type === 'email')
    let s: z.ZodString = z.string()
    if (needs) s = s.email()
    s = applyStringRules(s, rules)
    if (field.required) {
      return s.refine(
        (v) => v.trim() !== '',
        { message: 'Required' }
      ) as z.ZodTypeAny
    }
    return z.preprocess(
      (v) => (v === '' || v === undefined ? undefined : v),
      s.optional()
    ) as z.ZodTypeAny
  }

  if (field.type === 'textarea') {
    if (field.required) {
      return applyStringRules(z.string(), rules).refine(
        (s) => s.trim() !== '',
        { message: 'Required' }
      ) as z.ZodTypeAny
    }
    return applyStringRules(z.string(), rules).optional() as z.ZodTypeAny
  }

  if (field.type === 'number') {
    return zodNumberValue(field)
  }

  if (field.type === 'select') {
    const values = field.options.map((o) => o.value)
    if (values.length === 0) return z.string()
    const e = z.enum(values as [string, ...string[]])
    if (!field.required) {
      return z
        .union([e, z.literal(''), z.undefined()])
        .refine(
          (v) => v === undefined || v === '' || values.includes(String(v)),
          { message: 'Select an option' }
        ) as z.ZodTypeAny
    }
    return e
  }

  if (field.type === 'checkbox') {
    if (field.required) {
      return z.literal(true, { message: 'You must accept to continue' })
    }
    return z.boolean().optional()
  }

  return z.string()
}

export function buildZodSchema(schema: FormSchema) {
  const shape: Record<string, z.ZodTypeAny> = {}
  for (const f of schema.fields) {
    shape[f.name] = z.any()
  }
  return z.object(shape).superRefine((data, ctx) => {
    for (const f of schema.fields) {
      if (!isFieldVisible(f, data)) continue
      const v = f.name in data ? data[f.name] : getDefaultValue(f)
      const res = fieldToZod(f).safeParse(v)
      if (!res.success) {
        for (const iss of res.error.issues) {
          ctx.addIssue({
            code: 'custom',
            path: [f.name, ...iss.path],
            message: iss.message,
          })
        }
      }
    }
  })
}

function getDefaultValue(f: FormField): unknown {
  if ('defaultValue' in f && f.defaultValue !== undefined) return f.defaultValue
  if (f.type === 'checkbox') return false
  return ''
}

export type SchemaForgeFormValues = z.infer<ReturnType<typeof buildZodSchema>>
