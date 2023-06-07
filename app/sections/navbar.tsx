"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import NavLinks from "../components/nav-links";
import { gsap } from "gsap";

export default function Navbar() {
  const [clicked, setClicked] = useState(false);
  const handleClick = () => {
    setClicked(!clicked);
  };

  const menu = useRef(null);

  useEffect(() => {
    if (clicked) {
      gsap.to(menu.current, { x: "-25%", duration: 0.8, opacity: 1 });
    } else {
      gsap.to(menu.current, { x: 0, duration: 0.8, opacity: 1 });
    }
  }, [clicked]);

  // Menu Links
  const options = [
    { name: "Projects", link: "/projects" },
    { name: "About", link: "/about" },
    { name: "Contacts", link: "/contacts" },
  ];

  return (
    <div className="fixed top-0 w-full">
      <nav className="flex items-center justify-between px-6 py-2">
        <Link href="./">
          <Image
            src="/nn_logo.svg"
            alt="Noah's Navy Logo"
            width={150}
            height={0}
            priority={true}
            className="logo dark:invert"
          />
        </Link>
        <button
          className="menu-button dark:invert"
          aria-controls="primary-navigation"
          aria-expanded={clicked ? "true" : "false"}
          onClick={handleClick}
        >
          <svg
            className="hamburger"
            stroke="var(--button-color)"
            fill="none"
            viewBox="0 0 100 100"
            width="50"
          >
            <path
              className="line"
              d="m 20 40 h 60 a 1 1 0 0 1 0 20 h -60 a 1 1 0 0 0 0 20 h 60 a 1 1 0 0 1 0 20 h -30 v -70"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </button>
      </nav>
        <div ref={menu}>
          <NavLinks />
        </div>
    </div>
  );
}
