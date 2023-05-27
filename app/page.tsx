import Image from "next/image";

// `app/page.tsx` is the UI for the `/` URL
export default function Page() {
  return (
    <main>
      <div className="hero-section flex">
        <header className="w-2/5 ">
          <h1 className=" px-12  pt-12 text-5xl text-black">
            Our Creative Solutions Connect Brands and Causes with People
          </h1>
          <h2 className="px-12 text-l mt-4 text-neutral-400">
            We use design and messaging to create authentic connections between
            businesses and their audience
          </h2>
          <button className="bg-yellow-300 text-blue-900 mt-2 p-3 m-12 text-m rounded-full border-2 border-neutral-400 hover:bg-yellow-400 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300">
            Get in Touch
          </button>
        </header>
      </div>
    </main>
  );
}
