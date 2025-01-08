"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ImageIcon from "@/components/ImageIcon";
import GitHubIcon from "@/components/GitHubIcon";

export default function Home() {
  const imageIconRef = useRef<HTMLDivElement>(null);
  const githubIconRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const [isImageIconVisible, setIsImageIconVisible] = useState(false);
  const [isGithubIconVisible, setIsGithubIconVisible] = useState(false);
  const [isChartOpen, setIsChartOpen] = useState(false);

  useEffect(() => {
    // Initial setup - position icons at their starting points
    gsap.set([imageIconRef.current, githubIconRef.current], {
      opacity: 0,
      scale: 0.8,
      y: 0,
      x: 0
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Create a timeline for synchronized animations
    const tl = gsap.timeline({
      onComplete: () => {
        setIsImageIconVisible(true);
        setIsGithubIconVisible(true);
      }
    });

    // Add both animations to the timeline
    tl.to([imageIconRef.current, githubIconRef.current], {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: "back.out(1.7)",
    }, 0) // Start at the same time
    .to(imageIconRef.current, {
      y: 100,
      duration: 0.5,
      ease: "back.out(1.7)",
    }, 0) // Start at the same time
    .to(githubIconRef.current, {
      x: -100,
      y: -100,
      duration: 0.5,
      ease: "back.out(1.7)",
    }, 0); // Start at the same time
  };

  const handleMouseLeave = () => {
    // Don't hide if chart is open
    if (isChartOpen) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsImageIconVisible(false);
      setIsGithubIconVisible(false);

      // Create a timeline for synchronized hiding
      const tl = gsap.timeline();

      // Add both hide animations to the timeline
      tl.to([imageIconRef.current, githubIconRef.current], {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: "power2.inOut",
      }, 0) // Start at the same time
      .to(imageIconRef.current, {
        y: 0,
        duration: 0.3,
        ease: "power2.inOut",
      }, 0) // Start at the same time
      .to(githubIconRef.current, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.inOut",
      }, 0); // Start at the same time
    }, 3000);
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="relative">
        {/* The word "what" */}
        <h1 
          className="font-times text-white text-4xl cursor-pointer relative z-10"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          what
        </h1>

        {/* Image icon container - South */}
        <div 
          ref={imageIconRef}
          className="absolute left-1/2 top-0 -translate-x-1/2"
          style={{ pointerEvents: isImageIconVisible ? 'auto' : 'none' }}
        >
          <ImageIcon isVisible={isImageIconVisible} />
        </div>

        {/* GitHub icon container - Northwest */}
        <div 
          ref={githubIconRef}
          className="absolute left-1/2 top-0 -translate-x-1/2"
          style={{ pointerEvents: isGithubIconVisible ? 'auto' : 'none' }}
        >
          <GitHubIcon 
            isVisible={isGithubIconVisible} 
            onChartOpen={() => setIsChartOpen(true)}
            onChartClose={() => setIsChartOpen(false)}
          />
        </div>
      </div>
    </main>
  );
}

