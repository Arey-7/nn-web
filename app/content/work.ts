/**
 * The portfolio. Every section of the site reads from this file.
 *
 * Provenance notes, so nobody mistakes editorial for fact:
 *
 * - `headline` quotes the artwork directly wherever the line is legible in the
 *   creative. The one exception is `khrc`, whose headline is handwritten down
 *   the gutter of the page — that transcription is a best reading and SHOULD BE
 *   CONFIRMED against the original before publishing.
 * - `year` is only filled in where the artwork itself dates it (KRA names a
 *   31 December 2004 deadline; the Peugeot plate reads 2019; NMG's campaign is
 *   its own 60th). Campaigns with no verifiable date are left undated rather
 *   than guessed — fill them in when you know them.
 * - Film and radio `title`s are descriptive labels, not official campaign
 *   names, except where the source filename carries the spot's real name
 *   ("The Next Big Thing", "Mbu", "Beijing", "London", "Pattni").
 * - `blurb` is written copy. Edit freely.
 */

export type Medium = "print" | "film" | "radio";

export type PrintPiece = {
  src: string;
  thumb: string;
  tile: string;
  width: number;
  height: number;
  alt: string;
  line?: string;
};

export type FilmPiece = {
  id: string;
  title: string;
  seconds: number;
  poster: string;
  loop: string;
  film: string;
};

export type RadioPiece = {
  id: string;
  title: string;
  seconds: number;
  audio: string;
};

export type Campaign = {
  slug: string;
  client: string;
  title: string;
  headline: string;
  year?: string;
  medium: Medium;
  discipline: string;
  blurb: string;
  /** Legible on the dark theme. */
  accent: string;
  /** Legible on the light theme. Both clear WCAG AA against their background. */
  accentLight: string;
  featured?: boolean;
  print?: PrintPiece[];
  films?: FilmPiece[];
  radio?: RadioPiece[];
};

const p = (
  name: string,
  width: number,
  height: number,
  alt: string,
  line?: string
): PrintPiece => ({
  src: `/w/print/${name}.jpg`,
  thumb: `/w/print/${name}-t.jpg`,
  tile: `/w/print/${name}-s.jpg`,
  width,
  height,
  alt,
  line,
});

const f = (
  id: string,
  title: string,
  seconds: number
): FilmPiece => ({
  id,
  title,
  seconds,
  poster: `/w/film/${id}-poster.jpg`,
  loop: `/w/film/${id}-loop.mp4`,
  film: `/w/film/${id}.mp4`,
});

const r = (id: string, title: string, seconds: number): RadioPiece => ({
  id,
  title,
  seconds,
  audio: `/w/radio/${id}.mp3`,
});

