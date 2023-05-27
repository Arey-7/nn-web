import Link from "next/link";

export default function NavbarOptions() {
  return (
    <div className="">
      <Link href="/projects" className="mx-3">
        Projects
      </Link>
      <Link href="/about" className="mx-3">
        About
      </Link>
      <Link href="/contacts" className="mx-3">
        Contacts
      </Link>
    </div>
  );
}
