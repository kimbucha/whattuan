"use client";

import { useTheme } from '@/context/Theme-Context';
import React from 'react'
import { BsMoon, BsSun } from 'react-icons/bs'
import { motion } from "framer-motion";


export default function DarkMode() {
  const {theme, toggleTheme} = useTheme();

  return (
    
    <motion.div
    className=""
    initial={{ y: -100, x: "-50%", opacity: 0 }}
    animate={{ y: 0, x: "-50%", opacity: 1 }}
  >
        <button className=" dark:text-white/60 dark:hover:text-white/90 dark:border-white/20 dark:bg-white/10 dark:bg-opacity-80 dark:backdrop-blur-[.5rem] dark:shadow-black/[.04] dark:border-opacity-40  border-opacity-40 shadow-lg shadow-black/[.03] backdrop-blur-[.5rem] sm:rounded-md rounded-md lowercase text-[.9rem] font-medium  hover:text-gray-950 transition dark:text-gray-500 dark:hover:text-gray-300 px-3 py-3 flex items-center justify-center w-full
    " onClick={toggleTheme}>
      {
        theme === 'light' ? <BsSun /> : <BsMoon />
      }
      
    </button>
  </motion.div>

  )
}
