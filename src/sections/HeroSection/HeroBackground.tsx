export default function HeroBackground() {
  return (
    <div className="absolute inset-0 bg-[#0a0a0a]">
      <img
        src="/images/choque_cage_floor_logo.webp"
        alt="Choque Style Background"
        fetchPriority="high"
        decoding="async"
        className="w-full h-full object-cover object-center opacity-70"
      />
      {/* Filtro original que le daba el toque premium */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black pointer-events-none" />
    </div>
  )
}
