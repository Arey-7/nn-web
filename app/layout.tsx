import "./globals.css";
import { Roboto } from "next/font/google";
import { Providers } from "./providers";
import Navbar from "./sections/navbar";
import Footer from "./sections/footer";
import ThemeButton from "./components/theme_button";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="./nn-flag.png" sizes="100" />
        <title>Noah's Navy Communications</title>
      </head>
      <body className={roboto.className}>
        <Providers>
          <div className="min-h-screen w-full">
            <Navbar />
            {children}
            <ThemeButton />
          </div>
          <div>
          <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
