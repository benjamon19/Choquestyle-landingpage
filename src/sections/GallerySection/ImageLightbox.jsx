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
  const [transformOrigin, setTransformOrigin] = useState('center');

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

  const handleImageClick = (e) => {
    e.stopPropagation();
    if (!('ontouchstart' in window)) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;
      setTransformOrigin(`${percentX}% ${percentY}%`);
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
      {/* Flecha izquierda */}
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
          onError={(e) => (e.currentTarget.src = gallery.fallback)}
          style={{ transformOrigin }}
          className={`w-full max-w-full object-contain rounded-xl transition-transform duration-300 ${
            isZoomed
              ? 'md:scale-[1.5] md:max-h-[95vh]'
              : 'max-h-[80vh] scale-100'
          }`}
          draggable={false}
        />
      </div>

      {/* Flecha derecha */}
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
    </div>
  );
};

export default ImageLightbox;
