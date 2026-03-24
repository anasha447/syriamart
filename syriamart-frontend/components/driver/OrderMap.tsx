"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's broken default icon in Next.js (SSR + webpack issue)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9/dist/images/marker-shadow.png",
});

// Amber delivery pin icon
const deliveryIcon = new L.Icon({
  iconUrl:      "https://unpkg.com/leaflet@1.9/dist/images/marker-icon.png",
  iconRetinaUrl:"https://unpkg.com/leaflet@1.9/dist/images/marker-icon-2x.png",
  shadowUrl:    "https://unpkg.com/leaflet@1.9/dist/images/marker-shadow.png",
  iconSize:     [25, 41],
  iconAnchor:   [12, 41],
  popupAnchor:  [1, -34],
  shadowSize:   [41, 41],
});

interface OrderMapProps {
  lat:       number;
  lng:       number;
  label?:    string;
  className?: string;
}

/**
 * Leaflet map showing the delivery destination.
 * Loaded only client-side via dynamic() with ssr:false.
 * Uses free OpenStreetMap tiles — no API key required.
 */
export function OrderMap({ lat, lng, label = "Delivery", className }: OrderMapProps) {
  return (
    <div
      className={`w-full h-48 rounded-2xl overflow-hidden border border-slate-700 ${className ?? ""}`}
      style={{ zIndex: 0 }} // prevent Leaflet from overlapping bottom nav
    >
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", background: "#0F172A" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
        />
        <Marker position={[lat, lng]} icon={deliveryIcon}>
          <Popup className="text-xs font-semibold">{label}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
