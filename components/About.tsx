"use client";

import React from 'react';
import SectionHeading from './Section-Heading';
import { motion} from 'framer-motion';

import { useSectionInView } from '@/lib/hooks';

const About: React.FC = () => {
  const {ref} = useSectionInView('About', .5);


  return (
    <motion.section 
    ref={ref}
    className='mb-28 max-w-[45rem] text-center leading-8 sm:mb-40 scroll-mt-28'
    initial={{opacity:0, y:100}}
    animate={{opacity:1, y:0}}
    transition={{delay: .175}}
    id='about'
    >
      <SectionHeading>about</SectionHeading>
      <p className='mb-3 lowercase'>
      hey there , I'm tuan, a fullstack developer. I'm currently a student at the San Francisco State University, studying Computer Science. hit me up if you wanna work on something cool
      </p>
      <p>
   
      </p>
    </motion.section>
  );
};

export default About;