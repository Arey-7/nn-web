import Image from "next/image";

// `app/page.tsx` is the UI for the `/` URL
export default function Page() {
  return (
    <main>
      <div className="hero-section flex">
        <header className="p-12 w-2/5 ">
          <h1 className="text-5xl text-white">
            Our Creative Solutions Connect Brands and Causes with People
          </h1>
          <h2 className="text-l mt-4 text-neutral-400">
            We use design and messaging to create authentic connections between
            businesses and their audience
          </h2>
          <button className="bg-yellow-300 text-blue-900 mt-2 p-3 text-m rounded-full border-2 border-neutral-400 hover:bg-yellow-400">
            Get in Touch
          </button>
        </header>
      </div>
    </main>
  );
}
