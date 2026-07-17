import React from 'react';
import { FaMapMarkerAlt, FaWhatsapp, FaInstagram, FaClock } from 'react-icons/fa';
import { IoMdMail } from 'react-icons/io'; 

const ContactInfo = ({ contactInfo, schedule }: { contactInfo: any; schedule: any }) => {
  return (
    <div className="min-h-[300px] flex flex-col justify-center sm:justify-start">
      <div className="space-y-8">
        {/* Información de Contacto */}
        <div className="con-info-item">
          <h3 className="text-lg font-bold text-yellow-400 mb-3 uppercase tracking-wide">
            {contactInfo.title}
          </h3>

          <div className="space-y-3">
            {/* Dirección */}
            <div className="flex items-center space-x-2">
              <FaMapMarkerAlt className="text-yellow-400 text-lg flex-shrink-0" />
              <p className="text-white text-base">{contactInfo.address}</p>
            </div>

            {/* WhatsApp */}
            <div className="flex items-center space-x-2">
              <FaWhatsapp className="text-yellow-400 text-lg flex-shrink-0" />
              <a
                href={contactInfo.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-base transition-colors duration-300 hover:text-yellow-400 focus:text-yellow-400 active:text-yellow-400"
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
                className="text-white text-base transition-colors duration-300 hover:text-yellow-400 focus:text-yellow-400 active:text-yellow-400"
              >
                {contactInfo.instagram.text}
              </a>
            </div>

            <div className="flex items-center space-x-2">
              <IoMdMail className="text-yellow-400 text-lg flex-shrink-0" />
              <span className="text-white text-base">{contactInfo.email.text}</span>
            </div>
          </div>
        </div>

        {/* Horario de Atención */}
        <div className="con-info-item">
          <h3 className="text-lg font-bold text-yellow-400 mb-3 uppercase tracking-wide">
            {schedule.title}
          </h3>

          <div className="flex items-start space-x-2">
            <FaClock className="text-yellow-400 text-lg flex-shrink-0 mt-1" />
            <p className="text-white text-base">{schedule.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;