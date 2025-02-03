# WhatTuan Development Log & Implementation Guide

## Project Overview
A dynamic, modular homepage centered around a "what" element, surrounded by interactive bubbles that serve as gateways to different functionalities and content.

## Core Principles
- **Modularity First**: Each bubble is a self-contained component
- **Consistent Design**: Maintain visual and interactive coherence
- **Performance Focused**: Optimize for smooth animations and transitions
- **Extensible Architecture**: Easy to add new bubble modules
- **Documentation Driven**: Keep this log updated with all changes

## Architecture

### Core Components
1. **Central "What" Element**
   - Main focal point of the application
   - Serves as the hub for all interactions
   - Potentially interactive or dynamic

2. **Base Bubble System**
   - Built on BaseIcon component
   - Handles:
     - Animations (GSAP)
     - Hover states
     - Click interactions
     - Visibility management
     - Position management

3. **Module System**
   - Each bubble represents a module
   - Modules are self-contained
   - Standard interface for all modules
   - Independent state management

### File Structure
```
src/
├── components/
│   ├── base/
│   │   ├── BaseIcon.tsx        # Base bubble component
│   │   └── BubbleWrapper.tsx   # Higher-order component for modules
│   ├── modules/
│   │   ├── github/
│   │   ├── midi/
│   │   ├── art/
│   │   └── chatbot/
│   └── core/
│       └── WhatElement.tsx     # Central element
├── contexts/
│   ├── BubbleContext.tsx       # Bubble state management
│   └── ModuleContext.tsx       # Module communication
├── hooks/
│   ├── useModule.ts           # Module lifecycle management
│   └── useBubblePosition.ts   # Bubble positioning logic
├── types/
│   ├── bubble.ts
│   └── module.ts
└── utils/
    ├── animations.ts
    └── moduleLoader.ts
```

## Implementation Phases

### Phase 1: Core Infrastructure
- [x] Base bubble system (completed)
- [x] Animation system (completed)
- [x] Module interface definition (completed)
- [x] Module registry implementation (completed)
- [x] Module context system (completed)
- [x] Central "What" element implementation (completed)
- [x] Basic layout system (completed)
  - [x] Circular layout implementation
  - [x] Drag and drop support
  - [x] Position persistence
  - [x] Animation system integration

### Phase 2: First Modules
- [x] GitHub Module scaffold
  - [x] Basic component structure
  - [x] State management
  - [ ] API integration
  - [ ] Contribution visualization
  - [ ] Activity feed
- [ ] MIDI Controller Module
  - [ ] MIDI device connection
  - [ ] Visual keyboard
  - [ ] Sound synthesis

### Phase 3: Advanced Features
- [x] Module Communication System
- [x] Module Registry
- [ ] Dynamic Module Loading
- [x] State Persistence
- [ ] Settings Management

## Module Specification

### Standard Module Interface
```typescript
interface ModuleConfig {
  id: string;
  name: string;
  icon: React.ComponentType;
  initialPosition?: Position;
  defaultState?: any;
}

interface ModuleInstance {
  render: () => React.ReactNode;
  onMount?: () => void;
  onUnmount?: () => void;
  onActivate?: () => void;
  onDeactivate?: () => void;
}
```

### Module Requirements
1. Must implement ModuleInstance interface
2. Should handle its own state management
3. Must support activation/deactivation
4. Should clean up resources on unmount

## Progress Log

### Current Status
- Base bubble system implemented with animations
- Context system for bubble state management
- Initial positioning system
- Module system architecture completed
- GitHub module scaffold created
- Module registry implemented
- Central "What" element completed with:
  - Hover animations
  - Pulse effect
  - Module count display
- Bubble positioning system implemented with:
  - Circular layout algorithm
  - Drag and drop functionality
  - Position persistence
  - GSAP animations

### Next Steps
1. Complete GitHub module implementation
2. Add module activation animations
3. Implement module transition effects
4. Begin work on MIDI module

### Recent Updates

#### [2024-03-20]
- Created initial documentation
- Outlined development strategy
- Identified core components
- Implemented module system architecture:
  - Created module types and interfaces
  - Implemented module context
  - Created module registry
  - Developed BubbleWrapper component
  - Created GitHub module scaffold

