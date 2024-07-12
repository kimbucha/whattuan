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
        <button className=" w-[3rem] h-[3rem] bg-opacity-80  flex items-center justify-center  hover:scale-110 active:scale-105  
    transform translate-x-28
    " onClick={toggleTheme}>
      {
        theme === 'light' ? <BsSun /> : <BsMoon />
      }
      
    </button>
  </motion.div>

  )
}
