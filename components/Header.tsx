"use client";

import React from "react";
import { motion } from "framer-motion";
import { links } from "@/lib/data";
import Link from "next/link";
import clsx from "clsx";
import { useActiveSectionContext } from "@/context/Active-Section-Context";

const Header: React.FC = () => {
  const { activeSection, setActiveSection, setTimeOfLastClick } =
    useActiveSectionContext();
  return (
    <header className="z-[999] relative lowercase">
      <motion.div
        className="fixed top-0 left-1/2 transform -translate-x-1/2 h-[5rem] w-full sm:top-6 sm:h-[3.25rem] sm:w-[36rem] sm:rounded-full rounded-none border border-white border-opacity-40 bg-white bg-opacity-80 shadow-lg shadow-black/[.03] backdrop-blur-[.5rem] dark:bg-gray-900 dark:border-opacity-40 dark:shadow-black/[.04] dark:bg-opacity-80 dark:backdrop-blur-[.5rem] dark:border-black/40"
        initial={{ y: -100, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
      ></motion.div>
      <nav className="fixed top-[.15rem] left-1/2 transform -translate-x-1/2 h-12 sm:top-[1.7rem] sm:h-auto flex justify-center w-full py-2 sm:py-0">
        <ul className="flex w-full max-w-[22rem] sm:max-w-none sm:w-auto flex-wrap sm:flex-nowrap items-center justify-center gap-y-1 text-[.9rem] font-medium text-gray-500 sm:gap-5">
          {links.map((link) => (
            <motion.li
              className="h-full flex items-center justify-center relative"
              key={link.hash}
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <Link
                className={clsx(
                  "flex w-full items-center justify-center px-3 py-3 hover:text-gray-950 transition dark:text-gray-500 dark:hover:text-gray-300",
                  {
                    "text-gray-950 dark:text-gray-200":
                      activeSection === link.name,
                  }
                )}
                href={link.hash}
                onClick={() => {
                  setActiveSection(link.name);
                  setTimeOfLastClick(Date.now());
                }}
              >
                {link.name}
                {link.name === activeSection && (
                  <motion.span
                    className="bg-gray-100 rounded-full absolute inset-0 -z-10 dark:bg-gray-800"
                    layoutId="activeSection"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  ></motion.span>
                )}
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
