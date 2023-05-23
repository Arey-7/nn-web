import "./globals.css";
import { Roboto } from "next/font/google";
import Link from "next/link";
import Image from "next/image";

const roboto = Roboto({
  weight: "500",
  subsets: ["latin"],
});

export const metadata = {
  title: "Noah's Navy Communications",
  description: "We Links Brands and Causes To The People 🔥🔥🔥",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="./nn-flag.png" sizes="100" />
      </head>
      <body className={roboto.className}>
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
        {children}
      </body>
    </html>
  );
}
