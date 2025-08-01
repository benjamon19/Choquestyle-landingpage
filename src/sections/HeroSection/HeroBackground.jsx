import heroBackground from '../../assets/images/hero-background.webp'; 

export default function HeroBackground() {
  return (
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${heroBackground})`,
        backgroundPosition: 'center center',
        ...(() => {
          if (typeof window === 'undefined') return {};
          return window.innerWidth < 640
            ? { backgroundPosition: '86% center' }
            : { backgroundPosition: 'center center' };
        })()
      }}
    >
      <div className="absolute inset-0 bg-black/70"></div>
    </div>
  );
}