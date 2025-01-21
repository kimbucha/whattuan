"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import FloatingText from "@/components/FloatingText";
import ImageIcon, { ImageIconProps } from "@/components/ImageIcon";
import GitHubIcon, { GitHubIconProps } from "@/components/GitHubIcon";
import CalculatorIcon, { CalculatorIconProps } from "@/components/CalculatorIcon";
import CustomCursor from '@/components/CustomCursor';
import RevolvingDot from '@/components/RevolvingDot';

type BubbleComponent = React.ComponentType<ImageIconProps | GitHubIconProps | CalculatorIconProps>;

interface BubbleConfig {
  ref: React.RefObject<HTMLDivElement>;
  component: BubbleComponent;
  props: Partial<ImageIconProps | GitHubIconProps | CalculatorIconProps>;
}

export default function Home() {
  const whatRef = useRef<HTMLDivElement>(null);
  const imageIconRef = useRef<HTMLDivElement>(null);
  const githubIconRef = useRef<HTMLDivElement>(null);
  const calculatorIconRef = useRef<HTMLDivElement>(null);
  
  // Single source of truth for bubble state
  const [isActive, setIsActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);

  // Add state for drag interaction
  const [isDragging, setIsDragging] = useState(false);
  const dragTimeoutRef = useRef<NodeJS.Timeout>();

  // Group bubble configurations
  const bubbleConfigs = useMemo<BubbleConfig[]>(() => [
    {
      ref: imageIconRef,
      component: ImageIcon,
      props: {
        onClick: () => setIsModalOpen(true)
      }
    },
    {
      ref: githubIconRef,
      component: GitHubIcon,
      props: {
        username: "tuansdf",
        onChartOpen: () => setIsModalOpen(true),
        onChartClose: () => setIsModalOpen(false)
      }
    },
    {
      ref: calculatorIconRef,
      component: CalculatorIcon,
      props: {
        onCalculatorOpen: () => setIsModalOpen(true),
        onCalculatorClose: () => setIsModalOpen(false)
      }
    }
  ], []);

  // Handle window focus/blur
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsActive(false);
        setActiveIndex(null);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Handle what text interactions
  const handleWhatMouseEnter = () => {
    if (!hasAnimatedIn) {
      setIsActive(true);
      setHasAnimatedIn(true);
    }
    setActiveIndex(null);
  };

  const handleWhatMouseLeave = (e: React.MouseEvent) => {
    if (isModalOpen) return;

    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget?.closest('.icon-container') || relatedTarget?.closest('.main-container')) {
      return;
    }
    
    setIsActive(false);
    setActiveIndex(null);
    setHasAnimatedIn(false);
  };

  // Handle bubble interactions
  const handleBubbleMouseEnter = (index: number) => {
    if (!hasAnimatedIn) {
      setIsActive(true);
      setHasAnimatedIn(true);
    }
    setActiveIndex(index);
  };

  const handleBubbleMouseLeave = (e: React.MouseEvent) => {
    if (isModalOpen) return;

    const relatedTarget = e.relatedTarget as HTMLElement;
    
    if (relatedTarget === whatRef.current || 
        relatedTarget?.closest('.icon-container') ||
        relatedTarget?.closest('.main-container')) {
      return;
    }

    setActiveIndex(null);
    setIsActive(false);
    setHasAnimatedIn(false);
  };

  // Handle drag state
  const handleDragStart = () => {
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    // Small delay to prevent immediate state changes
    dragTimeoutRef.current = setTimeout(() => {
      setIsDragging(false);
    }, 50);
  };

  // Clean up
  useEffect(() => {
    return () => {
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <CustomCursor isDragging={isDragging} />
      <main className="flex min-h-screen items-center justify-center main-container">
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <FloatingText
                ref={whatRef}
                text="what"
                className="font-times text-white text-4xl cursor-none select-none"
                onMouseEnter={handleWhatMouseEnter}
                onMouseLeave={handleWhatMouseLeave}
              />

              {bubbleConfigs.map((config, index) => {
                const Component = config.component;
                const componentProps = {
                  ...config.props,
                  isVisible: isActive,
                  index,
                  total: bubbleConfigs.length,
                  centerRef: whatRef,
                  onDragStart: handleDragStart,
                  onDragEnd: handleDragEnd
                };

                return (
                  <div 
                    key={index}
                    ref={config.ref}
                    className={`absolute will-change-transform icon-container ${isDragging ? 'cursor-none' : 'cursor-grab'}`}
                    style={{ 
                      pointerEvents: isActive ? 'auto' : 'none',
                      visibility: isActive ? 'visible' : 'hidden',
                      position: 'fixed',
                      left: 0,
                      top: 0,
                      touchAction: 'none',
                      userSelect: 'none'
                    }}
                    onMouseEnter={() => handleBubbleMouseEnter(index)}
                    onMouseLeave={handleBubbleMouseLeave}
                  >
                    <Component {...componentProps} />
                    <RevolvingDot 
                      isActive={activeIndex === index}
                      isDragging={isDragging}
                      radius={24}
                      duration={2}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

