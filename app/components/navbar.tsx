import Image from "next/image";
import Link from "next/link";
import NavbarOptions from "./navbar_options";
import MenuButton from "./menu_button";

export default function Navbar() {
  return (
    <nav className="sticky flex justify-between p-5 align-middle my-auto">
      <Link href="./">
        <Image
          src="/nn_logo.svg"
          alt="Noah's Navy Logo"
          width={200}
          height={0}
        />
      </Link>
      <div className="uppercase my-auto text-blue-900">
        
        <Link href="./">
          <MenuButton/>
        </Link>
      </div>
    </nav>
  );
}
