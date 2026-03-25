import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// ── Custom marker icons ──
function svgIcon(color, label = '') {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="32" height="48">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="${color}" stroke="#fff" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="5" fill="#fff"/>
      ${label ? `<text x="12" y="15" text-anchor="middle" fill="${color}" font-size="8" font-weight="bold">${label}</text>` : ''}
    </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [32, 48],
    iconAnchor: [16, 48],
    popupAnchor: [0, -48],
  });
}

function userIcon() {
  const html = `
    <div style="position:relative;width:24px;height:24px;">
      <div style="position:absolute;top:50%;left:50%;width:24px;height:24px;transform:translate(-50%,-50%);background:rgba(59,130,246,0.25);border-radius:50%;animation:pulse-ring 1.5s ease-out infinite;"></div>
      <div style="position:absolute;top:50%;left:50%;width:14px;height:14px;transform:translate(-50%,-50%);background:#3b82f6;border:3px solid #fff;border-radius:50%;box-shadow:0 0 6px rgba(59,130,246,0.6);"></div>
    </div>
    <style>@keyframes pulse-ring{0%{transform:translate(-50%,-50%) scale(1);opacity:1}100%{transform:translate(-50%,-50%) scale(2.5);opacity:0}}</style>`;
  return L.divIcon({
    html,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -16],
  });
}

const PICKUP_ICON = svgIcon('#22c55e', 'P');
const DELIVERY_ICON = svgIcon('#ef4444', 'D');
const VOLUNTEER_ICON = userIcon();

// ── Route drawing component ──
function RoutingControl({ pickup, delivery }) {
  const map = useMap();
  const routingRef = useRef(null);

  useEffect(() => {
    if (!pickup || !delivery || !map) return;

    // Clean up existing
    if (routingRef.current) {
      try { map.removeControl(routingRef.current); } catch (e) { /* ignore */ }
    }

    const control = L.Routing.control({
      waypoints: [
        L.latLng(pickup[0], pickup[1]),
        L.latLng(delivery[0], delivery[1]),
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      show: false,          // hide text directions
      createMarker: () => null, // we draw our own markers
      lineOptions: {
        styles: [
          { color: '#6366f1', weight: 5, opacity: 0.8 },
          { color: '#a5b4fc', weight: 3, opacity: 0.5 },
        ],
        addWaypoints: false,
      },
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        profile: 'driving',
      }),
    }).addTo(map);

    routingRef.current = control;

    return () => {
      if (routingRef.current) {
        try { map.removeControl(routingRef.current); } catch (e) { /* ignore */ }
      }
    };
  }, [pickup, delivery, map]);

  return null;
}

// ── Auto-fit bounds component ──
function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length >= 2) {
      const bounds = L.latLngBounds(points.map((p) => L.latLng(p[0], p[1])));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [points, map]);
  return null;
}

/**
 * RouteMap — Shows pickup + delivery markers with driving route between them.
 * Props:
 *   pickup:     { lat, lng, label, address }
 *   delivery:   { lat, lng, label, address }
 *   volunteer:  { lat, lng } (optional, current volunteer position)
 *   className:  extra Tailwind classes
 */
export default function RouteMap({
  pickup,
  delivery,
  volunteer,
  className = '',
}) {
  if (!pickup?.lat || !pickup?.lng) return null;

  const pickupPos = [pickup.lat, pickup.lng];
  const deliveryPos = delivery?.lat && delivery?.lng ? [delivery.lat, delivery.lng] : null;
  const volunteerPos = volunteer?.lat && volunteer?.lng ? [volunteer.lat, volunteer.lng] : null;

  const center = pickupPos;
  const fitPoints = [pickupPos];
  if (deliveryPos) fitPoints.push(deliveryPos);
  if (volunteerPos) fitPoints.push(volunteerPos);

  // Google Maps navigation URL
  const googleMapsUrl = deliveryPos
    ? `https://www.google.com/maps/dir/?api=1&origin=${pickup.lat},${pickup.lng}&destination=${delivery.lat},${delivery.lng}&travelmode=driving`
    : `https://www.google.com/maps/search/?api=1&query=${pickup.lat},${pickup.lng}`;

  return (
    <div className={`relative ${className}`}>
      <div className="rounded-xl overflow-hidden border border-dark-700/50 h-full">
        <MapContainer center={center} zoom={13} className="w-full h-full" style={{ minHeight: '350px' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          <FitBounds points={fitPoints} />

          {/* Route line */}
          {deliveryPos && <RoutingControl pickup={pickupPos} delivery={deliveryPos} />}

          {/* Pickup Marker */}
          <Marker position={pickupPos} icon={PICKUP_ICON} zIndexOffset={500}>
            <Popup>
              <div style={{ minWidth: '170px', fontSize: '13px', lineHeight: '1.6' }}>
                <strong style={{ color: '#22c55e' }}>📦 Pickup Location</strong><br />
                {pickup.label && <><b>{pickup.label}</b><br /></>}
                {pickup.address && <span style={{ color: '#666' }}>{pickup.address}</span>}
                {!pickup.address && (
                  <span style={{ color: '#999', fontSize: '11px' }}>
                    {pickup.lat.toFixed(5)}, {pickup.lng.toFixed(5)}
                  </span>
                )}
              </div>
            </Popup>
          </Marker>

          {/* Delivery Marker */}
          {deliveryPos && (
            <Marker position={deliveryPos} icon={DELIVERY_ICON} zIndexOffset={500}>
              <Popup>
                <div style={{ minWidth: '170px', fontSize: '13px', lineHeight: '1.6' }}>
                  <strong style={{ color: '#ef4444' }}>🏠 Delivery Location</strong><br />
                  {delivery.label && <><b>{delivery.label}</b><br /></>}
                  {delivery.address && <span style={{ color: '#666' }}>{delivery.address}</span>}
                  {!delivery.address && (
                    <span style={{ color: '#999', fontSize: '11px' }}>
                      {delivery.lat.toFixed(5)}, {delivery.lng.toFixed(5)}
                    </span>
                  )}
                </div>
              </Popup>
            </Marker>
          )}

          {/* Volunteer Marker */}
          {volunteerPos && (
            <Marker position={volunteerPos} icon={VOLUNTEER_ICON} zIndexOffset={1000}>
              <Popup>
                <div style={{ minWidth: '120px', fontSize: '13px', textAlign: 'center' }}>
                  <strong style={{ color: '#3b82f6' }}>📍 You are here</strong>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Legend + Google Maps Button Overlay */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-[1000] pointer-events-none">
        {/* Legend */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg pointer-events-auto text-xs space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>
            <span className="text-gray-700">Pickup</span>
          </div>
          {deliveryPos && (
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
              <span className="text-gray-700">Delivery</span>
            </div>
          )}
        </div>

        {/* Google Maps button */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-3 py-2 rounded-lg shadow-lg hover:bg-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Open in Google Maps
        </a>
      </div>
    </div>
  );
}
