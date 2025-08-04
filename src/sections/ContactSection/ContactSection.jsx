// ContactSection.jsx
import React from 'react';
import { contactData } from './contactData';
import ContactInfo from './ContactInfo';
import MapComponent from './MapComponent';

const ContactSection = () => {
  return (
    <section 
      id="contacto"
      className="py-16 px-4"
      style={{ backgroundColor: '#121212' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Título Principal */}
        <div className="max-w-7xl mx-auto text-center">
          <h2
            className="text-4xl md:text-5xl uppercase leading-tight mb-16 font-bold tracking-wide"
            style={{
              fontFamily: "'Anton SC', 'Impact', 'Arial Black', sans-serif",
              letterSpacing: '0.05em',
              color: '#FFD600',
            }}
          >
            {contactData.title}
          </h2>
        </div>

        {/* Contenido Principal */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Información de Contacto */}
            <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
              <div className="w-full max-w-md lg:max-w-none">
                <ContactInfo 
                  contactInfo={contactData.contactInfo}
                  schedule={contactData.schedule}
                />
              </div>
            </div>

            {/* Mapa */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <MapComponent location={contactData.location} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
