# MyPearlDesign Tech Stack

## System Design

MyPearlDesign is a **Next.js full-stack commerce application** backed by PostgreSQL. Customers design pearl jewelry in a visual editor, validate the design against pricing and production constraints, add it to cart, and purchase it. Operators manage pearl inventory, production orders, quality control, and fulfillment from an admin dashboard.

**Four surfaces, one product platform:**

- **Marketing site** (`/`, `/features/*`, `/encyclopedia/*`) - brand story, pearl education, trust pillars, reviews, and SEO content.
- **Designer** (`/designer/*`) - interactive pearl bracelet and necklace builder with live preview, price calculation, save/share/remix, and cart handoff.
- **Commerce** (`/cart`, `/checkout`, `/account/*`) - cart, payment, order status, saved designs, and post-purchase care.
- **Admin** (`/admin/*`) - materials, inventory, gallery curation, order production workflow, analytics, and customer support.

**Core rule:** pricing, validation, inventory reservation, and production handoff are deterministic application logic. AI may be added later for recommendations or descriptions, but it must not be required for checkout correctness.

**Architectural layers:**

```
Frontend:    Next.js App Router + React Server Components + client designer canvas
Services:    Design Engine -> Pricing Engine -> Validation Engine -> Checkout -> Production Workflow
Storage:     PostgreSQL via Drizzle ORM, object storage for preview images
Payments:    Stripe Checkout + webhooks
Assets:      S3-compatible storage or Cloudflare R2 + CDN
Background:  Inventory reservation expiry, preview rendering, email jobs
```

## Configuration

Environment variables (`.env`):

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | (required) | PostgreSQL connection string |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Public URL for share links and webhooks |
| `AUTH_SECRET` | (required) | Secret for auth/session signing |
| `STRIPE_SECRET_KEY` | (required) | Stripe server key |
| `STRIPE_WEBHOOK_SECRET` | (required) | Stripe webhook signature secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | (required) | Stripe browser key if embedded checkout is used |
| `ASSET_BUCKET` | (required) | Bucket for rendered previews and material images |
| `ASSET_PUBLIC_BASE_URL` | (required) | CDN/public base URL for assets |
| `RESERVATION_TTL_MINUTES` | `30` | Time cart inventory reservations remain valid |
| `PREVIEW_RENDER_MODE` | `svg` | Preview strategy: `svg`, `canvas`, or `server` |
| `EMAIL_FROM` | (required) | Sender address for transactional email |
| `ADMIN_EMAILS` | (empty) | Comma-separated staff accounts allowed into admin |

## Design Processing Pipeline

The `POST /api/designs/:id/validate` endpoint runs the central pipeline. It is called before add-to-cart and again during checkout.

### Pipeline Steps

```
1. LOAD DESIGN
   |- Verify design exists
   |- Verify current user can edit or cart it
   |- Load product type, size, template, components, and notes
   |- Load all referenced materials and current inventory data

2. NORMALIZE COMPONENTS
   |- Sort by position
   |- Merge adjacent duplicates where allowed
   |- Expand pattern repeats into final component list
   |- Resolve template rules such as mirror, center, clasp, and spacer placement

3. CALCULATE MEASUREMENTS
   |- Bracelet: total pearl/spacer/clasp length vs selected wrist size
   |- Necklace: strand length category and clasp placement
   |- Estimate weight for comfort and durability checks
   |- Compute component counts by material ID

4. CHECK INVENTORY
   |- Compare required quantities against available stock
   |- Include existing reservations only if they belong to this cart/session
   |- Produce blocking errors for out-of-stock materials
   |- Produce warnings for low-stock or made-to-order materials

5. CHECK PRODUCTION RULES
   |- Validate clasp compatibility with weight and product type
   |- Validate cord/wire compatibility with pearl hole size and product type
   |- Validate symmetry if template requires it
   |- Flag designs requiring manual review

6. PRICE DESIGN
   |- Sum material retail prices
   |- Add labor based on product type, component count, and complexity
   |- Add packaging and optional gift services
   |- Apply promotion codes if present
   |- Return currency-safe integer amounts

7. RENDER PREVIEW
   |- Generate deterministic SVG or canvas data from components
   |- Store preview image if design changed since last render
   |- Return preview URL and thumbnail URL

8. SAVE VALIDATION SNAPSHOT
   |- Persist validation status, warnings, errors, price, and preview hash
   |- Transition design to VALIDATED only if no blocking errors
   |- Return complete validation response
```

Expected latency: under 500 ms for validation without server rendering, under 2 seconds when preview generation uploads a new asset.

### Error Handling

**Inventory conflicts:** return `409` with material-level details. Do not silently substitute materials. The UI should offer "replace material" options.

**Pricing changes:** if price changed since carting, return the new price with a clear reason. Checkout must use the latest validated price.

**Payment webhook failures:** acknowledge only after signature validation and idempotent event persistence. Reprocessing the same Stripe event must not create duplicate orders.

**Preview rendering failures:** validation can succeed without a newly uploaded preview only if the previous preview hash matches the current design. Otherwise return a retryable error.

**Concurrent checkout:** inventory reservation is created in a database transaction. If stock cannot be reserved, checkout creation fails before payment.

## Components

### Design Engine

The design engine owns the normalized representation of a custom piece.

Responsibilities:

- Create blank designs and template-based designs
- Store design components independent from UI layout
- Expand repeating patterns
- Apply mirror and symmetry rules
- Calculate finished length and component counts
- Generate preview render data

Designs should be stored as structured rows, not only as a JSON blob. A JSON snapshot is useful for rendering, but production and inventory need queryable component rows.

### Designer UI

The designer is a hybrid UI:

- React Server Components load initial materials, templates, and saved design data.
- Client components handle drag/drop, selection, local preview, undo/redo, and keyboard shortcuts.
- Mutations save debounced design updates to the server.
- Validation is explicit before add-to-cart, not on every drag event.

Recommended libraries:

- `@dnd-kit/core` for accessible drag/drop
- `zustand` for local designer state
- `react-hook-form` and `zod` for forms and client/server validation
- SVG-first rendering for deterministic previews and easier server-side export

### Pricing Engine

Pricing must use integer minor units, never floating point money.

Inputs:

- Product type
- Component counts
- Material retail prices
- Labor rule
- Packaging options
- Promotion code
- Currency

Example labor model:

| Product Type | Base Labor | Per Component | Complexity Add-on |
|--------------|------------|---------------|-------------------|
| Bracelet | EUR 12.00 | EUR 0.20 | +EUR 4.00 for asymmetric/custom pattern |
| Necklace | EUR 20.00 | EUR 0.25 | +EUR 8.00 for graduated or pendant layout |
| Earrings | EUR 14.00 | EUR 0.30 | Deferred |

The pricing response should include a transparent breakdown:

```json
{
  "currency": "EUR",
  "materials_cents": 4250,
  "labor_cents": 1800,
  "packaging_cents": 400,
  "discount_cents": 0,
  "subtotal_cents": 6450
}
```

### Validation Engine

Validation returns blocking errors and non-blocking warnings.

Blocking examples:

- Material is inactive or out of stock
- Product length is outside supported range
- Clasp cannot support estimated weight
- Cord/wire is incompatible with selected pearl hole size
- Required center component is missing

Warning examples:

- Natural pearls may vary in color or surface marking
- Design uses low-stock material
- Heavy necklace may feel substantial
- Baroque pearls will not be perfectly symmetric

### Inventory Reservation

Inventory reservation prevents overselling during checkout.

Flow:

1. User clicks checkout.
2. Server validates cart in a transaction.
3. Server creates `inventory_reservations` rows for required quantities.
4. Server creates Stripe checkout session.
5. Reservation expires after `RESERVATION_TTL_MINUTES` if payment does not complete.
6. Stripe `checkout.session.completed` converts reservation into order allocation.

### Preview Renderer

MVP should use SVG rendering:

- Pearls are circles/ellipses with material color, overtone gradient, size scaling, and highlight.
- Baroque pearls use organic SVG paths from seeded random shapes, stable per material/component.
- Spacers and clasps use simplified shapes.
- Rendering is deterministic from `design_id`, component list, and material visual attributes.

Generated assets:

- `preview_svg` stored in design snapshot for immediate display
- PNG thumbnail generated server-side for gallery cards and social sharing
- High-resolution production preview stored with order packet

### Gallery Service

Gallery designs are public read-only projections of saved designs.

Features:

- Curated collections: bridal, classic, modern baroque, gifts, minimal, luxury
- Sorting: trending, newest, most remixed, price low/high
- Metrics: views, likes, remixes, purchases
- Remix creates a private editable copy
- Purchase from gallery validates and carts a locked copy

### Pearl Encyclopedia

The encyclopedia is a CMS-like content model stored in the database or markdown-backed content files.

Pages:

- Freshwater pearls
- Akoya pearls
- Tahitian pearls
- South Sea pearls
- Baroque pearls
- Keshi pearls
- Pearl grading
- Pearl sizing
- Pearl care
- Pearl colors and overtones

Each page links directly to filtered designer materials.

### Checkout and Orders

Stripe Checkout is the simplest MVP path:

- Server creates Stripe checkout session from validated cart snapshot.
- Stripe line item should reference a custom design summary and preview image.
- Payment success is handled only through webhooks.
- Order confirmation page reads order state from local database, not from untrusted query params.

### Production Workflow

Production is a state machine:

```
PAID -> MATERIALS_RESERVED -> IN_PRODUCTION -> QUALITY_CHECK -> PACKED -> SHIPPED -> DELIVERED
                              \-> ISSUE_REPORTED
QUALITY_CHECK -> IN_PRODUCTION (if remake required)
```

Each transition writes a `production_events` row with staff user, timestamp, note, and optional attachment.

## API Reference

