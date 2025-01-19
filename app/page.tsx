"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ImageIcon from "@/components/ImageIcon";
import GitHubIcon from "@/components/GitHubIcon";
import CalculatorIcon from "@/components/CalculatorIcon";

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

  useEffect(() => {
    // Initial setup - position icons at their starting points
    gsap.set([imageIconRef.current, githubIconRef.current, calculatorIconRef.current], {
      opacity: 0,
      scale: 0.8,
      y: 0,
      x: 0,
      xPercent: -50,
      yPercent: -50
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
      onStart: () => {
        setIsImageIconVisible(true);
        setIsGithubIconVisible(true);
        setIsCalculatorIconVisible(true);
      }
    });

    // First fade in all icons
    tl.to([imageIconRef.current, githubIconRef.current, calculatorIconRef.current], {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: "power2.out",
    })
    // Then move them to their positions
    .to(imageIconRef.current, {
      y: 100,
      duration: 0.6,
      ease: "back.out(1.7)",
    }, "-=0.2")
    .to(githubIconRef.current, {
      x: -100,
      y: -100,
      duration: 0.5,
      ease: "back.out(1.7)",
    }, "-=0.4")
    .to(calculatorIconRef.current, {
      x: 100,
      y: -100,
      duration: 0.5,
      ease: "back.out(1.7)",
    }, "-=0.4");
  };

  const hideIcons = () => {
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

    timeoutRef.current = setTimeout(hideIcons, 3000);
  };

  const handleMouseLeave = (e?: React.MouseEvent) => {
    // Don't hide if any modal is open
    if (isChartOpen || isGalleryOpen || isCalculatorOpen) return;

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
          onMouseEnter={(e) => e.stopPropagation()}
          onMouseLeave={handleMouseLeave}
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
          onMouseEnter={(e) => e.stopPropagation()}
          onMouseLeave={handleMouseLeave}
        >
          <GitHubIcon 
            isVisible={isGithubIconVisible} 
            username="kimbucha"
            onChartOpen={() => {
              setIsChartOpen(true);
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
          onMouseEnter={(e) => e.stopPropagation()}
          onMouseLeave={handleMouseLeave}
        >
          <CalculatorIcon 
            isVisible={isCalculatorIconVisible}
            onCalculatorOpen={() => {
              setIsCalculatorOpen(true);
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