#### [2024-03-21]
- Implemented central "What" element:
  - Added hover animations
  - Created pulse effect
  - Integrated with module system
- Developed bubble positioning system:
  - Created circular layout algorithm
  - Added drag and drop support
  - Implemented position persistence
  - Integrated GSAP animations

### Implementation Details

#### What Element
The central "What" element serves as the hub for all modules and features:
- Responsive animations using GSAP
- Continuous pulse animation when idle
- Hover effects with scale transformation
- Module count display
- Integration with module and bubble contexts

#### Bubble Positioning System
The positioning system manages the layout of all bubble modules:
- Circular layout with configurable:
  - Radius
  - Spacing
  - Start angle
  - Maximum bubbles
- Drag and drop functionality:
  - Position updates
  - Animation smoothing
  - State persistence
- GSAP integration for smooth transitions

### Current Architecture

```typescript
// Bubble Position Management
interface LayoutConfig {
  centerX: number;
  centerY: number;
  radius: number;
  startAngle?: number;
  spacing?: number;
  maxBubbles?: number;
}

// What Element Integration
interface WhatElementProps {
  onHover?: () => void;
  onLeave?: () => void;
  onClick?: () => void;
}
```

### Testing Focus
- Animation performance optimization
- Drag and drop responsiveness
- Position calculation accuracy
- State persistence reliability
- Module activation/deactivation flows

### Known Issues
- Need to optimize animation performance
- Bubble positioning needs refinement
- Module state persistence needs testing
- Need to implement error boundaries for modules
- Position calculation needs optimization for large numbers of bubbles

### Optimization Opportunities
1. Implement position caching
2. Add animation throttling
3. Optimize GSAP timelines
4. Add position prediction for smoother animations

### Next Features to Implement
1. Module activation transitions
2. Inter-module communication
3. Position memory between sessions
4. Module loading states
5. Error recovery system

## Testing Strategy

### Unit Tests
- Component rendering
- State management
- Animation triggers
- Module lifecycle

### Integration Tests
- Module communication
- State synchronization
- Animation sequences

### Performance Tests
- Animation frame rate
- Module load time
- Memory usage

## Development Guidelines

### Code Style
- Use TypeScript for all new components
- Follow React best practices
- Document all public interfaces
- Use GSAP for animations

### Git Workflow
- Feature branches for new modules
- PR reviews required
- Maintain clean commit history
- Update documentation with changes

### Performance Considerations
- Lazy load modules
- Optimize animation frames
- Minimize state updates
- Use React.memo where appropriate

## Documentation Requirements

### For Each Module
- README.md with setup instructions
- API documentation
- State management details
- Performance considerations
- Known limitations

### For Core Systems
- Architecture diagrams
- State flow documentation
- Animation specifications
- Extension points

## Deployment Strategy

### Development
- Local development setup
- Module testing environment
- Performance profiling

### Staging
- Integration testing
- Load testing
- User acceptance testing

### Production
- Progressive rollout
- Performance monitoring
- Error tracking

## Future Considerations

### Scalability
- Dynamic module loading
- State persistence
- Performance optimization

### Extensibility
- Plugin system
- Custom module creation
- Theme support

### Accessibility
- Keyboard navigation
- Screen reader support
- ARIA attributes

## Progress Tracking

### Daily Updates

#### [2025-02-02]
- Project Reset & Restructuring
- Updated documentation
- Created cleanup plan
- Documented new architecture

#### [Previous entries moved to archive]

## Cleanup & Restructuring (2025-02-02)

### Current Status
- Decision to reset and restructure project
- New vision established:
  - Central "what" element with period animation
  - Full-screen transformation
  - ASCII art background system
  - Integrated chat interface

