import { useState, memo, useRef, useEffect } from 'react'
import { FaStar } from 'react-icons/fa'

const GOOGLE_COLORS = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#FF6D00', '#46BDC6', '#7B61FF', '#E91E63']
const getAvatarColor = (name: string) => GOOGLE_COLORS[name.charCodeAt(0) % GOOGLE_COLORS.length]

const GoogleLogo = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={{ flexShrink: 0 }}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
)

const reviewsRow1 = [
  { id: 1, name: 'Alejandro Francisco Selti Araya', rating: 5, text: 'Mi experiencia en la academia es muy beneficiosa comenzando por un grato ambiente, instalaciones cómodas, implementacion acorde a las nesecidades y de muy buena calidad.' },
  { id: 2, name: 'Paola Flores Rivera', rating: 5, text: 'Una academia bien establecida,con los implementos necesarios y la infraestructura ideal; Donde sos bienvenido/a independiente de tu genero y o experiencia, a todos se los forma por igual.' },
  { id: 3, name: 'Mauricio Alvear Veliz', rating: 5, text: 'Llevo aproximadamente 3 meses Y ha sido la mejor academia que estado el.ambiente es bacan los compañeros más experimentados te enseña no.hay ego ni arrogancia' },
  { id: 4, name: 'Simón Valenzuela', rating: 5, text: 'Excelente lugar de aprendizaje de defensa personal (boxeo, kickboxing y muai thai). Los compañeros de entrenamiento son muy empaticos y aportan para mejorar tus técnicas. Si quieres aprender con horarios flexibles y con excelentes compañeros de entrenamiento, definitivamente este es tu lugar.' },
  { id: 5, name: 'Lucas Berrios', rating: 5, text: 'Excelente establecimiento, lo mejor para aprender, perfeccionamiento y acondicionamiento, totalmente recomendado. El profesor enseña muy bien.' },
  { id: 6, name: 'Alexis Aguirre', rating: 5, text: 'Llego 2 meses en la academia y el ambiente del gimnacio las personas y el profesor son muy educados y el entrenamiento es muy bueno' },
  { id: 7, name: 'Javier Jopia', rating: 5, text: 'Es una academia que tiene todo lo que busco disciplina y además todos los compañeros y profesor buena onda 🔥' },
  { id: 8, name: 'MD.cracker', rating: 5, text: 'Gran academia, me sirvio para muchas cosas, liberar el estres, formar amistades, ganar confianza, etc. Y las clases son muy entretenidas y con mucho trabajo de por medio dadas por un gran profesor, recomendados al 100%' },
  { id: 9, name: 'mauricio bustos', rating: 5, text: 'La mejor academia del norte de chile. Excelente y profesionales profesores. 🤜🤛🥳' },
  { id: 10, name: 'Thiago Alves', rating: 5, text: 'Muy buena academia, me han enseñado mucho' },
  { id: 11, name: 'Maykel Navarro Martinez', rating: 5, text: 'Maestro muy buenos y excelentes horarios' },
  { id: 12, name: 'Elizabeth Nicolle Zarate A.', rating: 5, text: 'El profesor es realmente muy bueno, he aprendido y progresado bastante, el ambiente es adecuado para tanto como para hombres como para mujeres.' },
  { id: 13, name: 'Silverio Caceres', rating: 5, text: 'bueno llevo un año en la academia y asido una experiencia muy bonita mea ayudado bastante en temas de bajar de peso y liberar el estrés y también a conocer personas buenas y acer amistades' },
  { id: 14, name: 'Allen Alarcon', rating: 5, text: 'Exelente academia, muy organizada y muy buenos metodos de enseñanza👌' },
  { id: 15, name: 'fabiola venegas berrios', rating: 5, text: 'Muy recomendado! Mi hijo de 5 años disfruta muchos sus clases, entretenidas, dinámicas y el profe muy cercano con los niños!!!!' },
  { id: 16, name: 'Liam', rating: 5, text: 'Muy buena academia, unos amigos y yo nos animamos a ir a las clases de boxeo y ya aprendimos mucho en las 8 clases que llevamos, recomendadisimo' },
  { id: 17, name: 'Erica Maluenda', rating: 5, text: 'Exelente academia ,muy responsable 100%recomendable ,exelente diciplina ...💪🥊' },
  { id: 18, name: 'Elías Valenzuela Guajardo', rating: 5, text: 'Excelente academia de Boxeo, Kickboxing y Muay Thai. Recomendable tanto para peleadores avezados como para personas que recién se inician en estas artes marciales.' }
]

