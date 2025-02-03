import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface ModuleState {
  id: string;
  isActive: boolean;
  position: { x: number; y: number };
}

const WhatElement: React.FC = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [modules, setModules] = useState<ModuleState[]>([]);

  useEffect(() => {
    // Initialize pulse animation
    if (elementRef.current) {
      gsap.to(elementRef.current, {
        scale: 1.05,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
    }
  }, []);

  const handleClick = () => {
    if (!elementRef.current) return;

    setIsExpanded(!isExpanded);
    
    // Expansion animation
    gsap.to(elementRef.current, {
      scale: isExpanded ? 1 : 2,
      duration: 0.5,
      ease: 'power2.out'
    });

    // Background color inversion
    gsap.to('body', {
      backgroundColor: isExpanded ? 'rgb(26, 26, 26)' : 'rgb(230, 230, 230)',
      color: isExpanded ? 'rgb(255, 255, 255)' : 'rgb(26, 26, 26)',
      duration: 0.5
    });
  };

  return (
    <div className="relative">
      {/* Central Element */}
      <div
        ref={elementRef}
        onClick={handleClick}
        className={`
          cursor-pointer
          select-none
          font-mono
          text-4xl
          font-bold
          transition-colors
          duration-300
          ${isExpanded ? 'text-black' : 'text-white'}
        `}
      >
        what
        <span className="animate-blink">.</span>
      </div>

      {/* Module Count */}
      <div className="absolute -top-2 -right-2 text-sm opacity-50">
        {modules.length}
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </div>
  );
};

export default WhatElement; 