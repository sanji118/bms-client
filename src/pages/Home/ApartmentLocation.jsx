import { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ApartmentLocation = () => {
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/apartments')
      .then(res => setApartments(res.data))
      .catch(err => console.error('Failed to fetch:', err));
  }, []);

  const center = [23.8103, 90.4125]; // Dhaka

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-6">Apartment Locations Map</h2>

      <MapContainer center={center} zoom={12} scrollWheelZoom={false} className="h-[500px] w-full rounded-lg shadow">
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {apartments.map((apt, idx) => (
          apt.location?.lat && apt.location?.lng && (
            <Marker key={idx} position={[apt.location.lat, apt.location.lng]}>
              <Popup>
                Block {apt.block_name}, Apt {apt.apartment_no}<br />
                {apt.location.address}
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};

export default ApartmentLocation;
