import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Creative Director',
    company: 'Urban Threads',
    avatar: '/placeholder.svg',
    rating: 5,
    quote: 'FashionFOT VR revolutionized our customer experience. Our virtual try-on sessions increased conversion rates by 300% and dramatically reduced returns.',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'CEO',
    company: 'StyleTech Innovations',
    avatar: '/placeholder.svg',
    rating: 5,
    quote: 'The immersive quality is incredible. Customers can feel the fabric texture and see how garments move in real-time. It\'s the future of fashion retail.',
  },
  {
    name: 'Emma Thompson',
    role: 'Head of Digital',
    company: 'LuxFashion Group',
    avatar: '/placeholder.svg',
    rating: 5,
    quote: 'Implementation was seamless, and our team was amazed by the ROI. The AI recommendations feature alone has increased our average order value by 45%.',
  },
  {
    name: 'David Park',
    role: 'Founder',
    company: 'NextGen Boutique',
    avatar: '/placeholder.svg',
    rating: 5,
    quote: 'Our customers love the social shopping features. They can share outfits with friends instantly and get feedback before purchasing. It\'s game-changing.',
  },
  {
    name: 'Lisa Wong',
    role: 'VP of Innovation',
    company: 'Global Fashion Corp',
    avatar: '/placeholder.svg',
    rating: 5,
    quote: 'The enterprise solution exceeded our expectations. Custom VR environments for each brand and detailed analytics helped optimize our entire customer journey.',
  },
  {
    name: 'Ahmed Hassan',
    role: 'Digital Strategy Lead',
    company: 'Fashion Forward ME',
    avatar: '/placeholder.svg',
    rating: 5,
    quote: 'Mobile VR performance is outstanding. Our customers can try on entire collections during their commute. It\'s convenient and incredibly engaging.',
  },
];

export default function TestimonialsSection() {
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
            Trusted by Fashion Leaders
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See how fashion brands worldwide are transforming their customer experience
            with FashionFOT VR technology
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="glass cursor-reactive touch-target h-full">
                <CardContent className="p-6">
                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-accent fill-current"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-foreground mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="font-semibold text-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                      <div className="text-sm text-primary font-medium">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-border"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {[
            { number: '500+', label: 'Fashion Brands' },
            { number: '10M+', label: 'Virtual Try-Ons' },
            { number: '300%', label: 'Conversion Increase' },
            { number: '99.9%', label: 'Uptime SLA' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}