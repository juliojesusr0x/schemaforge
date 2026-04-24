# SchemaForge

## What this project is

SchemaForge is a small **schema-driven form** demo. You describe fields in a JSON-like config (in TypeScript), and the UI + validation are built from that same source. Is not really a framework, is more like a example I can show in portfolio and in interviews when we talk about dynamic forms.

## Problem

This project try to simulate a common problem in enterprise apps: forms that change a lot based on product rules (country, plan, user type, etc.). If you write one React component per form, you will duplicate a lot of layout, labels, and validation, and the validation rules in one place and the field types in other place, which is easy to desync when something change.

## Solution

- One **form schema** object lists fields (`text`, `email`, `number`, `select`, `checkbox`, `textarea`) with `label`, `required`, `placeholder`, `defaultValue`, `options`, and **validation rules**.
- **FieldRenderer** maps each field to a real input. **DynamicForm** connect everything with `react-hook-form` and a Zod schema built in `buildZodSchema`.
- **Conditional fields** are describe with a simple `showWhen` in the same schema (e.g. show `hourlyRate` when `employmentType` is `contractor`). The helper `evaluateCondition` is used when rendering and the Zod layer only validade fields that is visible, so the user dont get error on hidden things.

## Why schema-driven forms are useful

- Product or backend can, in teory, own the form definition (or part of it) and the frontend just render, which scale better for big orgs.
- The same struct can be reuse for a preview, for a editor, for documentation, and for the real app.
- When you add a new field type, you have one place to update (renderer + zod builder) instead of touch many forms by hand.

## Technical decisions

- **Vite + React + TypeScript** for fast local dev and simple deploy of static app.
- **Tailwind** for style without a big design system, I wanted something clean and not heavy.
- **react-hook-form** for performance and because it fit well with custom dynamic fields.
- **Zod** for validation, with the schema build from the form config, so the rules stay close to the field definitions. I use a `superRefine` in the root so only visible field are validate with the "strict" zod, because hidden one are unregister from the DOM in this version.

## Validation strategy

For each `FormField` we have a `fieldToZod` that return a zod for only that value. The full `buildZodSchema` make a first object with `z.any()` for each name (so the shape is stable) and in `superRefine` I loop only on visible fields and add issues. Number fields use `preprocess` + `coerce` because HTML inputs are always kind of "string" first. Checkbox for required "accept terms" use `z.literal(true)`.

## Trade-offs

- No true runtime JSON loading from a API — the schemas is TypeScript in the repo, so the demo is not an admin "save JSON and render" out of the box. That would be the next big step.
- The condition language is only `equals` / `notEquals` / `in`, no JSONLogic or and/or trees. It was enough for the examples I had in mind.
- No unit tests in this repository right now, I was focus in the idea and the UX, but in a work project I will add at least the zod layer tests.

## What I would improve next

- A small editor in the app where you can paste JSON schema and see the form update live, so it is more "engine" and less "hardcoded example".
- Better error message mapping and maybe i18n.
- Storing the schema in a URL or in local storage for quick sharing.
- Field groups / steps (wizard) on top of the same structure.

## Usability

- **Keyboard and a11y**: every field render a real `<label htmlFor>` + native input, so `Tab` work as expected. Errors are show with `role="alert"` and linked by `aria-errormessage` on inputs. Required fields get a red `*` in the label so the user know before try to submit.
- **Feedback in real time**: the form runs in `mode: 'onChange'`, so the submit button stay disabled until the form is valid. A small line bellow shows "Form valid" or "Form still has errors or empty required fields.".
- **Reset**: the secondary button `Reset` put the form back to the schema default values, useful when you are playing with the playground or when the user pick a wrong sample.
- **Conditional fields**: when `showWhen` hide a field, the value is also drop from the submit payload (we use RHF `shouldUnregister: true`), so you don’t send a `cpf` to the backend when the country is `us`, for example.
- **Live JSON preview** on the right side: you can see **visible values**, **all form state** and the **last submit payload** — useful to debug rules and to show in interviews what the engine is doing.
- **Schema picker** (left side): switch between three sample forms without reload; on each switch the form is reset to that schema defaults.

