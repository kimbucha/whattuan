import React, { createContext, useContext, useCallback, useState, useRef, useEffect } from 'react';
import { BubbleState, BubbleContextType } from '@/types/bubble';

const BUBBLE_TIMEOUT_MS = 4200; // 4.2 seconds

const BubbleContext = createContext<BubbleContextType | null>(null);

export const useBubbleContext = () => {
  const context = useContext(BubbleContext);
  if (!context) {
    throw new Error('useBubbleContext must be used within a BubbleProvider');
  }
  return context;
};

export const BubbleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bubbleStates, setBubbleStates] = useState<Record<string, BubbleState>>({});
  const timeoutRefs = useRef<Record<string, NodeJS.Timeout>>({});
  const lastInteractionTimeRef = useRef<Record<string, number>>({});

  const updateBubbleState = useCallback((id: string, updates: Partial<BubbleState>) => {
    setBubbleStates(prev => {
      const currentState = prev[id] || { 
        id, 
        isVisible: false, 
        isHovered: false, 
        lastInteractionTime: Date.now() 
      };

      // Clear existing timeout when making any state change
      if (timeoutRefs.current[id]) {
        clearTimeout(timeoutRefs.current[id]);
        delete timeoutRefs.current[id];
      }

      // Update last interaction time
      if ('lastInteractionTime' in updates) {
        lastInteractionTimeRef.current[id] = updates.lastInteractionTime!;
      }

      // If we're explicitly setting visibility to false, do it immediately
      if ('isVisible' in updates && !updates.isVisible) {
        return {
          ...prev,
          [id]: {
            ...currentState,
            ...updates,
            lastInteractionTime: updates.lastInteractionTime || Date.now()
          }
        };
      }

      // For all other state changes, update normally
      return {
        ...prev,
        [id]: {
          ...currentState,
          ...updates,
          lastInteractionTime: updates.lastInteractionTime || currentState.lastInteractionTime
        }
      };
    });
  }, []);

  const resetBubbleTimer = useCallback((id: string) => {
    // Clear existing timeout
    if (timeoutRefs.current[id]) {
      clearTimeout(timeoutRefs.current[id]);
      delete timeoutRefs.current[id];
    }

    // Set new timeout only if the bubble is visible and not hovered
    setBubbleStates(current => {
      const bubble = current[id];
      if (!bubble || !bubble.isVisible || bubble.isHovered) return current;

      timeoutRefs.current[id] = setTimeout(() => {
        setBubbleStates(latest => {
          const latestBubble = latest[id];
          // Only hide if not hovered and enough time has passed since last interaction
          if (latestBubble && !latestBubble.isHovered) {
            const timeSinceLastInteraction = Date.now() - (lastInteractionTimeRef.current[id] || 0);
            if (timeSinceLastInteraction >= BUBBLE_TIMEOUT_MS) {
              return {
                ...latest,
                [id]: { ...latestBubble, isVisible: false }
              };
            }
          }
          return latest;
        });
      }, BUBBLE_TIMEOUT_MS);

      return current;
    });
  }, []);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach(timeout => clearTimeout(timeout));
      timeoutRefs.current = {};
    };
  }, []);

  const value = {
    bubbleStates,
    updateBubbleState,
    resetBubbleTimer,
    BUBBLE_TIMEOUT_MS
  };

  return (
    <BubbleContext.Provider value={value}>
      {children}
    </BubbleContext.Provider>
  );
}; 