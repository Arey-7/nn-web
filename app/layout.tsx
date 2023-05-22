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
        <div className="p-2">
          <div className=" w-full p-3 border-b-2 border-nn-dark-gray">
            <Link href="./">
              <Image
                src="/nn-logo.svg"
                alt="Noah's Navy Logo"
                width={200}
                height={0}
              />
            </Link>
          </div>
          <div className="flex justify-between">
            {children}
            <nav className="sticky">
              <div className="nav-options grid grid-flow-column place-content-end uppercase">
                <Link
                  href="/projects"
                  className="border-2 border-nn-dark-gray border-t-0 p-2"
                >
                  Projects
                </Link>
                <Link
                  href="/about"
                  className="border-2 border-nn-dark-gray border-t-0 p-2 "
                >
                  About
                </Link>
                <Link
                  href="/contacts"
                  className="border-2 border-nn-dark-gray border-t-0 p-2 "
                >
                  Contacts
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </body>
    </html>
  );
}
