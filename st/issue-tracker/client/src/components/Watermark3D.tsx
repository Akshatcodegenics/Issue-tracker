import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function RotatingText() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.position.z = Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <Text
        fontSize={0.8}
        color="#1976d2"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        ISSUE
        <meshStandardMaterial 
          color="#1976d2" 
          transparent 
          opacity={0.1}
          emissive="#0d47a1"
          emissiveIntensity={0.2}
        />
      </Text>
      <Text
        fontSize={0.6}
        color="#dc004e"
        anchorX="center"
        anchorY="middle"
        position={[0, -1, 0]}
      >
        TRACKER
        <meshStandardMaterial 
          color="#dc004e" 
          transparent 
          opacity={0.1}
          emissive="#880e4f"
          emissiveIntensity={0.2}
        />
      </Text>
    </mesh>
  );
}

function FloatingCubes() {
  const cubes = Array.from({ length: 8 }, (_, i) => (
    <FloatingCube key={i} position={[
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    ]} />
  ));
  
  return <>{cubes}</>;
}

function FloatingCube({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.4;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.3, 0.3, 0.3]} />
      <meshStandardMaterial 
        color="#42a5f5" 
        transparent 
        opacity={0.05}
        wireframe
      />
    </mesh>
  );
}

const Watermark3D: React.FC = () => {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.3,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.3} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        
        <RotatingText />
        <FloatingCubes />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default Watermark3D;