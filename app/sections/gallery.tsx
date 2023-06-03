import Image from "next/image";

export default function Gallery(){
    return(
        <div>Gallery Section
            <div className="flex gap-2 overflow-hidden">
            <Image src="/gallery/dotted-lion.jpg"
            alt=""
            width={500}
            height={0}
            className="my-5 grayscale"/>
            <Image src="/gallery/dotted-lion.jpg"
            alt=""
            width={500}
            height={0}
            className="my-5"/>
            <Image src="/gallery/dotted-lion.jpg"
            alt=""
            width={500}
            height={0}
            className="my-5"/>
            <Image src="/gallery/dotted-lion.jpg"
            alt=""
            width={500}
            height={0}
            className="my-5"/>
            </div>
        </div>
    )
}