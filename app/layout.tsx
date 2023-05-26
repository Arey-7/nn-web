import "./globals.css";
import { Roboto } from "next/font/google";
import Navbar from "./components/navbar";

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
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
