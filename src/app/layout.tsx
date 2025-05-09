import type { Metadata } from "next";
import { Playfair_Display, Open_Sans } from "next/font/google";
import "@/app/globals.css";
// import { OffersBanner } from "@/components/offers-banner";
import { Analytics } from "@vercel/analytics/next";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-opensans",
});

export const metadata: Metadata = {
  title: "Indian Street Side Eatery",
  description:
    "Indian Street Side Eatery, Indian Street Food, Indian Street Food in USA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${openSans.variable} antialiased`}>
        {/* <OffersBanner /> */}

        <main>{children}</main>

        <Analytics />
      </body>
    </html>
  );
}
