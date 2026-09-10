import confetti from 'canvas-confetti';

// ─────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────

export interface WheelSector {
  /** Texto visible en la ruleta (ej. "5% OFF") */
  label: string;
  /** Valor numérico del descuento (ej. 5) */
  value: number;
  /** Color de fondo del sector */
  color: string;
  /** Color del texto del sector */
  textColor: string;
  /** Peso para el algoritmo de probabilidad (0 = imposible ganar) */
  weight: number;
  /** Etiqueta decorativa opcional (ej. "JACKPOT", "VIP") */
  badge?: string;
}

export interface WheelUser {
  id?: string;
  name: string;
  rut: string;
  email: string;
  discount: string;
  date: string;
  status?: 'Pendiente' | 'Canjeado';
}

/**
 * Control global de activación de la ruleta en la web normal (choquestyle.cl).
 * - false: Desactivada temporalmente en la web normal (solo visible con ?jackpot)
 * - true: Activada para todos los visitantes
 */
export const IS_WHEEL_ENABLED_GLOBALLY: boolean = true;

/**
 * URL de la Google Sheets Web App (Apps Script desplegado).
 * Puede configurarse aquí directamente o mediante VITE_GOOGLE_SHEETS_URL en .env.
 */
export const GOOGLE_SHEETS_API_URL: string =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_SHEETS_URL) ||
  'https://script.google.com/macros/s/AKfycbxasz1PXViDPlK2BIPPMACh0Ot1L2aEhzUNjSVUWBC0mFEnOPF8Ri0OrTtCwkRavLHP/exec';

// ─────────────────────────────────────────────────────────────
// CONFIGURACIÓN DE SECTORES
// ─────────────────────────────────────────────────────────────
/**
 * 6 Sectores de 60° cada uno:
 *   - 50% OFF: ROJO (#DC2626) con texto blanco
 *   - 40% OFF: AMARILLO (#FFD600) con texto negro
 *   - 5%, 10%, 20%, 30%: Tonos calibrados de gris con alternancia de contraste
 * 
 * Probabilidades calibradas:
 *   - 5% OFF:  94.5%
 *   - 10% OFF: 2.5%
 *   - 20% OFF: 2.0% (1 de cada 50 personas)
 *   - 30% OFF: 1.0% (1 de cada 100 personas)
 *   - 40% OFF: 0% (visual, imposible ganar)
 *   - 50% OFF: 0% (visual, imposible ganar)
 */
export const WHEEL_SECTORS: WheelSector[] = [
  {
    label: '5% OFF',
    value: 5,
    color: '#141414',
    textColor: '#FFD600',
    weight: 94.5,
  },
  {
    label: '50% OFF',
    value: 50,
    color: '#DC2626',
    textColor: '#FFFFFF',
    weight: 0.0,
  },
  {
    label: '10% OFF',
    value: 10,
    color: '#242426',
    textColor: '#FFFFFF',
    weight: 2.5,
  },
  {
    label: '40% OFF',
    value: 40,
    color: '#FFD600',
    textColor: '#0a0a0a',
    weight: 0.0,
  },
  {
    label: '20% OFF',
    value: 20,
    color: '#181818',
    textColor: '#FFD600',
    weight: 2.0, // 1 de cada 50 giros (2.0%)
  },
  {
    label: '30% OFF',
    value: 30,
    color: '#2e2e33',
    textColor: '#FFFFFF',
    weight: 1.0, // 1 de cada 100 giros (1.0%)
  },
];

export const TOTAL_SECTORS = WHEEL_SECTORS.length; // 6
export const SECTOR_ANGLE = 360 / TOTAL_SECTORS; // 60°

// ─────────────────────────────────────────────────────────────
// ALGORITMO DE SELECCIÓN POR PESOS ACUMULADOS
// ─────────────────────────────────────────────────────────────

/**
 * Detecta si la URL está en modo demostración/grabación de video.
 * Se activa únicamente con el parámetro ?jackpot (ej. ?jackpot, ?jackpot50, ?jackpot40)
 */
export function isDemoMode(): boolean {
  if (typeof window === 'undefined') return false;
  const url = (window.location.search + window.location.hash).toLowerCase();
  return url.includes('jackpot');
}

/**
 * Selecciona el índice del sector ganador mediante pesos ponderados acumulados.
 * Los sectores con weight = 0 NUNCA serán elegidos.
 */
