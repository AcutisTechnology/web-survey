import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  data?: {
    leaders?: number;
    supporters?: number;
  };
}

interface InteractiveMapProps {
  locations: MapLocation[];
  onLocationClick?: (location: MapLocation) => void;
}

// Ensure default marker icons load correctly in Vite
// Using CDN URLs avoids asset path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const InteractiveMap = ({ locations, onLocationClick }: InteractiveMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize map once
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    // Default center: João Pessoa, PB
    const defaultCenter: L.LatLngExpression = [-7.1195, -34.8450];

    const map = L.map(containerRef.current, {
      center: defaultCenter,
      zoom: 10,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);

    mapRef.current = map;
    markersLayerRef.current = markersLayer;

    return () => {
      markersLayer.clearLayers();
      map.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  // Update markers when locations change
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    const layer = markersLayerRef.current;
    layer.clearLayers();

    locations.forEach((location) => {
      const marker = L.marker([location.lat, location.lng]);

      const popupHtml = `
        <div style="padding:8px">
          <h3 style="font-weight:700;margin-bottom:8px">${location.name}</h3>
          ${location.data ? `
            <div style="font-size:14px">
              <p><strong>Lideranças:</strong> ${location.data.leaders ?? 0}</p>
              <p><strong>População com apoio:</strong> ${(location.data.supporters ?? 0).toLocaleString('pt-BR')}</p>
            </div>
          ` : ''}
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => onLocationClick?.(location));
      marker.addTo(layer);
    });

    // If we have at least one location, fit bounds nicely
    if (locations.length > 0) {
      const bounds = L.latLngBounds(
        locations.map((l) => [l.lat, l.lng] as [number, number])
      );
      // Handle identical points by padding
      if (bounds.isValid()) {
        mapRef.current.fitBounds(bounds.pad(0.2));
      }
    }
  }, [locations, onLocationClick]);

  return (
    <div
      ref={containerRef}
      style={{ height: '100%', width: '100%', borderRadius: '8px' }}
      aria-label="Mapa interativo com marcadores de cidades"
      role="region"
    />
  );
};

export default InteractiveMap;
