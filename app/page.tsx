"use client";

import { useEffect, useRef } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import gsap from "gsap";

export default function Home() {
  const iconRef = useRef(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial state - hidden and at the position of "what"
      gsap.set(iconRef.current, {
        y: 0,
        opacity: 0,
        scale: 0.8,
      });
    });

    return () => ctx.revert();
  }, []);

  const handleHover = () => {
    gsap.to(iconRef.current, {
      y: 100, // Distance to slide down
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "elastic.out(1, 0.5)", // Bouncy effect
      yoyo: true,
    });
  };

  const handleHoverExit = () => {
    gsap.to(iconRef.current, {
      y: 0,
      opacity: 0,
      scale: 0.8,
      duration: 0.5,
      ease: "power2.inOut",
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="relative">
        <h1 
          className="font-times text-white text-4xl cursor-pointer"
          onMouseEnter={handleHover}
          onMouseLeave={handleHoverExit}
        >
          what
        </h1>
        <div 
          ref={iconRef}
          className="absolute left-1/2 -translate-x-1/2 mt-4 pointer-events-none"
        >
          <PhotoIcon className="h-8 w-8 text-white" />
        </div>
      </div>
    </main>
  );
}
