import { useState } from "react";
import { FaTimes, FaBars } from "react-icons/fa";
import { navItems } from "./navItems";
import Logo from "./Logo";
import { scrollToSection } from "../../utils/scrollToSection";

export default function NavigationBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (item) => {
    scrollToSection(item.toLowerCase());
    setMenuOpen(false);
  };

  return (
    <nav className="bg-black/60 backdrop-blur-md text-white shadow-lg fixed top-0 left-0 right-0 z-50 border-b border-yellow-400/30">
      <div className="relative h-16 px-6 max-w-screen-xl mx-auto flex items-center">
        <div className="flex items-center space-x-3">
          <Logo />
        </div>

        {/* Botón hamburguesa - Móvil */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden ml-auto p-2 focus:outline-none transition-transform duration-300"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          <div className={`transition-transform duration-300 ${menuOpen ? "rotate-90" : ""}`}>
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </div>
        </button>

        {/* Menú Desktop */}
        <div className="hidden lg:flex lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 space-x-4 xl:space-x-6">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => handleNavClick(item)}
              className="cursor-pointer hover:text-yellow-400 hover:scale-105 transition-all duration-300 font-medium text-sm xl:text-base uppercase tracking-wide whitespace-nowrap px-1 py-0.5"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Menú móvil desplegable */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } bg-gradient-to-b from-black/50 via-black/40 to-black/30 backdrop-blur-lg border-t border-yellow-400/20`}
      >
        <div className="px-6 py-4 space-y-2">
          {navItems.map((item, index) => (
            <button
              key={item}
              onClick={() => handleNavClick(item)}
              className="block w-full text-left font-medium uppercase tracking-wide cursor-pointer hover:text-yellow-400 hover:translate-x-2 transition-all duration-300 py-1 px-2 rounded-md hover:bg-yellow-400/10 border-l-2 border-transparent hover:border-yellow-400"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}