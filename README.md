# Reef Rooster

The site for an advertising agency in Nairobi: a portfolio of press, film and
radio work, plus an internal tool for costing jobs and quoting clients.

Built with Next.js 16 (App Router), React 19, Tailwind 4, GSAP + ScrollTrigger,
OGL for the WebGL hero, and Lenis for smooth scrolling.

## Running it

```bash
npm install
npm run assets     # generate the web images, film and audio — see below
npm run dev
```

`npm run assets` is not optional on a fresh clone. The site loads everything
from `public/w`, which is generated and git-ignored; without it the pages
render with no artwork.

### The asset pipeline

`assets-source/ads` holds the masters — around 400MB of print scans, broadcast
video and radio spots. They are tracked but live outside `public/`, so they are
never deployed. `scripts/build-assets.sh` turns them into the ~100MB of
derivatives the site actually serves: three sizes of each still, a poster frame
and a silent hover loop and a web cut of each film, and an MP3 of each spot.

```bash
npm run assets            # build whatever is missing — reruns are cheap
FORCE=1 npm run assets    # rebuild everything from scratch
```

It needs `ffmpeg` and `ffprobe` and nothing else (`brew install ffmpeg`, or
`apt install ffmpeg`). Outputs are skipped if they already exist, so adding one
campaign does not re-encode the library.

The pixel dimensions declared in `app/content/work.ts` describe the generated
files. If you change a size constant in the script, resync them.

## Environment

Copy `.env.example` to `.env.local`. Nothing is required to run the public
site; the variables gate and back the internal tool.

| Variable               | Needed for                                                                               |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| `QUOTE_PASSWORD`       | Opening `/quote-calculator`. Without it nobody can, including you.                       |
| `QUOTE_SESSION_SECRET` | Signing the session cookie. Any long random string; changing it signs everyone out.      |
| `DATABASE_URL`         | Saving quotes to the ledger. Optional — without it the calculator works but cannot save. |

## The internal tool

`/quote-calculator` (bookmarkable at `/internal`) prices a job and produces a
client-facing quotation. It is password-gated, `noindex`, and nothing on the
site links to it.

It handles print, film, radio and creative work; each job type declares its own
inputs and how they combine, in `app/quote-calculator/pricing.ts`. Costs, profit
and margin stay on the left of the screen and never reach the printed sheet —
the print stylesheet shows only what is inside `.quote-doc`, so anything added
to that page later is excluded from paper by default.

Saved quotes go to a Postgres ledger at `/quote-calculator/ledger`, which keeps
the inputs, the figures, and the margin and VAT rules as they stood that day, so
an old quote still explains itself after the rules change.

## Layout

```
app/
  content/work.ts          the portfolio — every section reads from this
  content/site.ts          name, contact details, nav
  sections/                homepage sections (hero, featured work, film, radio)
  projects/                work index and campaign pages
  quote-calculator/        the internal tool, its gate and its ledger
scripts/build-assets.sh    masters -> public/w
assets-source/ads/         the masters; not deployed
```

## Before this goes live

- `app/content/site.ts` carries **placeholder** contact details. The email,
  phone and every social link are invented.
- The `khrc` headline in `work.ts` is a best reading of handwriting in the
  gutter of the original page, and should be confirmed against it.
- The campaigns are real work for real clients. Check you have the right to
  publish them before deploying anywhere public.
