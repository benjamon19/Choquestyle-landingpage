import HeroContent from './HeroContent'
import HeroSmoke from './HeroSmoke'

export default function HeroBanner() {
  return (
    <section
      id="inicio"
      className="relative text-white overflow-hidden bg-black"
      style={{
        height: '100svh',
        backgroundImage: 'radial-gradient(ellipse at 50% 35%, transparent 20%, rgba(0,0,0,0.6) 65%, black 95%), url(/images/choque_cage_floor_logo.webp)',
        backgroundSize: '100% 100%, auto 100%',
        backgroundPosition: 'center, center',
        backgroundRepeat: 'no-repeat, no-repeat',
      }}
    >
      <HeroSmoke />
      <HeroContent />
    </section>
  )
}
