import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix default marker icon issue with webpack/vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function createIcon(color) {
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="28" height="42">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="${color}" stroke="#fff" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="5" fill="#fff"/>
    </svg>`;
  return L.divIcon({
    html: svgIcon,
    className: '',
    iconSize: [28, 42],
    iconAnchor: [14, 42],
    popupAnchor: [0, -42],
  });
}

// "You are here" pulsing blue icon
function createUserIcon() {
  const svgIcon = `
    <div style="position:relative;width:24px;height:24px;">
      <div style="
        position:absolute;
        top:50%;left:50%;
        width:24px;height:24px;
        transform:translate(-50%,-50%);
        background:rgba(59,130,246,0.25);
        border-radius:50%;
        animation:pulse-ring 1.5s ease-out infinite;
      "></div>
      <div style="
        position:absolute;
        top:50%;left:50%;
        width:14px;height:14px;
        transform:translate(-50%,-50%);
        background:#3b82f6;
        border:3px solid #fff;
        border-radius:50%;
        box-shadow:0 0 6px rgba(59,130,246,0.6);
      "></div>
    </div>
    <style>
      @keyframes pulse-ring {
        0% { transform:translate(-50%,-50%) scale(1); opacity:1 }
        100% { transform:translate(-50%,-50%) scale(2.5); opacity:0 }
      }
    </style>`;
  return L.divIcon({
    html: svgIcon,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -16],
  });
}

// Marker color map
const ICONS = {
  donor: createIcon('#22c55e'),       // Green — Donations
  request: createIcon('#ef4444'),     // Red — NGO Requests
  volunteer: createIcon('#f97316'),   // Orange — Volunteers
  ngo: createIcon('#3b82f6'),         // Blue — NGOs
  user: createUserIcon(),             // Pulsing blue — User location
  default: createIcon('#94a3b8'),     // Gray
};

/**
 * Check if GeoJSON coordinates are valid.
 * GeoJSON stores as [longitude, latitude].
 * Returns false for [0,0] or NaN values.
 */
function isValidCoords(coords) {
  if (!coords || !Array.isArray(coords) || coords.length < 2) return false;
  const [lng, lat] = coords; // GeoJSON: [lng, lat]
  if (lng === 0 && lat === 0) return false;
  if (isNaN(lng) || isNaN(lat)) return false;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return false;
  return true;
}

/**
 * Convert GeoJSON [lng, lat] to Leaflet [lat, lng].
 * This is the ONLY place the swap should happen.
 */
function toLeaflet(coords) {
  return [coords[1], coords[0]]; // [lat, lng]
}

// Component to recenter map when position changes
function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], map.getZoom());
    }
  }, [lat, lng, map]);
  return null;
}

// Lucknow fallback
const FALLBACK = { lat: 26.8467, lng: 80.9462 };

export default function MapView({
  center = FALLBACK,
  zoom = 13,
  donations = [],
  requests = [],
  volunteers = [],
  className = '',
  userRole = null,
  userPosition = null,
  onAcceptPickup = null,
}) {
  const validCenter =
    center.lat && center.lng ? [center.lat, center.lng] : [FALLBACK.lat, FALLBACK.lng];

  return (
    <div className={`rounded-xl overflow-hidden border border-dark-700/50 ${className}`}>
      <MapContainer center={validCenter} zoom={zoom} className="w-full h-full" style={{ minHeight: '350px' }}>
        {/* CartoDB Positron tile layer for cleaner UI */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <RecenterMap lat={center.lat} lng={center.lng} />

        {/* ── "You are here" Marker ── */}
        {userPosition && userPosition.lat && userPosition.lng && (
          <Marker
            position={[userPosition.lat, userPosition.lng]}
            icon={ICONS.user}
            zIndexOffset={1000}
          >
            <Popup>
              <div style={{ minWidth: '140px', fontSize: '13px', textAlign: 'center' }}>
                <strong style={{ color: '#3b82f6' }}>📍 You are here</strong><br/>
                <span style={{ fontSize: '11px', color: '#666' }}>
                  Lat: {userPosition.lat.toFixed(6)}<br/>
                  Lng: {userPosition.lng.toFixed(6)}
                </span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* ── Donation Markers (Green) ── */}
        {donations.map((d, i) => {
          const coords = d.pickupLocation?.coordinates;
          if (!isValidCoords(coords)) return null;
          const leafletPos = toLeaflet(coords);
          const donorInfo = d.donor || d.donorId;
          return (
            <Marker key={`don-${d._id || i}`} position={leafletPos} icon={ICONS.donor}>
              <Popup>
                <div style={{ minWidth: '180px', fontSize: '13px', lineHeight: '1.6' }}>
                  <strong style={{ fontSize: '14px' }}>{d.title || 'Donation'}</strong><br/>
                  <span style={{ color: '#22c55e' }}>● Donor</span><br/>
                  <b>Food:</b> {d.quantity || 'N/A'}<br/>
                  <b>Status:</b> <span style={{ textTransform: 'capitalize' }}>{d.status}</span><br/>
                  {donorInfo?.name && <><b>Contact:</b> {donorInfo.name}<br/></>}
                  {donorInfo?.phone && <><b>Phone:</b> {donorInfo.phone}<br/></>}
                  {d.deliveryLocation && d.deliveryLocation.address && (
                    <><b>Delivery:</b> {d.deliveryLocation.address}<br/></>
                  )}
                  {userRole === 'volunteer' && d.status === 'pending' && onAcceptPickup && (
                    <button
                      onClick={() => onAcceptPickup(d._id)}
                      style={{
                        marginTop: '8px',
                        width: '100%',
                        padding: '6px 0',
                        background: '#22c55e',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      Accept Pickup
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* ── Request Markers (Red) ── */}
        {requests.map((r, i) => {
          const coords = r.location?.coordinates;
          if (!isValidCoords(coords)) return null;
          const leafletPos = toLeaflet(coords);
          const ngoInfo = r.ngo || r.ngoId;
          return (
            <Marker key={`req-${r._id || i}`} position={leafletPos} icon={ICONS.request}>
              <Popup>
                <div style={{ minWidth: '180px', fontSize: '13px', lineHeight: '1.6' }}>
                  <strong style={{ fontSize: '14px' }}>{r.foodNeeded || 'Food Request'}</strong><br/>
                  <span style={{ color: '#ef4444' }}>● NGO Request</span><br/>
                  <b>Urgency:</b> <span style={{ textTransform: 'capitalize' }}>{r.urgency || 'Medium'}</span><br/>
                  <b>Status:</b> <span style={{ textTransform: 'capitalize' }}>{r.status}</span><br/>
                  {ngoInfo?.name && <><b>NGO:</b> {ngoInfo.name}<br/></>}
                  {ngoInfo?.phone && <><b>Phone:</b> {ngoInfo.phone}<br/></>}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* ── Volunteer Markers (Orange) ── */}
        {volunteers.map((v, i) => {
          const coords = v.liveLocation?.coordinates || v.location?.coordinates;
          if (!isValidCoords(coords)) return null;
          const leafletPos = toLeaflet(coords);
          return (
            <Marker key={`vol-${v._id || i}`} position={leafletPos} icon={ICONS.volunteer}>
              <Popup>
                <div style={{ minWidth: '180px', fontSize: '13px', lineHeight: '1.6' }}>
                  <strong style={{ fontSize: '14px' }}>{v.name || 'Volunteer'}</strong><br/>
                  <span style={{ color: '#f97316' }}>● Volunteer</span><br/>
                  {v.phone && <><b>Phone:</b> {v.phone}<br/></>}
                  {v.email && <><b>Email:</b> {v.email}<br/></>}
                  {v.currentStatus && <><b>Status:</b> {v.currentStatus}</>}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
