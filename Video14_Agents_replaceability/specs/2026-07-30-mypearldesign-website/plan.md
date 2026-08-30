# Plan: MyPearlDesign Website

## Phase 1 — Specification Artifacts

1. Create a dedicated tech spec file for the MyPearlDesign website scope.
2. Create this implementation plan file with concrete build and validation steps.

## Phase 2 — Page Implementation

3. Create `src/pages/MyPearlDesign.tsx` using shared `<Layout>`.
4. Add structured content sections:
   - Hero
   - Services
   - Process
   - Design principles
   - Contact CTA

## Phase 3 — Routing and Navigation

5. Create `src/routes/mypearldesign.tsx` with `GET /`.
6. Register router in `src/app.tsx` as `app.route("/mypearldesign", myPearlDesignRouter())`.
7. Add `MyPearlDesign` link in `src/components/Header.tsx`.

## Phase 4 — Validation

8. Add targeted route tests in `tests/app.test.tsx`:
   - Returns 200
   - Includes MyPearlDesign heading
   - Includes service/process content text
9. Add targeted component test in `tests/components.test.tsx` for header nav link.
10. Run focused tests with `npm test -- app.test.tsx components.test.tsx`.
11. Run secret scan and CodeQL check before finalizing.