const reviewsRow2 = [
  { id: 19, name: 'Marco Carrera', rating: 5, text: 'Exelente escuela vale la pena visitarla y practicar uno de lo mejores deportes muy buena escuela de boxeo profe Dany choque un exelente entrenador profesional' },
  { id: 20, name: 'Eduardo Rodriguez Vilca', rating: 5, text: 'Muy buena academia. El profe es muy dedicado y preocupado por los alumnos.' },
  { id: 21, name: 'kim fuentes', rating: 5, text: 'Buen lugar para aprender Artes marciales desde cero, apto para todas las edades exelente gym 💪' },
  { id: 22, name: 'fernanda neira', rating: 5, text: 'Muy buena academia , tanto para niños y adultos, recomendable💯' },
  { id: 23, name: 'Julio_xx', rating: 5, text: 'Exelente academia, exelente profesor, un ambiente agradable, todo perfecto❤️' },
  { id: 24, name: 'giovanni Briones', rating: 5, text: 'Nos enseñan hacer un grupo a que todos tenemos que saludarnos cuando llegamos y cuando nos vamos hacer amigo hacer mas sociables a que tengamos la edad que tengamos podemos jugar y divertirnos' },
  { id: 25, name: 'Susana Chacón', rating: 5, text: 'Muy buena academia y muy buen profesor' },
  { id: 26, name: 'alfredo castro', rating: 5, text: 'Buen lugar y un ambiente para las disciplinas del box' },
  { id: 27, name: 'Luciano Morales', rating: 5, text: 'Exelente profesor' },
  { id: 28, name: 'Satoru Gojo', rating: 5, text: 'Muy bueno' },
  { id: 29, name: 'Gabriel Echeverria Araya', rating: 5, text: 'Un lugar agradable y cumple su función al 100%' },
  { id: 30, name: 'Juan Orozco', rating: 5, text: 'Mi deporte favorito y con mi profe favorito 💪🏽🫱🏻🫲🏼' },
  { id: 31, name: 'Edwin Lupaca', rating: 5, text: 'Buena escuela de entrenamiento 🔥🔥👊🏻👊🏻' },
  { id: 32, name: 'Luis Ignacio Diaz Avalos', rating: 5, text: 'El mejor lugar para entrenar!!!! 💪🏽🥊' },
  { id: 33, name: 'benjamin rojas', rating: 5, text: 'Muy recomendable' },
  { id: 34, name: 'Anderson Escobar', rating: 5, text: '100 puntos' },
  { id: 35, name: 'Ricardo Cancino', rating: 5, text: '100% recomendable !' },
  { id: 36, name: 'Luis Castillo', rating: 5, text: 'Excelentes entrenamientos !!!' }
]

const GOOGLE_REVIEWS_URL = "https://www.google.com/search?sxsrf=ANbL-n47MOXRMEG-sFHWIuNO29UpHnYy7g:1780889735256&q=choquestyle&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qORo52_TFnaf10uOHG7zX5R53AIuhH1Xyy6_vELCkTrJMYFPmfKeZLUTcCZ957F73rNf6riKHGXlEKivNk4yM8UL_EqaGoXprwJjNSAu5aBHVEFz3jA%3D%3D&uds=ALYpb_kKdx-oX15sdjMUmdmJV1Rhc5XYLK2koFcBuA2PfBh-p-S7X38QslTYgqi_8YS_A589WvogMwz54x0uPgMDJLf_6W9BGVBtwvgjpPO25YgFefdDv0Y"

