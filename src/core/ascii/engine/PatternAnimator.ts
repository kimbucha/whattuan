import {
  ASCIIPattern,
  AnimationOptions,
  PatternEvent,
  PatternEventHandler,
  PatternFrame
} from './types';

interface AnimationState {
  pattern: ASCIIPattern;
  currentFrame: number;
  elapsedTime: number;
  isPlaying: boolean;
  options: Required<AnimationOptions>;
}

const DEFAULT_OPTIONS: Required<AnimationOptions> = {
  duration: 1000,
  easing: 'linear',
  delay: 0,
  repeat: 0,
  yoyo: false,
  onComplete: () => {},
  onUpdate: () => {}
};

export class PatternAnimator {
  private animations: Map<string, AnimationState>;
  private eventHandlers: Map<string, Set<PatternEventHandler>>;
  private lastFrameTime: number;
  private animationFrameId: number | null;

  constructor() {
    this.animations = new Map();
    this.eventHandlers = new Map();
    this.lastFrameTime = performance.now();
    this.animationFrameId = null;
  }

  public addPattern(pattern: ASCIIPattern, options: AnimationOptions = {}): void {
    const state: AnimationState = {
      pattern,
      currentFrame: 0,
      elapsedTime: 0,
      isPlaying: false,
      options: { ...DEFAULT_OPTIONS, ...pattern.defaultAnimation, ...options }
    };

    this.animations.set(pattern.id, state);
    this.emitEvent('load', pattern);
  }

  public removePattern(patternId: string): void {
    const state = this.animations.get(patternId);
    if (state) {
      this.animations.delete(patternId);
      this.emitEvent('unload', state.pattern);
    }
  }

  public play(patternId: string): void {
    const state = this.animations.get(patternId);
    if (state) {
      state.isPlaying = true;
      if (this.animationFrameId === null) {
        this.startAnimationLoop();
      }
    }
  }

  public pause(patternId: string): void {
    const state = this.animations.get(patternId);
    if (state) {
      state.isPlaying = false;
    }
  }

  public reset(patternId: string): void {
    const state = this.animations.get(patternId);
    if (state) {
      state.currentFrame = 0;
      state.elapsedTime = 0;
    }
  }

  public getCurrentFrame(patternId: string): PatternFrame | null {
    const state = this.animations.get(patternId);
    if (!state) return null;
    return state.pattern.frames[state.currentFrame];
  }

  public addEventListener(patternId: string, handler: PatternEventHandler): void {
    if (!this.eventHandlers.has(patternId)) {
      this.eventHandlers.set(patternId, new Set());
    }
    this.eventHandlers.get(patternId)?.add(handler);
  }

  public removeEventListener(patternId: string, handler: PatternEventHandler): void {
    this.eventHandlers.get(patternId)?.delete(handler);
  }

  private emitEvent(type: PatternEvent['type'], pattern: ASCIIPattern, data?: any): void {
    const event: PatternEvent = {
      type,
      pattern,
      timestamp: performance.now(),
      data
    };

    const handlers = this.eventHandlers.get(pattern.id);
    handlers?.forEach(handler => handler(event));
  }

  private startAnimationLoop(): void {
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - this.lastFrameTime;
      this.lastFrameTime = currentTime;

      let hasActiveAnimations = false;

      this.animations.forEach((state, patternId) => {
        if (!state.isPlaying) return;

        state.elapsedTime += deltaTime;
        if (state.elapsedTime < state.options.delay) {
          hasActiveAnimations = true;
          return;
        }

        const activeTime = state.elapsedTime - state.options.delay;
        const totalDuration = state.pattern.frames.reduce(
          (sum, frame) => sum + frame.duration,
          0
        );

        let currentTime = activeTime % totalDuration;
        let frameIndex = 0;
        let frameDuration = 0;

        // Find current frame based on elapsed time
        for (const frame of state.pattern.frames) {
          if (currentTime < frameDuration + frame.duration) {
            break;
          }
          frameDuration += frame.duration;
          frameIndex++;
        }

        // Handle repeat and yoyo
        if (activeTime >= totalDuration) {
          if (state.options.repeat === 0) {
            state.isPlaying = false;
            frameIndex = state.pattern.frames.length - 1;
            state.options.onComplete();
            this.emitEvent('animate', state.pattern, { completed: true });
          } else if (state.options.repeat > 0) {
            state.options.repeat--;
            hasActiveAnimations = true;
          } else {
            hasActiveAnimations = true;
          }

          if (state.options.yoyo) {
            state.pattern.frames.reverse();
          }
        } else {
          hasActiveAnimations = true;
        }

        if (frameIndex !== state.currentFrame) {
          state.currentFrame = frameIndex;
          const progress = activeTime / totalDuration;
          state.options.onUpdate(progress);
          this.emitEvent('animate', state.pattern, { frame: frameIndex, progress });
        }
      });

      if (hasActiveAnimations) {
        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        this.animationFrameId = null;
      }
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  public cleanup(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.animations.clear();
    this.eventHandlers.clear();
  }
} 