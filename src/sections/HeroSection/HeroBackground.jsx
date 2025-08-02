import { useEffect, useState } from 'react';

export default function HeroBackground() {
  const [backgroundUrl, setBackgroundUrl] = useState('/images/hero-background.webp');

  useEffect(() => {
    const img = new Image();
    img.src = '/images/hero-background.webp';
    img.onload = () => setBackgroundUrl('/images/hero-background.webp');
    img.onerror = () => setBackgroundUrl('/images/hero-background.jpg');
  }, []);

  return (
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundPosition: 'center center',
        ...(() => {
          if (typeof window === 'undefined') return {};
          return window.innerWidth < 640
            ? { backgroundPosition: '85% center' }
            : { backgroundPosition: 'center center' };
        })()
      }}
    >
      <div className="absolute inset-0 bg-black/70"></div>
    </div>
  );
}
