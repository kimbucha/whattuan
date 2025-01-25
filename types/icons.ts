import { ReactElement } from 'react';

export interface BaseIconProps {
  id: string;
  index: number;
  children?: React.ReactNode;
  isVisible?: boolean;
  onClick?: () => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  className?: string;
} 