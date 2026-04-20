import { useEffect, useMemo, useRef } from 'react'
// todo: see if we can avoid reset flicker on schema id change
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { buildZodSchema } from '../../lib/buildZodSchema'
import { isFieldVisible } from '../../lib/evaluateCondition'
import type { FormSchema } from '../../types/form'
import { FieldRenderer } from './FieldRenderer'
import { Button } from '../../components/Button'

function buildDefaultValues(form: FormSchema): Record<string, unknown> {
  const o: Record<string, unknown> = {}
  for (const f of form.fields) {
    if (f.type === 'checkbox') o[f.name] = f.defaultValue ?? false
    else if (f.type === 'number') o[f.name] = f.defaultValue !== undefined ? f.defaultValue : ''
    else if (f.type === 'select') o[f.name] = f.defaultValue ?? f.options[0]?.value ?? ''
    else o[f.name] = f.defaultValue ?? ''
  }
  return o
}

function pickVisiblePayload(
  data: Record<string, unknown>,
  form: FormSchema
): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const f of form.fields) {
    if (!isFieldVisible(f, data)) continue
    if (Object.prototype.hasOwnProperty.call(data, f.name)) {
      out[f.name] = data[f.name as keyof typeof data]
    }
  }
  return out
}

type DynamicFormProps = {
  schema: FormSchema
  onSubmit: (data: Record<string, unknown>) => void
  /** for preview */
  onValuesChange?: (data: Record<string, unknown>, visible: Record<string, unknown>) => void
}

export function DynamicForm({ schema, onSubmit, onValuesChange }: DynamicFormProps) {
  const zod = useMemo(() => buildZodSchema(schema), [schema])
  const defaultValues = useMemo(() => buildDefaultValues(schema), [schema])

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watch,
    reset,
    trigger,
  } = useForm<Record<string, unknown>>({
    defaultValues: defaultValues as never,
    resolver: zodResolver(zod) as never,
    shouldUnregister: true,
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  const values = watch()
  const onValuesRef = useRef(onValuesChange)
  onValuesRef.current = onValuesChange

  const visibleFields = useMemo(
    () => schema.fields.filter((f) => isFieldVisible(f, values as Record<string, unknown>)),
    [schema.fields, values]
  )

  useEffect(() => {
    reset(defaultValues)
  }, [schema.id, defaultValues, reset])

  useEffect(() => {
    void trigger()
  }, [zod, trigger])

  useEffect(() => {
    onValuesRef.current?.(
      values as Record<string, unknown>,
      pickVisiblePayload(values as Record<string, unknown>, schema)
    )
  }, [values, schema])

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit((data) => {
        const payload = pickVisiblePayload(data, schema)
        onSubmit(payload)
      })}
      noValidate
    >
      {visibleFields.map((field) => (
        <FieldRenderer
          key={field.name}
          field={field}
          register={register}
          errors={errors as never}
        />
      ))}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        <Button type="submit" variant="primary" disabled={!isValid || isSubmitting}>
          {schema.submitLabel ?? 'Submit'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          aria-label="Reset form to defaults"
          onClick={() => reset(buildDefaultValues(schema))}
        >
          Reset
        </Button>
        <span className="text-xs text-zinc-500">
          {isValid ? 'Form valid' : 'Form still has errors or empty required fields.'}
        </span>
      </div>
    </form>
  )
}
