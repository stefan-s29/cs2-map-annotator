/*
 * Copyright 2025 Stefan Schätz
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';
import {
  MapContainer,
  ImageOverlay,
  useMapEvents,
  Marker,
  Popup,
  LatLngBoundsExpression,
} from 'react-leaflet';
import L from 'leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPinIcon } from '@heroicons/react/24/solid';

import { useEffect, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const markerIcon = L.divIcon({
  html: renderToStaticMarkup(<MapPinIcon className="w-24 h-24 text-red-600" />),
  className: '',
  iconAnchor: [12, 24],
});

interface MarkerData {
  id: string;
  position: LatLngExpression;
  note?: string;
  videoUrl?: string;
}

const MapView: React.FC = () => {
  const [markers, setMarkers] = useState<MarkerData[]>(() => {
    const saved = localStorage.getItem('markers');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('markers', JSON.stringify(markers));
  }, [markers]);

  const [bounds, setBounds] = useState<L.LatLngBoundsExpression | null>(null);
  const [center, setCenter] = useState<[number, number] | null>(null);

  const imageUrl = '/maps/example_map.jpg';

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      const newBounds: LatLngBoundsExpression = [
        [0, 0],
        [height, width],
      ];

      setBounds(newBounds);
      setCenter([height / 2, width / 2]);
    };
  }, []);

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const newMarker: MarkerData = {
          id: crypto.randomUUID(),
          position: [e.latlng.lat, e.latlng.lng],
        };
        setMarkers((prev) => [...prev, newMarker]);
      },
    });
    return null;
  }

  if (!bounds || !center) return <p>Loading map…</p>;

  return (
    <MapContainer
      crs={L.CRS.Simple}
      bounds={bounds}
      center={center}
      maxBounds={bounds}
      zoomControl={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      dragging={false}
      style={{
        width: `${bounds[1][1]}px`,
        height: `${bounds[1][0]}px`,
        border: '1px solid #333',
      }}
    >
      <ImageOverlay url={imageUrl} bounds={bounds} />
      <MapClickHandler />
      {markers.map((m) => (
        <Marker key={m.id} position={m.position} icon={markerIcon}>
          <Popup>
            <div>
              <textarea
                placeholder="Add note..."
                defaultValue={m.note}
                onBlur={(e) =>
                  setMarkers((prev) =>
                    prev.map((mm) => (mm.id === m.id ? { ...mm, note: e.target.value } : mm)),
                  )
                }
              />
              <input
                placeholder="YouTube link..."
                defaultValue={m.videoUrl}
                onBlur={(e) =>
                  setMarkers((prev) =>
                    prev.map((mm) => (mm.id === m.id ? { ...mm, videoUrl: e.target.value } : mm)),
                  )
                }
              />
              {m.videoUrl && (
                <iframe
                  width="200"
                  height="113"
                  src={m.videoUrl.replace('watch?v=', 'embed/')}
                  allow="autoplay; encrypted-media"
                />
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
