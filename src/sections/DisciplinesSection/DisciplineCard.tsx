import { GiBoxingGlove, GiHighKick } from 'react-icons/gi'
import { FaPrayingHands, FaUserNinja } from 'react-icons/fa'
import { TbMoodKidFilled } from 'react-icons/tb'

type IconComp = React.ComponentType<{ className?: string }>

const icons: Record<string, IconComp> = {
  boxing:   GiBoxingGlove,
  kick:     GiHighKick,
  muaythai: FaPrayingHands,
  mma:      FaUserNinja,
  kids:     TbMoodKidFilled,
}

export default function DisciplineCard({
  iconName, title, description, index,
}: {
  iconName: string
  title: string
  description: string
  index: number
}) {
  const Icon = icons[iconName]
  const num = String((index % 5) + 1).padStart(2, '0')

  return (
    <div
      className="discipline-card relative flex-shrink-0 w-[220px] md:w-[320px] flex flex-col mx-[10px] px-4 py-6 md:px-7 md:py-10 overflow-hidden transition-all duration-500"
      style={{
        backgroundColor: 'var(--color-bg-3)',
        borderTop:  '1px solid rgba(255,255,255,0.055)',
        borderLeft: '2px solid transparent',
      }}
    >
      {/* Number watermark removed */}

      {/* Icon */}
      {Icon && (
        <div className="mb-6 relative z-10">
          <Icon className="text-[#FFD600] text-3xl opacity-100" />
        </div>
      )}

      {/* Gold rule */}
      <div className="w-8 h-[2px] bg-[#FFD600] mb-5 relative z-10" />

      {/* Title */}
      <h3
        className="text-white uppercase mb-3 relative z-10"
        style={{
          fontFamily:    'var(--font-display)',
          fontSize:      'clamp(1.6rem, 4.5vw, 2.1rem)',
          letterSpacing: '0.02em',
          lineHeight:    0.95,
        }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className="text-gray-400 text-sm leading-relaxed relative z-10"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        {description}
      </p>
    </div>
  )
}
