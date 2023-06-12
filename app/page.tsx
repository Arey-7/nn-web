import Image from "next/image";
import ArtGallery from "./sections/art-gallery";
import AdGallery from "./sections/ad-gallery";

// `app/page.tsx` is the UI for the `/` URL
export default function Page() {
  return (
    <main className="text-5xl">
      <ArtGallery />
      <AdGallery />
    </main>
  );
}