### Files to Remove
- Components:
  - [x] BubbleIcon.tsx (obsolete)
  - [x] EmailIcon.tsx (not needed)
  - [x] TwitterIcon.tsx (not needed)
  - [x] LinkedInIcon.tsx (not needed)
  - [ ] GitHubIcon.tsx (will be reimplemented)
  - [x] FloatingText.tsx (obsolete)
  - [ ] CustomCursor.tsx (will be reimplemented)
  - [x] ImageIcon.tsx (obsolete)
  - [x] PianoIcon.tsx (obsolete)
  - [x] CalculatorIcon.tsx (obsolete)
  - [x] RevolvingDot.tsx (obsolete)
  - [ ] Piano.tsx (will be reimplemented)
  - [x] ActivityChart.tsx (obsolete)
  - [x] ActivityDay.tsx (obsolete)
  - [ ] BaseIcon.tsx (replaced by new core system)

- Contexts:
  - [x] BubbleContext.tsx (replaced by new state management)
  - [x] ModuleContext.tsx (replaced by new system)

- Hooks:
  - [x] useModule.ts (replaced by new system)
  - [x] useBubblePosition.ts (obsolete)
  - [x] useBubbleAnimations.ts (replaced by new animation system)

- Types:
  - [x] bubble.ts (replaced by new types)
  - [x] module.ts (replaced by new system)
  - [x] icons.ts (obsolete)

### New Structure
```
src/
├── core/
│   ├── what/               # Core "what" element
│   │   ├── WhatElement.tsx # Main component
│   │   ├── animations/     # Animation systems
│   │   └── vectors/        # Vector text handling
│   └── ascii/              # ASCII art system
│       ├── engine/         # Animation engine
│       ├── patterns/       # Pattern definitions
│       └── renderer/       # Rendering system
├── chat/
│   ├── interface/          # Chat UI components
│   ├── memory/             # Chat history & context
│   └── ai/                 # AI integration
└── shared/
    ├── state/             # Global state management
    ├── utils/             # Utility functions
    └── types/             # TypeScript definitions
```

### Immediate Tasks (2025-02-02)
1. [ ] Back up current codebase
2. [ ] Remove obsolete files:
   - [ ] Components cleanup
   - [ ] Contexts cleanup
   - [ ] Hooks cleanup
   - [ ] Types cleanup
3. [ ] Initialize new directory structure
4. [ ] Set up core systems:
   - [ ] What element
   - [ ] ASCII engine
   - [ ] State management

### Week 1 Goals (Feb 2-9, 2025)
- [ ] Complete codebase cleanup
- [ ] Set up new project structure
- [ ] Implement basic "what" element
- [ ] Initialize ASCII art system

### Week 2 Goals (Feb 10-16, 2025)
- [ ] Implement period animation
- [ ] Develop transformation system
- [ ] Create basic ASCII renderer
- [ ] Set up state management

### Database Implementation Timeline
- Week 3 (Feb 17-23, 2025):
  - [ ] Schema design
  - [ ] Initial migrations
  - [ ] Basic models
- Week 4 (Feb 24-Mar 2, 2025):
  - [ ] Memory system
  - [ ] Pattern storage
  - [ ] Performance optimization

### Today's Progress (2025-02-02)
- Completed major cleanup:
  - Removed obsolete components (13 files)
  - Removed obsolete contexts (2 files)
  - Removed obsolete hooks (3 files)
  - Removed obsolete types (3 files)
- Identified components to be reimplemented
- Updated documentation and timeline

### Next Steps (Starting 2025-02-03)
1. Set up new directory structure:
   ```
   src/
   ├── core/
   │   ├── what/          # New "what" element
   │   │   ├── components/
   │   │   ├── animations/
   │   │   └── hooks/
   │   └── ascii/         # ASCII art system
   │       ├── engine/
   │       ├── patterns/
   │       └── renderer/
   ├── chat/              # Chat interface
   │   ├── components/
   │   ├── hooks/
   │   └── ai/
   └── shared/            # Shared utilities
       ├── state/
       ├── types/
       └── utils/
   ```

2. Initialize new core systems:
   - [ ] Set up "what" element base
   - [ ] Create ASCII art engine foundation
   - [ ] Initialize state management

3. Begin implementation:
   - [ ] Basic "what" element with period animation
   - [ ] Simple ASCII art renderer
   - [ ] Basic state management system

