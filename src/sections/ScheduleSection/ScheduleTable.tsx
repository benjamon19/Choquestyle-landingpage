import { scheduleData, days } from './ScheduleData'

const DAY_KEYS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'] as const

function parseCell(value: string): { main: string; sub: string } | null {
  if (!value) return null
  const idx = value.indexOf(' (')
  if (idx === -1) return { main: value, sub: '' }
  return { main: value.slice(0, idx), sub: value.slice(idx + 2, -1) }
}

export default function ScheduleTable() {
  return (
    <div className="mt-[clamp(8px,2vh,2rem)]">
      <p
        className="lg:hidden text-[9px] text-[#FFD600]/40 uppercase tracking-[0.3em] mb-3 px-0.5"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        ← Desliza para ver →
      </p>

      <div
        className="custom-horizontal-scrollbar pb-4"
        style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
        onTouchStart={e => e.stopPropagation()}
        onTouchMove={e => e.stopPropagation()}
      >
        <div className="min-w-[640px] border-t border-l border-[#222]">

          {/* Header row */}
          <div className="grid grid-cols-7">
            {['HORA', ...days].map(label => (
              <div
                key={label}
                className="bg-[#FFD600] py-3 md:py-4 px-1 md:px-2 border-r border-b border-[#222] flex items-center justify-center shadow-[inset_0_-2px_0_rgba(0,0,0,0.2)]"
              >
                <span
                  className="text-black text-xs lg:text-base 2xl:text-xl tracking-wider uppercase leading-none mt-1"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Data rows */}
          {scheduleData.map((row, rowIdx) => (
            <div key={rowIdx} className="grid grid-cols-7">
              <div
                className="bg-[#111] text-[#FFD600] py-3 px-2 border-r border-b border-[#222] text-[11px] lg:text-xs xl:text-[13px] flex items-center justify-center font-bold tracking-widest text-center"
                style={{ fontFamily: 'var(--font-heading)', minHeight: 'clamp(32px, 5.5vh, 75px)' }}
              >
                {row.time}
              </div>

              {DAY_KEYS.map(dk => {
                const parsed = parseCell((row as any)[dk])
                return (
                  <div
                    key={dk}
                    className={`relative p-1.5 md:p-2 flex flex-col items-center justify-center text-center border-r border-b border-[#222] ${parsed ? 'bg-[#151515]' : 'bg-[#0a0a0a]'}`}
                    style={{ minHeight: 'clamp(32px, 5.5vh, 75px)' }}
                  >
                    {parsed && (
                      <>
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#FFD600]" />
                        <span
                          className="block text-[10px] lg:text-[11px] xl:text-[12px] font-bold text-white tracking-widest uppercase mb-1 leading-none"
                          style={{ fontFamily: 'var(--font-heading)' }}
                        >
                          {parsed.main}
                        </span>
                        {parsed.sub && (
                          <span
                            className="block text-[8px] lg:text-[9px] xl:text-[10px] text-[#FFD600] uppercase tracking-widest leading-none mt-0.5"
                            style={{ fontFamily: 'var(--font-heading)' }}
                          >
                            {parsed.sub}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <p
        className="mt-2 text-gray-500 text-[10px] md:text-xs leading-relaxed px-0.5"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        * Los horarios pueden estar sujetos a cambios. Consulta siempre con recepción |{' '}
        Las clases de Jhonatan se pagan por sesión, las de Daniel por mensualidad.
      </p>
    </div>
  )
}
