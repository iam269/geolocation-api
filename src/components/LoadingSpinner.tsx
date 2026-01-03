import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = 'Se obține locația...' }: LoadingSpinnerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center gap-4"
    >
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 rounded-full border-4 border-muted border-t-primary"
        />
        
        {/* Inner icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ y: [-2, 2, -2] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MapPin className="w-8 h-8 text-primary" />
          </motion.div>
        </div>
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-muted-foreground text-sm font-medium"
      >
        {message}
      </motion.p>
    </motion.div>
  );
}
