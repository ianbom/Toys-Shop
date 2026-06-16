## Overview

Melissa & Doug's (https://www.melissaanddoug.com/) visual direction in the provided reference is a **bright, playful, parent-friendly toy e-commerce system** built on a clean white canvas (`{colors.canvas}` — #FFFFFF), deep navy typography (`{colors.navy}` — #061B5B), soft sky-blue promotion bars (`{colors.sky-promo}` — #A9D8F6), and rounded product cards. The interface feels safe, cheerful, educational, and easy to shop. Brand personality comes from **soft toy photography**, **hand-drawn doodle accents**, **rounded capsule navigation**, and a strong contrast between the white page floor and deep navy UI structure.

The system should not feel like a generic SaaS website. It should feel like a polished children's toy store: friendly for parents, exciting for kids, and trustworthy for gifting. Product images are large, bright, isolated on white backgrounds, and supported by clear product names, orange star ratings, prices, and two-action card controls: an outlined secondary button and a filled primary button.

The visual identity is anchored by three signature elements: a **soft blue promo bar**, a **red oval handwritten logo**, and a **deep navy rewards bar**. These elements give the page a recognizable toy-retail rhythm while keeping the rest of the interface clean and breathable.

**Key Characteristics:**
- White-first canvas (`{colors.canvas}` — #FFFFFF) with deep navy text, icons, borders, and structure.
- Soft sky-blue top promo strip used as the first visual band on every page.
- Centered red oval logo with playful handwritten-style typography.
- Rounded search bar, rounded category pills, rounded filter controls, rounded cards, and rounded CTA buttons.
- Product cards use large studio-style toy photography, soft borders, minimal shadows, and consistent vertical alignment.
- Orange/yellow stars act as the main rating accent; blue buttons act as the primary commerce action.
- Decorative doodles are small, airy, and never compete with products.
- The design is playful but still production-ready: clean grid, readable hierarchy, predictable shopping controls.

## Colors

### Brand & Accent
- **Primary Navy** (`{colors.navy}` — #061B5B): Main text, icons, card titles, navigation outlines, breadcrumbs, product names, and dark UI bands.
- **Button Blue** (`{colors.button-blue}` — #1F7AE5): Primary action color for filled buttons such as “Add to Cart”. It should feel bright, friendly, and clickable.
- **Button Blue Dark** (`{colors.button-blue-dark}` — #175FBD): Pressed/active state for primary buttons.
- **Logo Red** (`{colors.logo-red}` — #EF2B2D): Used only for the oval brand logo and rare brand moments. Do not use it as the default CTA color.
- **Star Orange** (`{colors.star-orange}` — #FF8A00): Product ratings, review stars, small cheerful highlights.
- **Sky Promo** (`{colors.sky-promo}` — #A9D8F6): Top announcement bar and soft promotional surfaces.
- **Doodle Green** (`{colors.doodle-green}` — #65B946): Small decorative doodle strokes.
- **Doodle Pink** (`{colors.doodle-pink}` — #FF7DA8): Small decorative swirl accents.
- **Doodle Yellow** (`{colors.doodle-yellow}` — #FFC94A): Small star doodles and playful highlights.

### Surface
- **Canvas** (`{colors.canvas}` — #FFFFFF): Main page background, product card interior, toolbar area, and most section surfaces.
- **Surface Soft** (`{colors.surface-soft}` — #FAFAFA): Light section blocks, subtle editorial backgrounds, footer pre-CTA areas.
- **Surface Filter** (`{colors.surface-filter}` — #F5F5F5): Filter dropdown buttons, sort dropdown, small form controls.
- **Surface Card** (`{colors.surface-card}` — #FFFFFF): Product cards, category cards, content cards.
- **Rewards Surface** (`{colors.rewards-surface}` — #061B5B): Full-width rewards / loyalty strip below navigation.
- **Promo Surface** (`{colors.promo-surface}` — #A9D8F6): Top announcement strip.

### Hairlines & Borders
- **Hairline** (`{colors.hairline}` — #E5E7EF): Default 1px card borders, filter borders, section dividers.
- **Hairline Strong** (`{colors.hairline-strong}` — #CBD2E4): Stronger navy-tinted outlines for nav pills and buttons.
- **Navy Border** (`{colors.navy-border}` — #061B5B): Category pill outline, secondary button outline, search icon, utility icons.

### Text
- **Text Primary** (`{colors.text-primary}` — #061B5B): Headings, product names, nav labels, button labels, toolbar labels.
- **Text Body** (`{colors.text-body}` — #26345E): Body copy, product descriptions, helper text.
- **Text Muted** (`{colors.text-muted}` — #6F7691): Placeholder text, secondary metadata, inactive labels.
- **Text Inverse** (`{colors.text-inverse}` — #FFFFFF): Text on rewards bar, filled buttons, and red logo.
- **Price Text** (`{colors.price-text}` — #061B5B): Product prices, cart totals, checkout summary values.

### Semantic
- **Success** (`{colors.success}` — #1FA463): In-stock labels, successful cart states.
- **Warning** (`{colors.warning}` — #F6A623): Low-stock labels and promotional urgency.
- **Error** (`{colors.error}` — #D83A3A): Form validation errors, unavailable products, payment failure.
- **Info** (`{colors.info}` — #1F7AE5): Informational badges, help links, loyalty tooltips.

## Typography

### Font Family

Use a friendly rounded sans-serif as the main UI typeface. Recommended open-source options:

- **Primary UI:** `Nunito Sans`, `Nunito`, or `Quicksand`
- **Fallback:** `Inter`, `Arial Rounded MT Bold`, `system-ui`, `sans-serif`
- **Handwritten Accent:** `Baloo 2`, `Comic Neue`, `Patrick Hand`, or a similar playful handwritten-style font

The type system uses a warm and rounded voice. Headings should feel friendly and slightly playful, not corporate. Product names are bold and readable. Navigation labels are compact but rounded. Handwritten type is reserved only for the red oval logo, “New”, “Best Seller”, and small decorative notes.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---:|---:|---:|---:|---|
| `{typography.display-xl}` | 56px | 800 | 1.05 | -0.5px | Homepage hero headline |
| `{typography.display-lg}` | 44px | 800 | 1.08 | -0.25px | Category page title, major section heading |
| `{typography.display-md}` | 36px | 800 | 1.12 | 0 | Section heads such as “Shop by Age” |
| `{typography.display-sm}` | 28px | 800 | 1.2 | 0 | Promo banners, collection title variants |
| `{typography.title-lg}` | 24px | 800 | 1.25 | 0 | Product detail title, card title |
| `{typography.title-md}` | 20px | 700 | 1.3 | 0 | Product card name, nav label emphasis |
| `{typography.title-sm}` | 18px | 700 | 1.35 | 0 | Filter labels, section card headings |
| `{typography.body-lg}` | 18px | 500 | 1.5 | 0 | Hero supporting copy, homepage intro |
| `{typography.body-md}` | 16px | 500 | 1.5 | 0 | Default body text and product descriptions |
| `{typography.body-sm}` | 14px | 500 | 1.45 | 0 | Metadata, reviews, footer links |
| `{typography.caption}` | 12px | 600 | 1.4 | 0 | Badges, small helper labels |
| `{typography.button}` | 16px | 800 | 1.0 | 0 | Button labels, category pills |
| `{typography.nav-link}` | 15px | 800 | 1.2 | 0 | Main category navigation |
| `{typography.handwritten}` | 18–28px | 700 | 1.0 | 0 | Logo, “New”, “Best Seller”, playful labels |

### Principles

The system uses rounded, high-readability typography with a friendly voice. Product names and page headings should feel confident but soft. Avoid sharp, condensed, futuristic, or overly corporate fonts. The typography must support quick scanning for parents: product name, rating, price, and CTA should be readable at a glance.

Display headings can use a slightly bouncy rounded type style, but body text must stay calm and legible. Handwritten styling should be used sparingly; too much handwriting makes the interface look childish instead of premium.

### Note on Font Substitutes

If `Nunito Sans` is unavailable, use `Quicksand` for a more playful look or `Inter` for a cleaner production UI. If using `Inter`, increase border radius and decorative doodles slightly to preserve the playful feel. For the logo and small handwritten notes, `Patrick Hand` or `Comic Neue` can approximate the hand-drawn effect.

## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 72px · `{spacing.section-lg}` 96px.
- **Header vertical rhythm:** Promo bar 40–48px, main header 96–112px, category nav 56–64px, rewards bar 40–48px.
- **Page container padding:** 72–96px left and right on desktop.
- **Card gap:** 24px between product cards on desktop.
- **Card internal padding:** 24px bottom area; product image area uses large internal breathing room.
- **Section spacing:** 72px between major homepage sections; 32px between collection toolbar and product grid.

### Grid & Container
- **Max content width:** 1440px centered.
- **Desktop product grid:** 4 columns with 24px gap.
- **Homepage category grid:** 4–6 cards depending on section type.
- **Product detail layout:** 2-column layout; left image gallery 55%, right product summary 45%.
- **Toolbar layout:** Left filters, right item count and sort dropdown.
- **Footer:** 4-column desktop footer with clear grouping.

### Whitespace Philosophy

Whitespace is generous and friendly. The page must feel calm even though it contains colorful toys. Large white areas help toy photography stand out. Avoid dense product grids, cramped nav, or overloaded banners. Decorative doodles should sit in whitespace around the page, never inside primary product content areas.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, white background | Header, promo bar, rewards bar, page canvas |
| Soft Border | 1px `{colors.hairline}` | Product cards, filter controls, search input |
| Soft Card | White card + subtle shadow | Product cards, category cards, featured cards |
| Raised CTA | Filled blue surface + slight depth | Add to Cart, primary homepage CTA |
| Floating Control | Circular button + strong navy border/shadow | Accessibility launcher, carousel arrows |

### Shadow Tokens
- **Card Shadow** (`{shadow.card}`): `0 3px 10px rgba(6, 27, 91, 0.08)`
- **Card Hover Shadow** (`{shadow.card-hover}`): `0 8px 24px rgba(6, 27, 91, 0.12)`
- **Floating Shadow** (`{shadow.floating}`): `0 8px 24px rgba(6, 27, 91, 0.22)`

### Decorative Depth
- Use soft shadows only to lift cards slightly from the white canvas.
- Product photography creates visual depth through realistic lighting and clean cutouts.
- Do not use heavy glassmorphism, intense gradients, or dark overlays.
- The dark rewards bar creates section contrast without making the page feel dark.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---:|---|
| `{rounded.none}` | 0px | Rare; only for internal image crops if needed |
| `{rounded.xs}` | 4px | Small labels and tiny badges |
| `{rounded.sm}` | 8px | Dropdown corners, compact controls |
| `{rounded.md}` | 12px | Product thumbnails, small cards |
| `{rounded.lg}` | 16px | Product cards, category cards |
| `{rounded.xl}` | 24px | Search input, filter pills, soft promo cards |
| `{rounded.pill}` | 999px | Category nav pills, buttons, logo outline |
| `{rounded.full}` | 50% | Floating accessibility button, circular icon buttons |

### Shape Principles

Roundness is a core part of the brand language. Pills and rounded cards create a safe, soft, toy-friendly impression. Sharp rectangles should be avoided unless they are part of a technical layout such as a table or structured admin UI.

## Components

### Top Promo Bar

**`promo-bar`** — Full-width soft sky-blue strip at the top of the page. Height 40–48px. Text centered in `{typography.body-sm}` or `{typography.title-sm}` using `{colors.navy}`. Left and right arrow icons sit at the far edges. Used for free-shipping and sitewide promotions.

Recommended text examples:
- “Enjoy Free Shipping on Orders $49+”
- “Save on Favorite Toys This Week”
- “Free Shipping on Gifts and Baby Toys”

### Main Header

**`main-header`** — White header area with three zones: search on the left, centered logo, utility icons on the right. Desktop height 96–112px. The centered brand mark is the visual anchor.

- Left: large rounded search input.
- Center: red oval logo.
- Right: utility icon cluster with icon above text label.

### Search Input

**`search-input-large`** — Rounded search field, width 320–420px, height 52–58px, white fill, 1px light border, navy search icon, muted placeholder text.

Placeholder examples:
- “Search toys, puzzles, and more”
- “Search by age, category, or toy name”

### Logo Badge

**`brand-logo-oval`** — Red oval badge with white handwritten-style brand text. It uses two white oval outlines to mimic a playful toy-brand emblem. It should be centered and larger than normal nav logos.

Token suggestions:
- Background: `{colors.logo-red}`
- Text: `{colors.text-inverse}`
- Shape: `{rounded.pill}`
- Font: `{typography.handwritten}`

### Utility Icon Group

**`utility-icons`** — Right-side icon cluster for Accessibility, Help, Rewards, Account, and Cart. Icons are navy outline style with label below. Cart can display a red circular badge for item count.

Rules:
- Use simple line icons.
- Keep icons friendly and rounded.
- Maintain equal spacing between items.
- Avoid filled or overly detailed icons.

### Category Navigation Pills

**`category-nav-pill`** — Rounded pill button with white fill, navy 1.5px outline, navy label, and comfortable horizontal padding.

Default categories:
- Shop By Age
- Pretend Play
- Learning Toys
- Puzzles
- Arts & Crafts
- Trains & More Toys
- Sale
- Discover

Active/hover state can use a very light sky-blue fill (`{colors.surface-soft}` or `#EEF7FF`) while keeping navy outline.

### Rewards Bar

**`rewards-bar`** — Full-width deep navy strip below category navigation. Height 40–48px. Centered text in white uppercase with small downward chevron.

Text example:
- “PLAY PERKS REWARDS”

### Breadcrumb

**`breadcrumb`** — Small navigation row above page title. Uses `{typography.body-sm}` and navy text. Chevron separators are small and subtle.

Example:
`Home › Shop By Age › Baby Toys 0–12 Months`

### Page Title

**`collection-title`** — Large playful navy heading centered above the collection toolbar. Uses `{typography.display-lg}` with a rounded, friendly weight. Title should feel cheerful and easy to read.

Example:
- “Baby Toys 0–12 Months”
- “Learning Toys”
- “Pretend Play Favorites”

### Filter Toolbar

**`collection-toolbar`** — Horizontal toolbar below the title. Left side contains “Filter By” and filter dropdown buttons. Right side contains item count and sort dropdown.

Controls:
- `Age`
- `Category`
- `Subcategory`
- `Price`
- `Sort By: Best Sellers`

Each dropdown uses `{colors.surface-filter}`, rounded `{rounded.md}`, 1px `{colors.hairline}`, and navy text.

### Product Grid

**`product-grid`** — 4-column desktop layout with 24px gap. Cards align to the same height. Product imagery dominates the upper portion of every card.

Rules:
- Use consistent card widths.
- Product image areas should have uniform height.
- Text area and buttons align across all cards.
- Never overcrowd product cards with too many badges.

### Product Card

**`product-card`** — White card with rounded corners, subtle border, and soft shadow. The image area is large and clean. Product metadata appears below.

Structure:
1. Product image
2. Handwritten badge such as “New” or “Best Seller”
3. Product name
4. Rating row
5. Price
6. Action buttons

Recommended dimensions:
- Card radius: `{rounded.lg}`
- Border: `1px {colors.hairline}`
- Padding: 20–24px
- Image area: 240–320px desktop height

### Product Image

**`product-image-cutout`** — Clean isolated toy photo on white background. Toys should look soft, colorful, safe, and studio photographed. Use realistic shadows under products when needed.

Image rules:
- Keep background white.
- Avoid busy lifestyle images inside collection cards.
- Product should be centered and occupy 70–85% of image area.
- Use bright but natural toy colors.

### Product Badge

**`product-badge-handwritten`** — Handwritten navy text placed near the top-right of product cards. Used for “New”, “Best Seller”, or limited promotional labels.

Rules:
- No filled pill background.
- Looks hand-drawn.
- Uses navy ink and sometimes small underline strokes.
- Keep it small and playful.

### Rating Row

**`rating-row`** — Orange star icons followed by rating number and review count in navy. The row sits below product name.

Example:
`★ ★ ★ ★ ☆ 4.8 (312)`

Rules:
- Star color: `{colors.star-orange}`
- Review text: `{colors.navy}`
- Keep rating row compact.

### Buttons

**`button-primary`** — Filled rounded blue CTA. Used for Add to Cart and main shopping CTAs.

- Background: `{colors.button-blue}`
- Text: `{colors.text-inverse}`
- Radius: `{rounded.md}` or `{rounded.pill}`
- Height: 44–48px
- Font: `{typography.button}`

**`button-secondary`** — Outlined navy button. Used for More Info, Learn More, or secondary product actions.

- Background: white
- Border: 1.5px `{colors.navy-border}`
- Text: `{colors.navy}`
- Radius: `{rounded.md}` or `{rounded.pill}`
- Height: 44–48px

**`button-hero-primary`** — Larger blue pill CTA for homepage hero. Height 52–56px. Used for “Shop Best Sellers”, “Shop Toys”, or “Explore by Age”.

### Decorative Doodles

**`page-doodles`** — Small hand-drawn stars, swirls, dotted lines, and loops placed around whitespace. They support the playful tone but must not distract.

Rules:
- Use low visual density.
- Place near page edges or empty zones.
- Use green, yellow, pink, and light blue.
- Do not overlap product cards or text.

### Floating Accessibility Button

**`accessibility-launcher`** — Circular fixed button at bottom-right. Deep navy fill, white accessibility icon, white ring, and soft shadow.

Recommended size:
- Desktop: 56–64px
- Mobile: 52px

### Homepage Hero

**`homepage-hero`** — Large bright hero section with playful toy collage or child-friendly lifestyle imagery. Uses headline, short supporting copy, and two rounded CTAs.

Content example:
- Headline: “Play, Learn, and Grow Every Day”
- Subcopy: “Thoughtfully designed toys that inspire imagination, creativity, and early learning.”
- Primary CTA: “Shop Best Sellers”
- Secondary CTA: “Explore by Age”

### Category Card

**`category-card`** — Rounded card for homepage category browsing. Contains toy/category image, title, short text, and link.

Examples:
- Baby Toys
- Pretend Play
- Learning Toys
- Puzzles
- Arts & Crafts
- Outdoor Fun

### Age Card

**`age-card`** — Rounded shopping card grouped by child age. Uses pastel background accents, child-friendly iconography, and clear label.

Age groups:
- 0–12 Months
- 1–2 Years
- 2–3 Years
- 3–5 Years
- 6–8 Years

### Product Detail Layout

**`product-detail-layout`** — Two-column product detail page. Left side uses image gallery. Right side uses product title, rating, price, bullet features, quantity selector, and CTA buttons.

Right column structure:
1. Breadcrumb
2. Badge
3. Product title
4. Rating and review count
5. Price
6. Short description
7. Key feature bullets
8. Quantity selector
9. Add to Cart button
10. Shipping/help accordions

### Accordion

**`accordion`** — Used for FAQ, product details, care instructions, shipping, and returns. White background, navy text, 1px hairline dividers, and rounded top/bottom corners when grouped.

### Footer

**`footer`** — Clean white or very light surface footer with navy headings and links. Can include a soft sky-blue newsletter band above the footer.

Footer columns:
- Shop
- About
- Help
- Rewards
- Discover

## Do's and Don'ts

### Do
- Use a clean white canvas and let toy photography become the main visual energy.
- Use deep navy consistently for text, icons, outlines, and structural bars.
- Use rounded pills and cards to create a soft toy-store personality.
- Keep product cards consistent in height and spacing.
- Use bright, realistic toy images with clean backgrounds.
- Use orange stars for ratings and blue buttons for commerce actions.
- Add small decorative doodles only in whitespace.
- Keep navigation easy for parents: by age, by category, by learning type, and by product interest.
- Make the interface feel trustworthy, safe, educational, and giftable.

### Don't
- Don't create a dark, corporate, or SaaS-like interface.
- Don't use heavy gradients, neon colors, glassmorphism, or cyber-style effects.
- Don't overcrowd product cards with too many labels or promotional badges.
- Don't use sharp rectangular controls as the default shape.
- Don't make doodles too large or place them over products.
- Don't use red as the primary button color; reserve it for the logo or rare brand accents.
- Don't make product images too small; toys should be the main focus.
- Don't use overly childish fonts for all text; keep body and product text readable.
- Don't break alignment between product cards.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---:|---|
| Mobile | < 768px | Header collapses; search becomes full-width; category nav becomes horizontal scroll; product grid becomes 1-column; filters collapse into drawer |
| Tablet | 768–1024px | Product grid becomes 2 columns; utility icons tighten; homepage cards become 2-up |
| Desktop | 1024–1440px | Full header, full category nav, 4-column product grid |
| Wide | > 1440px | Same as desktop with max-width container and extra page whitespace |

### Touch Targets
- Buttons must be at least 44px tall.
- Category nav pills should have at least 44px effective tap height.
- Product card actions should remain side-by-side on desktop and stack only when necessary.
- Floating accessibility button should remain reachable at bottom-right.

### Collapsing Strategy
- Promo bar remains visible but text can shorten on mobile.
- Main header collapses into logo + cart + menu, with search below.
- Category pills become horizontally scrollable.
- Rewards bar stays full width with centered text.
- Filter toolbar becomes a single “Filter & Sort” button opening a drawer.
- Product grid changes from 4 → 2 → 1 columns.
- Doodles reduce or disappear on smaller screens to avoid clutter.

### Image Behavior
- Product images remain centered and proportional.
- Avoid cropping product cutouts aggressively.
- Homepage hero collage may crop responsively, but product-focused sections should preserve complete product visibility.
- Product detail gallery thumbnails become horizontal scroll on mobile.

## Iteration Guide

1. Start with the header because it defines the brand rhythm: promo bar → logo/search/icons → category pills → rewards bar.
2. Use `{colors.navy}` as the default structure color and `{colors.canvas}` as the default surface.
3. Build every interactive component with rounded corners first; only use sharp edges when absolutely necessary.
4. Product cards must prioritize image clarity, product name, rating, price, and CTA alignment.
5. Use handwritten accents only for logo and small badges.
6. Add doodles last. If the page already feels busy, remove doodles instead of adding more.
7. Maintain consistent button pairing: secondary outline on the left, primary filled blue on the right.
8. Keep commerce actions obvious and parent-friendly.
9. Test every layout at desktop, tablet, and mobile widths.
10. When in doubt, increase whitespace and enlarge product imagery.

## Known Gaps

- The exact production font from the reference website may differ from the recommended open-source substitutes. Use `Nunito Sans`, `Quicksand`, or a similar rounded sans-serif to approximate the feel.
- The color values are approximated from the provided visual reference and should be validated through brand inspection if exact pixel-perfect matching is required.
- Product imagery guidelines are based on the provided collection-page visual: white background, colorful baby toys, large cutout product photography, and consistent card alignment.
- Animation details such as dropdown behavior, hover transitions, mega menu motion, and cart drawer transitions are not covered in depth.
- Checkout, account, and order-history pages should reuse the same tokens but may require additional form and table states.
- Accessibility states such as keyboard focus rings, screen-reader labels, and high-contrast mode should be specified during implementation.
