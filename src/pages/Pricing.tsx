import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Sparkles, Crown, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const pricingPlans = [
  {
    name: 'Basic',
    price: 'Free',
    description: 'Perfect for getting started with virtual fashion',
    icon: Sparkles,
    features: [
      'Upload up to 10 clothing items',
      'Basic VR try-on experience',
      'Save up to 5 outfits',
      'Standard avatar models',
      'Community support'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Pro',
    price: '$9.99/month',
    description: 'For fashion enthusiasts and content creators',
    icon: Crown,
    features: [
      'Upload unlimited clothing items',
      'Advanced VR features',
      'Unlimited outfit saves',
      'Premium avatar models',
      'AI outfit suggestions',
      'HD texture rendering',
      'Priority support',
      'Export VR scenes'
    ],
    cta: 'Start Pro Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For fashion brands and businesses',
    icon: Zap,
    features: [
      'Everything in Pro',
      'White-label solution',
      'Custom branding',
      'API access',
      'Bulk item management',
      'Analytics dashboard',
      'Dedicated support',
      'Custom integrations'
    ],
    cta: 'Contact Sales',
    popular: false
  }
];

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCTA = (planName: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (planName === 'Enterprise') {
      navigate('/contact');
    } else {
      // In a real app, this would integrate with a payment processor
      console.log(`Selected plan: ${planName}`);
    }
  };

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-16"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Choose Your Fashion Journey
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Unlock the full potential of virtual fashion with our flexible pricing plans
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="gradient-primary text-white text-sm font-medium px-4 py-2 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <Card className={`h-full cursor-reactive ${
                    plan.popular 
                      ? 'ring-2 ring-primary shadow-elegant' 
                      : 'hover:shadow-elegant'
                  }`}>
                    <CardHeader className="text-center space-y-4">
                      <div className="mx-auto w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <div className="space-y-2">
                        <div className="text-3xl font-bold">{plan.price}</div>
                        <CardDescription>{plan.description}</CardDescription>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      <ul className="space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center space-x-3">
                            <Check className="w-5 h-5 text-primary flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button 
                        className={`w-full touch-target ${
                          plan.popular 
                            ? 'gradient-primary text-white' 
                            : ''
                        }`}
                        variant={plan.popular ? 'default' : 'outline'}
                        onClick={() => handleCTA(plan.name)}
                      >
                        {plan.cta}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* FAQ Section */}
          <div className="text-center space-y-8">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Can I cancel anytime?</h3>
                <p className="text-muted-foreground">
                  Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">What VR devices are supported?</h3>
                <p className="text-muted-foreground">
                  Our platform works with all modern VR headsets and also provides a web-based VR experience for desktop and mobile browsers.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Is there a free trial?</h3>
                <p className="text-muted-foreground">
                  The Basic plan is completely free. Pro plan includes a 7-day free trial with full access to premium features.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">How does the AI outfit suggestion work?</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes your uploaded items and suggests outfit combinations based on color coordination, style compatibility, and current fashion trends.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}