import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ActiveSectionContextProvider from "@/context/Active-Section-Context";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import DarkMode from "@/components/Dark-Mode";
import ThemeContextProvider from "@/context/Theme-Context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "whattuan",
  description: "oh hey whats up. im tuan. i make websites and stuff.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth">
      <body
        className={`${inter.className} bg-gray-50 text-gray-950 relative pt-28 sm:pt-36 dark:bg-gray-900 dark:text-gray-50 dark:text-opacity-90 transition-colors duration-500`}
      >
        <ThemeContextProvider>
          <ActiveSectionContextProvider>
            <Header/>
            {children}
            <Toaster position="bottom-center" reverseOrder={false} />
            <Footer />
          </ActiveSectionContextProvider>
          <DarkMode />
        </ThemeContextProvider>
      </body>
    </html>
  );
}
