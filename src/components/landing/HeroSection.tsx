import { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Calendar } from 'lucide-react';

// Lazy load the 3D canvas for performance
const HeroCanvas = lazy(() => import('../3d/HeroCanvas'));

export default function HeroSection() {
  const [show3D, setShow3D] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Show poster first, then load 3D
    const timer = setTimeout(() => {
      setShow3D(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const PosterImage = () => (
    <motion.div
      className="absolute inset-0 gradient-rainbow brick-pattern flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-center text-white"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4 glow-effect">
          FashionFOT VR
        </h1>
        <p className="text-lg md:text-xl opacity-80">
          Experience Fashion in Virtual Reality
        </p>
      </motion.div>
    </motion.div>
  );

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background and 3D Canvas */}
      <div className="absolute inset-0">
        {!show3D ? (
          <PosterImage />
        ) : (
          <Suspense fallback={<PosterImage />}>
            <HeroCanvas onAnimationComplete={() => setAnimationComplete(true)} />
          </Suspense>
        )}
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center px-4 md:px-8">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: animationComplete ? 1 : 0.3, y: 0 }}
          transition={{ delay: 4, duration: 1 }}
        >
          <motion.h2
            className="text-xl md:text-2xl text-white/90 mb-8 font-light tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: animationComplete ? 1 : 0 }}
            transition={{ delay: 4.5, duration: 1 }}
          >
            Revolutionary Virtual Try-On Technology
          </motion.h2>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: animationComplete ? 1 : 0 }}
            transition={{ delay: 5, duration: 1 }}
          >
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 text-lg font-semibold touch-target glow-effect"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book Demo
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg touch-target"
            >
              <Play className="mr-2 h-5 w-5" />
              Try Demo
            </Button>
          </motion.div>

          <motion.p
            className="text-white/70 mt-6 text-sm md:text-base max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: animationComplete ? 1 : 0 }}
            transition={{ delay: 5.5, duration: 1 }}
          >
            Step into the future of fashion retail with immersive VR experiences
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: animationComplete ? 1 : 0, y: 0 }}
          transition={{ delay: 6, duration: 1 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1 h-2 bg-white/60 rounded-full mt-2"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Touch gesture hints for mobile */}
      {animationComplete && (
        <motion.div
          className="absolute top-4 right-4 text-white/50 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 7, duration: 1 }}
        >
          <p className="hidden touch:block">Tap & drag avatar to rotate</p>
        </motion.div>
      )}
    </section>
  );
}