import Link from "next/link";
import { SITE } from "../content/site";

export default function Footer() {
  return (
    <footer className="no-print border-t border-line bg-paper">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="grid gap-16 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-7">
            <p className="text-label text-ink-faint">Start something</p>
            <Link
              href="/contacts"
              className="group mt-6 block text-display text-[clamp(2.75rem,8vw,7rem)]"
            >
              Let&rsquo;s make
              <br />
              <span className="italic text-accent">something</span> that
              <br />
              matters.
              <span className="ml-4 inline-block transition-transform duration-500 ease-(--ease-out-expo) group-hover:translate-x-4">
                &rarr;
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-10 md:col-span-5 md:grid-cols-2">
            <nav aria-label="Footer">
              <p className="text-label text-ink-faint">Site</p>
              <ul className="mt-5 space-y-2 text-lg">
                {SITE.nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="transition-colors hover:text-accent"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="text-label text-ink-faint">Elsewhere</p>
              <ul className="mt-5 space-y-2 text-lg">
                {SITE.social.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="transition-colors hover:text-accent"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <address className="col-span-2 not-italic">
              <p className="text-label text-ink-faint">Studio</p>
              <p className="mt-5 text-lg leading-relaxed text-ink-muted">
                {SITE.address}
              </p>
              <a
                href={`mailto:${SITE.email}`}
                className="mt-3 inline-block text-lg underline decoration-line underline-offset-4 transition-colors hover:text-accent"
              >
                {SITE.email}
              </a>
            </address>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-line py-8 text-sm text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {SITE.legalName}. Nairobi, Kenya.
          </p>
          <p>{SITE.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
