# Veridan Education design system

Tokens live in one place: `:root` in `src/app/globals.css`. Change a value there and every page follows. Colors are sampled from the Veridan logo.

## Color

| Token | Value | Use |
|---|---|---|
| `--brand-ocean-dark` | `#002B5F` | Navy from the logo: sidebar, banners, headings |
| `--brand-ocean` | `#003672` | Blue from the logo: primary buttons, links |
| `--brand-gold` | `#DEA843` | Gold from the logo: main calls to action, accents |
| `--brand-gold-dark` | `#7F5C12` | Gold for text. Bright gold fails contrast as text |
| `--brand-ink` | `#0E1B33` | Body text |
| `--brand-muted` | `#4E5A70` | Secondary text on light surfaces only |
| `--brand-pale-sky` | `#CBD7E6` | Secondary text on navy, dividers |
| `--brand-paper` | `#F6F8FC` | Page background |
| `--brand-surface` | `#FFFFFF` | Raised surfaces |

Tailwind utility names are kept from the earlier design, so `ocean` means brand blue, `carbon` means ink and `porcelain` means paper.

Every text and button pair must meet WCAG AA: 4.5:1 for text, 3:1 for borders and focus rings. Never use `text-dim-grey` on navy; use `text-pale-sky`.

## Type

Red Hat Display for headings, Red Hat Text for everything else. Sentence case. No em dashes in copy.

## Logo

- `public/brand/veridan-mark.svg`: the V, used through `src/components/ui/Logo.tsx`. Clean vector with a transparent background, drawn to match the supplied logo.
- `public/brand/veridan-logo.png`: the full lockup, raster only. The supplied `Logo.svg` is an auto-trace with wrong colors and rough edges, so don't use it.

The navy mark disappears on dark surfaces, so there it sits on a white plate.

## Dark mode

Only the public landing page has dark mode, through the `.landing` scope in `globals.css`. The portal is light only.

## Principles

- One bold move per page. On the landing page it's the diagonal cut from the logo's V.
- Avoid gradients, glow effects, identical card grids and all-caps labels.
- Numbers only mark things that really are a sequence.
- Keep keyboard focus visible and respect reduced motion.
