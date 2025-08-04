/**
 * Función de scroll optimizada y simple
 */
export const scrollToSection = (id) => {
  if (id === "inicio") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const el = document.getElementById(id);
  if (!el) {
    console.warn(`Elemento con id "${id}" no encontrado`);
    return;
  }

  const navHeight = 64; // Ajusta según tu navbar
  const screenWidth = window.innerWidth;
  
  // Offset base por dispositivo
  let baseOffset;
  if (screenWidth < 640) {
    baseOffset = -15; // Móvil
  } else if (screenWidth < 1024) {
    baseOffset = -15; // Tablet  
  } else {
    baseOffset = -15; // Desktop
  }
  
  const offsetTop = el.offsetTop - navHeight - baseOffset;
  
  window.scrollTo({ 
    top: Math.max(0, offsetTop),
    behavior: "smooth" 
  });
};

export default scrollToSection;