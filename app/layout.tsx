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
      <body className={roboto.className}>
        <nav className="flex justify-between sticky">
          <Link href="./">
            <Image
              src="/nn-logo.svg"
              alt="Noah's Navy Logo"
              width={150}
              height={0}
            />
          </Link>
          <div className="flex justify-between space-x-7 origin-left rotate-90 absolute top-0 right-0">
            <Link href="/projects">Projects</Link>
            <Link href="/projects">About</Link>
            <Link href="/projects">Contacts</Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
