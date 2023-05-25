import Image from "next/image";

export default function Projects() {
    return (
    <>
    <h1>Here are Our Projects!</h1>
    <Image
              src="/pencil.svg"
              alt="Noah's Navy Logo"
              width={500}
              height={0}
            />
    </>
    
    );
  }