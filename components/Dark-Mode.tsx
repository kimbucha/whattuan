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
        <button className="  sm:rounded-md rounded-md lowercase text-[.9rem] font-medium  px-3 py-3 flex items-center justify-center 
    " onClick={toggleTheme}>
      {
        theme === 'light' ? <BsSun /> : <BsMoon />
      }
      
    </button>
  </motion.div>

  )
}
