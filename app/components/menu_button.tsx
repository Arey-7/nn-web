"use client"
import Image from "next/image";
import { gsap, GSAPTween } from "gsap";

export default function MenuButton() {

  const onEnter = ({currentTarget}) =>{
    gsap.to(currentTarget,{margin:"auto "})
  }
  return (
    <div className="relative w-20 h-20">
      <Image
        src="pencil_white.svg"
        alt="Pencil Menu Icon"
        width={80}
        height={0}
        className="pencil-t"
      />
      <Image
        src="pencil_white.svg"
        alt="Pencil Menu Icon"
        width={80}
        height={0}
        className="pencil-b rotate-180"
      />
    </div>
  );
}
