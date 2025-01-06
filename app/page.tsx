"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ImageIcon from "@/components/ImageIcon";
import "@/lib/gsap";

export default function Home() {
  const iconContainerRef = useRef(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const [isIconVisible, setIsIconVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(iconContainerRef.current, {
        y: 0,
        opacity: 0,
        scale: 0.8,
      });
    });

    return () => {
      ctx.revert();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const slideOut = () => {
    gsap.to(iconContainerRef.current, {
      y: 100,
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "elastic.out(1, 0.5)",
      onComplete: () => setIsIconVisible(true),
    });
  };

  const slideIn = () => {
    setIsIconVisible(false);
    gsap.to(iconContainerRef.current, {
      y: 0,
      opacity: 0,
      scale: 0.8,
      duration: 0.5,
      ease: "power2.inOut",
    });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (!isIconVisible) {
      slideOut();
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      slideIn();
    }, 3000); // 3 seconds delay
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="relative">
        <h1 
          className="font-times text-white text-4xl cursor-pointer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          what
        </h1>
        <div 
          ref={iconContainerRef}
          className="absolute left-1/2 -translate-x-1/2 mt-4"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <ImageIcon isVisible={isIconVisible} />
        </div>
      </div>
    </main>
  );
}
