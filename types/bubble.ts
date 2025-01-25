export interface BubbleState {
  id: string;
  isVisible: boolean;
  isHovered: boolean;
  lastInteractionTime: number;
  timeoutId?: NodeJS.Timeout;
}

export interface BubbleConfig {
  id: string;
  ref: React.RefObject<HTMLDivElement>;
  component: React.ComponentType<any>;
  props: Record<string, any>;
}

export interface BubbleContextType {
  bubbleStates: Record<string, BubbleState>;
  updateBubbleState: (id: string, updates: Partial<BubbleState>) => void;
  resetBubbleTimer: (id: string) => void;
  BUBBLE_TIMEOUT_MS: number;
} 