### Components to Reimplelement
1. GitHubIcon.tsx - Will be part of the ASCII art system
2. CustomCursor.tsx - Enhanced version for the new interface
3. Piano.tsx - Simplified version for audio interaction
4. BaseIcon.tsx - Will be replaced by new core system

### Week 1 Focus (Feb 3-9, 2025)
- Monday: Set up new directory structure and initial files
- Tuesday-Wednesday: Implement basic "what" element
- Thursday-Friday: Create ASCII art foundation
- Weekend: Review and optimize initial implementation

## Project Standards & Best Practices

### Technology Stack
1. **Next.js & React**
   - Use Server Components where possible
   - Implement proper code splitting
   - Follow React 18+ best practices
   - Utilize React Suspense for loading states

2. **TypeScript**
   - Strict type checking enabled
   - Proper type definitions for all components
   - No any types unless absolutely necessary
   - Use generics for reusable components

3. **GSAP**
   - Use GSAP timelines for complex animations
   - Implement proper cleanup
   - Optimize performance with will-change
   - Use requestAnimationFrame for custom animations

4. **ASCII Art System**
   - WebGL for heavy rendering
   - Canvas for simpler patterns
   - Web Workers for pattern generation
   - Efficient pattern caching

### Design System

#### Core Principles
1. **Dynamic ASCII Aesthetics**
   - All UI elements bordered with ASCII art
   - Dynamic pattern changes on interaction
   - Smooth transitions between states
   - Performance-optimized animations

2. **Interactive Patterns**
   ```
   Mouse Movement Response:
   ╔══════╗  →  ╭──────╮  →  ┌──────┐
   ║      ║     │      │     └──────┘
   ╚══════╝     ╰──────╯     ┌──────┐
   ```

3. **Pattern Categories**
   - Borders: Dynamic ASCII frames
   - Backgrounds: Flowing ASCII patterns
   - Accents: Highlight elements
   - Transitions: Morphing patterns

#### ASCII Pattern System
```typescript
interface ASCIIPattern {
  type: 'border' | 'background' | 'accent';
  complexity: 1 | 2 | 3;  // Performance levels
  frames: string[];
  animationSpeed: number;
  interactionMode: {
    mouseMove?: boolean;
    hover?: boolean;
    click?: boolean;
  };
}
```

#### Animation Modes
1. **Idle State**
   - Subtle pattern shifts
   - Low CPU usage
   - Smooth transitions

2. **Interactive State**
   - Mouse position influences patterns
   - Character morphing
   - Direction-based changes

3. **Focus State**
   - Enhanced pattern complexity
   - Highlighted borders
   - Increased animation speed

#### Theme Configuration
```typescript
interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string[];
  };
  ascii: {
    patterns: Record<string, ASCIIPattern>;
    defaultSpeed: number;
    complexityThreshold: number;
  };
  animation: {
    duration: number;
    easing: string;
    frameRate: number;
  };
}
```

### Documentation References

