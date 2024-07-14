import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import Header from "@/components/Header";
import ActiveSectionContextProvider from "@/context/Active-Section-Context";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";

import ThemeContextProvider from "@/context/Theme-Context";
import localFont from '@next/font/local'
import Lines from "@/components/Lines";

const erotique = localFont({
  src: [
    {
      path: '../public/erotique/ErotiqueAlternateTrial-Regular.ttf',
      weight: '400'
    },
    {
      path: '../public/erotique/ErotiqueAlternateTrial-Bold.ttf',
      weight: '700'
    }
  ],
  variable: '--font-erotique'
})

const tiny5 = localFont({
  src: [
    {
      path: '../public/Tiny5/Tiny5-Regular.ttf',
      weight: '400'
    }
  ],
  variable: '--font-tiny5'
})



const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "whattuan",
  description: "oh hey whats up",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth">
      <body
        className={`${tiny5.className}   bg-gray-50 text-gray-950 relative pt-28 sm:pt-36 dark:bg-stone-800 dark:text-gray-50 dark:text-opacity-90 `}
      >
        <ThemeContextProvider>
          <ActiveSectionContextProvider>
            <Header/>
            {children}
            <Toaster position="bottom-center" reverseOrder={false} />
            <Footer />
            {/* <Lines /> */}
          </ActiveSectionContextProvider>

        </ThemeContextProvider>
      </body>
    </html>
  );
}