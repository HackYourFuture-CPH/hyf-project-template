"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const redIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png', 
  iconSize: [25, 41],  
  iconAnchor: [12, 41],  
  popupAnchor: [0, -41],  
});

const OurLocation = () => {
  const addressCoordinates = [55.680, 12.603]; 

  useEffect(() => {
    const map = L.map("map", {
      attributionControl: false, 
    }).setView(addressCoordinates, 16);  

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', 
    }).addTo(map);

        L.marker(addressCoordinates, { icon: redIcon })
      .addTo(map)
      .bindPopup("<b>Our Office Location</b><br/>Danneskiold-Samsøes Allé 41, Copenhagen") 
      .openPopup();

    return () => map.remove();
  }, []);

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold text-gray-800 mb-4">Visit Us</h1>
      <p className="text-center text-gray-600 mb-6">We are located at Danneskiold-Samsøes Allé 41 - Copenhagen.</p>
      <div
        id="map"
        style={{
          height: "400px",
          width: "100%",   
        }}
      ></div>
    </div>
  );
};

export default OurLocation;



