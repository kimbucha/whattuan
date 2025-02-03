import {
  ASCIIPattern,
  PatternComplexity,
  PatternMetrics,
  PatternFrame,
  Position,
  AnimationOptions
} from './types';

const ASCII_CHARS = {
  1: ['.', ',', '-', '~', '+', '=', '@'],
  2: ['░', '▒', '▓', '█', '■', '▪', '●', '◆', '◇'],
  3: ['╔', '╗', '╚', '╝', '║', '═', '╠', '╣', '╦', '╩', '╬']
};

const DEFAULT_ANIMATION: AnimationOptions = {
  duration: 1000,
  easing: 'linear',
  repeat: -1,
  yoyo: true
};

export class PatternGenerator {
  private complexity: PatternComplexity;
  private seed: number;
  private rng: () => number;

  constructor(complexity: PatternComplexity = 1, seed?: number) {
    this.complexity = complexity;
    this.seed = seed || Math.random() * Number.MAX_SAFE_INTEGER;
    this.rng = this.createRNG(this.seed);
  }

  private createRNG(seed: number): () => number {
    return () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
  }

  private getRandomChar(): string {
    const chars = ASCII_CHARS[this.complexity];
    return chars[Math.floor(this.rng() * chars.length)];
  }

  public generatePattern(width: number, height: number, frameCount: number = 1): ASCIIPattern {
    const frames: PatternFrame[] = [];
    const metrics: PatternMetrics = {
      width,
      height,
      complexity: this.complexity,
      memoryUsage: 0
    };

    for (let f = 0; f < frameCount; f++) {
      const frame = this.generateFrame(width, height);
      frames.push(frame);
      
      // Update memory usage based on frame content
      metrics.memoryUsage += frame.content.join('').length * 2; // Rough estimate: 2 bytes per char
    }

    return {
      id: `pattern_${Date.now()}_${Math.floor(this.rng() * 1000)}`,
      type: 'background',
      frames,
      metrics,
      defaultAnimation: DEFAULT_ANIMATION
    };
  }

  private generateFrame(width: number, height: number): PatternFrame {
    const content: string[] = [];
    const positions: Position[] = [];
    
    // Generate random positions for pattern generation
    const positionCount = Math.floor(this.rng() * 3) + 1;
    for (let i = 0; i < positionCount; i++) {
      positions.push({
        x: Math.floor(this.rng() * width),
        y: Math.floor(this.rng() * height)
      });
    }

    // Generate pattern content based on positions
    for (let y = 0; y < height; y++) {
      let line = '';
      for (let x = 0; x < width; x++) {
        const distanceToPosition = Math.min(...positions.map(pos => 
          Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2))
        ));

        // Probability of placing a character decreases with distance from positions
        const probability = 1 / (1 + distanceToPosition);
        line += this.rng() < probability ? this.getRandomChar() : ' ';
      }
      content.push(line);
    }

    return {
      content,
      duration: DEFAULT_ANIMATION.duration || 1000
    };
  }

  public generateVariation(pattern: ASCIIPattern, variationAmount: number = 0.2): ASCIIPattern {
    const { width, height } = pattern.metrics;
    const frames = pattern.frames.map(frame => {
      const newContent: string[] = frame.content.map(line => {
        return line.split('').map(char => {
          if (char === ' ' || this.rng() > variationAmount) {
            return char;
          }
          return this.getRandomChar();
        }).join('');
      });

      return {
        content: newContent,
        duration: frame.duration
      };
    });

    return {
      ...pattern,
      id: `${pattern.id}_var_${Date.now()}`,
      frames
    };
  }

  public interpolatePatterns(pattern1: ASCIIPattern, pattern2: ASCIIPattern, t: number): ASCIIPattern {
    if (pattern1.metrics.width !== pattern2.metrics.width || 
        pattern1.metrics.height !== pattern2.metrics.height) {
      throw new Error('Patterns must have the same dimensions for interpolation');
    }

    const frames = pattern1.frames.map((frame, i) => {
      const frame2 = pattern2.frames[i] || pattern2.frames[pattern2.frames.length - 1];
      return this.interpolateFrames(frame, frame2, t);
    });

    return {
      id: `interpolated_${Date.now()}`,
      type: pattern1.type,
      frames,
      metrics: {
        ...pattern1.metrics,
        memoryUsage: Math.round(
          pattern1.metrics.memoryUsage * (1 - t) + 
          pattern2.metrics.memoryUsage * t
        )
      },
      defaultAnimation: {
        ...pattern1.defaultAnimation,
        duration: Math.round(
          (pattern1.defaultAnimation.duration || 1000) * (1 - t) + 
          (pattern2.defaultAnimation.duration || 1000) * t
        )
      }
    };
  }

  private interpolateFrames(frame1: PatternFrame, frame2: PatternFrame, t: number): PatternFrame {
    const content = frame1.content.map((line, y) => {
      return line.split('').map((char, x) => {
        const char2 = frame2.content[y][x];
        return this.rng() < t ? char2 : char;
      }).join('');
    });

    return {
      content,
      duration: Math.round(frame1.duration * (1 - t) + frame2.duration * t)
    };
  }

  public setComplexity(complexity: PatternComplexity): void {
    this.complexity = complexity;
  }

  public setSeed(seed: number): void {
    this.seed = seed;
    this.rng = this.createRNG(seed);
  }
} 