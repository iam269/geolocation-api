import { motion } from 'framer-motion';
import { MapPin, Globe } from 'lucide-react';

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-6 md:py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
        className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/20 mb-4 relative"
      >
        <MapPin className="w-8 h-8 md:w-10 md:h-10 text-primary" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -inset-2 opacity-50"
        >
          <Globe className="w-full h-full text-primary/30" />
        </motion.div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl md:text-4xl font-bold text-foreground mb-2"
      >
        Locația Mea
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground text-sm md:text-base max-w-md mx-auto"
      >
        Descoperă coordonatele tale exacte pe hartă folosind GPS-ul dispozitivului tău
      </motion.p>
    </motion.header>
  );
}