export function pickWinningSectorIndex(): number {
  // MODO ESPECIAL DE GRABACIÓN DE VIDEO:
  // Cae en 50% OFF o 40% OFF según la URL o 50/50 de probabilidad
  if (isDemoMode()) {
    const url = (window.location.search + window.location.hash).toLowerCase();
    const idx50 = WHEEL_SECTORS.findIndex(s => s.value === 50);
    const idx40 = WHEEL_SECTORS.findIndex(s => s.value === 40);

    // Si pide explícitamente solo 40 (ej: ?jackpot40 o ?40off)
    if (url.includes('40') && !url.includes('50')) {
      return idx40 !== -1 ? idx40 : 0;
    }

    // Si está en jackpot50 o demo: 50% de probabilidad para 50% OFF y 50% de probabilidad para 40% OFF
    if (idx50 !== -1 && idx40 !== -1) {
      return Math.random() < 0.5 ? idx50 : idx40;
    }

    return idx50 !== -1 ? idx50 : 0;
  }

  const eligible = WHEEL_SECTORS
    .map((s, idx) => ({ ...s, index: idx }))
    .filter(s => s.weight > 0);

  const totalWeight = eligible.reduce((acc, s) => acc + s.weight, 0);
  const random = Math.random() * totalWeight;

  let accumulated = 0;
  for (const s of eligible) {
    accumulated += s.weight;
    if (random <= accumulated) {
      return s.index;
    }
  }
  return eligible[0].index;
}

// ─────────────────────────────────────────────────────────────
// CÁLCULO DE ROTACIÓN GSAP
// ─────────────────────────────────────────────────────────────

/**
 * Calcula los grados exactos de rotación para posicionar el centro
 * del sector ganador bajo el puntero superior (0° / 12 en punto).
 */
export function calculateWheelRotation(winningIndex: number, currentRotation: number): number {
  const sectorCenterAngle = winningIndex * SECTOR_ANGLE + SECTOR_ANGLE / 2;
  const normalizedCurrent = ((currentRotation % 360) + 360) % 360;
  const delta = (360 - ((sectorCenterAngle + normalizedCurrent) % 360)) % 360;

  // 6 vueltas completas mínimas para 4-5s de giro
  const fullSpins = 6 * 360;

  // Jitter aleatorio ±10° (sector = 60° de ancho, seguro lejos de las divisorias)
  const safeJitter = (Math.random() - 0.5) * 20;

  return currentRotation + fullSpins + delta + safeJitter;
}

// ─────────────────────────────────────────────────────────────
// FORMATEO Y VALIDACIÓN DE RUT CHILENO
// ─────────────────────────────────────────────────────────────

/**
 * Limpia un RUT eliminando caracteres que no sean números ni letra K.
 */
export function cleanRut(rut: string): string {
  return rut.replace(/[^0-9kK]/g, '').toUpperCase();
}

/**
 * Formatea dinámicamente un RUT chileno al estilo XX.XXX.XXX-X
 */
