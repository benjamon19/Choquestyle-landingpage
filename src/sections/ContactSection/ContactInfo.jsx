// ContactInfo.jsx
import React from 'react';
import { FaMapMarkerAlt, FaWhatsapp, FaInstagram, FaClock } from 'react-icons/fa';

const ContactInfo = ({ contactInfo, schedule }) => {
  return (
    <div className="space-y-4">
      {/* Información de Contacto */}
      <div>
        <h3 className="text-lg font-bold text-yellow-400 mb-3 uppercase tracking-wide">
          {contactInfo.title}
        </h3>
        
        <div className="space-y-2">
          {/* Dirección */}
          <div className="flex items-start space-x-2">
            <FaMapMarkerAlt className="text-yellow-400 text-lg mt-0.5 flex-shrink-0" />
            <p className="text-white text-base">{contactInfo.address}</p>
          </div>
          
          {/* WhatsApp */}
          <div className="flex items-center space-x-2">
            <FaWhatsapp className="text-yellow-400 text-lg flex-shrink-0" />
            <a 
              href={contactInfo.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-base hover:text-yellow-400 transition-colors duration-300"
            >
              {contactInfo.whatsapp.text}
            </a>
          </div>
          
          {/* Instagram */}
          <div className="flex items-center space-x-2">
            <FaInstagram className="text-yellow-400 text-lg flex-shrink-0" />
            <a 
              href={contactInfo.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-base hover:text-yellow-400 transition-colors duration-300"
            >
              {contactInfo.instagram.text}
            </a>
          </div>
        </div>
      </div>
      
      {/* Horario de Atención */}
      <div>
        <h3 className="text-lg font-bold text-yellow-400 mb-3 uppercase tracking-wide">
          {schedule.title}
        </h3>
        
        <div className="flex items-start space-x-2">
          <FaClock className="text-yellow-400 text-lg mt-0.5 flex-shrink-0" />
          <p className="text-white text-base">{schedule.note}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;