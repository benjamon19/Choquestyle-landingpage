import React, { useState, useEffect, useRef } from 'react';
import GalleryCard from './GalleryCard';
import ImageLightbox from './ImageLightbox';
import { galleries } from './galleryData';

const GallerySection = () => {
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Detectar si es móvil
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="galeria"
      className="py-20 px-4 sm:px-6 lg:px-8 w-full bg-[#121212] relative"
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2
          className="text-4xl md:text-5xl uppercase leading-tight mb-6 font-bold tracking-wide"
          style={{
            fontFamily: "'Impact', 'Arial Black', sans-serif",
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            color: '#FFD600',
          }}
        >
          NUESTRA ACADEMIA EN ACCIÓN
        </h2>

        <p className="text-center text-gray-300 text-sm max-w-3xl mx-auto leading-relaxed mb-16">
          Más que una escuela, somos una familia. ¿Qué esperas para unirte?
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {galleries.map((gallery, index) => (
            <div 
              key={gallery.id}
              className={`group relative transform-gpu will-change-transform transition-all duration-[1200ms] ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-16"
              }`}
              style={{
                transitionDelay: `${index * (isMobile ? 300 : 150)}ms`,
              }}
              onClick={() => setSelectedGallery(gallery)}
            >
              <div className="relative overflow-hidden rounded-lg aspect-square">
                <img 
                  src={gallery.image} 
                  alt={gallery.title} 
                  onError={(e) => e.currentTarget.src = gallery.fallback} // Fallback si falla el webp
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedGallery && (
        <ImageLightbox
          image={selectedGallery.image}
          fallback={selectedGallery.fallback}
          onClose={() => setSelectedGallery(null)}
        />
      )}
    </section>
  );
};

export default GallerySection;