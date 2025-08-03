import React, { useEffect, useState, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { galleries } from './galleryData';

const ImageLightbox = ({ image, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(
    galleries.findIndex((g) => g.image === image)
  );
  const [touchStart, setTouchStart] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [lastTap, setLastTap] = useState(0);

  const next = useCallback(() => {
    if (!isZoomed) {
      setCurrentIndex((prev) => (prev + 1) % galleries.length);
    }
  }, [isZoomed]);

  const prev = useCallback(() => {
    if (!isZoomed) {
      setCurrentIndex((prev) =>
        prev === 0 ? galleries.length - 1 : prev - 1
      );
    }
  }, [isZoomed]);

  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') {
      if (isZoomed) {
        setIsZoomed(false);
      } else {
        handleClose();
      }
    }
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  }, [next, prev, isZoomed]);

  useEffect(() => {
    setVisible(true);
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const handleTouchStart = (e) => {
    if (!isZoomed) {
      setTouchStart(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e) => {
    if (isZoomed) return;
    
    if (!touchStart) return;
    const endX = e.changedTouches[0].clientX;
    const delta = touchStart - endX;
    if (delta > 50) next();
    if (delta < -50) prev();
    setTouchStart(null);
  };

  // Manejar click para zoom solo en desktop
  const handleImageClick = (e) => {
    e.stopPropagation();
    // Solo en desktop (cuando no es touch)
    if (!('ontouchstart' in window)) {
      setIsZoomed(!isZoomed);
    }
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose(), 200);
  };

  const gallery = galleries[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={handleClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Flechas visibles solo en desktop y cuando no está zoomed */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
        className={`hidden md:block absolute left-6 text-[#FFD600] hover:text-white transition-all ${
          isZoomed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <FaChevronLeft size={36} />
      </button>

      <div
        onClick={handleImageClick}
        className={`max-w-5xl w-full px-4 transition-all duration-300 transform ${
          visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        } ${isZoomed ? 'md:cursor-zoom-out' : 'md:cursor-zoom-in'}`}
      >
        <img
          src={gallery.image}
          alt=""
          onError={(e) => e.currentTarget.src = gallery.fallback}
          className={`w-full object-contain rounded-xl transition-all duration-300 ${
            isZoomed 
              ? 'max-h-none md:scale-200' 
              : 'max-h-[80vh] scale-100'
          }`}
          draggable={false}
        />
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
        className={`hidden md:block absolute right-6 text-[#FFD600] hover:text-white transition-all cursor-pointer ${
          isZoomed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <FaChevronRight size={36} />
      </button>
      
      {/* Botón de cerrar más visible cuando está zoomed */}
      <button
        onClick={handleClose}
        className={`absolute top-4 right-4 text-white hover:text-[#FFD600] transition-colors ${
          isZoomed ? 'text-2xl bg-black bg-opacity-50 rounded-full p-2' : 'text-xl'
        }`}
      >
        ✕
      </button>
    </div>
  );
};

export default ImageLightbox;