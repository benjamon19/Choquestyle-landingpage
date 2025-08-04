import React from 'react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { footerData } from './footerData';

const FooterBar = () => {
  const currentYear = new Date().getFullYear(); 

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'instagram':
        return <FaInstagram className="text-3xl" />;
      case 'whatsapp':
        return <FaWhatsapp className="text-3xl" />;
      default:
        return null;
    }
  };

  return (
    <footer className="relative">
      {/* Línea separadora */}
      <div className="w-full h-[3px]" style={{ backgroundColor: '#323233' }} />

      {/* Contenido del footer */}
      <div className="bg-black py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center gap-4">
            
            {/* Redes sociales */}
            <div className="flex items-center space-x-1">
              {footerData.socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-yellow-400 focus:text-yellow-400 active:text-yellow-400 transition-colors duration-300 p-4"
                  aria-label={social.name}
                >
                  {getIcon(social.icon)}
                </a>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-center">
              <p className="text-white text-sm">
                © {currentYear} {footerData.copyright.brand}. {footerData.copyright.text}. {footerData.copyright.location}.
              </p>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterBar;