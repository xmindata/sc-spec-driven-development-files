# MyPearlDesign Mission

## Overview

**MyPearlDesign** is a personalized pearl jewelry commerce platform that:

1. **Guides** customers through pearl discovery, education, sizing, and design choices
2. **Lets users design** their own pearl bracelets, necklaces, earrings, and accessories in an interactive visual designer
3. **Prices designs in real time** based on pearl type, grade, size, findings, length, add-ons, and labor
4. **Shows inspiration** through a public gallery of curated and community-created pearl designs
5. **Converts designs into orders** with checkout, production handoff, and order tracking
6. **Supports artisans and operators** with an admin dashboard for materials, production, quality control, and fulfillment

The core metaphor is a **digital pearl atelier**: customers enter a calm, premium design studio, learn the story and qualities of pearls, compose a custom piece, and then hand it to expert makers for finishing.

MyPearlDesign is inspired by the reference site MyAstris: an emotionally branded jewelry experience centered on a visual designer, education, community inspiration, ethical materials, handcrafted production, and direct purchase. The distinction is that MyPearlDesign focuses specifically on pearls: freshwater, Akoya, Tahitian, South Sea, baroque, seed, keshi, dyed, mixed pearl strands, and pearl-accented pieces.

## Motivation

Pearl jewelry is personal, tactile, and symbolic, but most online pearl stores sell fixed SKUs with limited customization. Customers often struggle to understand differences between pearl types, luster, shape, overtone, surface quality, sizing, clasp options, and care requirements. As a result, buying pearls online can feel intimidating, generic, or risky.

The current failure mode:

- Customers browse static pearl products but cannot easily imagine their own design.
- Pearl education is disconnected from purchase decisions.
- Custom orders require manual messages, screenshots, or back-and-forth emails.
- Makers receive incomplete design intent and must clarify details after checkout.
- Shoppers cannot see realistic price impact as they customize.

MyPearlDesign closes these gaps with a guided design-to-purchase workflow. Customers build a design visually, receive pearl-specific guidance while designing, understand pricing instantly, and submit an order package that production can actually fulfill.

The platform should feel **premium, calm, trustworthy, and craft-led**. Pearls are not only beads; they carry symbolism around elegance, milestones, weddings, inheritance, softness, confidence, and natural uniqueness. The product experience should communicate that emotional value while still being operationally precise.

## Customer Workflow

```
+------------+      +------------+      +------------+      +------------+      +------------+
|  DISCOVER  | ---> |   DESIGN   | ---> |   REVIEW   | ---> |  CHECKOUT  | ---> | PRODUCTION |
| Homepage,  |      | Visual     |      | Validate   |      | Payment,   |      | Artisan    |
| gallery,   |      | pearl      |      | size,      |      | shipping,  |      | makes item,|
| education  |      | editor     |      | price      |      | order      |      | QC, ship   |
+------------+      +------------+      +------------+      +------------+      +-----+------+
                                                                                     |
                                                                                     v
                                                                              +------------+
                                                                              |  DELIVER   |
                                                                              | Finished   |
                                                                              | item and   |
                                                                              | care info  |
                                                                              +------------+
```

### Design States

| State | Trigger | Meaning |
|-------|---------|---------|
| **DRAFT** | User opens the designer or remixes a gallery design | Design exists in browser/session and can be edited |
| **SAVED** | User saves design while logged in or enters email for guest save | Design is persisted and can be resumed |
| **SHARED** | User publishes or copies share link | Design has a public read-only view and can be remixed |
| **VALIDATED** | User opens review step | Design passes inventory, sizing, pricing, and production checks |
| **CARTED** | User adds validated design to cart | Design is locked for checkout but can be duplicated for edits |
| **ORDERED** | Payment succeeds | Design becomes a production order |
| **IN_PRODUCTION** | Admin accepts order | Materials are reserved and artisan work begins |
| **QUALITY_CHECK** | Artisan marks item complete | Order waits for inspection, packaging, and care-card generation |
| **FULFILLED** | Shipment label created | Customer receives tracking and post-purchase care instructions |

### Design Surfaces

MyPearlDesign should include four customer-facing design surfaces:

1. **Homepage:** Brand promise, hero call-to-action, trust stats, design walkthrough, material/craft cards, inspiration carousel, reviews.
2. **Designer:** Interactive pearl arrangement tool with live preview, material palette, price updates, size guide, and validation.
3. **Gallery:** Curated and community designs that can be browsed, purchased, shared, or remixed.
4. **Pearl Encyclopedia:** Educational pages for pearl types, grades, shapes, colors, care rituals, and styling advice.

## Reference Site Analysis: MyAstris

