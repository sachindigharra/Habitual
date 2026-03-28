import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Polyline, Marker, Circle, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Custom current location dot icon
const currentLocationIcon = L.divIcon({
  className: "",
  html: `<div style="
    width: 16px; height: 16px;
    background: hsl(152, 60%, 42%);
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 0 0 4px rgba(52,211,153,0.3);
  "></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

// Start flag icon
const startIcon = L.divIcon({
  className: "",
  html: `<div style="
    width: 12px; height: 12px;
    background: hsl(32, 95%, 55%);
    border: 2px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
})

function RecenterMap({ position }) {
  const map = useMap()
  useEffect(() => {
    if (position) map.panTo(position, { animate: true })
  }, [position, map])
  return null
}

function InitialLocation({ onLocation }) {
  const map = useMap()
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const latlng = [pos.coords.latitude, pos.coords.longitude]
        map.setView(latlng, 16)
        onLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy })
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }, [map, onLocation])
  return null
}

export default function RunMap({ route, isTracking }) {
  const [idleLocation, setIdleLocation] = useState(null)

  const positions = route.map((p) => [p.lat, p.lng])
  const currentPos = positions.length > 0 ? positions[positions.length - 1] : null
  const defaultCenter = idleLocation ? [idleLocation.lat, idleLocation.lng] : [20, 0]
  const center = currentPos ?? defaultCenter

  return (
    <div className="w-full h-72 rounded-2xl overflow-hidden border border-border/50">
      <MapContainer
        center={center}
        zoom={16}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="" />

        {/* Show current location when idle (not tracking) */}
        {!isTracking && idleLocation && (
          <>
            <Marker position={[idleLocation.lat, idleLocation.lng]} icon={currentLocationIcon} />
            <Circle
              center={[idleLocation.lat, idleLocation.lng]}
              radius={idleLocation.accuracy}
              pathOptions={{ color: "hsl(152, 60%, 42%)", fillColor: "hsl(152, 60%, 42%)", fillOpacity: 0.1, weight: 1 }}
            />
          </>
        )}

        {/* Route polyline while tracking */}
        {positions.length > 1 && (
          <Polyline positions={positions} color="hsl(152, 60%, 42%)" weight={4} opacity={0.9} />
        )}

        {/* Start point */}
        {positions.length > 0 && (
          <Marker position={positions[0]} icon={startIcon} />
        )}

        {/* Current position dot while tracking */}
        {currentPos && (
          <Marker position={currentPos} icon={currentLocationIcon} />
        )}

        {/* Auto-center on current position while tracking */}
        {currentPos && isTracking && <RecenterMap position={currentPos} />}

        {/* Get initial location when idle */}
        {!isTracking && <InitialLocation onLocation={setIdleLocation} />}
      </MapContainer>
    </div>
  )
}
