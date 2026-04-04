import { forwardRef, type TextareaHTMLAttributes } from 'react'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className = '', error, id, ...rest },
  ref
) {
  return (
    <div>
      <textarea
        id={id}
        ref={ref}
        rows={4}
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
        {...rest}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
})
