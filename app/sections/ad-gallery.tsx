import Image from "next/image";
import { Splide, SplideSlide } from "@splidejs/react-splide";

export default function AdGallery() {
  const ads = [
    {
      src: "/ads/print/awf/awf_1a.jpg",
      alt: "AWF advert"
    },
    {
      src: "/ads/print/kenya_human_rights_commision/hanged.jpg",
      alt: "KHRC advert"
    },
    {
      src: "/ads/print/chiromo_lane/cl.jpg",
      alt: "Chiromo Lane advert"
    },
    {
      src: "/ads/print/nmg/Kizza-Besigye.jpg",
      alt: "NMG advert"
    },
    {
      src: "/ads/print/kra/layout3.jpg",
      alt: "KRA advert"
    },
    {
      src: "/ads/print/peugoet/p.png",
      alt: "Peugoet advert"
    },
  ];

  // Styles:  grid-flow-col auto-cols-min 
  return (
    <div className="">
      <div>
        <ul className="grid grid-cols-3">
        {ads.map((ad, index) => (
          <li>
            <div className="h-96">
              <Image
                key={index}
                src={ad.src}
                alt={ad.alt}
                width={350}
                height={200}
                className="h-full w-full object-cover"
              />
            </div>
          </li>
        ))}
        </ul>
      </div>
    </div>
  );
}
