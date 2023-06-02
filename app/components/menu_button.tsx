"use client";
import { useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";


export default function MenuButton() {
  
  const [clicked, setClicked] = useState(false);
  const handleClick = () => {
    setClicked(!clicked);
  };

  const { theme } = useTheme();
  const src = "/pencil.svg";
  let classname;
  switch (theme) {
    case "light":
      classname = "invert";
      break;
    case "dark":
      classname = "";
      break;
  }

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
          clicked ? `${classname} transition-transform rotate-45 ` : `${classname} transition-transform`
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
            ? `${classname} absolute transition-transform rotate-135 top-0`
            : `${classname} transition-transform rotate-180`
        }
      />
    </button>
  );
}
