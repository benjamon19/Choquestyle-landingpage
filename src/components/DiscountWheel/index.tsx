import React, { useState, useEffect } from 'react';
import DiscountWheelModal from './DiscountWheelModal';
import { isDemoMode, IS_WHEEL_ENABLED_GLOBALLY } from './wheelConfig';

/**
 * Componente unificado de la Ruleta de Descuentos.
 * 
 * - Si IS_WHEEL_ENABLED_GLOBALLY es false, la ruleta normal en choquestyle.cl está desactivada.
 * - Si la URL contiene ?jackpot (modo video/demo), SIEMPRE se activa y funciona.
 */
export default function DiscountWheel() {
  const [shouldRender, setShouldRender] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return IS_WHEEL_ENABLED_GLOBALLY || isDemoMode();
  });

  useEffect(() => {
    const checkStatus = () => {
      setShouldRender(IS_WHEEL_ENABLED_GLOBALLY || isDemoMode());
    };

    window.addEventListener('hashchange', checkStatus);
    window.addEventListener('popstate', checkStatus);
    return () => {
      window.removeEventListener('hashchange', checkStatus);
      window.removeEventListener('popstate', checkStatus);
    };
  }, []);

  // Si está desactivada globalmente y no estamos en ?jackpot, no renderiza nada en la web
  if (!shouldRender) {
    return null;
  }

  return <DiscountWheelModal />;
}

export { default as DiscountWheelModal } from './DiscountWheelModal';
export * from './wheelConfig';
