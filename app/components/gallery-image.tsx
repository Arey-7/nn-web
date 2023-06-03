import Image from "next/image";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

interface GalleryProps {
  images: GalleryImage[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  return (
    <div className="gallery">
      {images.map((image) => (
        <GalleryImage
          key={image.id}
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className={image.className}
        />
      ))}
    </div>
  );
};

const GalleryImage: React.FC<GalleryImage> = ({
  src,
  alt,
  width,
  height,
  className,
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
};

export default Gallery;
