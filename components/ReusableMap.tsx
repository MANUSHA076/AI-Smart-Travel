"use client";

import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface SafetyPoint {
  coordinate: [number, number];
  label?: string;
  description?: string;
  condition?: string;
  roadStatus?: string;
  temperature?: number | null;
  riskLevel?: 'low' | 'medium' | 'high';
}

interface MapProps {
  multiRoutes?: { points: [number, number][]; color: string; distance?: string }[];
  travelMode?: string;
  height?: string;
  safetyPoints?: SafetyPoint[];
}

export default function ReusableMap({ 
  multiRoutes = [], 
  travelMode = 'car', 
  height = "650px",
  safetyPoints = []
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const startMarkerRef = useRef<maplibregl.Marker | null>(null);
  const endMarkerRef = useRef<maplibregl.Marker | null>(null);
  const safetyMarkerRefs = useRef<maplibregl.Marker[]>([]);

  const getVehicleIcon = (mode: string) => {
    switch (mode) {
      case 'bus': return '🚌';
      case 'train': return '🚂';
      case 'walk': return '🚶';
      case 'bike': return '🚴';
      default: return '🚗';
    }
  };

  const calculateDistanceKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const styleUrl = `https://api.maptiler.com/maps/streets-v2/style.json?key=eBva6MXA6Q9PCXdaCpD2`;

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl, 
      center: [80.7718, 7.8731], 
      zoom: 7,
      attributionControl: false,
    });

    mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    startMarkerRef.current?.remove();
    endMarkerRef.current?.remove();
    safetyMarkerRefs.current.forEach((marker) => marker.remove());
    safetyMarkerRefs.current = [];

    const clearRoutes = () => {
      for (let i = 0; i < 10; i++) {
        if (map.getLayer(`route-${i}`)) map.removeLayer(`route-${i}`);
        if (map.getSource(`route-${i}`)) map.removeSource(`route-${i}`);
      }
    };

    if (!multiRoutes || multiRoutes.length === 0) {
      clearRoutes();
      return;
    }

    // 🚩 Start Marker
    const startEl = document.createElement('div');
    startEl.className = 'flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold border-2 border-white shadow-lg';
    startEl.innerHTML = 'A';
    startMarkerRef.current = new maplibregl.Marker({ element: startEl })
      .setLngLat(multiRoutes[0].points[0])
      .addTo(map);

    // 🚗 End Marker
    const lastRoute = multiRoutes[0].points;
    const endEl = document.createElement('div');
    endEl.className = 'text-4xl filter drop-shadow-md -translate-y-2';
    endEl.innerHTML = getVehicleIcon(travelMode);
    endMarkerRef.current = new maplibregl.Marker({ element: endEl })
      .setLngLat(lastRoute[lastRoute.length - 1])
      .addTo(map);

    // ⚠️ Safety Points (Low, Medium, High)
    safetyPoints.forEach((point) => {
      const markerElement = document.createElement('div');
      
      // පාට තීරණය කිරීම
      const riskColor = 
        point.riskLevel === 'high' ? 'bg-red-600' : 
        point.riskLevel === 'medium' ? 'bg-orange-500' : 'bg-emerald-500';

      markerElement.className = `flex flex-col items-center justify-center w-7 h-7 rounded-full border-2 border-white shadow-lg text-white cursor-pointer ${riskColor}`;
      markerElement.innerHTML = `<span style="font-size: 12px;">${point.riskLevel === 'high' ? '⚠️' : 'i'}</span>`;

      // Marker එකට ලඟින් යන routes හොයනවා (1.5km radius)
      const affectedRouteNumbers = multiRoutes
        .map((route, index) => {
          const touchesRoute = route.points.some(([lng, lat]) => {
            const distanceKm = calculateDistanceKm(point.coordinate[1], point.coordinate[0], lat, lng);
            return distanceKm < 1.5;
          });
          return touchesRoute ? index + 1 : null;
        })
        .filter((value): value is number => value !== null);

      const routeLabel =
        affectedRouteNumbers.length > 0
          ? affectedRouteNumbers.map((routeNumber) => `Route ${routeNumber}`).join(', ')
          : 'No direct route overlap';

      const riskNature =
        point.description ||
        point.condition ||
        point.roadStatus ||
        'No specific hazard details reported.';

      // Popup එක (Click කළාම පේන විස්තරය)
      const popup = new maplibregl.Popup({ offset: 15 }).setHTML(`
        <div style="padding: 8px; font-family: sans-serif; min-width: 150px;">
          <strong style="display: block; font-size: 14px; color: #333;">${point.label || 'Location'}</strong>
          <div style="margin-top: 4px; font-size: 11px; font-weight: bold; color: ${point.riskLevel === 'high' ? 'red' : 'orange'};">
            ${point.riskLevel?.toUpperCase()} RISK
          </div>
          <div style="margin-top: 6px; font-size: 12px; color: #1f2937;">
            <strong>Affected Route:</strong> ${routeLabel}
          </div>
          <p style="margin-top: 6px; font-size: 12px; color: #666; line-height: 1.4;">
            <strong>Risk Nature:</strong> ${riskNature}
          </p>
        </div>
      `);

      const marker = new maplibregl.Marker({ element: markerElement })
        .setLngLat(point.coordinate)
        .setPopup(popup)
        .addTo(map);
      
      safetyMarkerRefs.current.push(marker);
    });

    // 🛣️ Draw Multi Routes
    const drawRoutes = () => {
      clearRoutes();
      const bounds = new maplibregl.LngLatBounds();

      multiRoutes.forEach((route, index) => {
        const sourceId = `route-${index}`;
        map.addSource(sourceId, {
          'type': 'geojson',
          'data': { 'type': 'Feature', 'properties': {}, 'geometry': { 'type': 'LineString', 'coordinates': route.points } }
        });

        map.addLayer({
          'id': sourceId,
          'type': 'line',
          'source': sourceId,
          'layout': { 'line-join': 'round', 'line-cap': 'round' },
          'paint': { 
            // 💡 logic: රතු පාට ලැබෙන්නේ High risk කලාපයක් නිසා නම් පමණයි
            'line-color': route.color === 'red' ? '#dc2626' : '#16a34a', 
            'line-width': index === 0 ? 7 : 4,
            'line-opacity': 0.8 
          }
        });
        route.points.forEach(p => bounds.extend(p as [number, number]));
      });

      map.fitBounds(bounds, { padding: 80 });
    };

    if (map.loaded()) drawRoutes();
    else map.once('load', drawRoutes);

  }, [multiRoutes, travelMode, safetyPoints]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border shadow-xl bg-slate-50" style={{ height }}>
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
}