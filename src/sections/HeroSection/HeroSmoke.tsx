import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

const COUNT = 18

function SmokeParticles({ inViewRef }: { inViewRef: React.RefObject<boolean> }) {
  const texture = useTexture('/images/smoke.webp')
  const meshRefs = useRef<(THREE.Mesh | null)[]>([])

  const particles = useMemo(
    () =>
      Array.from({ length: COUNT }, () => ({
        position: [
          (Math.random() - 0.5) * 28,
          (Math.random() - 0.5) * 16,
          -(Math.random() * 6 + 1),
        ] as [number, number, number],
        rotation: Math.random() * Math.PI * 2,
        scale: 5 + Math.random() * 9,
        speed: 0.025 + Math.random() * 0.055,
        rotSpeed: (Math.random() - 0.5) * 0.003,
        opacity: 0.05 + Math.random() * 0.08,
      })),
    []
  )

  useFrame((state, delta) => {
    if (!inViewRef.current) return

    particles.forEach((p, i) => {
      const mesh = meshRefs.current[i]
      if (!mesh) return

      mesh.position.y += p.speed * delta
      mesh.rotation.z += p.rotSpeed

      if (mesh.position.y > 10) mesh.position.y = -10

      let edgeFade = 1
      if (mesh.position.y < -6) {
        edgeFade = Math.max(0, (mesh.position.y + 10) / 4)
      } else if (mesh.position.y > 6) {
        edgeFade = Math.max(0, (10 - mesh.position.y) / 4)
      }

      const timeFade = Math.min(state.clock.elapsedTime / 2.5, 1)

      const material = mesh.material as THREE.MeshBasicMaterial
      if (material) {
        material.opacity = p.opacity * edgeFade * timeFade
      }
    })
  })

  return (
    <>
      {particles.map((p, i) => (
        <mesh
          key={i}
          ref={el => { meshRefs.current[i] = el }}
          position={p.position}
          rotation={[0, 0, p.rotation]}
          scale={p.scale}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </>
  )
}

export default function HeroSmoke() {
  const [reducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const inViewRef = useRef(true)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { inViewRef.current = entry.isIntersecting },
      { threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (reducedMotion) return null

  return (
    <div ref={containerRef} className="absolute inset-0 z-[1] pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 55 }}
        gl={{ alpha: true, antialias: false }}
        dpr={1}
      >
        <SmokeParticles inViewRef={inViewRef} />
      </Canvas>
    </div>
  )
}
