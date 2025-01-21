import { useRef, useEffect } from 'react';

interface UseAnimationInitProps {
  onInit: () => void;
  dependencies: any[];
}

export const useAnimationInit = ({ onInit, dependencies }: UseAnimationInitProps) => {
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isInitializedRef.current) return;

    // Wait for next frame to ensure DOM is ready
    requestAnimationFrame(() => {
      onInit();
      isInitializedRef.current = true;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return isInitializedRef.current;
}; 