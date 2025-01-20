"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ImageIcon from "@/components/ImageIcon";
import GitHubIcon from "@/components/GitHubIcon";
import CalculatorIcon from "@/components/CalculatorIcon";

const HIDE_DELAY = 4.2; // seconds

export default function Home() {
  const whatRef = useRef<HTMLHeadingElement>(null);
  const imageIconRef = useRef<HTMLDivElement>(null);
  const githubIconRef = useRef<HTMLDivElement>(null);
  const calculatorIconRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const [isImageIconVisible, setIsImageIconVisible] = useState(false);
  const [isGithubIconVisible, setIsGithubIconVisible] = useState(false);
  const [isCalculatorIconVisible, setIsCalculatorIconVisible] = useState(false);
  
  const [isChartOpen, setIsChartOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  // Track hover states
  const [isImageIconHovered, setIsImageIconHovered] = useState(false);
  const [isGithubIconHovered, setIsGithubIconHovered] = useState(false);
  const [isCalculatorIconHovered, setIsCalculatorIconHovered] = useState(false);

  useEffect(() => {
    // Initial setup - position icons at their starting points
    gsap.set([imageIconRef.current, githubIconRef.current, calculatorIconRef.current], {
      opacity: 0,
      scale: 0.8,
      xPercent: -50,
      yPercent: -50
    });

    // Set initial positions
    gsap.set(imageIconRef.current, { x: 0, y: 100 });
    gsap.set(githubIconRef.current, { x: -100, y: -100 });
    gsap.set(calculatorIconRef.current, { x: 100, y: -100 });

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
      onStart: () => {
        setIsImageIconVisible(true);
        setIsGithubIconVisible(true);
        setIsCalculatorIconVisible(true);
      }
    });

    // Fade in all icons
    tl.to([imageIconRef.current, githubIconRef.current, calculatorIconRef.current], {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const hideIcons = () => {
    // Don't hide if any modal is open
    if (isChartOpen || isGalleryOpen || isCalculatorOpen) {
      setIsImageIconVisible(isGalleryOpen);
      setIsGithubIconVisible(isChartOpen);
      setIsCalculatorIconVisible(isCalculatorOpen);
      return;
    }

    // Don't hide if any icon is being hovered
    if (isImageIconHovered || isGithubIconHovered || isCalculatorIconHovered) {
      return;
    }

    // Create a timeline for synchronized hiding
    const tl = gsap.timeline({
      onComplete: () => {
        setIsImageIconVisible(false);
        setIsGithubIconVisible(false);
        setIsCalculatorIconVisible(false);
      }
    });

    // First move icons back to starting positions
    tl.to([imageIconRef.current, githubIconRef.current, calculatorIconRef.current], {
      x: 0,
      y: 0,
      duration: 0.4,
      ease: "power2.inOut",
    }, 0)
    // Then fade them out
    .to([imageIconRef.current, githubIconRef.current, calculatorIconRef.current], {
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: "power2.inOut",
    }, "-=0.2");
  };

  const startHideTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(hideIcons, HIDE_DELAY * 1000);
  };

  const handleIconHover = (
    isHovered: boolean, 
    setHoverState: (state: boolean) => void
  ) => {
    setHoverState(isHovered);
    if (isHovered) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    } else {
      startHideTimeout();
    }
  };

  const handleMouseLeave = (e?: React.MouseEvent) => {
    // Check if we're moving to the icons or their containers
    if (e?.relatedTarget instanceof HTMLElement) {
      const target = e.relatedTarget;
      if (target.closest('[role="dialog"]') || 
          target.closest('[role="button"]') ||
          target === imageIconRef.current?.parentElement ||
          target === githubIconRef.current?.parentElement ||
          target === calculatorIconRef.current?.parentElement ||
          target.closest('.icon-container')) {
        return;
      }
    }

    startHideTimeout();
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="relative">
        <h1 
          ref={whatRef}
          className="font-times text-white text-4xl cursor-pointer relative z-10"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          what
        </h1>

        <div 
          ref={imageIconRef}
          className="absolute left-1/2 top-1/2 transform-gpu will-change-transform icon-container"
          style={{ 
            pointerEvents: isImageIconVisible ? 'auto' : 'none',
          }}
          onMouseEnter={() => handleIconHover(true, setIsImageIconHovered)}
          onMouseLeave={() => handleIconHover(false, setIsImageIconHovered)}
        >
          <ImageIcon 
            isVisible={isImageIconVisible} 
            onClick={() => setIsGalleryOpen(true)}
          />
        </div>

        <div 
          ref={githubIconRef}
          className="absolute left-1/2 top-1/2 transform-gpu will-change-transform icon-container"
          style={{ 
            pointerEvents: isGithubIconVisible ? 'auto' : 'none',
          }}
          onMouseEnter={() => handleIconHover(true, setIsGithubIconHovered)}
          onMouseLeave={() => handleIconHover(false, setIsGithubIconHovered)}
        >
          <GitHubIcon 
            isVisible={isGithubIconVisible} 
            username="kimbucha"
            onChartOpen={() => {
              setIsChartOpen(true);
              setIsImageIconVisible(false);
              setIsCalculatorIconVisible(false);
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }
            }}
            onChartClose={() => {
              setIsChartOpen(false);
              startHideTimeout();
            }}
          />
        </div>

        <div 
          ref={calculatorIconRef}
          className="absolute left-1/2 top-1/2 transform-gpu will-change-transform icon-container"
          style={{ 
            pointerEvents: isCalculatorIconVisible ? 'auto' : 'none',
          }}
          onMouseEnter={() => handleIconHover(true, setIsCalculatorIconHovered)}
          onMouseLeave={() => handleIconHover(false, setIsCalculatorIconHovered)}
        >
          <CalculatorIcon 
            isVisible={isCalculatorIconVisible}
            onCalculatorOpen={() => {
              setIsCalculatorOpen(true);
              setIsImageIconVisible(false);
              setIsGithubIconVisible(false);
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }
            }}
            onCalculatorClose={() => {
              setIsCalculatorOpen(false);
              startHideTimeout();
            }}
          />
        </div>
      </div>
    </main>
  );
}

