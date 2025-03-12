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
  const [mousePosition, setMousePosition] = useState(new THREE.Vector3(0, 0, 0));
  
  // Track mouse position with raycasting for accurate world coordinates
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Convert mouse position to normalized coordinates (-1 to 1)
      const x = (event.clientX / size.width) * 2 - 1;
      const y = -(event.clientY / size.height) * 2 + 1;
      
      // Use raycasting to convert screen coordinates to world coordinates
      const mouse = new THREE.Vector2(x, y);
      raycaster.setFromCamera(mouse, camera);
      
      // Create a plane at z=-10 (same as our grid) to intersect with
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 10);
      const intersectionPoint = new THREE.Vector3();
      
      // Find the intersection point
      raycaster.ray.intersectPlane(plane, intersectionPoint);
      
      // Update mouse position state with the world coordinates
      setMousePosition(intersectionPoint);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [size, camera, raycaster]);
  
  // Create grid geometry
  const geometry = useMemo(() => {
    // Calculate size based on viewport to ensure it covers the screen
    const aspectRatio = viewport.width / viewport.height;
    const size = Math.max(120, 100 * Math.max(1, aspectRatio));
    const divisions = 60;
    const geometry = new THREE.PlaneGeometry(size, size, divisions, divisions);
    return geometry;
  }, [viewport]);

  // Create shader material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        spherePosition: { value: new THREE.Vector3(0, 0, 0) },
        sphereRadius: { value: 30.0 },
        distortionStrength: { value: 8.0 }
      },
      vertexShader: `
        uniform float time;
        uniform vec3 spherePosition;
        uniform float sphereRadius;
        uniform float distortionStrength;
        
        varying vec2 vUv;
        varying float vDistortion;
        
        void main() {
          vUv = uv;
          
          // Calculate distance from vertex to sphere center
          vec3 pos = position;
          float dist = distance(pos, spherePosition);
          
          // Apply distortion based on distance - very simple push effect
          float distortionFactor = 0.0;
          if (dist < sphereRadius) {
            // Simple linear falloff for clean push effect
            float normalizedDist = dist / sphereRadius;
            float falloff = max(0.0, 1.0 - normalizedDist);
            
            // Push vertices away from sphere center
            vec3 dir = normalize(pos - spherePosition);
            pos += dir * falloff * distortionStrength;
            distortionFactor = falloff;
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

  // Animation - using precise world coordinates from raycasting
  useFrame(({ clock }) => {
    if (gridRef.current && gridRef.current.material) {
      const time = clock.getElapsedTime();
      
      // Update time uniform
      (gridRef.current.material as THREE.ShaderMaterial).uniforms.time.value = time;
      
      // Use the exact world coordinates from raycasting
      (gridRef.current.material as THREE.ShaderMaterial).uniforms.spherePosition.value = mousePosition;
      
      if (sphereRef.current) {
        sphereRef.current.position.copy(mousePosition);
      }
    }
  });

  return (
    <>
      {/* Grid is vertical and positioned to fill the screen */}
      <mesh ref={gridRef} geometry={geometry} material={material} position={[0, 0, -10]}>
      </mesh>
      <mesh ref={sphereRef} position={[0, 0, 0]} visible={false}>
        <sphereGeometry args={[30.0, 32, 32]} />
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
      >
        <ambientLight intensity={0.5} />
        <DistortedGrid />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
} 