export const CAMPAIGNS: Campaign[] = [
  {
    slug: "awf",
    client: "African Wildlife Foundation",
    title: "Poaching is foreign",
    headline:
      "Let's say your healthy teeth bring a smile… and pocket change to a poacher.",
    medium: "print",
    discipline: "Conservation",
    accent: "#c9d92b",
    accentLight: "#676f16",
    featured: true,
    blurb:
      "Three long-copy pages that refuse to let the reader off. Each one starts on the reader's own body — your teeth, your hands, your hair — and walks it, sentence by sentence, into the animal's. They all land on the same verdict: poaching is foreign. It's unAfrican.",
    print: [
      p(
        "awf-elephant",
        629,
        791,
        "African Wildlife Foundation press ad: a close crop of an elephant's tusk against dark hide.",
        "Let's say your healthy teeth bring a smile… and pocket change to a poacher"
      ),
      p(
        "awf-gorilla",
        636,
        797,
        "African Wildlife Foundation press ad: a gorilla's hand resting on the forest floor.",
        "People donate their bodies to science. Yours is about to be donated as art"
      ),
      p(
        "awf-rhino",
        633,
        789,
        "African Wildlife Foundation press ad: a rhino's horn and face in the rain.",
        "Imagine being hunted to death for your Mohawk"
      ),
    ],
  },
  {
    slug: "chiromo-lane",
    client: "Ministry of Health",
    title: "Where do you fall?",
    headline: "Mental case / Judge-mental. Where do you fall?",
    medium: "print",
    discipline: "Public health",
    accent: "#29abe2",
    accentLight: "#1b7195",
    featured: true,
    blurb:
      "Two faces, one slash, and a question that puts the reader on one side of it. The campaign moves the shame off the ill and onto the people doing the naming — then hands over a number to dial.",
    print: [
      p(
        "chiromo-mental-case",
        961,
        1154,
        "Mental health press ad: two portraits divided by a slash, labelled 'Mental case' and 'Judge-mental'.",
        "Mental case / Judge-mental"
      ),
      p(
        "chiromo-family-curse",
        961,
        1154,
        "Mental health press ad: two portraits labelled 'Family curse' and 'Curse of ignorance'.",
        "Family curse / Curse of ignorance"
      ),
      p(
        "chiromo-third",
        961,
        1154,
        "Mental health press ad: a third pairing in the 'Where do you fall?' series."
      ),
      p(
        "chiromo-wide-1",
        1800,
        1081,
        "Mental health campaign, double-page spread."
      ),
      p(
        "chiromo-wide-2",
        1800,
        1081,
        "Mental health campaign, second double-page spread."
      ),
    ],
  },
  {
    slug: "kra",
    client: "Kenya Revenue Authority",
    title: "The tax man cometh",
    headline: "The tax man cometh.",
    year: "2004",
    medium: "print",
    discipline: "Public sector",
    accent: "#1ca5d8",
    accentLight: "#137295",
    featured: true,
    blurb:
      "A tax amnesty written in the cadence of scripture and set like a summons — seven all-type layouts, white on black, no pictures at all. 'Woe to thee if thou will not have declared…' One execution simply puts the excuse in the defendant's mouth: I didn't know about the deadline, my Lords.",
    print: [
      p(
        "kra-3",
        1273,
        1800,
        "Kenya Revenue Authority tax amnesty ad set entirely in type: 'The Tax Man Cometh'.",
        "The tax man cometh"
      ),
      p(
        "kra-1",
        1273,
        1800,
        "Kenya Revenue Authority tax amnesty ad: a quoted courtroom excuse set large.",
        "“I didn't know about the deadline on the 31st Dec… my Lords”"
      ),
      p("kra-2", 1273, 1800, "Kenya Revenue Authority tax amnesty layout."),
      p("kra-4", 1273, 1800, "Kenya Revenue Authority tax amnesty layout."),
      p("kra-5", 1273, 1800, "Kenya Revenue Authority tax amnesty layout."),
      p("kra-6", 1273, 1800, "Kenya Revenue Authority tax amnesty layout."),
      p("kra-7", 1273, 1800, "Kenya Revenue Authority tax amnesty layout."),
    ],
  },
  {
    slug: "khrc",
    client: "Kenya Human Rights Commission",
    title: "Hanged",
    headline:
      "1,090 Mau Mau were hanged by Britain for dreaming of self-determination.",
    medium: "print",
    discipline: "Human rights",
    accent: "#c9a227",
    accentLight: "#7f6619",
    featured: true,
    blurb:
      "A full page made to look like evidence: aged newsprint, dense columns of the record, a gallows standing where the masthead should be. The line runs down the gutter in longhand, as if someone wrote it in the margin of a paper they could not put down.",
    print: [
      p(
        "khrc-hanged",
        1274,
        1800,
        "Kenya Human Rights Commission full-page press ad on aged newsprint documenting colonial-era hangings of Mau Mau detainees."
      ),
    ],
  },
  {
    slug: "nmg",
    client: "Nation Media Group",
    title: "True & Timeless",
    headline: "There whatever the future holds.",
    year: "2019",
    medium: "print",
    discipline: "Media",
    accent: "#3c82c0",
    accentLight: "#0b63b0",
    featured: true,
    blurb:
      "Sixty years of a newspaper, argued through the days it showed up for. Each page pairs one photograph from the archive with the date it ran and the reporting around it — Kenyatta's death, Besigye sat down in the road, Wangari Maathai, Saba Saba. The claim is not that the Nation was good. It's that it was there.",
    print: [
      p(
        "nmg-mzee",
        1283,
        1800,
        "Nation Media Group @60 ad: a driver reads the Daily Nation special edition headlined 'Mzee is dead'.",
        "There when Kenya's beloved founding father died"
      ),
      p(
        "nmg-besigye",
        1001,
        1200,
        "Nation Media Group @60 ad: Kizza Besigye sitting in the road surrounded by police.",
        "There as Kizza Besigye was arrested for walking to work"
      ),
      p("nmg-wangari", 1500, 1800, "Nation Media Group @60 ad: Wangari Maathai."),
      p("nmg-sabasaba", 1001, 1200, "Nation Media Group @60 ad: Saba Saba."),
      p(
        "nmg-independence",
        1001,
        1200,
        "Nation Media Group @60 ad: Kenyan independence."
      ),
      p("nmg-albino", 918, 1100, "Nation Media Group @60 ad."),
      p(
        "nmg-tz-president",
        918,
        1100,
        "Nation Media Group @60 ad: Tanzania's first female president."
      ),
      p("nmg-royal-wedding", 780, 935, "Nation Media Group @60 ad: a royal wedding."),
      p("nmg-equator", 1500, 1800, "Nation Media Group full-page ad: Equator Sounds."),
    ],
  },
  {
    slug: "peugeot",
    client: "Peugeot",
    title: "The lion is back in the hood",
    headline: "The lion is back in the hood.",
    year: "2019",
    medium: "print",
    discipline: "Automotive",
    accent: "#e2622a",
    accentLight: "#ae4b20",
    featured: true,
    blurb:
      "Peugeot came back to Kenyan assembly at Thika, so the ad put the homecoming in the picture: the 504 that owned these roads from 1968 parked alongside the 3008 that inherits them. Two number plates, fifty-one years, one bloodline.",
    print: [
      p(
        "peugeot-3008",
        1800,
        1081,
        "Peugeot press ad: a 1968 Peugeot 504 and a 2019 Peugeot 3008 SUV side by side.",
        "The lion is back in the hood"
      ),
      p("peugeot-2", 1800, 1081, "Peugeot 3008 campaign layout."),
      p("peugeot-3", 1800, 1081, "Peugeot 3008 campaign layout."),
      p("peugeot-4", 1800, 1081, "Peugeot 3008 campaign layout."),
      p("peugeot-5", 1800, 1081, "Peugeot 3008 campaign layout."),
    ],
  },

  {
    slug: "stanbic",
    client: "CfC Stanbic Bank",
    title: "The businesses behind the business",
    headline: "Every balance sheet has someone standing behind it.",
    medium: "film",
    discipline: "Banking",
    accent: "#5c7cc3",
    accentLight: "#0033a1",
    featured: true,
    blurb:
      "A documentary series for the bank's enterprise arm, shot on the customers' own ground — a bakery, a freight yard, an engineering firm laying road, a farm, a pathology lab. Nobody reads a proposition to camera. The businesses just get on with it and the bank stands where it belongs: slightly off to one side.",
    films: [
      f("stanbic-bake-and-bite", "Bake & Bite", 167),
      f("stanbic-babuh-60", "Babuh Freighters", 63),
      f("stanbic-gibb-60", "GIBB Africa", 63),
      f("stanbic-kaitet-60", "Kaitet Farm", 65),
      f("stanbic-pathology", "Pathology", 182),
    ],
  },
  {
    slug: "business-daily",
    client: "Business Daily",
    title: "The Next Big Thing",
    headline: "Every giant was once a sketch nobody understood.",
    medium: "film",
    discipline: "Media",
    accent: "#e8927c",
    accentLight: "#925c4e",
    blurb:
      "The film opens on a pencil working over a sheet of paper, drawing a name that was crossed out long before the world learned the other one. An argument for reading the business pages before the rest of the country catches up.",
    films: [f("bd-next-big-thing", "The Next Big Thing", 35)],
  },
  {
    slug: "bic",
    client: "BIC",
    title: "Sixty seconds, one pen",
    headline: "Everything starts with somebody writing it down.",
    medium: "film",
    discipline: "FMCG",
    accent: "#f36f21",
    accentLight: "#ab4e17",
    blurb:
      "A sixty-second television commercial for the most ordinary object in the room, built around the moment a person bends over a page and commits.",
    films: [f("bic-without-newspaper", "BIC 60″", 63)],
  },
  {
    slug: "lucozade",
    client: "Lucozade",
    title: "Energy, drawn",
    headline: "Energy you can see coming.",
    medium: "film",
    discipline: "FMCG",
    accent: "#f28c00",
    accentLight: "#9b5a00",
    blurb:
      "A figure assembled out of glowing particles moves through the dark and resolves, for a moment, into a person — the drink's promise rendered as light rather than claimed as a line.",
    films: [f("lucozade-kenya", "Lucozade Kenya", 30)],
  },
  {
    slug: "psi-kenya",
    client: "PSI Kenya",
    title: "Mbu",
    headline: "The smallest thing in the room is the dangerous one.",
    medium: "film",
    discipline: "Public health",
    accent: "#dd484e",
    accentLight: "#cb262c",
    blurb:
      "Public-health film shot inside the ordinary Kenyan home where the risk actually lives — the doorway, the painted wall, the room everyone sleeps in.",
    films: [f("psi-mbu-64", "Mbu", 64)],
  },
  {
    slug: "the-east-african",
    client: "The East African",
    title: "Taxi",
    headline: "The region, read from the back seat.",
    medium: "film",
    discipline: "Media",
    accent: "#3e83b5",
    accentLight: "#1b6ca8",
    blurb:
      "A monochrome city, one yellow taxi sign holding the only colour in frame, and a newspaper that crosses borders for a living.",
    films: [f("tea-taxi", "Taxi", 63)],
  },

  {
    slug: "celtel",
    client: "Celtel",
    title: "Beijing / London",
    headline: "Two cities, one call.",
    medium: "radio",
    discipline: "Telecoms",
    accent: "#e93457",
    accentLight: "#d4032b",
    featured: true,
    blurb:
      "A pair of radio spots for the network that became Airtel, each one carrying a Kenyan listener somewhere they have never been and getting them home inside thirty seconds.",
    radio: [
      r("celtel-beijing", "Beijing", 28),
      r("celtel-london", "London", 32),
    ],
  },
  {
    slug: "hedex",
    client: "Hedex",
    title: "3 in 1",
    headline: "Three problems, one answer.",
    medium: "radio",
    discipline: "Pharmaceutical",
    accent: "#4182bd",
    accentLight: "#0b5fab",
    blurb: "Thirty seconds of radio built to be remembered at the counter.",
    radio: [r("hedex-3in1", "3 in 1 Mix", 30)],
  },
  {
    slug: "kra-radio",
    client: "Kenya Revenue Authority",
    title: "Pattni",
    headline: "Everybody knows the name.",
    medium: "radio",
    discipline: "Public sector",
    accent: "#1ca5d8",
    accentLight: "#137295",
    blurb:
      "Radio for the revenue authority that reaches for a name the whole country already has an opinion about, and lets the listener finish the thought.",
    radio: [r("kra-pattni", "Pattni", 53)],
  },
  {
    slug: "moe",
    client: "Ministry of Education",
    title: "Wind",
    headline: "Some things carry further than you think.",
    medium: "radio",
    discipline: "Public sector",
    accent: "#388c69",
    accentLight: "#006b3f",
    blurb: "A radio spot for the education ministry, carried on sound alone.",
    radio: [r("moe-wind", "Wind", 36)],
  },
];

