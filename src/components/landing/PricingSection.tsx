import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star } from 'lucide-react';

const pricingPlans = [
  {
    name: 'Basic',
    price: '$29',
    period: '/month',
    description: 'Perfect for small boutiques and independent retailers',
    features: [
      'Up to 100 virtual garments',
      'Basic VR try-on experience',
      'Mobile app access',
      'Email support',
      '720p rendering quality',
    ],
    popular: false,
  },
  {
    name: 'Pro',
    price: '$99',
    period: '/month',
    description: 'Ideal for growing fashion brands and retail chains',
    features: [
      'Unlimited virtual garments',
      'Advanced VR with haptics',
      'Social shopping features',
      'AI styling recommendations',
      '4K rendering quality',
      'Analytics dashboard',
      'Priority support',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Tailored solutions for large fashion enterprises',
    features: [
      'Custom VR environments',
      'White-label solutions',
      'Advanced analytics',
      'Dedicated account manager',
      '8K rendering quality',
      'Custom integrations',
      'On-site training',
      'SLA guarantee',
    ],
    popular: false,
  },
];

export default function PricingSection() {
  return (
    <section className="py-20 px-4 md:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Fashion VR Plan
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Flexible pricing options to match your business needs and scale with your growth
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <motion.div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                  <div className="bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Most Popular
                  </div>
                </motion.div>
              )}

              <Card className={`glass cursor-reactive touch-target h-full ${
                plan.popular ? 'ring-2 ring-accent glow-effect' : ''
              }`}>
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-foreground">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-2">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        className="flex items-center text-sm"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * featureIndex }}
                      >
                        <Check className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full touch-target ${
                      plan.popular
                        ? 'bg-accent hover:bg-accent/90 text-accent-foreground'
                        : 'bg-primary hover:bg-primary/90'
                    }`}
                    size="lg"
                  >
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-muted-foreground text-sm">
            All plans include 14-day free trial • No setup fees • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
}