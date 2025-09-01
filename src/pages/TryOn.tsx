import React from 'react';
import { motion } from 'framer-motion';
import { VRScene } from '@/components/vr/VRScene';

export default function TryOn() {
  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Virtual Try-On Experience</h1>
            <p className="text-xl text-muted-foreground">
              Mix and match your clothing items in our immersive VR environment
            </p>
          </div>

          <VRScene />
        </motion.div>
      </div>
    </div>
  );
}