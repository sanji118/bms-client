import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ApartmentLocation = () => {
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/apartments')
      .then(res => setApartments(res.data))
      .catch(err => {
        //console.error(err)
        });
  }, []);

  const customIcon = new Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [30, 30],
  });

  const center = [23.8103, 90.4125];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-yellow-500 mb-2">Apartment Location</h2>
          <p className="text-gray-600 text-lg">Find our apartments across Dhaka city with convenient access to transportation and amenities.</p>
        </div>

        {/* Map Card */}
        <div className="rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="relative z-0 h-[500px] w-11/12 mx-auto">
            <MapContainer
              center={center}
              zoom={12}
              scrollWheelZoom={true}
              className="h-full w-full z-0"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {apartments.map((apartment, index) => (
                <Marker
                  key={index}
                  position={apartment.location}
                  icon={customIcon}
                >
                  <Popup>
                    <div className="text-sm">
                      <p className="font-bold">Block {apartment.block_name} - Apt {apartment.apartment_no}</p>
                      <p>Floor: {apartment.floor_no}</p>
                      <p>Rent: ${apartment.rent}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApartmentLocation;
