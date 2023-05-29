"use client"
import Image from "next/image";
import { gsap } from "gsap";

export default function MenuButton() {

  return (
    <div className="space-y-1 hover:space-y-2">
      <Image
        src="pencil_white.svg"
        alt="Pencil Menu Icon"
        width={50}
        height={0}
        className="pencil-t space-y-2"
      />
      <Image
        src="pencil_white.svg"
        alt="Pencil Menu Icon"
        width={50}
        height={0}
        className="pencil-b rotate-180"
      />
    </div>
  );
}
