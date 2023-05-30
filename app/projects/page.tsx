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
    <h2 className="text-2xl p-56">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni delectus consectetur numquam? Alias, quae consequatur tempora similique nobis sunt obcaecati numquam temporibus pariatur aliquam neque nam asperiores ipsa voluptatum illum!
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum amet saepe eligendi, ipsam libero autem aut magnam commodi, quos veniam reiciendis officiis praesentium cumque itaque optio impedit, sequi repellat delectus.
    </h2>
    </>
    
    );
  }