export const FEATURED = CAMPAIGNS.filter((c) => c.featured && c.medium === "print");
export const FILMS = CAMPAIGNS.filter((c) => c.medium === "film");
export const RADIO = CAMPAIGNS.filter((c) => c.medium === "radio");

export const bySlug = (slug: string) => CAMPAIGNS.find((c) => c.slug === slug);

/**
 * Feeds both accent variants to CSS so the theme picks one. An inline style
 * can't respond to the theme class, but a custom property can.
 * Pair with the `ca-text` / `ca-bg` / `ca-border` utilities.
 */
export const accentVars = (c: Campaign) =>
  ({ "--ca": c.accent, "--ca-light": c.accentLight }) as React.CSSProperties;

/** Radio has no artwork, so it falls through to a typographic card. */
export const coverOf = (c: Campaign) =>
  c.print?.[0]?.thumb ?? c.films?.[0]?.poster ?? null;

export const pieceCount = (c: Campaign) =>
  (c.print?.length ?? 0) + (c.films?.length ?? 0) + (c.radio?.length ?? 0);

/** Every print image on the site, used for the hero mosaic. */
export const ALL_PRINT: PrintPiece[] = CAMPAIGNS.flatMap((c) => c.print ?? []);

export const CLIENTS = Array.from(
  new Set(CAMPAIGNS.map((c) => c.client))
).sort();
