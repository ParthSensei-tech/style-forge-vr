import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';
import HoodieModel from './HoodieModel';
import AvatarModel from './AvatarModel';
import LetterFragments from './LetterFragments';

interface HeroCanvasProps {
  onAnimationComplete?: () => void;
}

const LoadingFallback = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <motion.div
      className="w-32 h-32 border-4 border-primary/20 border-t-primary rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

export default function HeroCanvas({ onAnimationComplete }: HeroCanvasProps) {
  const [animationStage, setAnimationStage] = useState<'idle' | 'hoodie' | 'fragment' | 'assemble' | 'avatar' | 'complete'>('idle');
  const [showCanvas, setShowCanvas] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduceMotion(prefersReducedMotion);

    // Delay canvas loading for performance
    const timer = setTimeout(() => {
      setShowCanvas(true);
      // Start animation sequence
      setTimeout(() => setAnimationStage('hoodie'), 500);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (animationStage === 'complete' && onAnimationComplete) {
      onAnimationComplete();
    }
  }, [animationStage, onAnimationComplete]);

  const handleHoodieComplete = () => {
    if (!reduceMotion) {
      setAnimationStage('fragment');
      setTimeout(() => setAnimationStage('assemble'), 1500);
      setTimeout(() => setAnimationStage('avatar'), 3000);
      setTimeout(() => setAnimationStage('complete'), 4000);
    } else {
      // Skip to final state for reduced motion
      setAnimationStage('complete');
    }
  };

  if (!showCanvas) {
    return (
      <div className="absolute inset-0 gradient-rainbow brick-pattern">
        <LoadingFallback />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 gradient-rainbow brick-pattern">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{
          antialias: false, // Performance optimization
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={Math.min(window.devicePixelRatio, 2)} // Limit DPR for performance
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        
        {/* Optimized lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[-10, -10, -5]} intensity={0.3} color="#ff6bd6" />
        
        <Environment preset="city" environmentIntensity={0.3} />
        
        <Suspense fallback={null}>
          {animationStage === 'hoodie' && (
            <HoodieModel onAnimationComplete={handleHoodieComplete} />
          )}
          
          {(animationStage === 'fragment' || animationStage === 'assemble') && (
            <LetterFragments stage={animationStage} />
          )}
          
          {(animationStage === 'avatar' || animationStage === 'complete') && (
            <>
              <LetterFragments stage="complete" />
              <AvatarModel stage={animationStage} />
            </>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}