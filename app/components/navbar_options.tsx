import Link from "next/link";

export default function NavbarOptions() {

  return (
    <div className="w-full uppercase grid gap-3 fixed h-full backdrop-blur p-7" id="menu">
      <div className="mx-auto">
        <Link href="/projects">Projects</Link>
      </div>
      <div className="mx-auto">
        <Link href="/about">About</Link>
      </div>
      <div className="mx-auto">
        <Link href="/contacts">Contacts</Link>
      </div>
    </div>
  );
}
