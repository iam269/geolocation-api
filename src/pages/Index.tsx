import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useReverseGeocode } from '@/hooks/useReverseGeocode';
import { Header } from '@/components/Header';
import { LocationButton } from '@/components/LocationButton';
import { LocationInfo } from '@/components/LocationInfo';
import { MapView } from '@/components/MapView';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';

const Index = () => {
  const [isWatching, setIsWatching] = useState(false);

  const {
    latitude,
    longitude,
    accuracy,
    loading,
    error,
    supported,
    getPosition,
    startWatching,
    stopWatching,
  } = useGeolocation();

  const { address, loading: addressLoading, getAddress } = useReverseGeocode();

  const hasLocation = latitude !== null && longitude !== null;

  // Fetch address when location changes
  useEffect(() => {
    if (hasLocation) {
      getAddress(latitude, longitude);
    }
  }, [latitude, longitude, hasLocation, getAddress]);

  const handleGetLocation = useCallback(() => {
    getPosition();
  }, [getPosition]);

  const handleToggleWatch = useCallback(() => {
    if (isWatching) {
      stopWatching();
      setIsWatching(false);
    } else {
      startWatching();
      setIsWatching(true);
    }
  }, [isWatching, startWatching, stopWatching]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* SEO */}
      <title>Locația Mea - Găsește-ți coordonatele GPS pe hartă</title>
      <meta
        name="description"
        content="Află locația ta exactă folosind GPS-ul dispozitivului. Vizualizează coordonatele pe hartă interactivă și descoperă adresa completă."
      />

      <div className="container mx-auto px-4 flex flex-col flex-1">
        <Header />

        <main className="flex-1 flex flex-col gap-6 pb-8">
          {/* Location Button - Always visible */}
          <LocationButton
            onClick={handleGetLocation}
            loading={loading && !hasLocation}
            hasLocation={hasLocation}
            isWatching={isWatching}
            onToggleWatch={handleToggleWatch}
          />

          <AnimatePresence mode="wait">
            {/* Loading state - only when first getting location */}
            {loading && !hasLocation && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex items-center justify-center"
              >
                <LoadingSpinner message="Se obține locația ta..." />
              </motion.div>
            )}

            {/* Error state */}
            {error && !hasLocation && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex items-center justify-center"
              >
                <ErrorMessage
                  error={error}
                  supported={supported}
                  onRetry={handleGetLocation}
                />
              </motion.div>
            )}

            {/* Success state - Map and Info */}
            {hasLocation && (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Map - Takes most space */}
                <div className="lg:col-span-2 min-h-[300px] md:min-h-[400px] lg:min-h-0">
                  <MapView
                    latitude={latitude}
                    longitude={longitude}
                    accuracy={accuracy}
                    address={address?.display_name}
                  />
                </div>

                {/* Location Info Card */}
                <div className="lg:col-span-1">
                  <LocationInfo
                    latitude={latitude}
                    longitude={longitude}
                    accuracy={accuracy}
                    address={address?.display_name}
                    addressLoading={addressLoading}
                  />

                  {/* Status indicator */}
                  {isWatching && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 glass-card p-4 flex items-center gap-3"
                    >
                      <div className="relative">
                        <div className="w-3 h-3 bg-success rounded-full" />
                        <div className="absolute inset-0 w-3 h-3 bg-success rounded-full animate-ping" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Urmărire live activă</p>
                        <p className="text-xs text-muted-foreground">
                          Locația se actualizează automat
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Initial state - Instructions */}
            {!loading && !error && !hasLocation && (
              <motion.div
                key="initial"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex items-center justify-center"
              >
                <div className="glass-card p-8 text-center max-w-md">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-6xl mb-4"
                  >
                    🗺️
                  </motion.div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Gata să începem?
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Apasă butonul de mai sus pentru a-ți afișa locația curentă pe hartă.
                    Vei fi întrebat să permiți accesul la locație.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="py-4 text-center text-xs text-muted-foreground border-t border-border/50">
          <p>
            &copy; {new Date().getFullYear()} Locația Mea. Toate drepturile rezervate.
            Acest site a fost creat de Ioniță Aurel-Mihai.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
