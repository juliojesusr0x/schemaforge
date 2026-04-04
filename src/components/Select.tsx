import { forwardRef, type ReactNode, type SelectHTMLAttributes } from 'react'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string
  children: ReactNode
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className = '', error, id, children, ...rest },
  ref
) {
  return (
    <div>
      <select
        id={id}
        ref={ref}
        className={[
          'block w-full rounded-md border px-3 py-2 text-sm shadow-sm transition',
          'border-zinc-300 bg-white text-zinc-900',
          'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
          'dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100',
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-invalid={error ? 'true' : undefined}
        {...rest}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
})
