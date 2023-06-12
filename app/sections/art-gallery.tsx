import Image from "next/image";

export default function ArtGallery() {
  const artpieces = [
    {
      src: "/gallery/dotted_elephant.jpg",
      alt: "Elephant Artpiece"
    },
    {
      src: "/gallery/country.jpg",
      alt: "Country Artpiece"
    },
    {
      src: "/gallery/dotted_antelope.jpg",
      alt: "Antelope Artpiece"
    },
    {
      src: "/gallery/barnyard.jpg",
      alt: "Lion Artpiece"
    },
    {
      src: "/gallery/dotted_lion.jpg",
      alt: "Lion Artpiece"
    },
    {
      src: "/gallery/sea.jpg",
      alt: "Lion Artpiece"
    },
  ];

  return (
    <div className="">
      <ul className="grid grid-cols-3">
        {artpieces.map((artpiece, index) => (
          <li className="">
            <div className="h-96">
              <Image
                key={index}
                src={artpiece.src}
                alt={artpiece.alt}
                width={350}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
