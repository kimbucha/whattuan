import {
  ASCIIPattern,
  PatternComplexity,
  RenderOptions,
  PatternEngineConfig,
  EngineStats,
  PatternEventHandler,
  PatternError,
  AnimationOptions,
  Position,
  InteractionConfig
} from './types';
import { WebGLRenderer } from './WebGLRenderer';
import { PatternGenerator } from './PatternGenerator';
import { PatternAnimator } from './PatternAnimator';

const DEFAULT_CONFIG: Required<PatternEngineConfig> = {
  maxPatterns: 100,
  targetFPS: 60,
  useWebGL2: true,
  debug: false,
  optimizationLevel: 1
};

export class PatternEngine {
  private renderer: WebGLRenderer;
  private generator: PatternGenerator;
  private animator: PatternAnimator;
  private config: Required<PatternEngineConfig>;
  private patterns: Map<string, ASCIIPattern>;
  private interactionHandlers: Map<string, (position: Position) => void>;
  private canvas: HTMLCanvasElement;
  private isRunning: boolean;
  private frameCount: number;
  private lastStatsUpdate: number;
  private stats: EngineStats;

  constructor(canvas: HTMLCanvasElement, config: PatternEngineConfig = {}) {
    this.canvas = canvas;
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.patterns = new Map();
    this.interactionHandlers = new Map();
    this.isRunning = false;
    this.frameCount = 0;
    this.lastStatsUpdate = performance.now();
    
    // Initialize components
    this.renderer = new WebGLRenderer(canvas, this.config.useWebGL2);
    this.generator = new PatternGenerator(this.config.optimizationLevel);
    this.animator = new PatternAnimator();

    // Initialize stats
    this.stats = {
      fps: 0,
      activePatterns: 0,
      memoryUsage: 0,
      gpuMemory: 0,
      lastFrameTime: 0
    };

    // Set up event listeners
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Mouse move handler
    this.canvas.addEventListener('mousemove', (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const position: Position = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };

      this.interactionHandlers.forEach((handler) => {
        handler(position);
      });
    });

    // Animation event handler
    const handleAnimationEvent: PatternEventHandler = (event) => {
      if (event.type === 'animate') {
        const pattern = this.patterns.get(event.pattern.id);
        if (pattern) {
          this.renderPattern(pattern);
        }
      }
    };

    // Add animation event handler to all patterns
    this.patterns.forEach((pattern) => {
      this.animator.addEventListener(pattern.id, handleAnimationEvent);
    });
  }

  public generatePattern(
    width: number,
    height: number,
    complexity: PatternComplexity = this.config.optimizationLevel,
    frameCount: number = 1
  ): ASCIIPattern {
    if (this.patterns.size >= this.config.maxPatterns) {
      throw new PatternError(
        'Maximum pattern limit reached',
        {} as ASCIIPattern,
        'MAX_PATTERNS'
      );
    }

    this.generator.setComplexity(complexity);
    const pattern = this.generator.generatePattern(width, height, frameCount);
    this.addPattern(pattern);
    return pattern;
  }

  public addPattern(
    pattern: ASCIIPattern,
    options: AnimationOptions = {},
    interaction?: InteractionConfig
  ): void {
    if (this.patterns.has(pattern.id)) {
      throw new PatternError(
        `Pattern with id ${pattern.id} already exists`,
        pattern,
        'DUPLICATE_ID'
      );
    }

    // Load pattern into renderer
    this.renderer.loadPattern(pattern);

    // Add to animator with options
    this.animator.addPattern(pattern, options);

    // Store pattern
    this.patterns.set(pattern.id, pattern);

    // Set up interaction handlers if provided
    if (interaction) {
      this.setupInteraction(pattern.id, interaction);
    }

    // Update stats
    this.stats.activePatterns = this.patterns.size;
    this.updateMemoryStats();
  }

  public removePattern(patternId: string): void {
    const pattern = this.patterns.get(patternId);
    if (pattern) {
      this.animator.removePattern(patternId);
      this.patterns.delete(patternId);
      this.interactionHandlers.delete(patternId);
      this.updateStats();
    }
  }

  private setupInteraction(patternId: string, config: InteractionConfig): void {
    if (config.transform) {
      this.interactionHandlers.set(patternId, (position: Position) => {
        const pattern = this.patterns.get(patternId);
        if (pattern && config.transform) {
          const transformedFrame = config.transform(position);
          pattern.frames = [transformedFrame];
          this.animator.reset(patternId);
        }
      });
    }
  }

  public start(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      this.renderLoop();
    }
  }

  public stop(): void {
    this.isRunning = false;
  }

  private renderLoop(): void {
    if (!this.isRunning) return;

    this.frameCount++;
    const currentTime = performance.now();

    // Update stats every second
    if (currentTime - this.lastStatsUpdate >= 1000) {
      this.updateStats();
      this.frameCount = 0;
      this.lastStatsUpdate = currentTime;
    }

    // Render all active patterns
    this.patterns.forEach((pattern) => {
      this.renderPattern(pattern);
    });

    requestAnimationFrame(() => this.renderLoop());
  }

  private renderPattern(pattern: ASCIIPattern, options: RenderOptions = {}): void {
    const frame = this.animator.getCurrentFrame(pattern.id);
    if (frame) {
      this.renderer.render(pattern.id, options);
    }
  }

  private updateStats(): void {
    const currentTime = performance.now();
    this.stats = {
      fps: Math.round((this.frameCount * 1000) / (currentTime - this.lastStatsUpdate)),
      activePatterns: this.patterns.size,
      memoryUsage: this.calculateMemoryUsage(),
      gpuMemory: this.calculateGPUMemory(),
      lastFrameTime: currentTime - this.lastStatsUpdate
    };
  }

  private calculateMemoryUsage(): number {
    let total = 0;
    this.patterns.forEach((pattern) => {
      total += pattern.metrics.memoryUsage;
    });
    return total;
  }

  private calculateGPUMemory(): number {
    // This is a rough estimate as actual GPU memory usage is not directly accessible
    return this.patterns.size * 1024 * 1024; // Assume 1MB per pattern
  }

  private updateMemoryStats(): void {
    this.stats.memoryUsage = this.calculateMemoryUsage();
    this.stats.gpuMemory = this.calculateGPUMemory();
  }

  public getStats(): EngineStats {
    return { ...this.stats };
  }

  public cleanup(): void {
    this.stop();
    this.animator.cleanup();
    this.renderer.cleanup();
    this.patterns.clear();
    this.interactionHandlers.clear();
  }
} 