The MyAstris homepage communicates a clear pattern worth reusing:

- Hero message: "Designed by You, Defined by Stars" with an immediate emotional design promise.
- Social proof: customer and purchase statistics.
- Design guide: a step-by-step walkthrough before entering the designer.
- Three trust pillars: encyclopedia, ethically sourced natural materials, handcrafted production.
- Inspiration gallery: purchasable/remixable customer designs with discount pricing and popularity signals.
- Reviews: proof that users can confidently buy custom designs online.

For MyPearlDesign, the analogous positioning should be:

- Hero message: **"Designed by You, Finished by Pearl Artisans"** or **"Your Pearl Story, Designed by You"**
- Social proof around completed pearl designs, artisan-made orders, and customer milestones
- Design guide focused on pearl size, length, clasp, symmetry, color harmony, and care
- Trust pillars: Pearl Encyclopedia, Responsible Pearl Sourcing, Handcrafted Pearl Setting
- Inspiration gallery organized by occasions, pearl types, color palettes, and jewelry format
- Reviews emphasizing quality, luster, packaging, gift readiness, and design accuracy

## Product Catalog

### Core Product Types

| Product Type | MVP | Notes |
|--------------|-----|-------|
| **Bracelet** | Yes | Primary design format; easiest visual designer and sizing model |
| **Necklace** | Yes | Strand length, clasp, center pearl, pendant, spacer options |
| **Earrings** | Deferred | Requires pair symmetry, findings, drop length, and production-specific validation |
| **Anklet** | Deferred | Similar to bracelet but needs separate sizing and durability rules |
| **Gift Set** | Deferred | Bundled items, packaging, message card, occasion flows |

### Pearl Materials

| Pearl Type | Positioning | Designer Use |
|------------|-------------|--------------|
| **Freshwater** | Accessible, versatile, wide color range | Default MVP pearl family |
| **Akoya** | Classic high-luster elegance | Premium classic strands and bridal designs |
| **Tahitian** | Dramatic dark tones and overtones | Statement and luxury designs |
| **South Sea** | Large, rare, premium | High-end limited catalog |
| **Baroque** | Organic, expressive, one-of-a-kind | Modern asymmetrical designs |
| **Keshi** | Petite, luminous, irregular | Accents, delicate bracelets, texture |
| **Seed Pearl** | Small, vintage, intricate | Spacers, fine details, lace-like designs |

### Pearl Attributes

Every pearl variant should carry structured attributes:

- `type`: freshwater, akoya, tahitian, south_sea, baroque, keshi, seed
- `shape`: round, near_round, oval, button, drop, rice, potato, baroque
- `size_mm`: diameter or size range
- `color`: white, cream, pink, peach, lavender, gold, grey, black, peacock, mixed
- `overtone`: rose, silver, green, blue, gold, none
- `luster_grade`: A, AA, AAA, gem
- `surface_grade`: clean, lightly_spotted, naturally_marked
- `origin`: country or farm region where available
- `stock_count`: available units or strand inventory
- `unit_cost` and `retail_price`
- `care_notes`

## Designer Experience

### Bracelet Designer

The MVP designer should focus on bracelets because the interaction model is clear and conversion-friendly.

Core capabilities:

1. Select wrist size or target bracelet length.
2. Choose a starting template: classic strand, gradient, center pearl, alternating pearls, charm accent, asymmetrical.
3. Drag pearls from the material palette onto the strand.
4. Duplicate, mirror, rotate, replace, or clear selected segments.
5. Add spacers, knots, charms, and clasp options.
6. See live price, estimated production time, and inventory warnings.
7. Save, share, remix, add to cart, or purchase.

### Necklace Designer

The necklace designer extends the same concepts with:

- Strand lengths: choker, princess, matinee, opera, rope
- Centerpiece logic: pendant, focal pearl, graduated center
- Clasp visibility: hidden clasp, decorative clasp, front clasp
- Weight and comfort warnings for large pearls

### Design Validation

Before checkout, every design must pass validation:

| Validation | Rule |
|------------|------|
| **Length** | Total calculated length must fit selected product type and size range |
| **Inventory** | Required material quantities must be available or marked made-to-order |
| **Symmetry** | If user selects symmetric mode, left and right sides must match according to template rules |
| **Durability** | Heavy pearls require stronger cord/wire and compatible clasp |
| **Production** | Some combinations may require manual quote or artisan review |
| **Pricing** | Material, labor, packaging, and shipping estimates must be current |

## API Design

### Endpoints

All endpoints return JSON. Customer pages use session auth for saved designs and checkout. Admin endpoints require staff authentication.

