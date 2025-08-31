import { useRef, useState } from 'react';
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

interface AvatarModelProps {
  stage: 'avatar' | 'complete';
}

export default function AvatarModel({ stage }: AvatarModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const { size, viewport } = useThree();

  useFrame((state) => {
    if (groupRef.current && !isDragging) {
      // Idle animation - subtle breathing and head movement
      groupRef.current.rotation.y = rotation.y + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.02;
    }
  });

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setIsDragging(true);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (isDragging) {
      setRotation(prev => ({
        x: Math.max(-Math.PI / 6, Math.min(Math.PI / 6, prev.x + event.movementY * 0.01)),
        y: prev.y + event.movementX * 0.01,
      }));
    }
  };

  return (
    <group
      ref={groupRef}
      position={[2.5, stage === 'avatar' ? 3 : -0.5, 0]}
      scale={stage === 'avatar' ? 0.8 : 1}
      rotation={[rotation.x, rotation.y, 0]}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      {/* Simplified humanoid figure */}
      
      {/* Head */}
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#fdbcb4"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.4, 0.8, 0.2]} />
        <meshStandardMaterial
          color="#2a1065"
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.3, 1.2, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.12, 0.6, 0.12]} />
        <meshStandardMaterial
          color="#fdbcb4"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0.3, 1.2, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.12, 0.6, 0.12]} />
        <meshStandardMaterial
          color="#fdbcb4"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.1, 0.2, 0]}>
        <boxGeometry args={[0.14, 0.8, 0.14]} />
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>
      <mesh position={[0.1, 0.2, 0]}>
        <boxGeometry args={[0.14, 0.8, 0.14]} />
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>
      
      {/* Stylish accessories */}
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[0.2, 0.05, 0.2]} />
        <meshStandardMaterial
          color="#ff6bd6"
          emissive="#ff6bd6"
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </group>
  );
}