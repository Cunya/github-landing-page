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
    const size = 15;
    const divisions = 30;
    const geometry = new THREE.PlaneGeometry(size, size, divisions, divisions);
    return geometry;
  }, []);

  // Create shader material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        spherePosition: { value: new THREE.Vector3(0, 0, 2) },
        sphereRadius: { value: 2.5 },
        distortionStrength: { value: 1.5 }
      },
      vertexShader: `
        uniform float time;
        uniform vec3 spherePosition;
        uniform float sphereRadius;
        uniform float distortionStrength;
        
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          
          // Calculate distance from vertex to sphere center
          vec3 pos = position;
          float dist = distance(pos, spherePosition);
          
          // Apply distortion based on distance
          if (dist < sphereRadius * 1.5) {
            float strength = (1.0 - dist / (sphereRadius * 1.5)) * distortionStrength;
            vec3 dir = normalize(pos - spherePosition);
            pos -= dir * strength;
          }
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        
        void main() {
          // Grid pattern
          float gridSize = 50.0;
          vec2 grid = fract(vUv * gridSize);
          float lineWidth = 0.02;
          
          // Create grid lines
          float line = step(1.0 - lineWidth, grid.x) + step(1.0 - lineWidth, grid.y);
          
          // Apply color
          vec3 color = mix(vec3(0.1, 0.1, 0.2), vec3(0.5, 0.3, 0.7), line);
          
          gl_FragColor = vec4(color, 0.5);
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
      
      // Move sphere position for dynamic effect
      const spherePos = new THREE.Vector3(
        Math.sin(time * 0.3) * 2,
        Math.cos(time * 0.2) * 2,
        2 + Math.sin(time * 0.1) * 0.5
      );
      (gridRef.current.material as THREE.ShaderMaterial).uniforms.spherePosition.value = spherePos;
      
      if (sphereRef.current) {
        sphereRef.current.position.copy(spherePos);
      }
    }
  });

  return (
    <>
      <mesh ref={gridRef} geometry={geometry} material={material} rotation={[-Math.PI / 2, 0, 0]} />
      <mesh ref={sphereRef} position={[0, 0, 2]} visible={false}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial color="purple" wireframe />
      </mesh>
    </>
  );
}

export default function GridBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 5, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <DistortedGrid />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
} 