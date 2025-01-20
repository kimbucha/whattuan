import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { createBreathingAnimation } from "@/utils/animationUtils";
import { Draggable } from "gsap/Draggable";
import { Physics2D } from "gsap/Physics2D";

// Register plugins
gsap.registerPlugin(Draggable, Physics2D);

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
  const [displayValue, setDisplayValue] = useState("0");
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const calculatorContainerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.Context>();

  // Cleanup GSAP animations on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.revert();
      }
    };
  }, []);

  // Reset calculator state when visibility changes
  useEffect(() => {
    if (!isVisible) {
      setShowCalculator(false);
    }
  }, [isVisible]);

  // Setup breathing animation
  useEffect(() => {
    if (isVisible && containerRef.current && iconRef.current && circleRef.current && pathRef.current) {
      animationRef.current = createBreathingAnimation({
        container: containerRef.current,
        icon: iconRef.current,
        elements: [circleRef.current, pathRef.current],
        isVisible
      });
    }
    return () => {
      if (animationRef.current) {
        animationRef.current.revert();
      }
    };
  }, [isVisible]);

  // Setup draggable and physics
  useEffect(() => {
    if (containerRef.current) {
      // Create draggable instance
      Draggable.create(containerRef.current, {
        type: "x,y",
        inertia: true,
        bounds: window,
        onDragStart: function() {
          gsap.to(this.target, {
            scale: 1.1,
            duration: 0.2
          });
        },
        onDragEnd: function() {
          gsap.to(this.target, {
            scale: 1,
            duration: 0.2
          });
          
          // Add floating animation
          gsap.to(this.target, {
            y: "+=20",
            duration: 2,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1
          });
        }
      });

      // Add initial floating animation
      gsap.to(containerRef.current, {
        y: "+=20",
        duration: 2,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1
      });
    }

    return () => {
      // Cleanup draggable instance
      Draggable.get(containerRef.current)?.kill();
    };
  }, []);

  const closeCalculator = useCallback(() => {
    if (calculatorContainerRef.current) {
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
    } else {
      setShowCalculator(false);
      onCalculatorClose?.();
    }
  }, [onCalculatorClose]);

  // Handle icon click
  const handleClick = useCallback(() => {
    if (!showCalculator && iconRef.current && calculatorContainerRef.current) {
      // Click animation
      const timeline = gsap.timeline();
      timeline.to(iconRef.current, {
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
  }, [showCalculator, onCalculatorOpen, closeCalculator]);

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleClick();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeCalculator();
  };

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    } else if (e.key === 'Escape' && showCalculator) {
      closeCalculator();
    }
  }, [handleClick, showCalculator, closeCalculator]);

  const handleNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplayValue(num);
      setWaitingForOperand(false);
    } else {
      setDisplayValue(displayValue === "0" ? num : displayValue + num);
    }
  };

  const handleOperator = (op: string) => {
    const value = parseFloat(displayValue);
    
    if (previousValue === null) {
      setPreviousValue(displayValue);
    } else if (operator) {
      const prev = parseFloat(previousValue);
      let result: number;
      
      switch (operator) {
        case "+":
          result = prev + value;
          break;
        case "-":
          result = prev - value;
          break;
        case "×":
          result = prev * value;
          break;
        case "÷":
          result = prev / value;
          break;
        default:
          return;
      }
      
      setPreviousValue(String(result));
      setDisplayValue(String(result));
    }
    
    setWaitingForOperand(true);
    setOperator(op);
  };

  const handleEqual = () => {
    if (!operator || previousValue === null) return;
    
    const value = parseFloat(displayValue);
    const prev = parseFloat(previousValue);
    let result: number;
    
    switch (operator) {
      case "+":
        result = prev + value;
        break;
      case "-":
        result = prev - value;
        break;
      case "×":
        result = prev * value;
        break;
      case "÷":
        result = prev / value;
        break;
      default:
        return;
    }
    
    setDisplayValue(String(result));
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  const handleClear = () => {
    setDisplayValue("0");
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const buttonClass = "h-14 rounded bg-[#21262d] hover:bg-[#30363d] text-white font-medium text-lg transition-colors";
  const operatorClass = "h-14 rounded bg-[#1f6feb] hover:bg-[#388bfd] text-white font-medium text-lg transition-colors";

  return (
    <div 
      ref={containerRef}
      className="absolute w-8 h-8 flex items-center justify-center cursor-move"
      style={{
        touchAction: "none", // Prevent touch scrolling while dragging
      }}
      onClick={handleIconClick}
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
            onClick={handleBackdropClick}
            aria-hidden="true"
          />
          <div 
            ref={calculatorContainerRef}
            className="absolute -top-[150px] -right-[200px] z-50"
            role="dialog"
            aria-modal="true"
            aria-label="Calculator"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="bg-[#161b22] rounded-lg shadow-xl p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-[300px] flex flex-col gap-2">
                <div className="bg-[#0d1117] p-4 rounded-lg mb-2">
                  <input 
                    type="text" 
                    className="w-full bg-transparent text-right text-3xl text-white font-medium outline-none"
                    readOnly
                    value={displayValue}
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <button onClick={handleClear} className={`${buttonClass} col-span-2`}>C</button>
                  <button onClick={() => handleOperator('÷')} className={operatorClass}>÷</button>
                  <button onClick={() => handleOperator('×')} className={operatorClass}>×</button>
                  
                  <button onClick={() => handleNumber('7')} className={buttonClass}>7</button>
                  <button onClick={() => handleNumber('8')} className={buttonClass}>8</button>
                  <button onClick={() => handleNumber('9')} className={buttonClass}>9</button>
                  <button onClick={() => handleOperator('-')} className={operatorClass}>−</button>
                  
                  <button onClick={() => handleNumber('4')} className={buttonClass}>4</button>
                  <button onClick={() => handleNumber('5')} className={buttonClass}>5</button>
                  <button onClick={() => handleNumber('6')} className={buttonClass}>6</button>
                  <button onClick={() => handleOperator('+')} className={operatorClass}>+</button>
                  
                  <button onClick={() => handleNumber('1')} className={buttonClass}>1</button>
                  <button onClick={() => handleNumber('2')} className={buttonClass}>2</button>
                  <button onClick={() => handleNumber('3')} className={buttonClass}>3</button>
                  <button onClick={handleEqual} className={`${operatorClass} row-span-2`}>=</button>
                  
                  <button onClick={() => handleNumber('0')} className={`${buttonClass} col-span-2`}>0</button>
                  <button onClick={() => handleNumber('.')} className={buttonClass}>.</button>
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