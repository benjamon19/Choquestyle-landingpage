import { useEffect, useState } from 'react';

export default function HeroBackground() {
  const [backgroundUrl, setBackgroundUrl] = useState('/images/hero-background.webp');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = '/images/hero-background.webp';
    img.onload = () => setBackgroundUrl('/images/hero-background.webp');
    img.onerror = () => setBackgroundUrl('/images/hero-background.jpg');
  }, []);

  useEffect(() => {
    const checkIfMobile = () => {
      const newIsMobile = window.innerWidth < 640;
      setIsMobile(newIsMobile);
    };

    let timeoutId;

    const handleResize = () => {
      // Cancelar el timeout anterior si existe
      clearTimeout(timeoutId);
      
      // Esperar 150ms después de que termine de redimensionar
      timeoutId = setTimeout(checkIfMobile, 150);
    };

    // Verificar al montar el componente
    checkIfMobile();

    // Agregar listener con debounce
    window.addEventListener('resize', handleResize);

    // Cleanup del listener y timeout
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundPosition: isMobile ? '86% center' : 'center center'
      }}
    >
      <div className="absolute inset-0 bg-black/70"></div>
    </div>
  );
}