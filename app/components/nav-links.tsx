import Link from "next/link";

export default function NavLinks() {
  const options = [
    { name: "Projects", link: "/projects" },
    { name: "About", link: "/about" },
    { name: "Contacts", link: "/contacts" },
  ];


  return (
    <div
      className="bg-black text-gray-500  absolute -right-1/4 h-screen uppercase dark:invert w-1/5 divide-y"
    >
      {options.map((option, index) => (
          <Link href={option.link} key={index} className="block p-6 text-center hover:text-white">{option.name}</Link>
      ))}
    </div>
  );
}
