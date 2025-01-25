'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import FloatingText from "@/components/FloatingText";
import ImageIcon from "@/components/ImageIcon";
import GitHubIcon from "@/components/GitHubIcon";
import CalculatorIcon from "@/components/CalculatorIcon";
import { PianoIcon } from "@/components/PianoIcon";
import CustomCursor from '@/components/CustomCursor';
import { BubbleProvider, useBubbleContext } from "@/contexts/BubbleContext";
import type { BubbleConfig } from "@/types/bubble";

// Separate component that uses bubble context
function HomeContent() {
  const whatRef = useRef<HTMLDivElement>(null);
  const imageIconRef = useRef<HTMLDivElement>(null);
  const githubIconRef = useRef<HTMLDivElement>(null);
  const calculatorIconRef = useRef<HTMLDivElement>(null);
  const pianoIconRef = useRef<HTMLDivElement>(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPianoOpen, setIsPianoOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragTimeoutRef = useRef<NodeJS.Timeout>();

  // Group bubble configurations
  const bubbleConfigs = useMemo<BubbleConfig[]>(() => [
    {
      id: 'image',
      ref: imageIconRef,
      component: ImageIcon,
      props: {
        onClick: () => setIsModalOpen(true)
      }
    },
    {
      id: 'github',
      ref: githubIconRef,
      component: GitHubIcon,
      props: {
        username: "tuansdf",
        onChartOpen: () => setIsModalOpen(true),
        onChartClose: () => setIsModalOpen(false)
      }
    },
    {
      id: 'calculator',
      ref: calculatorIconRef,
      component: CalculatorIcon,
      props: {
        onCalculatorOpen: () => setIsModalOpen(true),
        onCalculatorClose: () => setIsModalOpen(false)
      }
    },
    {
      id: 'piano',
      ref: pianoIconRef,
      component: PianoIcon,
      props: {
        onPianoOpen: () => setIsPianoOpen(true),
        onPianoClose: () => setIsPianoOpen(false)
      }
    }
  ], []);

  const { updateBubbleState, resetBubbleTimer } = useBubbleContext();

  // Handle what text interactions
  const handleWhatMouseEnter = useCallback(() => {
    // Show all bubbles when hovering "what"
    bubbleConfigs.forEach(config => {
      updateBubbleState(config.id, {
        id: config.id,
        isVisible: true,
        isHovered: false,
        lastInteractionTime: Date.now()
      });
      resetBubbleTimer(config.id);
    });
  }, [bubbleConfigs, updateBubbleState, resetBubbleTimer]);

  const handleWhatMouseLeave = useCallback((e: React.MouseEvent) => {
    if (isModalOpen || isPianoOpen) return;

    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget?.closest('.icon-container') || relatedTarget?.closest('.main-container')) {
      return;
    }
    
    // Start the hide timer for all bubbles instead of hiding immediately
    bubbleConfigs.forEach(config => {
      resetBubbleTimer(config.id);
    });
  }, [bubbleConfigs, isModalOpen, isPianoOpen, resetBubbleTimer]);

  // Handle drag state
  const handleDragStart = useCallback(() => {
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    dragTimeoutRef.current = setTimeout(() => {
      setIsDragging(false);
    }, 50);
  }, []);

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
      <main className="fixed inset-0 flex items-center justify-center overflow-hidden cursor-none">
        <div className="relative w-screen h-screen flex items-center justify-center cursor-none">
          <div className="relative w-full max-w-4xl h-full max-h-screen flex items-center justify-center cursor-none">
            {/* Container for what text and bubbles */}
            <div className="relative w-48 h-48 flex items-center justify-center cursor-none">
              <FloatingText
                ref={whatRef}
                text="what"
                className="font-times text-white text-4xl cursor-none select-none"
                onMouseEnter={handleWhatMouseEnter}
                onMouseLeave={handleWhatMouseLeave}
              />

              {/* Bubble container */}
              <div className="absolute inset-0 pointer-events-none cursor-none">
                {bubbleConfigs.map((config, index) => {
                  const Component = config.component;
                  const angle = (index * (2 * Math.PI / bubbleConfigs.length)) - (Math.PI / 2);
                  const radius = 100; // Distance from center
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;

                  const componentProps = {
                    ...config.props,
                    id: config.id,
                    index,
                    onDragStart: handleDragStart,
                    onDragEnd: handleDragEnd
                  };

                  return (
                    <div 
                      key={config.id}
                      ref={config.ref}
                      className="absolute will-change-transform icon-container cursor-none"
                      style={{ 
                        pointerEvents: 'auto',
                        width: '32px',
                        height: '32px',
                        touchAction: 'none',
                        userSelect: 'none',
                        transform: `translate(${x}px, ${y}px)`,
                        left: '50%',
                        top: '50%',
                        marginLeft: '-16px',
                        marginTop: '-16px'
                      }}
                    >
                      <Component {...componentProps} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

// Main component that provides the context
export default function HomeClient() {
  return (
    <BubbleProvider>
      <HomeContent />
    </BubbleProvider>
  );
} 