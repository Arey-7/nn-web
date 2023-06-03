import Image from "next/image";
import Gallery from "./sections/gallery";

// `app/page.tsx` is the UI for the `/` URL
export default function Page() {
  return (
    <main className="text-5xl mx-auto w-10/12 p-4">
      <p className="text-3xl text-orange-400 mb-4">
        We have a way with words as you can see:
      </p>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusantium
        rerum explicabo autem recusandae tempora veritatis aliquid. Maiores
        accusantium vitae quasi eum dignissimos incidunt voluptatem fuga
        repellat, vel iste, veritatis est. Lorem ipsum dolor sit amet
        consectetur adipisicing elit. Quaerat dicta alias quos accusantium harum
        quidem quo veritatis ab quasi magnam, amet asperiores omnis illo
        blanditiis repellat distinctio id consequatur veniam. Lorem ipsum dolor
        sit amet consectetur adipisicing elit. Quis nobis quas consequuntur,
        totam laboriosam cum quae fugit itaque illum tempora ad? In optio hic
        repellat cupiditate voluptatibus. Porro, cum est! Lorem ipsum dolor sit
        amet consectetur adipisicing elit. Delectus voluptatibus cumque maiores
        sequi ex aut sint! Dolores ratione consequatur, rerum suscipit aliquid
        repellendus dolorum quis veritatis nam modi possimus ut? Lorem ipsum
        dolor sit amet, consectetur adipisicing elit. Optio aut amet saepe
        assumenda corporis itaque hic, voluptas quas impedit facere culpa
        reiciendis corrupti, nisi quos quidem illo eligendi voluptates rerum.
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Expedita
        delectus soluta tenetur facilis porro quibusdam dolore est. Minus totam
        ratione exercitationem fugit eos minima deleniti a, placeat, inventore
        animi debitis.
      </p>
      <p className="text-3xl text-green-400 mt-4">
        Bet the only words you read were "Lorem ipsum" then you skipped to this
        section
      </p>
      <Gallery/>
    </main>
  );
}
