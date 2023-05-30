import Image from "next/image";
import Link from "next/link";
import MenuButton from "./menu_button";


//sticky top-0 right-0 flex items-center justify-between w-full px-8 py-6 backdrop-blur-3xl border-none
export default function Navbar() {
  return (
    <nav className="sticky top-0 flex items-center justify-between px-8 py-6 backdrop-blur-3xl">
      <Link href="./">
        <Image
          src="/nn_logo.svg"
          alt="Noah's Navy Logo"
          width={150}
          height={0}
        />
      </Link>
        <Link href="">
          <MenuButton/>
        </Link>
    </nav>
  );
}
