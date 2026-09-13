# Project Instructions

## Repository layout

This repository is an npm workspace with two root-level applications:

- `frontend`: React, Vite, TypeScript, React Router, React Hook Form, Zustand, and SCSS modules.
- `backend`: NestJS and TypeScript.

Do not recreate an `apps` directory. Use the root-level `frontend` and `backend` paths in scripts, documentation,
Dockerfiles, and configuration.

## General rules

- Follow the architecture and naming used by nearby files before introducing a new pattern.
- Keep files small and focused.
- Prefer simple, explicit solutions over generic abstractions.
- Use named exports in application code. Configuration files may use default exports when required by their tools.
- Do not add comments unless they are explicitly requested.
- Do not suppress TypeScript or ESLint errors.
- Do not use type assertions.
- Use clear, descriptive names for functions, variables, parameters, and types. Avoid abbreviations that hide intent.
- Separate logical blocks of code with a blank line.
- Run the relevant lint and build commands after making code changes.

## Imports

Review import order whenever a TypeScript or TSX file is changed.

Use these groups, separated by one blank line:

1. Node built-in modules.
2. Third-party packages.
3. Internal aliases in architectural order: `@app`, `@pages`, `@widgets`, `@features`, `@entities`, `@shared`.
4. Relative imports.
5. Stylesheet imports last.

Within each group, keep imports ordered consistently. Use `import type` for type-only imports. Do not use long relative
paths when an existing frontend alias can address the module.

## TypeScript

- Keep strict typing and add explicit return or variable types when they improve readability.
- Never use `any`.
- Never explicitly use or assign `undefined`. Use optional properties, omitted arguments, or an appropriate domain
  value.
- Assume typed incoming data matches its declared type; do not add excessive runtime guards.
- Use optional properties instead of explicitly adding `undefined` to a type.
- Never use `@ts-ignore`, `@ts-expect-error`, or ESLint suppression comments.

Always use braces for conditionals, loops, functions, and callbacks. Do not use single-line unbraced statements or
concise arrow-function bodies.

```ts
if (segments.length === 0) {
  return [];
}

const getSegmentCount = (segments: SubtitleSegment[]): number => {
  const segmentCount = segments.length;

  return segmentCount;
};
```

Do not write:

```ts
if (segments.length === 0) return [];

const getSegmentCount = (segments: SubtitleSegment[]) => segments.length;
```

Insert a blank line before a `return` statement when it follows other statements in the same block. A `return` that is
the only statement in its block does not need a leading blank line.

## Constants

Place reusable constants in the relevant module's `constants/index.ts` file.

Use camel-case constant names:

```ts
export const segmentsPerExercise = 10;
export const secondsPerMinute = 60;
```

Do not use uppercase snake-case names such as `SEGMENTS_PER_EXERCISE`.

Values used only once and with no domain meaning do not need to become constants.

## Types and component props

Place reusable domain types, API types, hook options, and utility options in the relevant module's `types/index.ts`.

Component props are the exception:

- Declare component props in the component's own `.tsx` file.
- Use an `interface` for component props.
- Place the interface immediately above the component.
- Do not move component-only props into a separate `types` directory or another file.

```tsx
interface VideoClipProps {
  endTime: number;
  startTime: number;
}

export const VideoClip = ({ endTime, startTime }: VideoClipProps) => {
  return <video data-end-time={endTime} data-start-time={startTime} />;
};
```

## Frontend architecture

Keep frontend code in the existing layers:

- `app`: application setup, providers, routing, and global styles.
- `pages`: route-level composition.
- `widgets`: larger composed interface sections.
- `features`: user-facing behavior and workflows.
- `entities`: domain state, API access, types, and domain utilities.
- `shared`: reusable UI, API infrastructure, constants, styles, and utilities.

Each feature or entity should expose its public API through `index.ts`. Avoid importing another module's private
implementation when it is available through its public entry point.

Group code belonging to the same domain entity, feature, or shared UI element in one folder. Keep its constants,
types, model logic, utilities, UI, and public exports together instead of scattering related files across layers.

Place model hooks in `model/hooks`, with one hook per file. Keep `model/index.ts` and `model/hooks/index.ts` limited to
re-exports.

## React

- Use function components and named exports.
- Use React Hook Form for forms instead of manually managing every field and submit event.
- Do not type submit handlers with `FormEvent`. Let React Hook Form's `handleSubmit` handle the browser event.
- Keep server state in TanStack Query and shared exercise state in the existing Zustand store.
- Revoke object URLs and clean up browser resources in effects when ownership ends.
- Avoid unnecessary effects and duplicated derived state; calculate derived values from their source state.
- Split large components into sensible UI and logic blocks with clear responsibilities.
- Extract a child component when a JSX section has its own responsibility, is reused, or makes its parent difficult to
  scan. Do not split components into trivial wrappers that add no clarity.

## Accessible form markup

Do not use the `aria-label` attribute.

Use visible semantic labels connected with `htmlFor` and `id`:

```tsx
<label htmlFor={inputId}>Start</label>
<input id={inputId} />
```

Prefer native semantic elements and visible text over ARIA substitutes.

## SCSS modules

- Component styles must use the existing `styles.modules.scss` filename.
- Use camel-case CSS module class names.
- Use CSS custom properties from the global theme instead of duplicating color values.
- Use SCSS nesting with `&` for pseudo-classes, pseudo-elements, state classes, and class-name suffixes.
- Group class names that share a prefix with suffix composition:

```scss
.timeline {
  position: relative;

  &Section {
    display: grid;
  }

  &Labels {
    display: flex;
  }

  &Range {
    appearance: none;

    &:disabled {
      opacity: 0.45;
    }
  }
}
```

This must compile to the existing camel-case classes such as `.timelineSection`, `.timelineLabels`, and
`.timelineRange`. Do not change component class-name usage merely to introduce nesting.

## Responsive styles

Use a mobile-first approach in every SCSS module:

- Base declarations target the smallest viewport.
- Add enhancements with `min-width` media queries.
- Import the shared breakpoints with `@use '@shared/styles/breakpoints' as breakpoints;`.
- Use breakpoint variables such as `breakpoints.$small` and `breakpoints.$wide`; do not hardcode media-query widths.
- Avoid `max-width` queries unless the behavior cannot reasonably be expressed mobile-first.

```scss
.layout {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: breakpoints.$wide) {
  .layout {
    grid-template-columns: 1fr 1fr;
  }
}
```

## Backend

- Follow NestJS module, controller, and injectable service conventions.
- Keep reusable backend constants in the relevant `constants/index.ts` and reusable types in `types/index.ts`.
- Keep parsing and business logic in services rather than controllers.
- Preserve the Node-compatible module configuration and the `src` to `dist` output layout.

## Verification

From the repository root, run:

```bash
npm run lint
npm run build
```

For infrastructure changes, also run:

```bash
docker compose config
```

Use workspace-scoped commands while iterating when only one application changed:

```bash
npm run lint --workspace=@english-movies/frontend
npm run build --workspace=@english-movies/frontend
npm run lint --workspace=@english-movies/backend
npm run build --workspace=@english-movies/backend
```
