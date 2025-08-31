import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import * as THREE from 'three';

interface HoodieModelProps {
  onAnimationComplete?: () => void;
}

export default function HoodieModel({ onAnimationComplete }: HoodieModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [animationPhase, setAnimationPhase] = useState<'appear' | 'rotate' | 'fragment'>('appear');

  useEffect(() => {
    // Animation sequence timing
    const timer1 = setTimeout(() => setAnimationPhase('rotate'), 800);
    const timer2 = setTimeout(() => {
      setAnimationPhase('fragment');
      onAnimationComplete?.();
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onAnimationComplete]);

  useFrame((state) => {
    if (groupRef.current && animationPhase === 'rotate') {
      groupRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group
      ref={groupRef}
      scale={animationPhase === 'fragment' ? 0 : 1}
      position-y={animationPhase === 'fragment' ? 2 : 0}
      rotation-y={animationPhase === 'fragment' ? Math.PI * 4 : 0}
    >
      {/* Simplified hoodie geometry for performance */}
      <group>
        {/* Main body */}
        <Box args={[1.2, 1.5, 0.8]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color="#2a1065" 
            roughness={0.7}
            metalness={0.1}
            emissive="#1a0a3a"
            emissiveIntensity={0.2}
          />
        </Box>
        
        {/* Hood */}
        <Box args={[1.0, 0.8, 0.6]} position={[0, 0.8, 0.1]}>
          <meshStandardMaterial 
            color="#1a0a3a" 
            roughness={0.8}
            metalness={0.05}
          />
        </Box>
        
        {/* Sleeves */}
        <Box args={[0.4, 1.2, 0.4]} position={[-0.8, 0, 0]}>
          <meshStandardMaterial 
            color="#2a1065" 
            roughness={0.7}
            metalness={0.1}
          />
        </Box>
        <Box args={[0.4, 1.2, 0.4]} position={[0.8, 0, 0]}>
          <meshStandardMaterial 
            color="#2a1065" 
            roughness={0.7}
            metalness={0.1}
          />
        </Box>
        
        {/* Pocket detail */}
        <Box args={[0.6, 0.4, 0.05]} position={[0, -0.3, 0.41]}>
          <meshStandardMaterial 
            color="#1a0a3a" 
            roughness={0.9}
            metalness={0.0}
          />
        </Box>
      </group>
    </group>
  );
}