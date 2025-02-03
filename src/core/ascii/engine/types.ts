/**
 * Core types for the ASCII art engine
 */

export type PatternComplexity = 1 | 2 | 3;

export interface Position {
  x: number;
  y: number;
}

export interface PatternFrame {
  content: string[];
  duration: number;
}

export interface PatternMetrics {
  width: number;
  height: number;
  complexity: PatternComplexity;
  memoryUsage: number;
}

export interface InteractionConfig {
  mouseMove?: boolean;
  hover?: boolean;
  click?: boolean;
  transform?: (position: Position) => PatternFrame;
}

export interface AnimationOptions {
  duration?: number;
  easing?: string;
  delay?: number;
  repeat?: number;
  yoyo?: boolean;
  onComplete?: () => void;
  onUpdate?: (progress: number) => void;
}

export interface ASCIIPattern {
  id: string;
  type: 'border' | 'background' | 'accent';
  frames: PatternFrame[];
  defaultAnimation: AnimationOptions;
  metrics: PatternMetrics;
  interaction?: InteractionConfig;
}

export interface RenderOptions {
  scale?: number;
  opacity?: number;
  color?: string;
  background?: string;
  blend?: 'normal' | 'multiply' | 'screen' | 'overlay';
}

export interface WebGLPatternData {
  texture: WebGLTexture;
  program: WebGLProgram;
  vertices: Float32Array;
  textureCoords: Float32Array;
}

export interface EngineStats {
  fps: number;
  activePatterns: number;
  memoryUsage: number;
  gpuMemory: number;
  lastFrameTime: number;
}

export interface PatternEngineConfig {
  maxPatterns?: number;
  targetFPS?: number;
  useWebGL2?: boolean;
  debug?: boolean;
  optimizationLevel?: PatternComplexity;
}

// Event system types
export type PatternEventType = 
  | 'load'
  | 'unload'
  | 'animate'
  | 'interact'
  | 'error';

export interface PatternEvent {
  type: PatternEventType;
  pattern: ASCIIPattern;
  timestamp: number;
  data?: any;
}

export type PatternEventHandler = (event: PatternEvent) => void;

// Error types
export class PatternError extends Error {
  constructor(
    message: string,
    public pattern: ASCIIPattern,
    public code: string
  ) {
    super(message);
    this.name = 'PatternError';
  }
}

// Performance monitoring types
export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: {
    patterns: number;
    textures: number;
    total: number;
  };
  gpuStats: {
    memory: number;
    utilization: number;
  };
}

// Cache system types
export interface PatternCache {
  frames: Map<string, WebGLTexture>;
  metrics: PatternMetrics;
  lastUsed: number;
  hitCount: number;
} 