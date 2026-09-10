import React, { useState, useEffect } from 'react';
import DiscountWheelModal from './DiscountWheelModal';
import DiscountWheelAdmin from './DiscountWheelAdmin';
import { ADMIN_SECRET_ROUTE } from './wheelConfig';

/**
 * Componente unificado de la Ruleta de Descuentos.
 * 
 * Si la URL contiene el hash o parámetro secreto (ej. #/ganadores-ruleta-choque2025 o ?panel=choque2025),
 * renderiza el Panel Administrativo para buscar y consultar ganadores.
 * 
 * En cualquier otro caso, renderiza la Ruleta habitual para los visitantes de la web.
 * 
 * 100% revocable: Si la campaña termina, solo elimina la carpeta /DiscountWheel y su línea en App.tsx.
 */
export default function DiscountWheel() {
  const [isAdminView, setIsAdminView] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname;
    const hash = window.location.hash;
    const search = window.location.search;

    return (
      hash.includes(ADMIN_SECRET_ROUTE) ||
      hash.includes('ganadores') ||
      path.includes(ADMIN_SECRET_ROUTE) ||
      path.includes('ganadores') ||
      search.includes('panel=choque') ||
      search.includes('admin=choque')
    );
  });

  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const search = window.location.search;

      setIsAdminView(
        hash.includes(ADMIN_SECRET_ROUTE) ||
        hash.includes('ganadores') ||
        path.includes(ADMIN_SECRET_ROUTE) ||
        path.includes('ganadores') ||
        search.includes('panel=choque') ||
        search.includes('admin=choque')
      );
    };

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  if (isAdminView) {
    return <DiscountWheelAdmin />;
  }

  return <DiscountWheelModal />;
}

export { default as DiscountWheelModal } from './DiscountWheelModal';
export { default as DiscountWheelAdmin } from './DiscountWheelAdmin';
export * from './wheelConfig';