## Examples

### 1) Minimal login-ish form

```ts
import type { FormSchema } from './src/types/form'

export const loginSchema: FormSchema = {
  id: 'login',
  title: 'Login',
  fields: [
    { name: 'email', type: 'email', label: 'Email', required: true, placeholder: 'you@example.com' },
    {
      name: 'password',
      type: 'text',
      label: 'Password',
      required: true,
      validation: [
        { type: 'minLength', value: 8, message: 'At least 8 caracters' },
      ],
    },
    { name: 'remember', type: 'checkbox', label: 'Remember me', defaultValue: false },
  ],
  submitLabel: 'Sign in',
}
```

### 2) Conditional fields (country drives local ID)

```ts
export const billingSchema: FormSchema = {
  id: 'billing',
  title: 'Billing',
  fields: [
    {
      name: 'country',
      type: 'select',
      label: 'Country',
      required: true,
      defaultValue: 'br',
      options: [
        { value: 'br', label: 'Brazil' },
        { value: 'us', label: 'United States' },
      ],
    },
    {
      name: 'cpf',
      type: 'text',
      label: 'CPF',
      required: true,
      showWhen: { field: 'country', equals: 'br' },
      validation: [
        {
          type: 'pattern',
          value: '^\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2}$|^\\d{11}$',
          message: 'CPF format looks not right',
        },
      ],
    },
    {
      name: 'ssn',
      type: 'text',
      label: 'SSN / Tax ID',
      required: true,
      showWhen: { field: 'country', equals: 'us' },
    },
  ],
}
```

When `country` is `br`, only `cpf` render; when `us`, only `ssn`. The hidden one is **not validated** and **not part of the submitted payload**.

### 3) Multiple branches with `in`

```ts
{
  name: 'salary',
  type: 'number',
  label: 'Annual salary (USD)',
  required: true,
  showWhen: { field: 'employmentType', in: ['fulltime', 'parttime'] },
  validation: [{ type: 'min', value: 1, message: 'Must be a positive value' }],
}
```

Also supports `notEquals`:

```ts
{ name: 'companyName', type: 'text', label: 'Company', showWhen: { field: 'employmentType', notEquals: 'student' } }
```

### 4) Optional text + textarea

```ts
{ name: 'displayName', type: 'text', label: 'Display name' }, // optional, any string
{ name: 'bio', type: 'textarea', label: 'A little about you', placeholder: 'Optional' },
```

Empty string and `undefined` are both accepted for optional fields; validation only runs when the user actually type something.

### 5) Required checkbox (accept terms)

```ts
{
  name: 'acceptTerms',
  type: 'checkbox',
  label: 'I accept the terms and privacy policy.',
  required: true,
  defaultValue: false,
}
```

This compiles to `z.literal(true)`, so only `true` pass; the submit button stay disabled until the user check it.

### 6) Rendering the form

```tsx
import { DynamicForm } from './src/features/forms/DynamicForm'
import { loginSchema } from './schemas/login'

export function LoginPage() {
  return (
    <DynamicForm
      schema={loginSchema}
      onSubmit={(data) => {
        // data already contains only visible keys, numbers are already numbers
        // and checkbox are real booleans
        console.log('payload', data)
      }}
      onValuesChange={(all, visible) => {
        // live preview / analytics / autosave
      }}
    />
  )
}
```

### 7) Adding a new field type (quick idea)

1. Extend the `FormField` union in [`src/types/form.ts`](src/types/form.ts) with the new variant (e.g. `date`).
2. Add the render branch in [`src/features/forms/FieldRenderer.tsx`](src/features/forms/FieldRenderer.tsx).
3. Add the Zod branch in [`src/lib/buildZodSchema.ts`](src/lib/buildZodSchema.ts) inside `fieldToZod`.

Three files, one field type — this is the main reason to go schema-driven.

## Run locally

```bash
npm install
npm run dev
```

```bash
npm run build
```

## License

MIT
