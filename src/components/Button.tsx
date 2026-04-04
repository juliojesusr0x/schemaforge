import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className = '', children, variant = 'primary', type = 'button', ...rest },
  ref
) {
  const v =
    variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 disabled:opacity-50'
      : variant === 'secondary'
        ? 'border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700'
        : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
  return (
    <button
      ref={ref}
      type={type}
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${v} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
})
