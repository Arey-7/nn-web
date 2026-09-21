import Hero from "./sections/hero";
import Statement from "./sections/statement";
import FeaturedWork from "./sections/featured-work";
import FilmRoom from "./sections/film-room";
import RadioRoom from "./sections/radio-room";
import ClientMarquee from "./sections/client-marquee";

export default function Page() {
  return (
    <>
      <Hero />
      <Statement />
      <FeaturedWork />
      <FilmRoom />
      <RadioRoom />
      <ClientMarquee />
    </>
  );
}
