import { useMemo } from 'react';
import * as THREE from 'three';

interface LetterFragmentsProps {
  stage: 'fragment' | 'assemble' | 'complete';
}

export default function LetterFragments({ stage }: LetterFragmentsProps) {
  const letters = ['F', 'a', 's', 'h', 'i', 'o', 'n', 'F', 'O', 'T', ' ', 'V', 'R'];
  
  const letterPositions = useMemo(() => {
    const positions: Array<[number, number, number]> = [];
    let xOffset = -3.5;
    
    letters.forEach((letter, index) => {
      if (letter === ' ') {
        xOffset += 0.3;
      } else {
        positions.push([xOffset, 0, 0]);
        xOffset += 0.6;
      }
    });
    
    return positions;
  }, []);

  const fragmentPositions = useMemo(() => {
    return Array.from({ length: 12 }, () => [
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 4,
    ] as [number, number, number]);
  }, []);

  return (
    <group>
      {letters.filter(l => l !== ' ').map((letter, index) => {
        const finalPos = letterPositions[index] || [0, 0, 0];
        const fragmentPos = fragmentPositions[index] || [0, 0, 0];
        
        let animateProps;
        
        switch (stage) {
          case 'fragment':
            animateProps = {
              position: fragmentPos,
              scale: 0.1,
              rotateX: Math.PI * 2,
              rotateY: Math.PI * 2,
            };
            break;
          case 'assemble':
            animateProps = {
              position: finalPos,
              scale: 1,
              rotateX: 0,
              rotateY: 0,
            };
            break;
          default:
            animateProps = {
              position: finalPos,
              scale: 1,
              rotateX: 0,
              rotateY: 0,
            };
        }

        return (
          <group
            key={`${letter}-${index}`}
            position={stage === 'fragment' ? fragmentPos : finalPos}
            scale={stage === 'fragment' ? 0.1 : 1}
            rotation={stage === 'fragment' ? [Math.PI * 2, Math.PI * 2, 0] : [0, 0, 0]}
          >
            {/* Fallback to simple box geometry for performance */}
            <mesh>
              <boxGeometry args={[0.4, 0.6, 0.1]} />
              <meshStandardMaterial
                color={index < 7 ? "#7a3ff5" : "#ff6bd6"}
                emissive={index < 7 ? "#2a1065" : "#661146"}
                emissiveIntensity={0.3}
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>
            
            {/* Letter overlay for visual representation */}
            <mesh position={[0, 0, 0.06]}>
              <planeGeometry args={[0.35, 0.5]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={0.9}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}