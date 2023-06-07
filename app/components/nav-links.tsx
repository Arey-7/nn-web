import Link from "next/link";

export default function NavLinks() {
  const options = [
    { name: "Projects", link: "/projects" },
    { name: "About", link: "/about" },
    { name: "Contacts", link: "/contacts" },
  ];


  return (
    <div
      className="bg-black text-gray-500  absolute -right-1/4 h-screen uppercase dark:invert w-1/5"
    >
      {options.map((option, index) => (
        <div key={index} className="p-6 mx-auto hover:text-white">
          <Link href={option.link}>{option.name}</Link>
        </div>
      ))}
    </div>
  );
}
