"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import Image from "next/image";

const MagneticBubble: React.FC<{ isHovered: boolean }> = ({ isHovered }) => {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    if (isHovered) {
      controls.start({
        scale: 1,
        opacity: 1,
        transition: { duration: 0.5 },
      });
    } else {
      controls.start({
        scale: 0,
        opacity: 0,
        transition: { duration: 0.5 },
      });
    }
  }, [isHovered, controls]);

  useEffect(() => {
    const bubble = bubbleRef.current;
    if (!bubble) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = bubble.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      controls.start({ x, y });
    };

    bubble.addEventListener("mousemove", handleMouseMove);
    return () => {
      bubble.removeEventListener("mousemove", handleMouseMove);
    };
  }, [controls]);

  return (
    <motion.div
      ref={bubbleRef}
      initial={{ scale: 0, opacity: 0 }}
      animate={controls}
      className="absolute top-0 left-full ml-4 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg"
    >
      <Image src="/github.svg" alt="GitHub" width={32} height={32} />
    </motion.div>
  );
};

export default MagneticBubble;