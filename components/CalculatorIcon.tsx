import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { createBreathingAnimation } from "@/utils/animationUtils";

interface CalculatorIconProps {
  isVisible: boolean;
  onCalculatorOpen?: () => void;
  onCalculatorClose?: () => void;
}

const CalculatorIcon: React.FC<CalculatorIconProps> = ({ 
  isVisible, 
  onCalculatorOpen, 
  onCalculatorClose 
}) => {
  const [showCalculator, setShowCalculator] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const calculatorContainerRef = useRef<HTMLDivElement>(null);

  // Reset calculator state when visibility changes
  useEffect(() => {
    if (!isVisible) {
      setShowCalculator(false);
    }
  }, [isVisible]);

  // Setup breathing animation
  useEffect(() => {
    if (isVisible && containerRef.current && iconRef.current && circleRef.current && pathRef.current) {
      createBreathingAnimation({
        container: containerRef.current,
        icon: iconRef.current,
        elements: [circleRef.current, pathRef.current],
        isVisible
      });
    }
  }, [isVisible]);

  // Handle icon click
  const handleClick = useCallback((e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e?.stopPropagation) {
      e.stopPropagation();
    }

    if (!showCalculator) {
      // Click animation
      gsap.timeline()
        .to(iconRef.current, {
          scale: 0.92,
          duration: 0.15,
          ease: "power2.out"
        })
        .to(iconRef.current, {
          scale: 1,
          duration: 0.15,
          ease: "power2.in"
        });

      // Show calculator
      gsap.fromTo(calculatorContainerRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
          onStart: () => {
            setShowCalculator(true);
            onCalculatorOpen?.();
          }
        }
      );
    } else {
      closeCalculator();
    }
  }, [showCalculator, onCalculatorOpen]);

  const closeCalculator = useCallback(() => {
    gsap.to(calculatorContainerRef.current, {
      opacity: 0,
      scale: 0.95,
      y: 20,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        setShowCalculator(false);
        onCalculatorClose?.();
      }
    });
  }, [onCalculatorClose]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    } else if (e.key === 'Escape' && showCalculator) {
      closeCalculator();
    }
  }, [handleClick, showCalculator, closeCalculator]);

  return (
    <div 
      ref={containerRef}
      className="relative w-8 h-8 flex items-center justify-center cursor-pointer"
      onClick={handleClick}
      onKeyDown={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label="Calculator"
    >
      <svg
        ref={iconRef}
        width="30"
        height="30"
        viewBox="-2 -2 102 100"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
      >
        <circle
          ref={circleRef}
          cx="49"
          cy="48"
          r="46"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          ref={pathRef}
          fillRule="evenodd"
          clipRule="evenodd"
          d="M30 20h40c5.523 0 10 4.477 10 10v40c0 5.523-4.477 10-10 10H30c-5.523 0-10-4.477-10-10V30c0-5.523 4.477-10 10-10zm2 15h36v10H32V35zm0 20h8v8h-8v-8zm14 0h8v8h-8v-8zm14 0h8v20h-8V55zm-28 12h8v8h-8v-8zm14 0h8v8h-8v-8z"
          fill="currentColor"
        />
      </svg>

      {showCalculator && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={(e) => {
              e.stopPropagation();
              closeCalculator();
            }}
            aria-hidden="true"
          />
          <div 
            ref={calculatorContainerRef}
            className="absolute -top-[150px] -right-[200px] z-50"
            role="dialog"
            aria-modal="true"
            aria-label="Calculator"
          >
            <div 
              className="bg-[#161b22] rounded-lg shadow-xl p-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Calculator UI will go here */}
              <div className="w-[300px] h-[400px] flex flex-col">
                <div className="bg-[#0d1117] p-4 rounded-t-lg">
                  <input 
                    type="text" 
                    className="w-full bg-transparent text-right text-2xl text-white outline-none"
                    readOnly
                    value="0"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2 p-4">
                  {/* Calculator buttons will go here */}
                  <div className="col-span-4 text-[#7d8590] text-sm text-center">
                    Calculator coming soon...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CalculatorIcon; 