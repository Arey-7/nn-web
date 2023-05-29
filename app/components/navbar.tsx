import Image from "next/image";
import Link from "next/link";
import MenuButton from "./menu_button";

export default function Navbar() {
  return (
    <nav className="sticky flex items-center justify-between w-full px-8 py-6 bg-transparent backdrop-blur">
      <Link href="./">
        <Image
          src="/nn_logo_black.svg"
          alt="Noah's Navy Logo"
          width={150}
          height={0}
          className="invert"
        />
      </Link>
        <Link href="./">
          <MenuButton/>
        </Link>
    </nav>
  );
}