#### Design Management

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/designs` | Create a draft design from template or blank canvas |
| `GET` | `/api/designs/:id` | Retrieve design details and rendered preview data |
| `PATCH` | `/api/designs/:id` | Update design components, size, notes, or visibility |
| `POST` | `/api/designs/:id/validate` | Validate inventory, size, production rules, and price |
| `POST` | `/api/designs/:id/share` | Create or update public share link |
| `POST` | `/api/designs/:id/remix` | Duplicate a public design into a new editable draft |

#### Materials and Education

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/materials` | List pearls, spacers, charms, clasps, and cords with filters |
| `GET` | `/api/materials/:id` | Retrieve material detail, attributes, inventory, and care notes |
| `GET` | `/api/pearl-types` | Pearl encyclopedia index |
| `GET` | `/api/pearl-types/:slug` | Pearl education page content |

#### Gallery

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/gallery` | List public designs with filters and sorting |
| `GET` | `/api/gallery/:id` | Public gallery design detail |
| `POST` | `/api/gallery/:id/view` | Track view count |
| `POST` | `/api/gallery/:id/like` | Like or unlike a public design |

#### Cart and Orders

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/cart/items` | Add a validated design to cart |
| `GET` | `/api/cart` | Retrieve cart with current pricing |
| `PATCH` | `/api/cart/items/:id` | Update quantity, gift packaging, or notes |
| `POST` | `/api/checkout` | Create checkout session |
| `POST` | `/api/webhooks/payment` | Receive payment provider events |
| `GET` | `/api/orders/:id` | Retrieve customer order status |

