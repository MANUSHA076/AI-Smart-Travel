"use client";

import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapProps {
  routeData: [number, number][] | null;
  travelMode?: string;
  height?: string;
}

export default function ReusableMap({ 
  routeData, 
  travelMode = 'car', 
  height = "550px" 
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const startMarkerRef = useRef<maplibregl.Marker | null>(null);
  const endMarkerRef = useRef<maplibregl.Marker | null>(null);

  const getVehicleIcon = (mode: string) => {
    switch (mode) {
      case 'bus': return '🚌';
      case 'train': return '🚂';
      case 'walk': return '🚶';
      case 'bike': return '🚴';
      default: return '🚗';
    }
  };

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    // MapTiler Key එක පාවිච්චි කරලා ලස්සන Style එකක් ගමු
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
    if (!map || !routeData || routeData.length === 0) return;

    startMarkerRef.current?.remove();
    endMarkerRef.current?.remove();

    // 🚩 Start Marker (Point A)
    const startElement = document.createElement('div');
    startElement.className = 'flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold border-2 border-white shadow-lg';
    startElement.innerHTML = 'A';
    startMarkerRef.current = new maplibregl.Marker({ element: startElement })
      .setLngLat(routeData[0])
      .addTo(map);

    // 🚗 Vehicle Marker (Point B)
    const endElement = document.createElement('div');
    endElement.className = 'text-4xl filter drop-shadow-md -translate-y-2 cursor-pointer';
    endElement.innerHTML = getVehicleIcon(travelMode);
    endMarkerRef.current = new maplibregl.Marker({ element: endElement })
      .setLngLat(routeData[routeData.length - 1])
      .addTo(map);

    const updateLayer = () => {
      if (map.getSource('route')) {
        (map.getSource('route') as maplibregl.GeoJSONSource).setData({
          'type': 'Feature',
          'properties': {}, // TypeScript fix
          'geometry': {
            'type': 'LineString',
            'coordinates': routeData
          }
        });
      } else {
        map.addSource('route', {
          'type': 'geojson',
          'data': {
            'type': 'Feature',
            'properties': {}, // TypeScript fix
            'geometry': {
              'type': 'LineString',
              'coordinates': routeData
            }
          }
        });

        map.addLayer({
          'id': 'route',
          'type': 'line',
          'source': 'route',
          'layout': { 'line-join': 'round', 'line-cap': 'round' },
          'paint': { 
            'line-color': '#ef4444', 
            'line-width': 6,
            'line-opacity': 0.8 
          }
        });
      }

      const bounds = routeData.reduce((acc, coord) => acc.extend(coord as [number, number]), 
        new maplibregl.LngLatBounds(routeData[0], routeData[0]));
      map.fitBounds(bounds, { padding: 80 });
    };

    if (map.isStyleLoaded()) {
      updateLayer();
    } else {
      map.once('style.load', updateLayer);
    }

  }, [routeData, travelMode]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border shadow-xl bg-slate-50" style={{ height }}>
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
}