import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  address?: string | null;
}

export function MapView({ latitude, longitude, accuracy, address }: MapViewProps) {
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [marker, setMarker] = useState<L.Marker | null>(null);
  const [accuracyCircle, setAccuracyCircle] = useState<L.Circle | null>(null);

  const position = useMemo(
    (): L.LatLngExpression => [latitude, longitude],
    [latitude, longitude]
  );

  // Create custom pulse icon
  const pulseIcon = useMemo(() => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div class="marker-pulse"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer || map) return;

    const leafletMap = L.map(mapContainer, {
      center: position,
      zoom: 16,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(leafletMap);

    // Add marker
    const newMarker = L.marker(position, { icon: pulseIcon })
      .addTo(leafletMap)
      .bindPopup(
        `<div class="text-center p-1">
          <p class="font-semibold text-sm mb-1">📍 Ești aici</p>
          <p class="text-xs opacity-80">${latitude.toFixed(6)}°, ${longitude.toFixed(6)}°</p>
          ${address ? `<p class="text-xs opacity-70 mt-1 max-w-[200px]">${address}</p>` : ''}
        </div>`
      );

    setMarker(newMarker);
    setMap(leafletMap);

    return () => {
      leafletMap.remove();
    };
  }, [mapContainer]);

  // Update map position
  useEffect(() => {
    if (!map) return;

    map.flyTo(position, map.getZoom(), {
      duration: 1.5,
    });

    // Update marker position
    if (marker) {
      marker.setLatLng(position);
      marker.setPopupContent(
        `<div class="text-center p-1">
          <p class="font-semibold text-sm mb-1">📍 Ești aici</p>
          <p class="text-xs opacity-80">${latitude.toFixed(6)}°, ${longitude.toFixed(6)}°</p>
          ${address ? `<p class="text-xs opacity-70 mt-1 max-w-[200px]">${address}</p>` : ''}
        </div>`
      );
    }
  }, [latitude, longitude, address, map, marker, position]);

  // Update accuracy circle
  useEffect(() => {
    if (!map) return;

    // Remove old circle
    if (accuracyCircle) {
      accuracyCircle.remove();
    }

    // Add new circle if accuracy is available
    if (accuracy) {
      const circle = L.circle(position, {
        radius: accuracy,
        color: 'hsl(174, 80%, 45%)',
        fillColor: 'hsl(174, 80%, 45%)',
        fillOpacity: 0.1,
        weight: 2,
      }).addTo(map);
      setAccuracyCircle(circle);
    }
  }, [accuracy, map, position]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-full rounded-2xl overflow-hidden border border-border/50"
    >
      <div
        ref={setMapContainer}
        className="w-full h-full"
        style={{ minHeight: '300px' }}
      />

      {/* Overlay gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background/80 to-transparent pointer-events-none z-[1000]" />
    </motion.div>
  );
}
