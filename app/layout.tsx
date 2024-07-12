import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ActiveSectionContextProvider from "@/context/Active-Section-Context";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import DarkMode from "@/components/Dark-Mode";
import ThemeContextProvider from "@/context/Theme-Context";
import localFont from '@next/font/local'

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
        className={`${inter.className}   bg-gray-50 text-gray-950 relative pt-28 sm:pt-36 dark:bg-stone-800 dark:text-gray-50 dark:text-opacity-90 `}
      >
        <ThemeContextProvider>
          <ActiveSectionContextProvider>
            <Header/>
            {children}
            <Toaster position="bottom-center" reverseOrder={false} />
            <Footer />
          </ActiveSectionContextProvider>

        </ThemeContextProvider>
      </body>
    </html>
  );
}