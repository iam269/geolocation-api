import { motion } from 'framer-motion';
import { MapPin, Navigation, Compass, ExternalLink, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface LocationInfoProps {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  address?: string | null;
  addressLoading?: boolean;
}

export function LocationInfo({
  latitude,
  longitude,
  accuracy,
  address,
  addressLoading,
}: LocationInfoProps) {
  const [copied, setCopied] = useState(false);

  const formatCoordinate = (value: number, decimals: number = 6) => {
    return value.toFixed(decimals);
  };

  const handleCopyCoordinates = async () => {
    const text = `${formatCoordinate(latitude)}, ${formatCoordinate(longitude)}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenInGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-6 space-y-4"
    >
      {/* Coordinates */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-primary">
          <MapPin className="w-5 h-5" />
          <h3 className="font-semibold">Coordonate</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Latitudine</p>
            <p className="text-lg font-mono font-semibold text-foreground">
              {formatCoordinate(latitude)}°
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Longitudine</p>
            <p className="text-lg font-mono font-semibold text-foreground">
              {formatCoordinate(longitude)}°
            </p>
          </div>
        </div>

        {accuracy && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Compass className="w-4 h-4" />
            <span>Precizie: ±{accuracy.toFixed(0)}m</span>
          </div>
        )}
      </div>

      {/* Address */}
      {(address || addressLoading) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="pt-3 border-t border-border"
        >
          <div className="flex items-center gap-2 text-accent mb-2">
            <Navigation className="w-4 h-4" />
            <h4 className="font-medium text-sm">Adresă</h4>
          </div>
          {addressLoading ? (
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed">{address}</p>
          )}
        </motion.div>
      )}

      {/* Actions */}
      <div className="pt-3 border-t border-border flex flex-wrap gap-2">
        <Button
          variant="glass"
          size="sm"
          onClick={handleCopyCoordinates}
          className="flex-1 min-w-[120px]"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-success" />
              Copiat!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copiază
            </>
          )}
        </Button>

        <Button
          variant="glass"
          size="sm"
          onClick={handleOpenInGoogleMaps}
          className="flex-1 min-w-[120px]"
        >
          <ExternalLink className="w-4 h-4" />
          Google Maps
        </Button>
      </div>
    </motion.div>
  );
}
