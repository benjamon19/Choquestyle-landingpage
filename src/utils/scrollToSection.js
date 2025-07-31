/**
 * Función utilitaria para hacer scroll súper inteligente a secciones
 * Detecta automáticamente el mejor punto de scroll basándose en el contenido
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

  // 📏 ALTURA DEL NAVBAR: 64px = h-16 | 80px = h-20 | ajusta según tu nav
  const navHeight = 64;
  
  // Detección inteligente del contenido
  const getSmartOffset = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Detectar el primer elemento con contenido significativo
    const titleElement = el.querySelector('h1, h2, h3, .title, [class*="title"]');
    const contentElement = el.querySelector('p, .content, [class*="content"]');
    
    let baseOffset;
    
    // 📱 OFFSET BASE POR DISPOSITIVO: ajusta estos valores para más/menos espacio
    if (screenWidth < 640) {
      baseOffset = -15; // 📱 MÓVIL: menos espacio
    } else if (screenWidth < 1024) {
      baseOffset = -15; // 📱 TABLET: espacio medio
    } else {
      baseOffset = 40; // 💻 DESKTOP: más espacio
    }
    
    // Ajuste inteligente basado en la altura de pantalla
    const screenHeightFactor = Math.min(screenHeight / 800, 1.5);
    baseOffset *= screenHeightFactor;
    
    // Si hay un título, usar su posición como referencia
    if (titleElement) {
      const titleRect = titleElement.getBoundingClientRect();
      const sectionRect = el.getBoundingClientRect();
      const titleOffsetInSection = titleRect.top - sectionRect.top;
      
      // 🎯 AJUSTE TÍTULO: si el título está muy abajo, ajustar más
      if (titleOffsetInSection > 100) {
        baseOffset += titleOffsetInSection * 0.3; // 📐 Factor de ajuste (0.1-0.5)
      }
    }
    
    // 🖼️ AJUSTE CONTENIDO VISUAL: más espacio para imágenes/cards
    const hasImages = el.querySelectorAll('img, video, canvas').length > 0;
    const hasCards = el.querySelectorAll('[class*="card"], [class*="box"]').length > 0;
    
    if (hasImages || hasCards) {
      baseOffset += 20; // 📐 ESPACIO EXTRA para contenido visual
    }
    
    return Math.round(baseOffset);
  };
  
  const smartOffset = getSmartOffset();
  const offsetTop = el.offsetTop - navHeight - smartOffset;
  
  window.scrollTo({ 
    top: Math.max(0, offsetTop),
    behavior: "smooth" 
  });
};

/**
 * Versión con detección de intersección para scroll perfecto
 */
export const scrollToSectionPerfect = (id) => {
  if (id === "inicio") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const el = document.getElementById(id);
  if (!el) {
    console.warn(`Elemento con id "${id}" no encontrado`);
    return;
  }

  const navHeight = 80;
  const screenHeight = window.innerHeight;
  const sectionHeight = el.offsetHeight;
  
  // Calcular el punto óptimo para centrar visualmente el contenido
  let targetOffset;
  
  if (sectionHeight < screenHeight * 0.8) {
    // Sección pequeña: centrarla en pantalla
    targetOffset = el.offsetTop - navHeight - ((screenHeight - sectionHeight) / 3);
  } else {
    // Sección grande: mostrar desde el inicio con padding inteligente
    const smartPadding = Math.min(screenHeight * 0.1, 80);
    targetOffset = el.offsetTop - navHeight - smartPadding;
  }
  
  window.scrollTo({ 
    top: Math.max(0, targetOffset),
    behavior: "smooth" 
  });
};

/**
 * Versión que detecta el "sweet spot" visual de cada sección
 */
export const scrollToSectionSweetSpot = (id) => {
  if (id === "inicio") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const el = document.getElementById(id);
  if (!el) {
    console.warn(`Elemento con id "${id}" no encontrado`);
    return;
  }

  const navHeight = 80;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  
  // Analizar el contenido de la sección
  const analyzeSection = () => {
    const children = Array.from(el.children);
    let bestElement = null;
    let bestScore = 0;
    
    children.forEach((child, index) => {
      let score = 0;
      
      // Priorizar elementos con texto importante
      if (child.querySelector('h1, h2, h3')) score += 10;
      if (child.querySelector('p')) score += 5;
      if (child.querySelector('img, video')) score += 8;
      
      // Elementos en la primera mitad tienen más score
      if (index < children.length / 2) score += 3;
      
      // Elementos con clases específicas
      const classList = child.className.toLowerCase();
      if (classList.includes('title') || classList.includes('header')) score += 8;
      if (classList.includes('content') || classList.includes('description')) score += 6;
      
      if (score > bestScore) {
        bestScore = score;
        bestElement = child;
      }
    });
    
    return bestElement;
  };
  
  const targetElement = analyzeSection();
  let targetOffset;
  
  if (targetElement) {
    // Usar el elemento más importante como referencia
    const elementOffset = targetElement.offsetTop;
    const padding = screenWidth < 768 ? 20 : 40;
    targetOffset = elementOffset - navHeight - padding;
  } else {
    // Fallback al comportamiento estándar
    const defaultPadding = screenWidth < 768 ? 25 : 50;
    targetOffset = el.offsetTop - navHeight - defaultPadding;
  }
  
  window.scrollTo({ 
    top: Math.max(0, targetOffset),
    behavior: "smooth" 
  });
};

// Exportar la función principal (puedes cambiar cuál usar)
export { scrollToSection as default };