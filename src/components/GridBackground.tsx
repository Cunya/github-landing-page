'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Grid with sphere distortion
function DistortedGrid() {
  const gridRef = useRef<THREE.Mesh>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const { viewport, size, camera, raycaster } = useThree();
  // Always keep the initial animation active
  const initialAnimationRef = useRef({ progress: 1.0 });
  const [isPointerOnScreen, setIsPointerOnScreen] = useState(false);
  const mousePosition = useRef(new THREE.Vector3(0, 0, 0));
  const targetPosition = useRef(new THREE.Vector3(0, 0, 0));
  
  // Create grid geometry with performance optimizations
  const geometry = useMemo(() => {
    // Calculate size based on viewport to ensure it covers the screen
    const aspectRatio = viewport.width / viewport.height;
    const size = Math.max(120, 100 * Math.max(1, aspectRatio));
    
    // Adjust divisions based on device performance (fewer for mobile)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const divisions = isMobile ? 40 : 60;
    
    const geometry = new THREE.PlaneGeometry(size, size, divisions, divisions);
    return geometry;
  }, [viewport]);

  // Create shader material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        spherePosition: { value: new THREE.Vector3(0, 0, 0) },
        sphereRadius: { value: 100.0 },
        distortionStrength: { value: 4.0 },
        initialAnimationProgress: { value: 1.0 } // Always at full strength
      },
      vertexShader: `
        uniform float time;
        uniform vec3 spherePosition;
        uniform float sphereRadius;
        uniform float distortionStrength;
        uniform float initialAnimationProgress;
        
        varying vec2 vUv;
        varying float vDistortion;
        
        void main() {
          vUv = uv;
          
          // Apply initial animation effect - subtle wave pattern
          // Always apply the wave pattern regardless of interaction
          vec3 pos = position;
          float waveX = sin(pos.x * 0.03 + time * 0.5) * 1.0;
          float waveY = cos(pos.y * 0.03 + time * 0.5) * 1.0;
          pos.z += waveX + waveY;
          
          // Initialize distortion factor with a subtle base from the wave
          float distortionFactor = 0.2 * (waveX + waveY + 2.0) / 4.0;
          
          // Calculate distance from vertex to sphere center
          float dist = distance(pos, spherePosition);
          
          // Apply additional distortion based on distance - push effect
          if (dist < sphereRadius) {
            // Simple linear falloff for clean push effect
            float normalizedDist = dist / sphereRadius;
            float falloff = max(0.0, 1.0 - normalizedDist);
            
            // Push vertices away from sphere center
            vec3 dir = normalize(pos - spherePosition);
            pos += dir * falloff * distortionStrength;
            
            // Enhance distortion factor where the sphere is
            distortionFactor = max(distortionFactor, falloff);
          }
          
          vDistortion = distortionFactor;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying float vDistortion;
        
        void main() {
          // Grid pattern
          float gridSize = 80.0; // More grid lines
          vec2 grid = fract(vUv * gridSize);
          float lineWidth = 0.03; // Thicker lines
          
          // Create grid lines
          float line = step(1.0 - lineWidth, grid.x) + step(1.0 - lineWidth, grid.y);
          
          // Apply color - using site's color palette
          // Space Cadet (deep blue-purple) to Thistle (light purple) to Rose Quartz (soft pink)
          vec3 baseColor = vec3(0.05, 0.05, 0.15); // Dark background
          vec3 lineColor = mix(
            vec3(0.5, 0.3, 0.7), // Thistle-like purple
            vec3(0.9, 0.6, 0.8), // Rose Quartz-like pink
            vDistortion // Use distortion to blend colors
          );
          
          vec3 color = mix(baseColor, lineColor, line);
          
          // Add glow effect in distorted areas
          float glow = vDistortion * 0.5;
          color += vec3(0.3, 0.1, 0.5) * glow;
          
          gl_FragColor = vec4(color, 0.7); // More opaque
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });
  }, []);

  // Track mouse position with raycasting for accurate world coordinates
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setIsPointerOnScreen(true);
      
      // Convert mouse position to normalized coordinates (-1 to 1)
      const x = (event.clientX / size.width) * 2 - 1;
      const y = -(event.clientY / size.height) * 2 + 1;

      // Use raycasting to convert screen coordinates to world coordinates
      const mouseCoords = new THREE.Vector2(x, y);
      raycaster.setFromCamera(mouseCoords, camera);

      // Create a plane at z=10 to intersect with
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 10);
      const intersectionPoint = new THREE.Vector3();

      // Find the intersection point
      if (raycaster.ray.intersectPlane(plane, intersectionPoint)) {
        // Update target position with the world coordinates
        targetPosition.current.copy(intersectionPoint);
      }
    };
    
    // Use document instead of window for more reliable mouseleave detection
    const handleMouseLeave = () => {
      setIsPointerOnScreen(false);
    };
    
    // Check if mouse is outside viewport bounds
    const checkMouseBounds = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;
      
      // If mouse is at the edge of the viewport, consider it "left"
      if (clientX <= 0 || clientY <= 0 || clientX >= innerWidth || clientY >= innerHeight) {
        setIsPointerOnScreen(false);
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousemove', checkMouseBounds);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousemove', checkMouseBounds);
    };
  }, [camera, raycaster, size]);

  // Animation - using precise world coordinates and initial animation
  useFrame(({ clock }) => {
    if (gridRef.current && gridRef.current.material) {
      const time = clock.getElapsedTime();
      const material = gridRef.current.material as THREE.ShaderMaterial;
      
      // Update time uniform
      material.uniforms.time.value = time;
      
      // Smoothly interpolate to target position or back to center
      if (isPointerOnScreen) {
        // When pointer is on screen, move toward the target position with faster lerp
        mousePosition.current.lerp(targetPosition.current, 0.3);
      } else {
        // When pointer is off screen, move back to center with a slower lerp for smoother transition
        mousePosition.current.lerp(new THREE.Vector3(0, 0, 0), 0.1);
      }
      
      // Use the interpolated position
      material.uniforms.spherePosition.value = mousePosition.current;
      
      if (sphereRef.current) {
        sphereRef.current.position.copy(mousePosition.current);
      }
    }
  });

  return (
    <>
      {/* Grid is vertical and positioned to fill the screen */}
      <mesh ref={gridRef} geometry={geometry} material={material} position={[0, 0, -10]}>
      </mesh>
      <mesh ref={sphereRef} position={[0, 0, 0]} visible={false}>
        <sphereGeometry args={[100.0, 32, 32]} />
        <meshBasicMaterial color="purple" wireframe />
      </mesh>
    </>
  );
}

export default function GridBackground() {
  // Track window size for responsive canvas
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    // Handle window resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 w-screen h-screen overflow-hidden">
      <Canvas 
        camera={{ position: [0, 0, 20], fov: 100 }}
        style={{ width: '100vw', height: '100vh' }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]} // Responsive pixel ratio
        performance={{ min: 0.5 }} // Performance optimization
      >
        <ambientLight intensity={0.5} />
        <DistortedGrid />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
} 