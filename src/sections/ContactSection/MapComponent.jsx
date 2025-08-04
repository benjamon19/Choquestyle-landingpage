// MapComponent.jsx
import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa'; // FaMapMarkerAlt se puede dejar o quitar si no se usa en otro lado

const MapComponent = ({ location }) => {
  // Enlace directo a la ubicación personalizada en Google Maps (para el iframe)
  const googleMapsEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.123456789!2d-68.9325788!3d-22.4633079!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x96ac091becf5bbef:0xa9022ec805e48b21!2sAcademia%20Choquestyle!5e0!3m2!1ses!2scl!4v1700000000000!5m2!1ses!2scl";

  return (
    <div 
      className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700 w-full lg:aspect-[4/3] aspect-[16/10]"
      style={{ 
        maxWidth: '420px'
      }}
    >
      <div className="relative w-full h-full">
        {/* Mapa embebido de Google Maps */}
        <iframe
          src={googleMapsEmbedUrl}
          width="100%"
          height="100%"
          style={{ 
            border: 'none',
            display: 'block',
            margin: 0,
            padding: 0
          }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación - Academia Choquestyle, Calama, Chile"
        />
      </div>
    </div>
  );
};

export default MapComponent;