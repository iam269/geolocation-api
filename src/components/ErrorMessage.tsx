import { motion } from 'framer-motion';
import { AlertTriangle, XCircle, WifiOff, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorMessageProps {
  error: GeolocationPositionError | null;
  onRetry?: () => void;
  supported?: boolean;
}

export function ErrorMessage({ error, onRetry, supported = true }: ErrorMessageProps) {
  const getErrorDetails = () => {
    if (!supported) {
      return {
        icon: WifiOff,
        title: 'Browser incompatibil',
        message: 'Browser-ul tău nu suportă funcția de geolocalizare. Te rugăm să folosești un browser modern precum Chrome, Firefox sau Safari.',
        color: 'text-destructive',
      };
    }

    if (!error) {
      return {
        icon: AlertTriangle,
        title: 'Eroare necunoscută',
        message: 'A apărut o eroare neașteptată. Te rugăm să încerci din nou.',
        color: 'text-warning',
      };
    }

    switch (error.code) {
      case error.PERMISSION_DENIED:
        return {
          icon: XCircle,
          title: 'Acces refuzat',
          message: 'Ai refuzat accesul la locație. Pentru a folosi această funcție, te rugăm să permiți accesul la locație din setările browser-ului.',
          color: 'text-destructive',
        };
      case error.POSITION_UNAVAILABLE:
        return {
          icon: WifiOff,
          title: 'Locație indisponibilă',
          message: 'Nu am putut determina locația ta. Asigură-te că serviciile de localizare sunt activate și că ai o conexiune la internet stabilă.',
          color: 'text-warning',
        };
      case error.TIMEOUT:
        return {
          icon: Clock,
          title: 'Timp expirat',
          message: 'A durat prea mult pentru a obține locația. Te rugăm să încerci din nou.',
          color: 'text-warning',
        };
      default:
        return {
          icon: AlertTriangle,
          title: 'Eroare',
          message: error.message || 'A apărut o eroare neașteptată.',
          color: 'text-warning',
        };
    }
  };

  const { icon: Icon, title, message, color } = getErrorDetails();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 text-center max-w-md mx-auto"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
        className={`inline-flex p-4 rounded-full bg-secondary mb-4 ${color}`}
      >
        <Icon className="w-8 h-8" />
      </motion.div>

      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{message}</p>

      {onRetry && (
        <Button variant="glow" size="sm" onClick={onRetry}>
          Încearcă din nou
        </Button>
      )}
    </motion.div>
  );
}