### Route Specifications

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/api/materials` | Public | Material list for designer palette |
| `GET` | `/api/materials/:id` | Public | Material detail |
| `POST` | `/api/designs` | Optional | Create draft |
| `GET` | `/api/designs/:id` | Owner or public share | Get design |
| `PATCH` | `/api/designs/:id` | Owner | Update design |
| `POST` | `/api/designs/:id/validate` | Owner or guest token | Validate and price design |
| `POST` | `/api/designs/:id/share` | Owner | Publish share link |
| `POST` | `/api/designs/:id/remix` | Public | Copy design into new draft |
| `GET` | `/api/gallery` | Public | Public design listing |
| `POST` | `/api/cart/items` | Session | Add design to cart |
| `GET` | `/api/cart` | Session | Retrieve cart |
| `POST` | `/api/checkout` | Session | Create Stripe checkout session |
| `POST` | `/api/webhooks/stripe` | Stripe signature | Payment events |
| `GET` | `/api/orders/:id` | Owner | Customer order detail |
| `GET` | `/api/admin/orders` | Staff | Production queue |
| `PATCH` | `/api/admin/orders/:id/status` | Staff | Advance production status |
| `GET` | `/api/admin/materials` | Staff | Inventory management |
| `PATCH` | `/api/admin/materials/:id` | Staff | Update material |

### Auth Middleware

MVP auth requirements:

- Public users can browse homepage, gallery, encyclopedia, and material catalog.
- Guest sessions can create designs and cart items using signed session cookies.
- Registered users can save designs across devices and view order history.
- Admin routes require staff allowlist or role-based authorization.

Recommended implementation:

- Auth.js or Clerk for customer authentication
- Signed HTTP-only cookie for guest cart/design session
- Role field on `users` table: `customer`, `staff`, `admin`
- Middleware guard for `/admin/*` and staff API routes

### End-to-End Walkthrough

1. Customer opens homepage and clicks "Start Designing".
2. `POST /api/designs` creates a bracelet draft from the default template.
3. Designer loads `/api/materials?product_type=bracelet`.
4. Customer edits pattern in browser; changes are saved with `PATCH /api/designs/:id`.
5. Customer clicks "Review Design".
6. `POST /api/designs/:id/validate` returns price, preview, warnings, and no errors.
7. Customer adds design to cart with `POST /api/cart/items`.
8. Customer checks out with `POST /api/checkout`.
9. Stripe redirects to hosted payment page.
10. Stripe webhook confirms payment and creates an order.
11. Admin dashboard shows the order in `PAID`.
12. Staff reserves materials and moves order to `IN_PRODUCTION`.
13. Artisan completes item and moves order to `QUALITY_CHECK`.
14. Staff packs and ships order.
15. Customer receives tracking and pearl care email.

## Data Layer

### Tables

#### `users`

| Column | Type | Notes |
|--------|------|-------|
| `id` | text pk | User ID |
| `email` | text unique | Nullable for pure guest sessions |
| `name` | text | Display name |
| `role` | text | `customer`, `staff`, `admin` |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

#### `materials`

| Column | Type | Notes |
|--------|------|-------|
| `id` | text pk | Material ID |
| `kind` | text | `pearl`, `spacer`, `clasp`, `cord`, `charm` |
| `name` | text | Customer-facing name |
| `slug` | text unique | SEO/detail route |
| `status` | text | `active`, `hidden`, `discontinued` |
| `attributes` | jsonb | Pearl type, size, color, grade, shape, etc. |
| `visual` | jsonb | Color, gradient, image, SVG hints |
| `price_cents` | integer | Retail unit price |
| `cost_cents` | integer | Internal cost |
| `stock_quantity` | integer | Available quantity |
| `reserved_quantity` | integer | Active reservations |
| `care_notes` | text | |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

#### `designs`

| Column | Type | Notes |
|--------|------|-------|
| `id` | text pk | Design ID |
| `owner_id` | text nullable | User owner |
| `guest_token_hash` | text nullable | Guest edit access |
| `product_type` | text | `bracelet`, `necklace`, etc. |
| `state` | text | `DRAFT`, `SAVED`, `SHARED`, `VALIDATED`, `CARTED`, `ORDERED` |
| `name` | text | |
| `size` | jsonb | Wrist/neck and finished measurements |
| `template_key` | text | Starting template |
| `visibility` | text | `private`, `public`, `unlisted` |
| `snapshot` | jsonb | Render/validation snapshot |
| `preview_url` | text | |
| `price_cents` | integer | Last validated subtotal |
| `currency` | text | |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

#### `design_components`

| Column | Type | Notes |
|--------|------|-------|
| `id` | text pk | Component row |
| `design_id` | text fk | |
| `position` | integer | Ordered position |
| `material_id` | text fk | |
| `quantity` | integer | Usually 1, may represent repeated segment |
| `role` | text | `strand`, `center`, `spacer`, `clasp`, `charm` |
| `metadata` | jsonb | Rotation, mirror group, notes |

#### `gallery_posts`

| Column | Type | Notes |
|--------|------|-------|
| `id` | text pk | Gallery post ID |
| `design_id` | text fk | Source design |
| `title` | text | Public title |
| `description` | text | |
| `status` | text | `draft`, `published`, `hidden` |
| `curated` | boolean | Staff curated |
| `view_count` | integer | |
| `like_count` | integer | |
| `remix_count` | integer | |
| `purchase_count` | integer | |
| `created_at` | timestamp | |

#### `carts` and `cart_items`

`carts` store session/user ownership and currency. `cart_items` store the design ID, validation snapshot, price snapshot, quantity, and gift options.

#### `inventory_reservations`

| Column | Type | Notes |
|--------|------|-------|
| `id` | text pk | |
| `cart_id` | text | |
| `order_id` | text nullable | Filled after payment |
| `material_id` | text fk | |
| `quantity` | integer | Reserved quantity |
| `status` | text | `active`, `converted`, `expired`, `released` |
| `expires_at` | timestamp | |
| `created_at` | timestamp | |

#### `orders`

| Column | Type | Notes |
|--------|------|-------|
| `id` | text pk | |
| `user_id` | text nullable | |
| `email` | text | |
| `status` | text | Payment/order state |
| `production_status` | text | Production workflow state |
| `stripe_checkout_session_id` | text unique | |
| `stripe_payment_intent_id` | text | |
| `subtotal_cents` | integer | |
| `shipping_cents` | integer | |
| `tax_cents` | integer | |
| `total_cents` | integer | |
| `currency` | text | |
| `shipping_address` | jsonb | |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

#### `order_items`

Each row points to a purchased design snapshot and production packet. Never depend on mutable current design rows for production.

#### `production_events`

Append-only event log for production status transitions, QC notes, staff actions, and customer issue reports.

#### `encyclopedia_pages`

SEO and education content with `slug`, `title`, `summary`, `body`, `hero_image_url`, `related_material_filters`, and metadata.

### JSON Field Schemas

#### Pearl Material Attributes

```json
{
  "pearl_type": "freshwater",
  "shape": "near_round",
  "size_mm": 7,
  "color": "white",
  "overtone": "rose",
  "luster_grade": "AAA",
  "surface_grade": "lightly_spotted",
  "origin": "China",
  "hole_size_mm": 0.8,
  "batch_code": "FW-WHT-7-AAA-2026-01"
}
```

#### Design Size

```json
{
  "wrist_cm": 16.5,
  "finished_length_cm": 18.0,
  "fit": "comfort"
}
```

#### Validation Snapshot

```json
{
  "status": "valid",
  "validated_at": "2026-07-30T21:00:00Z",
  "component_hash": "sha256:...",
  "errors": [],
  "warnings": [
    {
      "code": "NATURAL_VARIATION",
      "message": "Baroque pearls vary naturally in shape and surface."
    }
  ],
  "pricing": {
    "currency": "EUR",
    "materials_cents": 4250,
    "labor_cents": 1800,
    "packaging_cents": 400,
    "subtotal_cents": 6450
  }
}
```

## Seed Data

### Seed Pearl Materials

| ID | Name | Type | Size | Color | Grade |
|----|------|------|------|-------|-------|
| `mat_fw_white_6_aaa` | White Freshwater Pearl 6mm | freshwater | 6mm | white | AAA |
| `mat_fw_pink_7_aa` | Blush Freshwater Pearl 7mm | freshwater | 7mm | pink | AA |
| `mat_fw_lavender_7_aa` | Lavender Freshwater Pearl 7mm | freshwater | 7mm | lavender | AA |
| `mat_akoya_white_7_aaa` | Classic Akoya Pearl 7mm | akoya | 7mm | white | AAA |
| `mat_tahitian_peacock_9_aa` | Peacock Tahitian Pearl 9mm | tahitian | 9mm | peacock | AA |
| `mat_baroque_white_mixed` | White Baroque Pearl Mixed | baroque | mixed | white | AA |
| `mat_keshi_cream_5` | Cream Keshi Pearl 5mm | keshi | 5mm | cream | AA |

### Seed Findings

| ID | Name | Kind |
|----|------|------|
| `mat_gold_spacer_2mm` | Gold-Filled Spacer 2mm | spacer |
| `mat_silver_spacer_2mm` | Sterling Silver Spacer 2mm | spacer |
| `mat_gold_lobster_clasp` | Gold-Filled Lobster Clasp | clasp |
| `mat_silver_lobster_clasp` | Sterling Silver Lobster Clasp | clasp |
| `mat_silk_cord_white` | White Silk Cord | cord |
| `mat_elastic_clear` | Clear Jewelry Elastic | cord |

### Seed Templates

| Key | Product | Description |
|-----|---------|-------------|
| `classic_strand` | bracelet | Repeating pearl strand with clasp |
| `center_pearl` | bracelet | Focal center pearl with symmetric sides |
| `alternating_spacer` | bracelet | Pearl-spacer alternating rhythm |
| `baroque_story` | bracelet | Organic baroque layout with asymmetry allowed |
| `classic_necklace` | necklace | Uniform strand necklace |
| `graduated_necklace` | necklace | Larger center pearls taper outward |

## Concurrency and Consistency

### Write Serialization

Use PostgreSQL transactions for all checkout and inventory reservation operations. Lock material rows with `SELECT ... FOR UPDATE` when creating reservations.

### Idempotency

Stripe webhook events must be stored in a `payment_events` table keyed by Stripe event ID. If an event has already been processed, return success without side effects.

### Reservation Expiry

A periodic job expires active reservations where `expires_at < now()` and status is `active`. Expiry decrements reserved quantities or marks reservation rows as expired depending on the chosen inventory model.

### Design Mutability

Once a design is carted or ordered:

- Editing the design creates a new draft copy.
- Cart items store validation and price snapshots.
- Orders store immutable design and production snapshots.

This prevents a customer or admin edit from changing what production needs to make.

## Dashboard Pages

### Marketing Homepage

Sections:

- Hero with pearl design promise and primary CTA
- Trust stats: completed designs, fulfilled orders, reviews
- Design walkthrough video/cards
- Pearl education, sourcing, and handcrafted quality cards
- Inspiration gallery carousel
- Reviews and FAQ

### Designer

Panels:

- Product type and size
- Pearl/material palette
- Template selector
- Canvas/strand preview
- Component inspector
- Price and warnings
- Save/share/remix/add-to-cart actions

### Gallery

Features:

- Filter by product type, pearl type, color, price, occasion
- Cards with preview, title, price, view/remix counts
- Detail page with material list, care notes, purchase/remix buttons

### Encyclopedia

Features:

- SEO-friendly pearl education pages
- Related materials and templates
- Care instructions
- Comparison tables

### Account

Features:

- Saved designs
- Order history
- Order detail and tracking
- Reorder/remix
- Care instruction downloads

### Admin Orders

Features:

- Kanban or table by production state
- Production packet view
- QC checklist
- Status transition controls
- Customer notes and support flags

### Admin Materials

Features:

- Material CRUD
- Batch and stock management
- Price and visibility controls
- Image/visual attribute management
- Low-stock alerts

### Analytics

Features:

- Funnel: homepage -> designer -> validated -> cart -> paid
- Popular pearl types, colors, sizes
- Gallery views/remixes/purchases
- Average order value
- Production lead time
- QC failure rate

## Testing

### Smoke Test: Design Validation

1. Create bracelet design.
2. Add freshwater pearls and clasp.
3. Validate design.
4. Assert status is `valid`, price is returned, and preview URL exists.

### Smoke Test: Inventory Conflict

1. Set material stock to 1.
2. Create design requiring 2 units.
3. Validate design.
4. Assert `409` or validation error for insufficient stock.

### Smoke Test: Checkout Reservation

1. Create valid design.
2. Add to cart.
3. Create checkout session.
4. Assert reservation rows exist and material reserved quantity increased.

### Smoke Test: Stripe Webhook

1. Send signed `checkout.session.completed` fixture.
2. Assert order is created.
3. Assert reservation is converted.
4. Assert duplicate webhook does not create duplicate order.

### Smoke Test: Remix

1. Publish gallery design.
2. Call remix endpoint.
3. Assert new private draft exists with copied components.
4. Assert original gallery metrics increment.

### Smoke Test: Production Status

1. Create paid order.
2. Move through `MATERIALS_RESERVED`, `IN_PRODUCTION`, `QUALITY_CHECK`, `PACKED`, `SHIPPED`.
3. Assert production events are appended for each transition.

## Dependencies

Recommended npm dependencies:

| Package | Purpose |
|---------|---------|
| `next` | Full-stack application framework |
| `react`, `react-dom` | UI |
| `typescript` | Type safety |
| `drizzle-orm` | Database ORM |
| `postgres` or `pg` | PostgreSQL driver |
| `zod` | Runtime validation |
| `@dnd-kit/core` | Designer drag/drop |
| `zustand` | Client designer state |
| `stripe` | Payments and webhooks |
| `@auth/core` or `next-auth` | Authentication |
| `resend` or `nodemailer` | Transactional email |
| `sharp` | Server-side preview image generation |
| `lucide-react` | Icons |
| `tailwindcss` | Styling |

## Project Layout

```
src/
  app/
    (marketing)/
      page.tsx
      features/
      encyclopedia/
      gallery/
    designer/
      page.tsx
      [designId]/
    cart/
    checkout/
    account/
    admin/
    api/
      designs/
      materials/
      gallery/
      cart/
      checkout/
      webhooks/
      admin/
  components/
    marketing/
    designer/
      DesignerShell.tsx
      StrandCanvas.tsx
      MaterialPalette.tsx
      ComponentInspector.tsx
      PriceSummary.tsx
    gallery/
    checkout/
    admin/
  lib/
    auth/
    db/
    design/
      normalize.ts
      templates.ts
      measurements.ts
    pricing/
      calculate-price.ts
      labor-rules.ts
    validation/
      validate-design.ts
      production-rules.ts
    inventory/
      reserve.ts
      release-expired.ts
    rendering/
      svg-renderer.ts
      thumbnail.ts
    payments/
      stripe.ts
      webhook-handler.ts
    email/
  db/
    schema.ts
    migrations/
    seed/
  jobs/
    expire-reservations.ts
    render-gallery-thumbnails.ts
```

## Open Questions

1. Should the database be PostgreSQL from day one, or is SQLite acceptable for a local MVP?
2. Should preview rendering start with pure SVG or use a canvas/image pipeline immediately?
3. Which countries, currencies, tax rules, and shipping carriers are in launch scope?
4. Is guest checkout required?
5. Should the public gallery support community uploads at launch, or only staff-curated designs?
6. How granular should pearl inventory tracking be for real operations?
7. Does the business need manual quote flow for high-value Tahitian and South Sea designs?
8. Which authentication provider should be preferred for the target deployment?
