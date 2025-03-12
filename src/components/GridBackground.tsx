'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Grid with sphere distortion
function DistortedGrid() {
  const gridRef = useRef<THREE.Mesh>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  
  // Create grid geometry
  const geometry = useMemo(() => {
    const size = 25; // Even larger size
    const divisions = 50; // More divisions for smoother effect
    const geometry = new THREE.PlaneGeometry(size, size, divisions, divisions);
    return geometry;
  }, []);

  // Create shader material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        spherePosition: { value: new THREE.Vector3(0, 0, 8) }, // Moved further back
        sphereRadius: { value: 12.0 }, // Even larger radius
        distortionStrength: { value: 6.0 } // Stronger distortion
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
          
          // Apply distortion based on distance
          float distortionFactor = 0.0;
          if (dist < sphereRadius) {
            float strength = (1.0 - dist / sphereRadius) * distortionStrength;
            vec3 dir = normalize(pos - spherePosition);
            pos -= dir * strength;
            distortionFactor = strength / distortionStrength; // Normalize to 0-1
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
          float gridSize = 70.0; // More grid lines
          vec2 grid = fract(vUv * gridSize);
          float lineWidth = 0.012; // Thinner lines
          
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
          float glow = vDistortion * 0.4;
          color += vec3(0.3, 0.1, 0.5) * glow;
          
          gl_FragColor = vec4(color, 0.7); // More opaque
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });
  }, []);

  // Animation
  useFrame(({ clock }) => {
    if (gridRef.current && gridRef.current.material) {
      const time = clock.getElapsedTime();
      
      // Update time uniform
      (gridRef.current.material as THREE.ShaderMaterial).uniforms.time.value = time;
      
      // Move sphere position for dynamic effect - slower, more dramatic movement
      const spherePos = new THREE.Vector3(
        Math.sin(time * 0.1) * 5,
        Math.cos(time * 0.08) * 5,
        8 + Math.sin(time * 0.05) * 2.0
      );
      (gridRef.current.material as THREE.ShaderMaterial).uniforms.spherePosition.value = spherePos;
      
      if (sphereRef.current) {
        sphereRef.current.position.copy(spherePos);
      }
    }
  });

  return (
    <>
      {/* Grid is vertical and positioned further back */}
      <mesh ref={gridRef} geometry={geometry} material={material} position={[0, 0, -10]}>
      </mesh>
      <mesh ref={sphereRef} position={[0, 0, 8]} visible={false}>
        <sphereGeometry args={[12.0, 32, 32]} />
        <meshBasicMaterial color="purple" wireframe />
      </mesh>
    </>
  );
}

export default function GridBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 15], fov: 70 }}>
        <ambientLight intensity={0.5} />
        <DistortedGrid />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
} 