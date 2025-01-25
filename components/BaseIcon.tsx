import { useRef, useEffect } from "react";
import { BaseIconProps } from "@/types/icons";
import { createFloatingAnimation } from "@/utils/animations";
import { useBubbleContext } from "@/contexts/BubbleContext";
import gsap from "gsap";

export const BaseIcon: React.FC<BaseIconProps> = ({ 
  id,
  index,
  children,
  isVisible = false,
  onClick,
  onMouseEnter: externalMouseEnter,
  onMouseLeave: externalMouseLeave,
  onDragStart,
  onDragEnd,
  ...props 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const { bubbleStates, updateBubbleState, resetBubbleTimer } = useBubbleContext();
  const bubbleState = bubbleStates[id] || { isVisible: false, isHovered: false };

  useEffect(() => {
    if (!containerRef.current) return;

    // Create floating animation with numeric index
    animationRef.current = createFloatingAnimation(containerRef.current, index);

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [index]);

  // Initialize bubble state when isVisible prop changes
  useEffect(() => {
    if (isVisible && !bubbleState.isVisible) {
      updateBubbleState(id, { 
        isVisible: true,
        isHovered: false,
        lastInteractionTime: Date.now()
      });
      resetBubbleTimer(id);
    }
  }, [id, isVisible, bubbleState.isVisible, updateBubbleState, resetBubbleTimer]);

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (!bubbleState.isVisible) return;
    
    updateBubbleState(id, { 
      isHovered: true,
      isVisible: true,
      lastInteractionTime: Date.now()
    });
    externalMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (!bubbleState.isVisible) return;
    
    updateBubbleState(id, { 
      isHovered: false,
      lastInteractionTime: Date.now()
    });
    resetBubbleTimer(id);
    externalMouseLeave?.(e);
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{
        opacity: bubbleState.isVisible ? 1 : 0,
        border: "1px solid rgba(255, 255, 255, 0.8)",
        borderRadius: "50%",
        width: "64px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        willChange: "transform",
        cursor: "pointer",
        background: "rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(2px)",
        transform: `scale(${bubbleState.isVisible ? 1 : 0.8})`,
        pointerEvents: bubbleState.isVisible ? "auto" : "none"
      }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      {...props}
    >
      {children}
    </div>
  );
}; 