#### Admin

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/admin/orders` | List orders by production status |
| `PATCH` | `/api/admin/orders/:id/status` | Move order through production states |
| `GET` | `/api/admin/materials` | Manage pearl inventory and pricing |
| `PATCH` | `/api/admin/materials/:id` | Update material attributes, stock, or visibility |
| `GET` | `/api/admin/analytics/overview` | Sales, conversion, design, and production metrics |

### API Response: Design Example

```json
{
  "design_id": "dsn_8f3a2b1c",
  "owner_id": "usr_4d2e9f0a",
  "product_type": "bracelet",
  "state": "VALIDATED",
  "name": "Moonlit Freshwater Bracelet",
  "size": {
    "wrist_cm": 16.5,
    "finished_length_cm": 18.0
  },
  "components": [
    {
      "position": 1,
      "material_id": "mat_freshwater_white_7mm_aaa",
      "kind": "pearl",
      "quantity": 1
    },
    {
      "position": 2,
      "material_id": "mat_gold_filled_spacer_2mm",
      "kind": "spacer",
      "quantity": 1
    }
  ],
  "pricing": {
    "materials": 42.5,
    "labor": 18.0,
    "packaging": 4.0,
    "subtotal": 64.5,
    "currency": "EUR"
  },
  "validation": {
    "status": "valid",
    "warnings": []
  },
  "preview_url": "https://assets.mypearledesign.com/designs/dsn_8f3a2b1c.png"
}
```

### Error Responses

| Code | Meaning | Example |
|------|---------|---------|
| `400` | Invalid design data | Bracelet length is outside supported range |
| `401` | Authentication required | User must sign in to save design |
| `403` | Permission denied | User cannot edit another user's private design |
| `404` | Not found | Design or material does not exist |
| `409` | Inventory conflict | Selected pearl is no longer available |
| `422` | Production validation failed | Clasp is incompatible with selected pearl weight |
| `500` | Server error | Unexpected pricing or persistence failure |

## Pearl Knowledge Base

### Pearl Encyclopedia

The encyclopedia should help customers make confident design choices. Each page should include:

- Pearl origin and formation
- Typical colors and overtones
- Luster and surface expectations
- Styling recommendations
- Best product formats
- Care instructions
- Pricing guidance
- Related materials in the designer

### Core Education Topics

| Topic | Customer Question |
|-------|-------------------|
| **Pearl Types** | What is the difference between freshwater, Akoya, Tahitian, and South Sea pearls? |
| **Pearl Grading** | What do luster, surface, shape, color, and matching mean? |
| **Pearl Sizes** | How does 4mm, 7mm, or 10mm look on wrist or neck? |
| **Pearl Shapes** | Why choose round, button, drop, rice, or baroque? |
| **Color and Overtone** | Which pearl colors match skin tone, occasion, and metal? |
| **Care** | How do I protect pearls from water, perfume, heat, and scratches? |
| **Sourcing** | Where do the pearls come from and how are they selected? |

### Responsible Sourcing

The site should communicate sourcing with care and evidence. Claims must be accurate and not overstate traceability. If a pearl batch has full origin details, show them. If it has supplier-level assurance only, say that plainly.

Sourcing principles:

1. Use trusted pearl suppliers with documented quality standards.
2. Avoid vague sustainability claims without supporting detail.
3. Keep batch-level metadata where available.
4. Explain that natural variation is expected and part of the product.
5. Photograph representative pearls honestly, including shape and surface variation.

## Order and Production

### Production States

| State | Meaning |
|-------|---------|
| **PAID** | Payment succeeded and order is ready for review |
| **MATERIALS_RESERVED** | Required pearls and findings are reserved |
| **IN_PRODUCTION** | Artisan is assembling the piece |
| **QUALITY_CHECK** | Finished piece is inspected for length, clasp, durability, and design match |
| **PACKED** | Care card, pouch/box, and gift options are prepared |
| **SHIPPED** | Tracking number is available |
| **DELIVERED** | Carrier marks shipment delivered |
| **ISSUE_REPORTED** | Customer reports fit, damage, or mismatch issue |

### Production Handoff

Every paid design becomes a production packet:

- Rendered preview image
- Product type and size
- Ordered component list with material IDs and quantities
- Assembly instructions and symmetry rules
- Customer notes
- Gift packaging options
- Quality-control checklist
- Care-card template

## Dashboard

### Customer Account

Customers can:

- View saved designs
- Resume drafts
- Track orders
- Reorder or remix past designs
- Manage addresses
- Download care instructions

### Admin Overview

Operators can see:

- Total sales and conversion rate
- Draft-to-checkout funnel
- Popular pearl types and colors
- Low-stock materials
- Open production orders
- Orders waiting for quality check
- Refund, repair, and fit issues

### Material Management

Staff can manage:

- Pearl batches and stock counts
- Material visibility in designer
- Price changes
- Representative images
- Quality grade and care notes
- Substitute materials for out-of-stock designs

## Scope

### MVP Delivers

1. Marketing homepage inspired by MyAstris structure
2. Pearl bracelet designer with templates, live preview, validation, pricing, save/share/remix
3. Necklace designer with a smaller set of templates
4. Pearl encyclopedia for core pearl types and care topics
5. Gallery of curated and public designs
6. Cart and checkout for custom designs
7. Customer account for saved designs and orders
8. Admin dashboard for orders, materials, inventory, and production status
9. Payment webhook handling and order state transitions
10. Email notifications for saved design, order confirmation, production updates, and shipment

### Deferred

- Earrings and anklets
- 3D physically accurate rendering
- AI design assistant
- Multi-currency international tax engine
- Marketplace payouts for external designers
- Loyalty program
- Gift set builder
- Live artisan chat
- Augmented reality try-on

## Success Metrics

| Metric | Target |
|--------|--------|
| Designer start rate | 25%+ of homepage visitors click into designer |
| Design completion rate | 35%+ of designer starts reach validated design |
| Save/share rate | 15%+ of completed designs are saved or shared |
| Cart conversion | 20%+ of validated designs are added to cart |
| Purchase conversion | 5%+ of designer starts result in purchase |
| Production accuracy | 98%+ orders pass quality check without remake |
| Inventory conflicts | <2% of checkout attempts fail due to stock |
| Customer satisfaction | 4.7/5 average review rating |

## Implementation Notes

### Tech Stack

Use a Next.js full-stack application with a relational database, object storage for rendered design previews, and a payment provider for checkout. Keep design validation and pricing deterministic in application code. Use optional AI only for future recommendations, not for core pricing or production rules.

### Database Schema

Core entities:

- `users`
- `designs`
- `design_components`
- `materials`
- `material_batches`
- `gallery_posts`
- `carts`
- `cart_items`
- `orders`
- `order_items`
- `production_events`
- `reviews`
- `encyclopedia_pages`

### Project Structure

```
src/
  app/
    page.tsx
    designer/
    gallery/
    encyclopedia/
    account/
    admin/
    api/
  components/
    designer/
    gallery/
    materials/
    checkout/
    admin/
  lib/
    pricing/
    validation/
    rendering/
    inventory/
    payments/
    email/
  db/
    schema.ts
    seed/
```

## Open Questions

1. Should the MVP support guest checkout, or require account creation before purchase?
2. Which market and currency should launch first?
3. Will production be made-to-order only, or should some curated designs be ready-to-ship?
4. How exact should pearl inventory be: per-pearl count, per-strand batch count, or approximate batch quantity?
5. Which payment provider should be used?
6. Does the brand want community publishing from day one, or only curated gallery designs?
7. What level of source traceability can be honestly claimed for each pearl type?
