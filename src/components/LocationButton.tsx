import { motion } from 'framer-motion';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocationButtonProps {
  onClick: () => void;
  loading?: boolean;
  hasLocation?: boolean;
  isWatching?: boolean;
  onToggleWatch?: () => void;
}

export function LocationButton({
  onClick,
  loading = false,
  hasLocation = false,
  isWatching = false,
  onToggleWatch,
}: LocationButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex flex-col sm:flex-row gap-3 w-full"
    >
      <Button
        variant="glow"
        size="xl"
        onClick={onClick}
        disabled={loading}
        className="flex-1 relative overflow-hidden group"
      >
        {loading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Se caută locația...</span>
          </>
        ) : (
          <>
            <motion.span
              initial={false}
              animate={{ scale: hasLocation ? 1.2 : 1 }}
              transition={{ type: 'spring', bounce: 0.6 }}
            >
              <MapPin className="w-6 h-6" />
            </motion.span>
            <span>{hasLocation ? 'Actualizează locația' : 'Afișează locația mea'}</span>
          </>
        )}

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
        />
      </Button>

      {hasLocation && onToggleWatch && (
        <Button
          variant={isWatching ? 'success' : 'glass'}
          size="xl"
          onClick={onToggleWatch}
          className="sm:w-auto whitespace-nowrap"
        >
          <Navigation className={`w-5 h-5 ${isWatching ? 'animate-pulse' : ''}`} />
          <span className="hidden sm:inline">
            {isWatching ? 'Urmărire activă' : 'Urmărire live'}
          </span>
          <span className="sm:hidden">
            {isWatching ? 'Live ON' : 'Live'}
          </span>
        </Button>
      )}
    </motion.div>
  );
}
