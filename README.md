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