export function formatRut(rut: string): string {
  const cleaned = cleanRut(rut);
  if (!cleaned) return '';
  if (cleaned.length <= 1) return cleaned;

  const dv = cleaned.slice(-1);
  let body = cleaned.slice(0, -1);

  // Limitar cuerpo a máximo 8 dígitos (ej: 99.999.999)
  if (body.length > 8) {
    body = body.slice(0, 8);
  }

  // Insertar separadores de miles
  body = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${body}-${dv}`;
}

/**
 * Valida un RUT chileno mediante el algoritmo Módulo 11.
 */
export function validateRut(rut: string): boolean {
  const cleaned = cleanRut(rut);
  // Un RUT chileno válido tiene entre 8 y 9 caracteres (cuerpo + 1 verificador)
  if (cleaned.length < 8 || cleaned.length > 9) return false;

  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);

  if (!/^\d+$/.test(body)) return false;

  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = 11 - (sum % 11);
  let expectedDv = '';
  if (remainder === 11) expectedDv = '0';
  else if (remainder === 10) expectedDv = 'K';
  else expectedDv = remainder.toString();

  return dv === expectedDv;
}

// ─────────────────────────────────────────────────────────────
// VALIDACIÓN DE EMAIL
// ─────────────────────────────────────────────────────────────

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// ─────────────────────────────────────────────────────────────
// PERSISTENCIA EN LOCALSTORAGE — BLINDADA CON TRY/CATCH
// ─────────────────────────────────────────────────────────────

const LS_KEY_PARTICIPATED = 'wheel_participated';
const LS_KEY_USER = 'wheel_user';
const LS_KEY_EMAIL_HISTORY = 'wheel_email_history';
const LS_KEY_RUT_HISTORY = 'wheel_rut_history';
const LS_KEY_WON_SECTOR = 'wheel_won_sector';
const LS_KEY_ALL_WINNERS = 'wheel_all_winners';
/** Obtiene la URL de Google Sheets guardada o configurada */
export function getGoogleSheetsUrl(): string {
  return GOOGLE_SHEETS_API_URL;
}

/** Obtiene el sector ganado guardado (si giró pero no completó formulario) */
export function getStoredWonSector(): WheelSector | null {
  try {
    const raw = localStorage.getItem(LS_KEY_WON_SECTOR);
    if (!raw) return null;
    return JSON.parse(raw) as WheelSector;
  } catch {
    return null;
  }
}

/** Guarda el sector ganado antes del registro */
export function saveWonSector(sector: WheelSector): void {
  try {
    localStorage.setItem(LS_KEY_WON_SECTOR, JSON.stringify(sector));
  } catch {}
}

/** Limpia el sector ganado guardado */
export function clearWonSector(): void {
  try {
    localStorage.removeItem(LS_KEY_WON_SECTOR);
  } catch {}
}

/** Limpia por completo el almacenamiento de la ruleta (ideal para pruebas y ?reset) */
export function resetWheelStorage(): void {
  try {
    localStorage.removeItem(LS_KEY_PARTICIPATED);
    localStorage.removeItem(LS_KEY_USER);
    localStorage.removeItem(LS_KEY_WON_SECTOR);
    localStorage.removeItem(LS_KEY_EMAIL_HISTORY);
    localStorage.removeItem(LS_KEY_RUT_HISTORY);
    localStorage.removeItem('discount_lead');
    localStorage.removeItem('discount_leads_history');
    localStorage.removeItem('discount_wheel_dismissed');
    sessionStorage.removeItem('discount_wheel_dismissed');
  } catch {}
}

/** Verifica si el usuario ya participó (bandera global) */
export function hasParticipated(): boolean {
  try {
    if (
      typeof window !== 'undefined' &&
      (window.location.search.includes('reset') ||
        window.location.search.includes('test') ||
        isDemoMode())
    ) {
      return false;
    }
    return localStorage.getItem(LS_KEY_PARTICIPATED) === 'true';
  } catch {
    return false;
  }
}

/** Obtiene los datos del participante guardado en el navegador local */
export function getStoredUser(): WheelUser | null {
  try {
    const raw = localStorage.getItem(LS_KEY_USER);
    if (!raw) return null;
    return JSON.parse(raw) as WheelUser;
  } catch {
    return null;
  }
}

/** Guarda la participación definitiva tras registrarse */
export function saveParticipation(user: WheelUser): void {
  // EN MODO DEMO / VIDEO: No bloquear participaciones futuras para permitir pruebas ilimitadas
  if (isDemoMode()) {
    return;
  }

  try {
    localStorage.setItem(LS_KEY_PARTICIPATED, 'true');
    localStorage.setItem(LS_KEY_USER, JSON.stringify(user));

    // Limpiar sector pendiente ya que se convirtió en cupón formal
    clearWonSector();

    // Guardar email en el historial para bloquear duplicados
    const historyRaw = localStorage.getItem(LS_KEY_EMAIL_HISTORY);
    const history: string[] = historyRaw ? JSON.parse(historyRaw) : [];
    const cleanEmail = user.email.toLowerCase();
    if (!history.includes(cleanEmail)) {
      history.push(cleanEmail);
      localStorage.setItem(LS_KEY_EMAIL_HISTORY, JSON.stringify(history));
    }

    // Guardar RUT en el historial para bloquear duplicados
    const rutClean = cleanRut(user.rut);
    const rutHistoryRaw = localStorage.getItem(LS_KEY_RUT_HISTORY);
    const rutHistory: string[] = rutHistoryRaw ? JSON.parse(rutHistoryRaw) : [];
    if (rutClean && !rutHistory.includes(rutClean)) {
      rutHistory.push(rutClean);
      localStorage.setItem(LS_KEY_RUT_HISTORY, JSON.stringify(rutHistory));
    }
  } catch (err) {
    console.error('[Wheel] Error guardando participación:', err);
  }
}

/** Verifica si un email ya fue usado en participaciones previas */
export function isEmailUsed(email: string): boolean {
  try {
    // En entorno de desarrollo o pruebas (?reset, ?test, ?jackpot, localhost), NO bloquear
    if (
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.search.includes('reset') ||
        window.location.search.includes('test') ||
        isDemoMode())
    ) {
      return false;
    }

    const cleanEmail = email.trim().toLowerCase();

    // Verificar en el usuario activo
    const currentUser = getStoredUser();
    if (currentUser && currentUser.email.toLowerCase() === cleanEmail) {
      return true;
    }

    // Verificar en el historial de emails
    const historyRaw = localStorage.getItem(LS_KEY_EMAIL_HISTORY);
    if (historyRaw) {
      const history: string[] = JSON.parse(historyRaw);
      return history.includes(cleanEmail);
    }
  } catch (err) {
    console.error('[Wheel] Error verificando email:', err);
  }
  return false;
}

/** Verifica si un RUT ya fue usado en participaciones previas */
export function isRutUsed(rut: string): boolean {
  try {
    if (
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.search.includes('reset') ||
        window.location.search.includes('test') ||
        isDemoMode())
    ) {
      return false;
    }

    const rutClean = cleanRut(rut);
    if (!rutClean) return false;

    // Verificar en usuario activo
    const currentUser = getStoredUser();
    if (currentUser && cleanRut(currentUser.rut) === rutClean) {
      return true;
    }

    // Verificar en historial de RUTs
    const historyRaw = localStorage.getItem(LS_KEY_RUT_HISTORY);
    if (historyRaw) {
      const history: string[] = JSON.parse(historyRaw);
      return history.includes(rutClean);
    }
  } catch (err) {
    console.error('[Wheel] Error verificando RUT:', err);
  }
  return false;
}

// ─────────────────────────────────────────────────────────────
// SINCRONIZACIÓN CON GOOGLE SHEETS EN LA NUBE
// ─────────────────────────────────────────────────────────────

/**
 * Envía un ganador a Google Sheets vía POST.
 * Incluye fallback automático a localStorage sin bloquear la UI.
 */
export async function submitWinnerToCloud(user: WheelUser): Promise<boolean> {
  // EN MODO DEMO / VIDEO: NO GUARDAR NADA EN GOOGLE SHEETS
  if (isDemoMode()) {
    console.info('[Wheel] Modo Demo activo: No se envía a Google Sheets para mantener limpia la hoja.');
    return true;
  }

  const url = getGoogleSheetsUrl();
  if (!url) {
    console.info('[Wheel] Google Sheets URL no configurada aún; guardado solo localmente.');
    return true;
  }

  try {
    // Usamos text/plain con JSON.stringify para evitar problemas de preflight OPTIONS con Google Apps Script
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'addWinner',
        date: user.date,
        name: user.name,
        rut: user.rut,
        email: user.email,
        discount: user.discount,
        status: user.status || 'Pendiente',
      }),
    });
    return true;
  } catch (error) {
    console.warn('[Wheel] No se pudo enviar a Google Sheets en este momento:', error);
    return false;
  }
}



// ─────────────────────────────────────────────────────────────
// SONIDO Y EFECTOS — COMPATIBILIDAD TOTAL CON IPHONE (IOS) Y MÓVILES
// ─────────────────────────────────────────────────────────────

let sharedAudioCtx: AudioContext | null = null;

function getSharedAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!sharedAudioCtx) {
    const AudioCtxClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtxClass) {
      try {
        sharedAudioCtx = new AudioCtxClass();
      } catch {}
    }
  }
  return sharedAudioCtx;
}

/**
 * Desbloquea síncronamente el motor de audio en iOS / Safari y Android.
 * Debe ser invocado en el evento de toque o click del usuario.
 */
export function unlockAudio(): void {
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    // Micro-buffer de silencio inmediato para activar el hardware de audio en iOS
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
  } catch {}
}

/** Tick mecánico reutilizando el contexto activo para iPhone y móviles */
export function playTickSound(): void {
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(380, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(130, ctx.currentTime + 0.035);

    gain.gain.setValueAtTime(0.22, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // Falla silenciosamente si el navegador bloquea audio
  }
}

/** Confeti premium con paleta Choquestyle */
export function triggerConfetti(): void {
  try {
    const count = 180;
    const defaults = {
      origin: { y: 0.6 },
      colors: ['#FFD600', '#FFFFFF', '#FFA000', '#EF4444', '#E5E5E5'],
      zIndex: 999999,
    };

    const fire = (particleRatio: number, opts: confetti.Options) => {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    };

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  } catch (err) {
    console.error('[Wheel] Error disparando confeti:', err);
  }
}