const ReviewCard = memo(({ review }: { review: any }) => {
  const avatarColor = getAvatarColor(review.name)
  return (
    <a
      href={GOOGLE_REVIEWS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-shrink-0 w-[200px] sm:w-[260px] md:w-[300px] p-4 md:p-5 rounded-2xl mx-1.5 md:mx-2 flex flex-col h-[200px] sm:h-[220px] md:h-[240px] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
      style={{
        background: '#1c1f27',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.35)',
        textDecoration: 'none',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm md:text-base flex-shrink-0"
          style={{ backgroundColor: avatarColor }}
        >
          {review.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-white text-xs md:text-sm font-medium truncate leading-tight">{review.name}</span>
          <div className="flex items-center gap-1 mt-0.5">
            {[...Array(review.rating)].map((_, i) => (
              <FaStar key={i} className="text-[#FBBC05] text-[9px] md:text-[10px]" />
            ))}
          </div>
        </div>
        <GoogleLogo size={18} />
      </div>

      {/* Divider */}
      <div className="w-full h-px mb-3" style={{ background: 'rgba(255,255,255,0.06)' }} />

      {/* Text */}
      <p className="text-gray-300 text-xs md:text-sm leading-relaxed flex-grow line-clamp-4 md:line-clamp-5">
        {review.text}
      </p>
    </a>
  )
})

const canHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

const GoogleReviewsCarousel = () => {
  const [row1Paused, setRow1Paused] = useState(false)
  const [row2Paused, setRow2Paused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [sectionVisible, setSectionVisible] = useState(true)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setSectionVisible(entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="mt-10 md:mt-20 overflow-hidden w-full relative">
      <div className="text-center mb-8 md:mb-16 flex flex-col items-center justify-center">
        <div className="w-12 h-[2px] bg-[#FFD600] mb-6" />
        <h3
          className="text-white text-4xl sm:text-5xl lg:text-[4rem] uppercase mb-8"
          style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', lineHeight: 0.9 }}
        >
          LO QUE DICEN DE <span className="text-[#FFD600]">NOSOTROS</span>
        </h3>

        {/* Google-style rating widget */}
        <a
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-5 px-6 py-4 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
          style={{
            background: '#1c1f27',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
            textDecoration: 'none',
          }}
        >
          {/* Score */}
          <div className="flex flex-col items-center">
            <span
              className="text-white font-bold leading-none"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', fontFamily: 'var(--font-display)' }}
            >
              4.9
            </span>
            <div className="flex gap-0.5 mt-1">
              <FaStar className="text-[#FBBC05] text-sm" />
              <FaStar className="text-[#FBBC05] text-sm" />
              <FaStar className="text-[#FBBC05] text-sm" />
              <FaStar className="text-[#FBBC05] text-sm" />
              <FaStar className="text-[#FBBC05] text-sm" />
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-12 self-center" style={{ background: 'rgba(255,255,255,0.1)' }} />

          {/* Info */}
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-2">
              <GoogleLogo size={20} />
              <span className="text-white text-sm font-semibold">Google Reviews</span>
            </div>
            <span className="text-gray-400 text-xs">47 opiniones · Ver en Google</span>
          </div>
        </a>
      </div>

      {/* Row 1 - Moving Left */}
      <div
        className="flex w-max mb-6 animate-marquee"
        style={{ animationDuration: '50s', animationPlayState: !sectionVisible || row1Paused ? 'paused' : 'running', willChange: 'transform' }}
        onMouseEnter={() => canHover && setRow1Paused(true)}
        onMouseLeave={() => canHover && setRow1Paused(false)}
      >
        {reviewsRow1.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
        {reviewsRow1.map((review) => (
          <ReviewCard key={`${review.id}-dup`} review={review} />
        ))}
      </div>

      {/* Row 2 - Moving Right */}
      <div
        className="flex w-max animate-marquee-reverse"
        style={{ animationDuration: '50s', animationPlayState: !sectionVisible || row2Paused ? 'paused' : 'running', willChange: 'transform' }}
        onMouseEnter={() => canHover && setRow2Paused(true)}
        onMouseLeave={() => canHover && setRow2Paused(false)}
      >
        {reviewsRow2.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
        {reviewsRow2.map((review) => (
          <ReviewCard key={`${review.id}-dup`} review={review} />
        ))}
      </div>

      {/* Gradient fades for edges */}
      <div className="absolute top-0 bottom-0 left-0 w-12 md:w-32 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, var(--color-bg), transparent)' }} />
      <div className="absolute top-0 bottom-0 right-0 w-12 md:w-32 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, var(--color-bg), transparent)' }} />
    </div>
  )
}

export default GoogleReviewsCarousel
