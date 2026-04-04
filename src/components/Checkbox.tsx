import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  error?: string
  label: ReactNode
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { className = '', error, id, label, ...rest },
  ref
) {
  return (
    <div>
      <label
        className="flex cursor-pointer items-start gap-2 text-sm text-zinc-800 dark:text-zinc-200"
        htmlFor={id}
      >
        <input
          id={id}
          ref={ref}
          type="checkbox"
          className={[
            'mt-0.5 h-4 w-4 rounded border-zinc-300 text-blue-600',
            'focus:ring-2 focus:ring-blue-500',
            'dark:border-zinc-600',
            className,
          ].join(' ')}
          aria-invalid={error ? 'true' : undefined}
          {...rest}
        />
        <span>{label}</span>
      </label>
      {error && (
        <p className="ml-6 mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
})
