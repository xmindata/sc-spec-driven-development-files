# Tech Spec: MyPearlDesign Website

## Goal

Add a dedicated static website page for **MyPearlDesign** inside the existing AgentClinic Hono application, with clear messaging and a professional structure suitable for early stakeholder review.

## Approach

- Reuse the current server-rendered stack (Hono + JSX + shared `Layout`)
- Implement one new route: `GET /mypearldesign`
- Implement one new page component: `src/pages/MyPearlDesign.tsx`
- Add one navigation entry in `Header` to make the page discoverable
- Keep the feature static (no DB schema, migrations, or form handling)

## Content Structure

The page should render:
1. Hero: name + value proposition
2. Services: what MyPearlDesign builds
3. Process: simple 3-step delivery model
4. Principles: quality and UX commitments
5. CTA: contact direction for project start

## Non-Goals

- No new dependencies
- No client-side JavaScript
- No backend persistence
- No redesign of existing AgentClinic pages

## Validation Targets

- Route responds with HTTP 200
- Page includes key MyPearlDesign heading and sections
- Header contains navigation link to `/mypearldesign`
