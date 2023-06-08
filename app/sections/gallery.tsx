import Image from "next/image";

export default function Gallery() {
  const artpieces = [
    {
      src: "/gallery/dotted-lion.jpg",
      alt: "Lion Artpiece",
      className: "w-72 h-48 rounded-md border-8 border-amber-900 object-cover",
    },
    {
      src: "/gallery/dotted-lion.jpg",
      alt: "Lion Artpiece",
      className: "w-72 h-48 rounded-md border-8 border-amber-900 object-cover",
    },
    {
      src: "/gallery/dotted-lion.jpg",
      alt: "Lion Artpiece",
      className: "w-72 h-48 rounded-md border-8 border-amber-900 object-cover",
    },
    {
      src: "/gallery/dotted-lion.jpg",
      alt: "Lion Artpiece",
      className: "w-72 h-48 rounded-md border-8 border-amber-900 object-cover",
    },
    {
      src: "/gallery/dotted-lion.jpg",
      alt: "Lion Artpiece",
      className: "w-72 h-48 rounded-md border-8 border-amber-900 object-cover",
    },
    {
      src: "/gallery/dotted-lion.jpg",
      alt: "Lion Artpiece",
      className: "w-72 h-48 rounded-md border-8 border-amber-900 object-cover",
    },
    {
      src: "/gallery/dotted-lion.jpg",
      alt: "Lion Artpiece",
      className: "w-72 h-48 rounded-md border-8 border-amber-900 object-cover",
    },
    {
      src: "/gallery/dotted-lion.jpg",
      alt: "Lion Artpiece",
      className: "w-72 h-48 rounded-md border-8 border-amber-900 object-cover",
    },
    {
      src: "/gallery/dotted-lion.jpg",
      alt: "Lion Artpiece",
      className: "w-72 h-48 rounded-md border-8 border-amber-900 object-cover",
    },
    {
      src: "/gallery/dotted-lion.jpg",
      alt: "Lion Artpiece",
      className: "w-72 h-48 rounded-md border-8 border-amber-900 object-cover",
    },
    {
      src: "/gallery/dotted-lion.jpg",
      alt: "Lion Artpiece",
      className: "w-72 h-48 rounded-md border-8 border-amber-900 object-cover",
    }
  ];

  
  return (
    <div>
      Art Gallery
      <div className="flex gap-2 overflow-hidden">
        {artpieces.map((artpiece, index) => (
          <Image
            key={index}
            src={artpiece.src}
            alt={artpiece.alt}
            width={3}
            height={2}
            className={artpiece.className}
          />
        ))}
      </div>
    </div>
  );
}
