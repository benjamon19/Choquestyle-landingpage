// MapComponent.jsx
import React from 'react';
import { FaMapMarkerAlt, FaExternalLinkAlt } from 'react-icons/fa';

const MapComponent = ({ location }) => {
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address + ', ' + location.city)}`;

  return (
    <div 
      className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700 w-full lg:aspect-[4/3] aspect-[16/10]"
      style={{ 
        // Desktop: mantiene tamaño controlado
        // Móvil: se hace responsive automáticamente
        maxWidth: '420px'
      }}
    >
      <div className="relative w-full h-full">
        {/* Mapa embebido de Google Maps */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.123456789!2d-68.933333!3d-22.466667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDI4JzAwLjAiUyA2OMKwNTYnMDAuMCJX!5e0!3m2!1ses!2scl!4v1234567890123!5m2!1ses!2scl"
          width="100%"
          height="100%"
          style={{ 
            border: 'none',
            display: 'block',
            margin: 0,
            padding: 0
          }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación - Vicuña Mackenna 2320, Calama, Chile"
        />
        
        {/* Overlay con información */}
        <div className="absolute top-2 left-2 bg-black/90 backdrop-blur-sm text-white p-2.5 rounded-lg shadow-lg max-w-[280px] z-10">
          <div className="flex items-start space-x-2">
            <FaMapMarkerAlt className="text-yellow-400 text-sm mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-bold text-xs text-yellow-400 mb-1 leading-tight">{location.address}</p>
              <p className="text-xs text-gray-300 mb-2 leading-tight">{location.city}</p>
              <a
                href={googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 bg-yellow-400 text-black px-2 py-0.5 rounded text-xs font-semibold hover:bg-yellow-300 transition-colors duration-200"
              >
                <span>Ver mapa</span>
                <FaExternalLinkAlt className="text-xs" />
              </a>
            </div>
          </div>
        </div>

        {/* Marcador visual */}
        <div className="absolute bottom-2 right-2 bg-yellow-400 text-black p-1.5 rounded-full shadow-lg z-10">
          <FaMapMarkerAlt className="text-sm" />
        </div>
      </div>
    </div>
  );
};

export default MapComponent;