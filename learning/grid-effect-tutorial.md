# Interactive Grid Background Effect Tutorial

## Level: Advanced
**Prerequisites**: Basic understanding of React, Three.js, and GLSL shaders

## Overview
In this tutorial, you'll learn how to create an interactive 3D grid background effect that responds to mouse movement. This effect combines Three.js, React Three Fiber, and custom GLSL shaders to create a mesmerizing visual experience.

## Learning Objectives
- Understand how to set up a Three.js scene in React
- Learn to create custom shader materials
- Implement mouse interaction with 3D objects
- Master performance optimization techniques
- Create responsive and adaptive visual effects

## Part 1: Project Setup

### Required Dependencies
```bash
npm install three @react-three/fiber @react-three/drei
```

### Basic Component Structure
```tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function GridBackground() {
  return (
    <Canvas>
      <OrbitControls />
      <DistortedGrid />
    </Canvas>
  )
}
```

## Part 2: Grid Geometry

### Creating the Base Grid
1. Calculate grid size based on viewport:
```tsx
const gridSize = useMemo(() => {
  const aspect = window.innerWidth / window.innerHeight
  return [aspect * 10, 10]
}, [])
```

2. Create grid geometry:
```tsx
const geometry = useMemo(() => {
  const divisions = window.innerWidth < 768 ? 40 : 60
  return new THREE.PlaneGeometry(...gridSize, divisions, divisions)
}, [gridSize])
```

## Part 3: Shader Implementation

### Vertex Shader
```glsl
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

### Fragment Shader
```glsl
uniform vec2 uMouse;
uniform float uTime;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vec2 grid = fract(vUv * 20.0);
  float line = min(grid.x, grid.y);
  
  float dist = length(vPosition.xy - uMouse);
  float wave = sin(dist * 10.0 - uTime) * 0.5 + 0.5;
  
  vec3 color = mix(vec3(0.1, 0.1, 0.2), vec3(0.8, 0.7, 0.9), line);
  color += wave * vec3(0.2, 0.1, 0.3) * smoothstep(2.0, 0.0, dist);
  
  gl_FragColor = vec4(color, 1.0);
}
```

## Part 4: Mouse Interaction

### Tracking Mouse Position
```tsx
const [mouse, setMouse] = useState([0, 0])

useEffect(() => {
  const handleMouseMove = (event) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1
    const y = -(event.clientY / window.innerHeight) * 2 + 1
    setMouse([x, y])
  }

  window.addEventListener('mousemove', handleMouseMove)
  return () => window.removeEventListener('mousemove', handleMouseMove)
}, [])
```

## Part 5: Performance Optimization

### Key Optimization Techniques
1. Use `useMemo` for geometry and materials
2. Implement responsive grid density
3. Optimize shader calculations
4. Use proper cleanup in useEffect

## Part 6: Advanced Features

### Adding Color Transitions
```glsl
uniform vec3 uColorA;
uniform vec3 uColorB;

// In fragment shader
vec3 finalColor = mix(uColorA, uColorB, wave);
```

### Implementing Glow Effects
```glsl
float glow = exp(-dist * 2.0);
color += glow * vec3(0.3, 0.2, 0.4);
```

## Common Challenges and Solutions

1. **Performance Issues**
   - Solution: Reduce grid density on mobile devices
   - Use `useMemo` for expensive calculations
   - Implement proper cleanup

2. **Shader Compilation Errors**
   - Solution: Validate shader syntax
   - Check uniform variable declarations
   - Ensure proper varying variable usage

3. **Mouse Interaction Lag**
   - Solution: Implement smooth interpolation
   - Use requestAnimationFrame for updates
   - Optimize state updates

## Best Practices

1. **Code Organization**
   - Separate shader code into files
   - Use TypeScript for better type safety
   - Implement proper error boundaries

2. **Performance**
   - Monitor frame rate
   - Use React DevTools for profiling
   - Implement proper cleanup

3. **Accessibility**
   - Provide fallback for non-WebGL browsers
   - Consider reduced motion preferences
   - Maintain proper contrast ratios

## Exercises

1. **Basic Implementation**
   - Create a static grid
   - Add basic color transitions
   - Implement simple mouse interaction

2. **Advanced Features**
   - Add multiple distortion points
   - Implement color gradients
   - Create custom easing functions

3. **Optimization Challenge**
   - Optimize for mobile devices
   - Implement level of detail
   - Add performance monitoring

## Resources
- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [GLSL Shader Tutorial](https://thebookofshaders.com/)
- [WebGL Fundamentals](https://webglfundamentals.org/)

## Next Steps
1. Experiment with different grid patterns
2. Add particle effects
3. Implement custom post-processing
4. Create interactive controls
5. Add animation presets

Remember to test your implementation across different devices and browsers to ensure consistent behavior and performance. 