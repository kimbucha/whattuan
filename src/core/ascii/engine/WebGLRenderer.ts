import {
  WebGLPatternData,
  ASCIIPattern,
  RenderOptions,
  PatternError,
  PerformanceMetrics
} from './types';

// WebGL shaders
const VERTEX_SHADER = `
  attribute vec4 a_position;
  attribute vec2 a_texcoord;
  varying vec2 v_texcoord;
  void main() {
    gl_Position = a_position;
    v_texcoord = a_texcoord;
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  uniform sampler2D u_texture;
  uniform vec4 u_color;
  uniform float u_opacity;
  varying vec2 v_texcoord;
  void main() {
    vec4 texColor = texture2D(u_texture, v_texcoord);
    gl_FragColor = texColor * u_color * u_opacity;
  }
`;

export class WebGLRenderer {
  private gl: WebGLRenderingContext | WebGL2RenderingContext;
  private patterns: Map<string, WebGLPatternData>;
  private program: WebGLProgram;
  private metrics: PerformanceMetrics;
  private lastFrameTime: number;

  constructor(canvas: HTMLCanvasElement, useWebGL2: boolean = true) {
    // Initialize WebGL context
    this.gl = this.initializeContext(canvas, useWebGL2);
    this.patterns = new Map();
    this.program = this.createProgram();
    this.metrics = this.initializeMetrics();
    this.lastFrameTime = performance.now();

    // Set up initial state
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
  }

  private initializeContext(canvas: HTMLCanvasElement, useWebGL2: boolean): WebGLRenderingContext | WebGL2RenderingContext {
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    
    try {
      if (useWebGL2) {
        gl = canvas.getContext('webgl2') as WebGL2RenderingContext | null;
      }
      if (!gl) {
        gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
      }

      if (!gl) {
        throw new Error('WebGL not supported');
      }

      return gl;
    } catch (err) {
      const error = err as Error;
      throw new Error('WebGL initialization failed: ' + error.message);
    }
  }

  private createShader(type: number, source: string): WebGLShader {
    const shader = this.gl.createShader(type);
    if (!shader) {
      throw new Error('Failed to create shader');
    }

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const info = this.gl.getShaderInfoLog(shader);
      this.gl.deleteShader(shader);
      throw new Error('Shader compilation failed: ' + info);
    }

    return shader;
  }

  private createProgram(): WebGLProgram {
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    
    const program = this.gl.createProgram();
    if (!program) {
      throw new Error('Failed to create program');
    }

    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      const info = this.gl.getProgramInfoLog(program);
      throw new Error('Program linking failed: ' + info);
    }

    return program;
  }

  private initializeMetrics(): PerformanceMetrics {
    return {
      fps: 0,
      frameTime: 0,
      memoryUsage: {
        patterns: 0,
        textures: 0,
        total: 0
      },
      gpuStats: {
        memory: 0,
        utilization: 0
      }
    };
  }

  public loadPattern(pattern: ASCIIPattern): WebGLPatternData {
    try {
      const texture = this.createTextureFromPattern(pattern);
      const { vertices, textureCoords } = this.createGeometry();

      const data: WebGLPatternData = {
        texture,
        program: this.program,
        vertices,
        textureCoords
      };

      this.patterns.set(pattern.id, data);
      return data;
    } catch (err) {
      const error = err as Error;
      throw new PatternError(
        `Failed to load pattern: ${error.message}`,
        pattern,
        'LOAD_ERROR'
      );
    }
  }

  private createTextureFromPattern(pattern: ASCIIPattern): WebGLTexture {
    const texture = this.gl.createTexture();
    if (!texture) {
      throw new Error('Failed to create texture');
    }

    // Convert ASCII pattern to image data
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }

    // Set up canvas for pattern
    canvas.width = pattern.metrics.width;
    canvas.height = pattern.metrics.height;
    
    // Draw pattern
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '16px monospace';

    pattern.frames[0].content.forEach((line, i) => {
      ctx.fillText(line, 0, (i + 1) * 16);
    });

    // Load texture
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      canvas
    );

    // Set texture parameters
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

    return texture;
  }

  private createGeometry() {
    // Create a square
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    const textureCoords = new Float32Array([
      0, 0,
      1, 0,
      0, 1,
      1, 1,
    ]);

    return { vertices, textureCoords };
  }

  public render(patternId: string, options: RenderOptions = {}) {
    const data = this.patterns.get(patternId);
    if (!data) {
      throw new Error(`Pattern ${patternId} not found`);
    }

    const {
      scale = 1,
      opacity = 1,
      color = '#ffffff',
      blend = 'normal'
    } = options;

    // Use program
    this.gl.useProgram(data.program);

    // Set up attributes
    this.setupAttributes(data);

    // Set up uniforms
    this.setupUniforms(data, { scale, opacity, color });

    // Draw
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

    // Update metrics
    this.updateMetrics();
  }

  private setupAttributes(data: WebGLPatternData) {
    // Position attribute
    const positionLocation = this.gl.getAttribLocation(data.program, 'a_position');
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, data.vertices, this.gl.STATIC_DRAW);
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

    // Texture coordinate attribute
    const texcoordLocation = this.gl.getAttribLocation(data.program, 'a_texcoord');
    const texcoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texcoordBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, data.textureCoords, this.gl.STATIC_DRAW);
    this.gl.enableVertexAttribArray(texcoordLocation);
    this.gl.vertexAttribPointer(texcoordLocation, 2, this.gl.FLOAT, false, 0, 0);
  }

  private setupUniforms(data: WebGLPatternData, options: Required<Pick<RenderOptions, 'scale' | 'opacity' | 'color'>>) {
    const { scale, opacity, color } = options;

    // Get uniform locations
    const colorLocation = this.gl.getUniformLocation(data.program, 'u_color');
    const opacityLocation = this.gl.getUniformLocation(data.program, 'u_opacity');

    // Set uniforms
    const [r, g, b] = this.hexToRGB(color);
    this.gl.uniform4fv(colorLocation, [r, g, b, 1.0]);
    this.gl.uniform1f(opacityLocation, opacity);
  }

  private hexToRGB(hex: string): [number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
  }

  private updateMetrics() {
    const currentTime = performance.now();
    const frameTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;

    this.metrics.frameTime = frameTime;
    this.metrics.fps = 1000 / frameTime;
    this.metrics.memoryUsage.patterns = this.patterns.size;
    // Note: Actual GPU stats would require WebGL extensions
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public cleanup() {
    // Delete all patterns and their resources
    this.patterns.forEach((data, id) => {
      this.gl.deleteTexture(data.texture);
    });
    this.patterns.clear();

    // Delete program and shaders
    this.gl.deleteProgram(this.program);
  }
} 