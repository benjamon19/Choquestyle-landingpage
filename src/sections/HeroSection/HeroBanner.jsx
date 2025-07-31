import HeroBackground from './HeroBackground';
import HeroContent from './HeroContent';
import useHeroAnimation from './useHeroAnimation';

export default function HeroBanner() {
  const animationStates = useHeroAnimation();

  return (
    <section
      id="inicio"
      className="relative text-white min-h-screen flex items-center justify-center overflow-hidden"
    >
      <HeroBackground />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <HeroContent animationStates={animationStates} />
      </div>
    </section>
  );
}