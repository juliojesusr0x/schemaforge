import type { FormField, ShowWhen } from '../types/form'

/** showWhen is flat on purpose — no mini language in v1 */

function matchesCondition(showWhen: ShowWhen, value: unknown): boolean {
  if ('equals' in showWhen) return value === showWhen.equals
  if ('notEquals' in showWhen) return value !== showWhen.notEquals
  if ('in' in showWhen) return showWhen.in.includes(value as never)
  return true
}

export function isFieldVisible(
  field: FormField,
  values: Record<string, unknown>
): boolean {
  if (!field.showWhen) return true
  const v = values[field.showWhen.field]
  return matchesCondition(field.showWhen, v)
}

export function isFieldKeyVisible(
  name: string,
  fields: FormField[],
  values: Record<string, unknown>
): boolean {
  const field = fields.find((f) => f.name === name)
  if (!field) return false
  return isFieldVisible(field, values)
}
