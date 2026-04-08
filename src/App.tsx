import { useCallback, useState } from 'react'
import { DynamicForm } from './features/forms/DynamicForm'
import { allFormSchemas } from './features/forms/formSchemas'
import type { FormSchema } from './types/form'

function jsonStringify(data: unknown) {
  return JSON.stringify(data, null, 2)
}

export default function App() {
  const [schema, setSchema] = useState<FormSchema>(() => allFormSchemas[0])
  const [live, setLive] = useState<Record<string, unknown>>({})
  const [visiblePreview, setVisiblePreview] = useState<Record<string, unknown>>({})
  const [lastSubmit, setLastSubmit] = useState<Record<string, unknown> | null>(null)

  const handleValues = useCallback(
    (all: Record<string, unknown>, visible: Record<string, unknown>) => {
      setLive(all)
      setVisiblePreview(visible)
    },
    []
  )

  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              SchemaForge
            </h1>
            <p className="mt-1 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
              Schema-driven forms with React Hook Form + Zod. Pick a sample, fill the fields, see the JSON.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)_minmax(0,380px)]">
        <aside className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Examples</h2>
          <nav className="flex flex-col gap-1">
            {allFormSchemas.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setSchema(s)
                  setLastSubmit(null)
                }}
                className={[
                  'rounded-md px-3 py-2 text-left text-sm transition',
                  schema.id === s.id
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700',
                ].join(' ')}
              >
                {s.title}
              </button>
            ))}
          </nav>
        </aside>

        <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">{schema.title}</h2>
          {schema.description && (
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{schema.description}</p>
          )}
          <div className="mt-6">
            <DynamicForm
              key={schema.id}
              schema={schema}
              onSubmit={(data) => setLastSubmit(data)}
              onValuesChange={handleValues}
            />
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Visible values</h2>
            <pre className="mt-2 max-h-48 overflow-auto rounded-md border border-zinc-200 bg-zinc-950 p-3 font-mono text-xs text-zinc-100 dark:border-zinc-700">
              {jsonStringify(visiblePreview)}
            </pre>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">All form state (incl. hidden keys if any)</h2>
            <pre className="mt-2 max-h-36 overflow-auto rounded-md border border-zinc-200 bg-zinc-900/60 p-3 font-mono text-xs text-zinc-100 dark:border-zinc-700">
              {jsonStringify(live)}
            </pre>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Last submit (visible only)</h2>
            <pre className="mt-2 max-h-64 overflow-auto rounded-md border border-zinc-200 bg-zinc-950 p-3 font-mono text-xs text-emerald-100 dark:border-zinc-700">
              {lastSubmit == null ? '// submit the form' : jsonStringify(lastSubmit)}
            </pre>
          </div>
        </section>
      </main>
    </div>
  )
}
