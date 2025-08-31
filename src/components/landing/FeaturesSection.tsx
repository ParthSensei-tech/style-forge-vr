import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Smartphone, Zap, Users, ShoppingBag } from 'lucide-react';

const features = [
  {
    icon: Eye,
    title: 'Immersive VR Experience',
    description: 'Try on clothes in photorealistic virtual environments with haptic feedback and spatial audio.',
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Design',
    description: 'Seamless experience across all devices with optimized performance for mobile VR headsets.',
  },
  {
    icon: Zap,
    title: 'Real-Time Physics',
    description: 'Advanced cloth simulation and body tracking for authentic fit and movement visualization.',
  },
  {
    icon: Users,
    title: 'Social Shopping',
    description: 'Share your virtual outfits with friends and get real-time feedback in collaborative spaces.',
  },
  {
    icon: ShoppingBag,
    title: 'AI-Powered Recommendations',
    description: 'Personalized styling suggestions based on your preferences, body type, and fashion trends.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4 md:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Revolutionary Fashion Technology
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience the future of fashion retail with cutting-edge VR technology
            that transforms how you shop, try on, and discover clothing.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="glass cursor-reactive touch-target h-full group">
                <CardContent className="p-6 text-center">
                  <motion.div
                    className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <feature.icon className="h-6 w-6 text-primary" />
                  </motion.div>
                  
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}