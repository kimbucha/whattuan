"use client";

import React, { useState } from "react";
import Image from "next/image";
import what from "@/public/what.png";
import { motion } from "framer-motion";
import Link from "next/link";
import { BsArrowRight, BsLinkedin } from "react-icons/bs";
import { HiDownload } from "react-icons/hi";
import { FaGithubSquare } from "react-icons/fa";
import { useSectionInView } from "@/lib/hooks";
import { useActiveSectionContext } from "@/context/Active-Section-Context";
import ImagePopup from './ImagePopUp';

const Intro: React.FC = () => {
  const { ref } = useSectionInView("Home", 0.5);
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();

  const [showPopup, setShowPopup] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleImageClick = (url: string) => {
    setImageUrl(url);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setImageUrl('');
  };

  return (
    <section
      ref={ref}
      id="home"
      className="mb-28 max-w-[50rem] text-center sm:mb-0 scroll-mt-[100rem] lowercase"
    >
      <div className="flex items-center justify-center lowercase ">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "tween",
              duration: 0.2,
            }}
          >
            <Image
              src={what}
              alt="tuan nguyen"
              width="2000"
              height="192"
              priority={true}
              className="h-24 w-24 "
            />
          </motion.div>
        </div>
      </div>
      <motion.h1
        className="mb-10 mt-4 px-4 text-2xl font-medium !leading-[1.5] sm:text-4xl"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="">what</span>
      </motion.h1>

      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-2 px-4 text-lg font-medium"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.1,
        }}
      >
        <Link
          href="#contact"
          className="group bg-gray-900 text-gray-200 px-7 py-3 flex items-center gap-2 rounded-md outline-none focus:scale-110 hover:scale-105 active:scale-105 hover:bg-gray-950 hover:text-white transition borderBlack dark:bg-neutral-800 dark:text-white/60 dark:hover:text-white/90 dark:border-white/20 "
          onClick={() => {
            setActiveSection("Contact");
            setTimeOfLastClick(Date.now());
          }}
        >
          Contact
          <BsArrowRight className="opacity-70 group-hover:translate-x-1.5 transition" />
        </Link>

        <div className="">
          <a
            href="#"
            onClick={() => handleImageClick('/RESUME.webp')}
            className="group bg-white px-7 py-3 text-gray-700 flex items-center gap-2 rounded-md outline-none focus:scale-110 hover:scale-105 hover:text-gray-950 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60 dark:hover:text-white/90 dark:border-white/20"
          >
            Resume{" "}
          </a>

          {showPopup && <ImagePopup imageUrl={imageUrl} onClose={handleClosePopup} />}
        </div>

        <a
          className="bg-white p-4 text-gray-700 flex items-center gap-2 rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60 dark:hover:text-white/90 dark:border-white/20"
          href="https://www.linkedin.com/in/kimbo-the-wizard/"
          target="_blank"
        >
          <BsLinkedin />
        </a>

        <a
          className="bg-white p-4 text-gray-700 flex items-center gap-2 text-[1.25rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60 dark:hover:text-white/90 dark:border-white/20"
          href="https://github.com/kimbucha"
          target="_blank"
        >
          <FaGithubSquare />
        </a>
      </motion.div>
    </section>
  );
};

export default Intro;
