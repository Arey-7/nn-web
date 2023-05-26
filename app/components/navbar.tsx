import Image from "next/image";
import Link from "next/link";

function Navbar() {
    return ( 
        <nav className="sticky flex justify-between p-5 align-middle my-auto">
          <Link href="./">
            <Image
              src="/nn-logo.svg"
              alt="Noah's Navy Logo"
              width={200}
              height={0}
            />
          </Link>
          <div className="uppercase my-auto text-blue-900">
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
        </nav>
     );
}

export default Navbar;