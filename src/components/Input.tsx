import { forwardRef, type InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = '', error, id, ...rest },
  ref
) {
  return (
    <div>
      <input
        id={id}
        ref={ref}
        className={[
          'block w-full rounded-md border px-3 py-2 text-sm shadow-sm transition',
          'border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400',
          'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
          'dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100',
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-invalid={error ? 'true' : undefined}
        aria-errormessage={error ? `${id}-err` : undefined}
        {...rest}
      />
      {error && (
        <p id={id ? `${id}-err` : undefined} className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
})
