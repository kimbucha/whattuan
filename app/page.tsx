"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ImageIcon from "@/components/ImageIcon";

export default function Home() {
  const iconContainerRef = useRef(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
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
    });
  };

  const slideIn = () => {
    gsap.to(iconContainerRef.current, {
      y: 0,
      opacity: 0,
      scale: 0.8,
      duration: 0.5,
      ease: "power2.inOut",
    });
  };

  const handleHover = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    slideOut();
    
    timeoutRef.current = setTimeout(() => {
      slideIn();
    }, 4200);
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="relative">
        <h1 
          className="font-times text-white text-4xl cursor-pointer"
          onMouseEnter={handleHover}
        >
          what
        </h1>
        <div 
          ref={iconContainerRef}
          className="absolute left-1/2 -translate-x-1/2 mt-4 pointer-events-none"
        >
          <ImageIcon />
        </div>
      </div>
    </main>
  );
}
