import { CLIENTS } from "../content/work";

export default function ClientMarquee() {
  return (
    <section
      aria-labelledby="clients-heading"
      className="border-y border-line bg-paper py-16 md:py-24"
    >
      <h2 id="clients-heading" className="sr-only">
        Clients
      </h2>

      <div className="edge-fade-x overflow-hidden">
        <div className="animate-marquee flex w-max gap-14 pr-14 md:gap-24 md:pr-24">
          {/* Doubled so the -50% translate loops without a seam. */}
          {[...CLIENTS, ...CLIENTS].map((client, i) => (
            <span
              key={`${client}-${i}`}
              aria-hidden={i >= CLIENTS.length}
              className="text-display shrink-0 text-[clamp(1.8rem,4.4vw,4rem)] text-ink-faint"
            >
              {client}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
