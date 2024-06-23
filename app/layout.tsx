import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ActiveSectionContextProvider from "@/context/Active-Section-Context";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/footer";
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
        className={
          "${inter.className} bg-gray-50 text-gray-950 relative pt-28 sm:pt-36 dark:bg-gray-900 dark:text-gray-50 dark:text-opacity-90 transition-colors duration-500"
        }
      >
        <div className="bg-[#becaff] absolute top-[-6rem] -z-10 right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[12rem] sm:w-[68.75rem] dark:bg-[#627a94]"></div>

        <div className="bg-[#ffffff] absolute top-[-1rem] -z-10 left-[35rem] h-[31.25rem] w-[42rem] rounded-full blur-[12rem] sm:w-[68.75rem] md:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#676394]"></div>
        <div></div>

        <ThemeContextProvider>
          <ActiveSectionContextProvider>
          <Header />
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
