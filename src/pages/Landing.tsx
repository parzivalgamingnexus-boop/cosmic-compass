import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Shield, Activity, Bell, ArrowRight, Globe } from 'lucide-react';
import heroImage from '@/assets/hero-space.jpg';

const stats = [
  { value: '16,000+', label: 'NEOs Tracked' },
  { value: '24/7', label: 'Real-Time Data' },
  { value: '99.9%', label: 'Accuracy' },
  { value: '5+', label: 'Risk Factors' },
];

const features = [
  {
    icon: Activity,
    title: 'Real-Time Tracking',
    description:
      "Live data from NASA's Near-Earth Object database. Track every asteroid approaching our planet with precision.",
  },
  {
    icon: Shield,
    title: 'Risk Analysis Engine',
    description:
      'Advanced scoring evaluates each asteroid based on size, speed, proximity, and hazardous classification.',
  },
  {
    icon: Bell,
    title: 'Smart Alerts',
    description:
      'Set custom proximity thresholds for asteroids on your watchlist. Get notified before close approach events.',
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Near-Earth asteroids approaching Earth in deep space"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
          <div className="absolute inset-0 cosmic-grid opacity-20" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-16">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-primary mb-8">
              <Globe className="w-3.5 h-3.5" />
              Near-Earth Object Monitoring Platform
            </div>
          </motion.div>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter mb-6 leading-[0.9]"
          >
            <span className="text-gradient-primary">COSMIC</span>
            <br />
            <span className="text-foreground">WATCH</span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Monitor near-Earth objects in real-time. Analyze risks, track
            asteroids, and stay informed about cosmic events that could affect
            our planet.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button variant="glow" size="xl" asChild>
              <Link to="/auth?tab=signup">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline-glow" size="xl" asChild>
              <Link to="#features">Learn More</Link>
            </Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex justify-center pt-2">
            <div className="w-1 h-2.5 bg-primary/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-border/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-gradient-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 scroll-mt-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Your{' '}
              <span className="text-gradient-primary">Command Center</span>
              <br />
              for Space Monitoring
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to track, analyze, and understand near-Earth
              objects — all in one powerful platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                viewport={{ once: true }}
                className="glass rounded-xl p-8 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Ready to Monitor the{' '}
              <span className="text-gradient-accent">Cosmos</span>?
            </h2>
            <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
              Join space enthusiasts tracking near-Earth objects in real-time.
              Free to start, powerful enough for serious research.
            </p>
            <Button variant="glow" size="xl" asChild>
              <Link to="/auth?tab=signup">
                Create Free Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            <span>Cosmic Watch</span>
          </div>
          <p>Powered by NASA NeoWs API • Data updated in real-time</p>
        </div>
      </footer>
    </div>
  );
}
