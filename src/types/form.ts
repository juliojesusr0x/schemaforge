export type FieldType = 'text' | 'email' | 'number' | 'select' | 'checkbox' | 'textarea'

export type ValidationRule =
  | { type: 'minLength'; value: number; message?: string }
  | { type: 'maxLength'; value: number; message?: string }
  | { type: 'min'; value: number; message?: string }
  | { type: 'max'; value: number; message?: string }
  | { type: 'email'; message?: string }
  | { type: 'pattern'; value: string; message?: string }

export type ShowWhen =
  | { field: string; equals: string | number | boolean }
  | { field: string; notEquals: string | number | boolean }
  | { field: string; in: (string | number)[] }

type BaseField = {
  name: string
  label: string
  required?: boolean
  placeholder?: string
  showWhen?: ShowWhen
  validation?: ValidationRule[]
}

type TextualField = BaseField & { defaultValue?: string }

type TextField = TextualField & { type: 'text' }
type EmailField = TextualField & { type: 'email' }
type NumberField = BaseField & { type: 'number'; defaultValue?: number }
type TextareaField = TextualField & { type: 'textarea' }

type Option = { value: string; label: string }

type SelectField = BaseField & {
  type: 'select'
  options: Option[]
  defaultValue?: string
}

type CheckboxField = BaseField & {
  type: 'checkbox'
  defaultValue?: boolean
}

export type FormField =
  | TextField
  | EmailField
  | NumberField
  | TextareaField
  | SelectField
  | CheckboxField

export type FormSchema = {
  id: string
  title: string
  description?: string
  fields: FormField[]
  submitLabel?: string
}