#### Official Documentation
1. **Next.js**
   - [Next.js Documentation](https://nextjs.org/docs)
   - [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
   - [App Router](https://nextjs.org/docs/app)

2. **TypeScript**
   - [TypeScript Handbook](https://www.typescriptlang.org/docs/)
   - [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

3. **GSAP**
   - [GSAP Documentation](https://greensock.com/docs/)
   - [GSAP Performance](https://greensock.com/gsap-performance/)

4. **WebGL**
   - [WebGL Fundamentals](https://webglfundamentals.org/)
   - [WebGL2 Fundamentals](https://webgl2fundamentals.org/)

#### Additional Resources
1. **ASCII Art**
   - [ASCII Art Algorithms](https://en.wikipedia.org/wiki/ASCII_art#Algorithms)
   - [Terminal Animation Techniques](https://github.com/topics/terminal-animation)

2. **Performance**
   - [Web Performance](https://web.dev/performance-get-started/)
   - [React Performance](https://react.dev/learn/render-and-commit)

3. **Accessibility**
   - [WCAG Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/)
   - [React Accessibility](https://react.dev/reference/react-dom/components#aria-attributes)

### Today's Progress (2025-02-02)
1. Completed Major Cleanup
   - Removed all obsolete files and directories
   - Established new project structure
   - Updated documentation

2. New Directory Structure Implemented
   ```
   src/
   ├── core/
   │   ├── what/          # New "what" element
   │   │   ├── components/
   │   │   ├── animations/
   │   │   └── hooks/
   │   └── ascii/         # ASCII art system
   │       ├── engine/
   │       ├── patterns/
   │       └── renderer/
   ├── chat/              # Chat interface
   │   ├── components/
   │   ├── hooks/
   │   └── ai/
   └── shared/            # Shared utilities
       ├── state/
       ├── types/
       └── utils/
   ```

3. Established Design System
   - Defined ASCII pattern system
   - Created animation specifications
   - Set up theme configuration

### Next Steps
1. Implement Core ASCII Engine
   - Pattern generation system
   - Animation framework
   - Performance optimization

2. Create Base Components
   - ASCII-bordered containers
   - Interactive elements
   - Pattern transitions

3. Set Up State Management
   - Theme context
   - Animation state
   - Pattern cache

## Project Roadmap (Updated 2025-02-02)

### Phase 1: Foundation (Feb 2-16, 2025)
1. **Core ASCII Engine** (Week 1)
   - [ ] Pattern Generation System
     - [ ] Basic ASCII pattern definitions
     - [ ] Pattern transformation algorithms
     - [ ] Frame interpolation system
   - [ ] WebGL Renderer
     - [ ] Text-to-texture conversion
     - [ ] Shader system for animations
     - [ ] Performance optimization layer
   - [ ] Animation Framework
     - [ ] GSAP integration
     - [ ] Frame management
     - [ ] State transitions

2. **Theme System** (Week 1-2)
   - [ ] Theme Context
     - [ ] Color management
     - [ ] Pattern preferences
     - [ ] Animation settings
   - [ ] Pattern Registry
     - [ ] Border patterns
     - [ ] Background patterns
     - [ ] Accent patterns
   - [ ] Dynamic Updates
     - [ ] Real-time theme switching
     - [ ] Pattern hot-reloading
     - [ ] Performance monitoring

3. **Base Components** (Week 2)
   - [ ] ASCII Container
     - [ ] Dynamic borders
     - [ ] Interactive states
     - [ ] Performance optimization
   - [ ] Pattern Transitions
     - [ ] Morphing system
     - [ ] State management
     - [ ] Event handling

### Phase 2: Core Features (Feb 17-Mar 2, 2025)
1. **What Element**
   - [ ] Period Animation
   - [ ] Expansion System
   - [ ] Color Inversion
   - [ ] Text Morphing

2. **Chat Interface**
   - [ ] ASCII-styled UI
   - [ ] Dynamic Responses
   - [ ] Memory System
   - [ ] Context Management

3. **Performance Optimization**
   - [ ] Pattern Caching
   - [ ] WebGL Optimization
   - [ ] Animation Throttling
   - [ ] Memory Management

### Phase 3: Enhancement (Mar 3-16, 2025)
1. **Advanced Features**
   - [ ] Pattern Editor
   - [ ] Custom Animations
   - [ ] Plugin System
   - [ ] Theme Builder

2. **Integration**
   - [ ] API Connections
   - [ ] State Persistence
   - [ ] Error Recovery
   - [ ] Analytics

### Implementation Priority Queue
1. Core ASCII Engine
   ```typescript
   // Core Pattern System
   interface PatternEngine {
     initialize(): void;
     registerPattern(pattern: ASCIIPattern): void;
     animate(options: AnimationOptions): void;
     cleanup(): void;
   }

   // WebGL Renderer
   interface ASCIIRenderer {
     context: WebGLRenderingContext;
     patterns: Map<string, WebGLTexture>;
     render(pattern: ASCIIPattern): void;
     update(deltaTime: number): void;
   }
   ```

2. Theme System
   ```typescript
   // Theme Registry
   interface ThemeRegistry {
     current: ThemeConfig;
     patterns: Map<string, ASCIIPattern>;
     register(theme: ThemeConfig): void;
     update(updates: Partial<ThemeConfig>): void;
     getPattern(id: string): ASCIIPattern;
   }
   ```

3. Base Components
   ```typescript
   // ASCII Container
   interface ASCIIContainer {
     pattern: ASCIIPattern;
     state: ContainerState;
     render(): JSX.Element;
     updatePattern(newPattern: ASCIIPattern): void;
   }
   ```

### Today's Implementation Plan (2025-02-02)
1. Core ASCII Engine Bootstrap
   - [ ] Set up WebGL context
   - [ ] Create basic pattern system
   - [ ] Implement frame management

2. Initial Files to Create:
   ```
   src/
   ├── core/
   │   └── ascii/
   │       ├── engine/
   │       │   ├── PatternEngine.ts
   │       │   ├── WebGLRenderer.ts
   │       │   └── types.ts
   │       └── patterns/
   │           ├── basic/
   │           └── registry.ts
   ```

3. Performance Metrics to Track:
   - Frame rate during animations
   - Memory usage per pattern
   - GPU utilization
   - Pattern switching latency

---

Last Updated: February 2, 2025 

## 2024-02-02: ASCII Engine Implementation

### Core Components Implemented

1. **Type System** (`types.ts`)
   - Comprehensive type definitions for patterns, animations, and engine configuration
   - Support for different pattern complexities and interaction modes
   - Performance monitoring and error handling types

2. **WebGL Renderer** (`WebGLRenderer.ts`)
   - Hardware-accelerated rendering using WebGL/WebGL2
   - Efficient texture management for ASCII patterns
   - Support for custom shaders and blending modes
   - Performance optimization through batch rendering

3. **Pattern Generator** (`PatternGenerator.ts`)
   - Procedural ASCII pattern generation with different complexity levels
   - Support for multi-frame animations
   - Pattern variation and interpolation capabilities
   - Deterministic generation through seeded RNG

4. **Pattern Animator** (`PatternAnimator.ts`)
   - Frame-based animation system with timing control
   - Support for easing functions and yoyo animations
   - Event-driven animation updates
   - Memory-efficient animation state management

5. **Pattern Engine** (`PatternEngine.ts`)
   - Central coordination of renderer, generator, and animator
   - Pattern lifecycle management
   - Interactive pattern transformations
   - Performance monitoring and statistics
   - Automatic resource cleanup

### Demo Implementation

Created `ASCIIDemo.tsx` component to showcase the engine capabilities:
- Background pattern generation and animation
- Interactive border pattern with mouse tracking
- Real-time performance statistics display
- Clean component lifecycle management

### Next Steps

1. **Performance Optimization**
   - Implement pattern caching system
   - Add WebGL instancing for repeated patterns
   - Optimize memory usage for large pattern sets

2. **Feature Enhancements**
   - Add more complex pattern generation algorithms
   - Implement pattern composition and layering
   - Add support for custom ASCII character sets
   - Create pattern presets and templates

3. **Documentation**
   - Create API documentation for each component
   - Add usage examples and best practices
   - Document performance considerations
   - Create pattern design guidelines

4. **Testing**
   - Implement unit tests for core components
   - Add performance benchmarks
   - Create visual regression tests
   - Test browser compatibility

### Technical Debt & Improvements

1. **Code Organization**
   - Consider splitting WebGLRenderer into smaller classes
   - Extract common utilities into shared modules
   - Implement proper error boundary system

2. **Performance**
   - Profile memory usage in long-running animations
   - Optimize WebGL state changes
   - Implement pattern pooling for frequent updates

3. **Features**
   - Add support for pattern masks and clipping
   - Implement pattern export/import
   - Add pattern transition effects

4. **Documentation**
   - Document internal implementation details
   - Create troubleshooting guide
   - Add performance tuning guide

### Current Status

- Core engine implementation complete
- Basic demo working
- Ready for initial testing and optimization
- No major blocking issues identified

### Dependencies

- React for UI components
- WebGL/WebGL2 for rendering
- TypeScript for type safety
- Next.js for application framework

### Notes

- WebGL2 support is preferred but falls back to WebGL1
- Pattern complexity affects performance significantly
- Memory usage scales with pattern count and size
- Consider implementing worker-based pattern generation for complex patterns 