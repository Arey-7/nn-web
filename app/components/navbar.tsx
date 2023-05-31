"use client"
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MenuButton from "./menu_button";
import NavbarOptions from "./navbar_options";

//sticky top-0 right-0 flex items-center justify-between w-full px-8 py-6 backdrop-blur-3xl border-none
export default function Navbar() {
//   const [visibleMenu,setVisibleMenu] = useState(false);
// const showMenu = () => {
// setVisibleMenu(!visibleMenu);

  return (
    <div className="sticky top-0 h-20">
      <nav className="flex items-center justify-between px-8 py-6">
        <Link href="./">
          <Image
            src="/nn_logo.svg"
            alt="Noah's Navy Logo"
            width={150}
            height={0}
            priority={true}
            className="logo"
          />
        </Link>
        <div>
          <MenuButton />
        </div>
      </nav>
      <div className= "invisible">
        <NavbarOptions />
      </div>
    </div>
  );
}
