import React, { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
import { AlertCircle, ArrowRight } from 'lucide-react';
import {
  WHEEL_SECTORS,
  SECTOR_ANGLE,
  pickWinningSectorIndex,
  calculateWheelRotation,
  validateEmail,
  isEmailUsed,
  validateRut,
  formatRut,
  isRutUsed,
  hasParticipated,
  getStoredUser,
  saveParticipation,
  getStoredWonSector,
  saveWonSector,
  resetWheelStorage,
  submitWinnerToCloud,
  playTickSound,
  unlockAudio,
  triggerConfetti,
  isDemoMode,
  WheelSector,
  WheelUser,
} from './wheelConfig';
import { scrollToSection } from '../../utils/scrollToSection';

type ViewState = 'wheel' | 'lead_form' | 'winner';

export default function DiscountWheelModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<ViewState>('wheel');
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [hasSpun, setHasSpun] = useState<boolean>(false);
  const [hasExitedModal, setHasExitedModal] = useState<boolean>(false);
  const [wonSector, setWonSector] = useState<WheelSector | null>(null);

  // Formulario
  const [name, setName] = useState<string>('');
  const [rut, setRut] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [formErrors, setFormErrors] = useState<{ name?: string; rut?: string; email?: string; general?: string }>({});

  // Resultado persistido
  const [participated, setParticipated] = useState<boolean>(false);
  const [savedUser, setSavedUser] = useState<WheelUser | null>(null);

  // Refs para animaciones y vistas
  const containerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const wheelViewRef = useRef<HTMLDivElement>(null);
  const cardViewRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const wheelDivRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);
  const currentRotationRef = useRef<number>(0);
  const lastPinIndexRef = useRef<number>(-1);
  const lastSoundTimeRef = useRef<number>(0);
  const isClosingRef = useRef<boolean>(false);

  // ─────────────────────────────────────────────────────────────
  // INICIALIZACIÓN — Leer localStorage al montar y auto-apertura
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    // En modo demostración/grabación de video (?jackpot50, etc.): SIEMPRE reiniciar y abrir ruleta limpia
    if (isDemoMode()) {
      resetWheelStorage();
      setParticipated(false);
      setSavedUser(null);
      setHasSpun(false);
      setWonSector(null);
      setCurrentView('wheel');
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 400);
      return () => clearTimeout(timer);
    }

    // Si la URL tiene ?reset o ?test, limpiar todo el storage para pruebas libres
    if (
      typeof window !== 'undefined' &&
      (window.location.search.includes('reset') || window.location.search.includes('test'))
    ) {
      resetWheelStorage();
    }

    const alreadyPlayed = hasParticipated();
    setParticipated(alreadyPlayed);

    if (alreadyPlayed) {
      const user = getStoredUser();
      if (user) {
        setSavedUser(user);
      }
      setHasExitedModal(true);
    } else {
      // Si ya había girado previamente y no completó formulario, recuperar su premio
      const pendingWon = getStoredWonSector();
      if (pendingWon) {
        setWonSector(pendingWon);
        setHasSpun(true);
        setCurrentView('lead_form');
      }

      // Auto-abrir la ruleta apenas entra a la página (1s de delay para carga suave)
      const autoOpenTimer = setTimeout(() => {
        if (pendingWon) {
          setCurrentView('lead_form');
        } else {
          setCurrentView('wheel');
        }
        setIsOpen(true);
      }, 1000);

      return () => clearTimeout(autoOpenTimer);
    }
  }, []);

  const isFirstViewMountRef = useRef<boolean>(true);

  // ─────────────────────────────────────────────────────────────
  // BLOQUEO DE SCROLL EN BODY Y LENIS MIENTRAS ESTÉ ABIERTO
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      const prevTouchAction = document.body.style.touchAction;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      return () => {
        document.body.style.overflow = prevOverflow;
        document.body.style.touchAction = prevTouchAction;
      };
    }
  }, [isOpen]);

  // ─────────────────────────────────────────────────────────────
  // ANIMACIÓN DE ENTRADA ULTRA PULIDA (SIN PARPADEO / FOUC)
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      isClosingRef.current = false;

      if (tlRef.current) {
        tlRef.current.kill();
      }

      const tl = gsap.timeline();
      tlRef.current = tl;

      if (currentView === 'wheel') {
        if (backdropRef.current) {
          tl.to(backdropRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
        }
        if (wheelViewRef.current) {
          tl.to(
            wheelViewRef.current,
            { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'back.out(1.2)' },
            '-=0.15'
          );
        }
        if (wheelDivRef.current) {
          tl.fromTo(
            wheelDivRef.current,
            { rotation: currentRotationRef.current - 24 },
            { rotation: currentRotationRef.current, duration: 0.65, ease: 'power3.out' },
            '-=0.35'
          );
        }
        if (pointerRef.current) {
          tl.fromTo(
            pointerRef.current,
            { opacity: 0, y: -10, rotation: -14 },
            { opacity: 1, y: 0, rotation: 0, duration: 0.35, ease: 'back.out(2)', transformOrigin: '15px 4px' },
            '-=0.45'
          );
        }
      } else {
        // Para vistas de tarjeta (lead_form y winner)
        if (backdropRef.current) {
          tl.to(backdropRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
        }
        if (cardViewRef.current) {
          tl.to(
            cardViewRef.current,
            { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'expo.out' },
            '-=0.15'
          );
        }
      }

      return () => {
        tl.kill();
      };
    }
  }, [isOpen]);

  // Animación de entrada de la tarjeta (lead_form y winner) al cambiar de vista
  useEffect(() => {
    if (isOpen && currentView !== 'wheel' && cardViewRef.current) {
      gsap.fromTo(
        cardViewRef.current,
        { opacity: 0, scale: 0.92, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'back.out(1.2)' }
      );
    }
  }, [isOpen, currentView]);

  // ─────────────────────────────────────────────────────────────
  // CIERRE CON ANIMACIÓN FLUIDA (SIN LAG NI CORTES)
  // ─────────────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    if (isClosingRef.current || isSpinning) return;
    isClosingRef.current = true;
    setHasExitedModal(true);

    if (tlRef.current) {
      tlRef.current.kill();
    }

    const activeContent = currentView === 'wheel' ? wheelViewRef.current : cardViewRef.current;
    const backdrop = backdropRef.current;

    if (activeContent || backdrop) {
      const exitTl = gsap.timeline({
        onComplete: () => {
          setIsOpen(false);
          isClosingRef.current = false;
        },
      });

      if (activeContent) {
        exitTl.to(
          activeContent,
          {
            opacity: 0,
            scale: 0.93,
            y: 10,
            duration: 0.22,
            ease: 'power2.in',
          },
          0
        );
      }

      if (backdrop) {
        exitTl.to(
          backdrop,
          {
            opacity: 0,
            duration: 0.22,
            ease: 'power2.in',
          },
          0
        );
      }
    } else {
      setIsOpen(false);
      isClosingRef.current = false;
    }
  }, [currentView, isSpinning]);

  // Tecla ESC (capture phase para funcionar con inputs enfocados)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Escape' || e.key === 'Esc') && isOpen) {
        e.preventDefault();
        e.stopPropagation();
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, handleClose]);

  // ─────────────────────────────────────────────────────────────
  // ABRIR MODAL
  // ─────────────────────────────────────────────────────────────
  const handleOpenModal = () => {
    if (participated) {
      // Si ya participó, abre directamente la pantalla ganadora para ver datos y tomar captura
      const user = savedUser || getStoredUser();
      if (user) setSavedUser(user);
      setCurrentView('winner');
      setIsOpen(true);
      return;
    }

    if (hasSpun && wonSector) {
      // Si ya giró la ruleta y ganó su descuento, NO vuelve a girar: va directo al formulario
      setCurrentView('lead_form');
      setIsOpen(true);
      return;
    }

    // Si no ha girado, abre la ruleta
    setCurrentView('wheel');
    setIsOpen(true);
  };

  // ─────────────────────────────────────────────────────────────
  // 1. GIRO DE LA RULETA
  // ─────────────────────────────────────────────────────────────
  const handleSpin = () => {
    // Desbloquear audio síncronamente en iOS Safari / iPhone y Android
    unlockAudio();

    if (isSpinning || hasSpun || !wheelDivRef.current) return;

    setIsSpinning(true);

    const winningIndex = pickWinningSectorIndex();
    const winning = WHEEL_SECTORS[winningIndex];
    setWonSector(winning);
    setHasSpun(true);
    saveWonSector(winning);

    const targetRotation = calculateWheelRotation(winningIndex, currentRotationRef.current);

    gsap.to(wheelDivRef.current, {
      rotation: targetRotation,
      duration: 4.8,
      ease: 'power4.out',
      transformOrigin: '50% 50%',
      force3D: true,
      onUpdate: () => {
        if (!wheelDivRef.current) return;
        const rot = gsap.getProperty(wheelDivRef.current, 'rotation') as number;

        // 12 pernos = detección cada 30°
        const pinIndex = Math.floor((rot + 15) / 30);
        if (pinIndex !== lastPinIndexRef.current) {
          lastPinIndexRef.current = pinIndex;

          const now = performance.now();
          if (now - lastSoundTimeRef.current > 30) {
            lastSoundTimeRef.current = now;
            playTickSound();
          }

          if (pointerRef.current) {
            gsap.fromTo(
              pointerRef.current,
              { rotation: -18 },
              {
                rotation: 0,
                duration: 0.1,
                ease: 'power2.out',
                transformOrigin: '15px 4px',
                overwrite: 'auto',
              }
            );
          }
        }
      },
      onComplete: () => {
        currentRotationRef.current = targetRotation;
        setIsSpinning(false);
        triggerConfetti();

        setTimeout(() => {
          if (wheelViewRef.current) {
            gsap.to(wheelViewRef.current, {
              opacity: 0,
              scale: 0.9,
              duration: 0.35,
              ease: 'power2.in',
              onComplete: () => {
                setCurrentView('lead_form');
              },
            });
          } else {
            setCurrentView('lead_form');
          }
        }, 1400);
      },
    });
  };

  // ─────────────────────────────────────────────────────────────
  // 2. ENVÍO DEL FORMULARIO — SIN CÓDIGOS
  // ─────────────────────────────────────────────────────────────
  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wonSector) return;

    const errors: { name?: string; rut?: string; email?: string; general?: string } = {};
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const rawRut = rut.trim();

    if (!cleanName || cleanName.length < 3) {
      errors.name = 'Ingresa tu nombre completo (mínimo 3 caracteres).';
    }

    if (!rawRut) {
      errors.rut = 'Ingresa tu RUT.';
    } else if (!validateRut(rawRut)) {
      errors.rut = 'Ingresa un RUT chileno válido (ej. 12.345.678-9).';
    } else if (isRutUsed(rawRut)) {
      errors.general = 'Este RUT ya utilizó su intento en la ruleta.';
    }

    if (!cleanEmail || !validateEmail(cleanEmail)) {
      errors.email = 'Ingresa un correo electrónico válido.';
    } else if (isEmailUsed(cleanEmail)) {
      errors.general = 'Este correo ya utilizó su intento.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    const formattedRutStr = formatRut(rawRut);

    const user: WheelUser = {
      name: cleanName,
      rut: formattedRutStr,
      email: cleanEmail,
      discount: `${wonSector.value}%`,
      date: new Date().toISOString(),
      status: 'Pendiente',
    };

    saveParticipation(user);
    // Enviar a la nube (Google Sheets) en segundo plano
    submitWinnerToCloud(user);

    setSavedUser(user);
    setParticipated(true);

    triggerConfetti();
    setCurrentView('winner');
  };

  // ─────────────────────────────────────────────────────────────
  // HELPER SVG — TRAZADO DE SECTORES
  // ─────────────────────────────────────────────────────────────
  const getSectorPath = (index: number, radius: number = 186) => {
    const a1 = index * SECTOR_ANGLE;
    const a2 = (index + 1) * SECTOR_ANGLE;
    const rad1 = (a1 * Math.PI) / 180;
    const rad2 = (a2 * Math.PI) / 180;

    const x1 = radius * Math.sin(rad1);
    const y1 = -radius * Math.cos(rad1);
    const x2 = radius * Math.sin(rad2);
    const y2 = -radius * Math.cos(rad2);

    return `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
  };

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────
  return (
    <>
      {/* BOTÓN FLOTANTE — SOLO SI EL MODAL ESTÁ CERRADO Y YA SALIÓ AL MENOS UNA VEZ */}
      {!isOpen && (hasExitedModal || participated) && (
        <button
          onClick={handleOpenModal}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-black/95 border-2 border-[#FFD600] text-white shadow-[0_0_35px_rgba(255,214,0,0.35)] hover:bg-[#FFD600] hover:text-black transition-all duration-300 group cursor-pointer backdrop-blur-md animate-button-slide-up"
          aria-label={
            participated
              ? 'Ver mi cupón de descuento'
              : hasSpun && wonSector
                ? `Reclamar mi descuento ${wonSector.label}`
                : '¡No te quedes sin tu descuento!'
          }
        >
          {participated ? (
            <>
              <span className="text-lg inline-block">🎟️</span>
              <span
                className="text-xs uppercase tracking-[0.18em] font-bold"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                VER MI CUPÓN {savedUser?.discount ? `// ${savedUser.discount}` : ''}
              </span>
            </>
          ) : hasSpun && wonSector ? (
            <>
              <span className="text-lg animate-gift-wobble inline-block shrink-0">🎁</span>
              <span
                className="text-xs uppercase tracking-[0.16em] font-extrabold text-[#FFD600] group-hover:text-black transition-colors whitespace-nowrap"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                ¡RECLAMA TU {wonSector.label}!
              </span>
            </>
          ) : (
            <>
              <span className="text-lg animate-gift-wobble inline-block shrink-0">🎁</span>
              <span
                className="text-xs uppercase tracking-[0.16em] font-extrabold text-[#FFD600] group-hover:text-black transition-colors whitespace-nowrap"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                ¡NO TE QUEDES SIN TU DESCUENTO!
              </span>
            </>
          )}
        </button>
      )}

      {/* MODAL PRINCIPAL */}
      {isOpen && (
        <div
          ref={containerRef}
          className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 ${currentView === 'wheel' ? 'overflow-hidden' : 'overflow-y-auto'
            }`}
          data-lenis-prevent
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            ref={backdropRef}
            onClick={handleClose}
            className="fixed inset-0 bg-black/90 cursor-pointer"
            style={{ opacity: 0 }}
          />

          {/* ─── VISTA 1: RULETA DIRECTA SOBRE EL BACKDROP (SIN CAJA) ─── */}
          {currentView === 'wheel' && (
            <div
              ref={wheelViewRef}
              className="relative z-10 flex flex-col items-center text-center w-full max-w-[500px] mx-auto px-2"
              style={{ opacity: 0, transform: 'scale(0.92)', backfaceVisibility: 'hidden' }}
            >
              <h2
                className="uppercase text-4xl sm:text-6xl md:text-7xl text-white tracking-tight mb-1 whitespace-nowrap"
                style={{ fontFamily: 'var(--font-display)', lineHeight: 0.9 }}
              >
                RULETA <span className="text-[#FFD600]">CHOQUESTYLE</span>
              </h2>

              <p
                className="text-gray-200 text-sm sm:text-lg md:text-xl font-bold tracking-[0.16em] uppercase mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                GIRA Y GANA HASTA UN <span className="text-[#FFD600] font-extrabold">50% DE DESCUENTO</span>
              </p>

              {/* RULETA GRANDE — DIRECTA */}
              <div
                className="relative mx-auto w-[min(78vw,330px)] h-[min(78vw,330px)] sm:w-[380px] sm:h-[380px] md:w-[420px] md:h-[420px] aspect-square select-none flex items-center justify-center my-2 shrink-0"
              >
                {/* Puntero */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                  <div
                    ref={pointerRef}
                    style={{ opacity: 0, transformOrigin: '15px 4px' }}
                  >
                    <svg width="30" height="42" viewBox="0 0 30 42" fill="none">
                      <path
                        d="M15 40L3 6C1.5 3 3.5 0 7 0H23C26.5 0 28.5 3 27 6L15 40Z"
                        fill="#FFD600"
                        stroke="#000000"
                        strokeWidth="2.5"
                      />
                      <circle cx="15" cy="9" r="4.5" fill="#0a0a0a" stroke="#FFD600" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>

                {/* Resplandor exterior */}
                <div className="absolute inset-0 rounded-full border border-[#FFD600]/30 shadow-[0_0_45px_rgba(255,214,0,0.2)] pointer-events-none" />

                {/* Contenedor circular */}
                <div
                  className="w-full h-full rounded-full overflow-hidden flex items-center justify-center pointer-events-none"
                >
                  {/* Div giratorio */}
                  <div
                    ref={wheelDivRef}
                    className="w-full h-full pointer-events-auto"
                    style={{
                      transformOrigin: '50% 50%',
                      willChange: 'transform',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                  >
                    <svg
                      viewBox="-200 -200 400 400"
                      className="w-full h-full block"
                    >
                      {/* Borde exterior */}
                      <circle cx="0" cy="0" r="190" fill="#0c0c0c" stroke="#FFD600" strokeWidth="4" />

                      {/* Sectores */}
                      {WHEEL_SECTORS.map((sector, i) => (
                        <g key={i}>
                          <path
                            d={getSectorPath(i, 186)}
                            fill={sector.color}
                            stroke="#FFD600"
                            strokeWidth="1.2"
                            strokeOpacity="0.45"
                          />

                          <g transform={`rotate(${i * SECTOR_ANGLE + SECTOR_ANGLE / 2})`}>
                            <text
                              x="0"
                              y="-118"
                              fill={sector.textColor}
                              textAnchor="middle"
                              dominantBaseline="central"
                              style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '28px',
                                fontWeight: 900,
                                letterSpacing: '0.02em',
                              }}
                            >
                              {sector.label}
                            </text>
                          </g>
                        </g>
                      ))}

                      {/* 12 Pernos dorados (uno cada 30°, alineados a los 6 sectores) */}
                      {Array.from({ length: 12 }).map((_, pinIdx) => {
                        const angle = (pinIdx * 30 * Math.PI) / 180;
                        const px = 181 * Math.sin(angle);
                        const py = -181 * Math.cos(angle);
                        return (
                          <circle
                            key={pinIdx}
                            cx={px}
                            cy={py}
                            r={pinIdx % 2 === 0 ? 4.2 : 2.6}
                            fill="#FFD600"
                            stroke="#000"
                            strokeWidth="1.2"
                          />
                        );
                      })}

                      {/* Centro de la rueda */}
                      <circle cx="0" cy="0" r="50" fill="#000000" stroke="#FFD600" strokeWidth="3" />
                      <circle cx="0" cy="0" r="39" fill="#111111" stroke="#FFD600" strokeWidth="1" strokeDasharray="3 3" />
                      <text
                        x="0"
                        y="-7"
                        fill="#FFFFFF"
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '15px',
                          fontWeight: 900,
                          letterSpacing: '0.12em',
                        }}
                      >
                        CHOQUE
                      </text>
                      <text
                        x="0"
                        y="11"
                        fill="#FFD600"
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '15px',
                          fontWeight: 900,
                          letterSpacing: '0.12em',
                        }}
                      >
                        STYLE
                      </text>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Botón GIRAR — Mantiene el espacio reservado para que la ruleta NUNCA se mueva hacia abajo */}
              <div className="dw-spin-btn pt-2 w-full max-w-[440px] flex flex-col items-center justify-center">
                <div className="w-full h-[58px] flex items-center justify-center">
                  <button
                    onClick={handleSpin}
                    onTouchStart={() => unlockAudio()}
                    onMouseDown={() => unlockAudio()}
                    disabled={isSpinning || hasSpun}
                    className={`group relative overflow-hidden bg-[#FFD600] text-black font-extrabold uppercase h-[50px] px-6 transition-all duration-700 ease-out hover:shadow-[0_0_50px_rgba(255,214,0,0.45)] disabled:cursor-not-allowed cursor-pointer w-full text-center flex items-center justify-center ${hasSpun && !isSpinning
                      ? 'opacity-0 scale-95 pointer-events-none'
                      : 'opacity-100 scale-100'
                      }`}
                    style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.14em', fontSize: '0.92rem' }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2 whitespace-nowrap">
                      {isSpinning ? (
                        <>
                          <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          GIRANDO LA RULETA...
                        </>
                      ) : (
                        '¡GIRAR RULETA AHORA!'
                      )}
                    </span>
                    {!isSpinning && (
                      <span className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                    )}
                  </button>
                </div>
                <p
                  className="text-gray-400 text-[11px] sm:text-xs tracking-wide mt-2 text-center"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  * Válido exclusivamente para alumnos nuevos. Aplica sobre el plan mensual contratado.
                </p>
              </div>
            </div>
          )}

          {/* ─── VISTAS 2 y 3: DENTRO DE LA TARJETA ─── */}
          {(currentView === 'lead_form' || currentView === 'winner') && (
            <div
              ref={cardViewRef}
              className="relative z-10 w-full max-w-[500px] bg-[#0a0a0a] border border-[#FFD600]/40 shadow-[0_0_60px_rgba(0,0,0,0.95),0_0_40px_rgba(255,214,0,0.18)] text-white my-auto overflow-hidden"
              style={{ opacity: 0, transform: 'scale(0.92) translateY(20px)' }}
            >
              {/* Acento amarillo */}
              <div className="h-1 w-full bg-[#FFD600]" />

              {/* Barra superior */}
              <div className="dw-topbar flex items-center justify-between px-4 sm:px-6 pt-3 pb-1 border-b border-white/5">
                <div className="flex items-center gap-2">
                </div>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-[#FFD600] text-[11px] uppercase tracking-[0.15em] transition-colors cursor-pointer flex items-center gap-1.5 py-1 px-2 hover:bg-white/5 rounded"
                  style={{ fontFamily: 'var(--font-heading)' }}
                  aria-label="Cerrar modal"
                >
                  <span>Cerrar</span>
                  <span className="text-sm font-bold">✕</span>
                </button>
              </div>

              <div className="p-4 sm:p-6 md:p-7">

                {/* ─── VISTA 2: FORMULARIO DE DATOS ─── */}
                {currentView === 'lead_form' && wonSector && (
                  <div className="space-y-4 text-center">
                    <div className="space-y-1">
                      <h2
                        className="uppercase text-4xl sm:text-5xl text-white tracking-tight"
                        style={{ fontFamily: 'var(--font-display)', lineHeight: 0.95 }}
                      >
                        GANASTE <span className="text-[#FFD600]">{wonSector.label}</span>
                      </h2>
                      <p
                        className="text-gray-300 text-xs sm:text-sm pt-0.5"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        Ingresa tus datos para registrar tu descuento:
                      </p>
                      <p
                        className="text-gray-400 text-[11px] sm:text-xs pt-0.5"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        * Válido exclusivamente para alumnos nuevos. Aplica sobre el plan mensual contratado.
                      </p>
                    </div>

                    {/* Recuadro del formulario */}
                    <div className="bg-[#111111] border border-[#FFD600]/30 p-4 sm:p-5 space-y-3.5 text-left">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span
                          className="text-[11px] uppercase tracking-[0.2em] text-[#FFD600] font-bold"
                          style={{ fontFamily: 'var(--font-heading)' }}
                        >
                          REGISTRO DE DESCUENTO
                        </span>
                        <span
                          className="text-[11px] uppercase tracking-widest text-[#FFD600] font-bold"
                          style={{ fontFamily: 'var(--font-heading)' }}
                        >
                          {wonSector.label}
                        </span>
                      </div>

                      {formErrors.general && (
                        <div className="flex items-center gap-2 p-2.5 bg-red-950/70 border-l-2 border-red-500 text-red-300 text-xs">
                          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                          <span>{formErrors.general}</span>
                        </div>
                      )}

                      <form onSubmit={handleClaimSubmit} className="space-y-3">
                        <div className="space-y-1">
                          <label
                            className="block text-[11px] uppercase tracking-widest text-gray-300 font-bold"
                            style={{ fontFamily: 'var(--font-heading)' }}
                          >
                            Nombre Completo:
                          </label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Tu nombre y apellido"
                            className="w-full px-3.5 py-2.5 sm:py-3 bg-[#0a0a0a] border border-white/15 focus:border-[#FFD600] text-sm text-white placeholder-gray-600 outline-none transition-colors"
                            style={{ fontFamily: 'var(--font-body)' }}
                          />
                          {formErrors.name && (
                            <p className="text-red-400 text-[10px] font-semibold">{formErrors.name}</p>
                          )}
                        </div>

                        {/* Campo RUT chileno */}
                        <div className="space-y-1">
                          <label
                            className="block text-[11px] uppercase tracking-widest text-gray-300 font-bold"
                            style={{ fontFamily: 'var(--font-heading)' }}
                          >
                            RUT:
                          </label>
                          <input
                            type="text"
                            value={rut}
                            onChange={(e) => {
                              setRut(formatRut(e.target.value));
                              if (formErrors.rut) setFormErrors(prev => ({ ...prev, rut: undefined }));
                            }}
                            placeholder="12.345.678-9"
                            maxLength={12}
                            className="w-full px-3.5 py-2.5 sm:py-3 bg-[#0a0a0a] border border-white/15 focus:border-[#FFD600] text-sm text-white placeholder-gray-600 outline-none transition-colors font-mono"
                            style={{ fontFamily: 'var(--font-body)' }}
                          />
                          {formErrors.rut && (
                            <p className="text-red-400 text-[10px] font-semibold">{formErrors.rut}</p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label
                            className="block text-[11px] uppercase tracking-widest text-gray-300 font-bold"
                            style={{ fontFamily: 'var(--font-heading)' }}
                          >
                            Correo Electrónico:
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tucorreo@email.com"
                            className="w-full px-3.5 py-2.5 sm:py-3 bg-[#0a0a0a] border border-white/15 focus:border-[#FFD600] text-sm text-white placeholder-gray-600 outline-none transition-colors"
                            style={{ fontFamily: 'var(--font-body)' }}
                          />
                          {formErrors.email && (
                            <p className="text-red-400 text-[10px] font-semibold">{formErrors.email}</p>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="group relative overflow-hidden bg-[#FFD600] text-black font-extrabold uppercase py-3.5 px-5 w-full transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,214,0,0.4)] cursor-pointer mt-2"
                          style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.14em', fontSize: '0.88rem' }}
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2 whitespace-nowrap">
                            <span>REGISTRAR MI DESCUENTO</span>
                            <ArrowRight className="w-4 h-4" />
                          </span>
                          <span className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* ─── VISTA 3: PANTALLA FINAL — SIN CÓDIGOS ─── */}
                {currentView === 'winner' && savedUser && (
                  <div className="text-center space-y-7 py-6 sm:py-8">
                    <div>
                      <h2
                        className="uppercase text-3xl sm:text-5xl text-white tracking-tight"
                        style={{ fontFamily: 'var(--font-display)', lineHeight: 0.95 }}
                      >
                        ¡GANASTE UN{' '}
                        <span className="text-[#FFD600]">{savedUser.discount}</span>
                        {' '}DE DESCUENTO!
                      </h2>
                    </div>

                    {/* Medallón de Descuento */}
                    <div className="py-8 sm:py-10 bg-[#111111] border-y border-[#FFD600]/40">
                      <div
                        className="text-6xl sm:text-7xl text-[#FFD600] font-bold tracking-tight"
                        style={{ fontFamily: 'var(--font-display)', lineHeight: 0.9 }}
                      >
                        {savedUser.discount} OFF
                      </div>
                    </div>

                    {/* Datos del participante */}
                    <div className="bg-[#111111] border border-[#FFD600]/20 p-6 sm:p-7 text-left space-y-3">
                      <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-2">
                        <span className="w-2 h-2 bg-[#FFD600] inline-block" />
                        <span
                          className="text-[10px] uppercase tracking-[0.2em] text-[#FFD600] font-bold"
                          style={{ fontFamily: 'var(--font-heading)' }}
                        >
                          TUS DATOS REGISTRADOS
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-sm text-gray-300" style={{ fontFamily: 'var(--font-body)' }}>
                          <span className="text-gray-500 text-xs uppercase tracking-wider">Nombre:</span>{' '}
                          <span className="text-white font-semibold">{savedUser.name}</span>
                        </p>
                        <p className="text-sm text-gray-300" style={{ fontFamily: 'var(--font-body)' }}>
                          <span className="text-gray-500 text-xs uppercase tracking-wider">RUT:</span>{' '}
                          <span className="text-[#FFD600] font-mono font-bold">{savedUser.rut || '—'}</span>
                        </p>
                        <p className="text-sm text-gray-300" style={{ fontFamily: 'var(--font-body)' }}>
                          <span className="text-gray-500 text-xs uppercase tracking-wider">Correo:</span>{' '}
                          <span className="text-white font-semibold">{savedUser.email}</span>
                        </p>
                      </div>
                    </div>

                    {/* Mensaje de instrucciones */}
                    <div className="bg-[#0d0d0d] border-l-2 border-[#FFD600] px-5 py-5 sm:py-6 text-left space-y-2">
                      <p
                        className="text-xs sm:text-sm text-gray-200 leading-relaxed"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        <strong className="text-[#FFD600]">¡Felicidades!</strong> Tómale una captura de pantalla a este cupón o menciona tu RUT (<strong className="text-[#FFD600] font-mono">{savedUser.rut}</strong>) al momento de inscribirte para hacer válido tu descuento.
                      </p>
                      <p
                        className="text-[11px] sm:text-xs text-gray-400 leading-normal border-t border-white/10 pt-2"
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        * Beneficio válido exclusivamente para alumnos nuevos. Aplica sobre el plan mensual contratado.
                      </p>
                    </div>

                    {/* Botón Entendido / Cerrar */}
                    <button
                      onClick={handleClose}
                      className="group relative overflow-hidden bg-[#FFD600] text-black font-extrabold uppercase py-3.5 px-6 transition-all duration-300 hover:shadow-[0_0_45px_rgba(255,214,0,0.35)] cursor-pointer w-full"
                      style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.14em', fontSize: '0.88rem' }}
                    >
                      <span className="relative z-10">ENTENDIDO</span>
                      <span className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                    </button>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      )}
    </>
  );
}
