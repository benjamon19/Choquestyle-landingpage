import React, { useEffect, useState, useCallback, useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { galleries } from './galleryData';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const ImageLightbox = ({ image, onClose }: { image: string, onClose: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const [currentIndex, setCurrentIndex] = useState(
    galleries.findIndex((g) => g.image === image)
  );
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState('center');

  const next = useCallback(() => {
    if (!isZoomed && imageRef.current) {
      gsap.to(imageRef.current, { opacity: 0, x: -30, duration: 0.2, onComplete: () => {
        setCurrentIndex((prev) => (prev + 1) % galleries.length);
      }});
    }
  }, [isZoomed]);

  const prev = useCallback(() => {
    if (!isZoomed && imageRef.current) {
      gsap.to(imageRef.current, { opacity: 0, x: 30, duration: 0.2, onComplete: () => {
        setCurrentIndex((prev) => prev === 0 ? galleries.length - 1 : prev - 1);
      }});
    }
  }, [isZoomed]);

  const handleClose = useCallback(() => {
    if (tlRef.current) {
      // Reversa acelerada (cierra más rápido de lo que abre)
      tlRef.current.timeScale(1.8).reverse().then(() => onClose());
    } else {
      onClose();
    }
  }, [onClose]);

  const stateRef = useRef({ isZoomed, next, prev, handleClose });
  useEffect(() => {
    stateRef.current = { isZoomed, next, prev, handleClose };
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (stateRef.current.isZoomed) setIsZoomed(false);
        else stateRef.current.handleClose();
      }
      if (e.key === 'ArrowRight') stateRef.current.next();
      if (e.key === 'ArrowLeft') stateRef.current.prev();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    // Animación de entrada al cambiar de imagen
    if (imageRef.current) {
      gsap.fromTo(imageRef.current, 
        { opacity: 0, x: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out', clearProps: 'all' }
      );
    }
  }, [currentIndex]);

  useGSAP(() => {
    // Setup inicial invisible y desplazado
    gsap.set('.lb-bg', { opacity: 0 });
    gsap.set('.lb-img-container', { opacity: 0, scale: 0.85, y: 40 });
    gsap.set('.lb-ui-left', { opacity: 0, x: -30 });
    gsap.set('.lb-ui-right', { opacity: 0, x: 30 });
    gsap.set('.lb-ui-close', { opacity: 0, y: -20 });

    const tl = gsap.timeline();
    tlRef.current = tl;

    // Timeline súper suave
    tl.to('.lb-bg', { opacity: 1, duration: 0.4, ease: 'power2.out' })
      .to('.lb-img-container', { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'expo.out' }, '-=0.2')
      .to(['.lb-ui-left', '.lb-ui-right', '.lb-ui-close'], { opacity: 1, x: 0, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }, '-=0.5');
  }, { scope: containerRef });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isZoomed) setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isZoomed || !touchStart) return;
    const endX = e.changedTouches[0].clientX;
    const delta = touchStart - endX;
    if (delta > 50) next();
    if (delta < -50) prev();
    setTouchStart(null);
  };

  const handleImageClick = (e: React.MouseEvent) => {
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

  const gallery = galleries[currentIndex];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background */}
      <div 
        className="lb-bg absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
        onClick={handleClose}
      />

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="lb-ui-close absolute top-6 right-6 text-white/50 hover:text-[#FFD600] transition-colors z-50 p-2"
      >
        <FaTimes size={28} />
      </button>

      {/* Prev Button */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className={`lb-ui-left hidden md:flex absolute left-8 text-[#FFD600] hover:text-white transition-all z-50 p-4 ${
          isZoomed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <FaChevronLeft size={42} />
      </button>

      {/* Image Container */}
      <div
        className={`lb-img-container relative z-10 max-w-6xl w-full px-4 flex justify-center items-center ${isZoomed ? 'md:cursor-zoom-out' : 'md:cursor-zoom-in'}`}
        onClick={handleImageClick}
      >
        <img
          ref={imageRef}
          src={gallery.image}
          alt="Gallery Image"
          onError={(e: any) => (e.currentTarget.src = gallery.fallback)}
          style={{ transformOrigin }}
          className={`max-w-full object-contain rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
            isZoomed
              ? 'md:scale-[1.8] md:max-h-[95vh] rounded-none'
              : 'max-h-[85vh] scale-100'
          }`}
          draggable={false}
        />
      </div>

      {/* Next Button */}
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className={`lb-ui-right hidden md:flex absolute right-8 text-[#FFD600] hover:text-white transition-all z-50 p-4 cursor-pointer ${
          isZoomed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <FaChevronRight size={42} />
      </button>
    </div>
  );
};

export default ImageLightbox;
