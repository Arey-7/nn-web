import Image from "next/image";
import Link from "next/link";
import NavbarOptions from "./navbar_options";

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
          <div className="hover:space-y-4 focus:animate-spin">
          <Image
            src="/pencil_black.svg"
            alt="Menu button"
            width={80}
            height={0}
            className="mb-1"
          />
          <Image
            src="/pencil_black.svg"
            alt="Menu button"
            width={80}
            height={0}
            className="mt-1 rotate-180 "
          />
          </div>
          
        </Link>
      </div>
    </nav>
  );
}
