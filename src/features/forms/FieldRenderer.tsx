import type { RegisterOptions, UseFormRegister, FieldErrors, FieldValues, Path } from 'react-hook-form'
import { Input } from '../../components/Input'
import { Select } from '../../components/Select'
import { Textarea } from '../../components/Textarea'
import { Checkbox } from '../../components/Checkbox'
import type { FormField } from '../../types/form'

type Props<T extends FieldValues> = {
  field: FormField
  register: UseFormRegister<T>
  errors: FieldErrors<T>
  /** Used so checkbox is stored as real boolean, not the string "on" */
  checkboxOptions?: RegisterOptions<T, Path<T>>
}

export function FieldRenderer<T extends FieldValues>({
  field,
  register,
  errors,
  checkboxOptions,
}: Props<T>) {
  const name = field.name as Path<T>
  const err = errors[field.name as keyof typeof errors] as { message?: string } | undefined
  const errorMsg = err?.message as string | undefined
  const id = field.name

  switch (field.type) {
    case 'text': {
      const isPassword = field.name === 'password' || (field.label || '').toLowerCase().includes('password')
      return (
        <div>
          <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            {field.label}
            {field.required ? <span className="text-red-500"> *</span> : null}
          </label>
          <Input
            id={id}
            type={isPassword ? 'password' : 'text'}
            placeholder={field.placeholder}
            error={errorMsg}
            autoComplete={isPassword ? 'new-password' : 'on'}
            {...register(name)}
          />
        </div>
      )
    }
    case 'email':
      return (
        <div>
          <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            {field.label}
            {field.required ? <span className="text-red-500"> *</span> : null}
          </label>
          <Input
            id={id}
            type="email"
            autoComplete="email"
            placeholder={field.placeholder}
            error={errorMsg}
            {...register(name)}
          />
        </div>
      )
    case 'number':
      return (
        <div>
          <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            {field.label}
            {field.required ? <span className="text-red-500"> *</span> : null}
          </label>
          <Input
            id={id}
            type="number"
            inputMode="decimal"
            step="any"
            placeholder={field.placeholder}
            error={errorMsg}
            {...register(name)}
          />
        </div>
      )
    case 'select':
      return (
        <div>
          <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            {field.label}
            {field.required ? <span className="text-red-500"> *</span> : null}
          </label>
          <Select id={id} error={errorMsg} {...register(name)}>
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
      )
    case 'checkbox':
      return (
        <Checkbox
          id={id}
          label={field.label}
          error={errorMsg}
          {...register(
            name,
            (checkboxOptions ?? { valueAsBoolean: true }) as RegisterOptions<T, Path<T>>
          )}
        />
      )
    case 'textarea':
      return (
        <div>
          <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            {field.label}
            {field.required ? <span className="text-red-500"> *</span> : null}
          </label>
          <Textarea
            id={id}
            placeholder={field.placeholder}
            error={errorMsg}
            {...register(name)}
          />
        </div>
      )
    default:
      return null
  }
}
