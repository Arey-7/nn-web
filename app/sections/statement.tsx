"use client";

import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const COPY =
  "A brief is a problem someone is paying to have solved. A cause is a problem nobody is paying for. We have never been much good at telling the two apart.";

export default function Statement() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(".word", { opacity: 1 });
        return;
      }

      gsap.to(".word", {
        opacity: 1,
        stagger: 0.12,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top 78%",
          end: "bottom 62%",
          scrub: 0.4,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="bg-paper py-32 md:py-48">
      <div className="mx-auto max-w-[1300px] px-6 md:px-10">
        <p className="text-display text-[clamp(1.9rem,5.2vw,4.75rem)]">
          {COPY.split(" ").map((word, i) => (
            <span
              key={`${word}-${i}`}
              className="word inline-block opacity-15"
            >
              {word}
              {" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
