"use client";
import { useState } from "react";
import Image from "next/image";


export default function MenuButton() {
  
  const [clicked, setClicked] = useState(false);
  const handleClick = () => {
    setClicked(!clicked);
  };
  return (
    <button
      className={
        clicked ? "relative" : "space-y-2 hover:transition-all hover:space-y-3"
      }
      onClick={handleClick}
    >
      <Image
        src="/pencil.svg"
        alt="Menu Icon"
        width={50}
        height={0}
        priority={true}
        className={
          clicked ? "transition-transform rotate-45" : "transition-transform"
        }
      />
      <Image
        src="/pencil.svg"
        alt="Menu Icon"
        width={50}
        height={0}
        priority={true}
        className={
          clicked
            ? "absolute transition-transform rotate-135 top-0"
            : "transition-transform rotate-180"
        }
      />
    </button>
  );
}
