# Grid Background Effect Documentation

## Overview
The grid background effect is an interactive 3D visualization created using Three.js and React Three Fiber. It features a responsive grid that distorts based on mouse movement, creating an engaging and dynamic background effect.

## Technical Implementation

### Core Components

1. **DistortedGrid Component**
   - A Three.js mesh that renders the main grid
   - Uses custom shader materials for the distortion effect
   - Implements mouse tracking and interaction

2. **GridBackground Component**
   - Main wrapper component that sets up the Three.js canvas
   - Handles responsive sizing and window resizing
   - Configures camera and rendering settings

### Key Features

#### 1. Grid Geometry
- Dynamically sized based on viewport dimensions
- Responsive to screen size and aspect ratio
- Optimized for different devices:
  - Mobile: 40 divisions
  - Desktop: 60 divisions

#### 2. Shader Implementation
The effect uses custom GLSL shaders with the following features:

##### Vertex Shader
- Implements a base wave animation
- Calculates distance-based distortion from mouse position
- Applies smooth falloff for the distortion effect

##### Fragment Shader
- Creates the grid pattern using UV coordinates
- Implements color blending between:
  - Base color (dark blue-purple)
  - Line color (thistle to rose quartz)
- Adds glow effects in distorted areas

#### 3. Mouse Interaction
- Tracks mouse position using raycasting
- Converts screen coordinates to world space
- Smoothly interpolates between positions
- Handles edge cases (mouse leaving screen)

### Performance Optimizations

1. **Geometry Optimization**
   - Uses `useMemo` for geometry creation
   - Adjusts grid density based on device capabilities

2. **Rendering Settings**
   - Implements responsive pixel ratio
   - Uses performance optimization settings
   - Enables antialiasing for smooth edges

3. **Animation Efficiency**
   - Smooth interpolation for mouse movement
   - Optimized shader calculations
   - Efficient state management

## Usage

```tsx
import GridBackground from '@/components/GridBackground';

// In your component:
<GridBackground />
```

## Technical Requirements

- Three.js
- React Three Fiber
- React Three Drei
- Modern browser with WebGL support

## Browser Support

The effect requires WebGL support and is optimized for modern browsers. Performance may vary based on device capabilities and screen resolution. 