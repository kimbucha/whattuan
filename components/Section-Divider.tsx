"use client"

import { motion } from 'framer-motion';
import React from 'react';

const SectionDivider: React.FC = () => {
  return (
    <motion.div className='bg-gray-200 my-24 h-16 w-1 rounded-full hidden sm:block dark:bg-opacity-30'
    initial={{opacity:0, y:100}}
    animate={{opacity:1, y:0}}
    transition={{delay: .125}}
    >
      {/* Your component content goes here */}
    </motion.div>
  );
};

export default SectionDivider;