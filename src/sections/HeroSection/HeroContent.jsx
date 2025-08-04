import { scrollToSection } from "../../utils/scrollToSection";
import heroData from './heroData'; 

export default function HeroContent({ animationStates }) {
  const { title, subtitle, text } = animationStates;
  const { mainTitle, subTitle, description, buttonText } = heroData;

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[80vh] max-w-3xl mx-auto">
      <h1 
        className={`text-6xl sm:text-6xl md:text-7xl lg:text-8xl text-[#FFD600] uppercase leading-tight mb-2 font-black transition-all duration-800 ease-out transform ${
          title ? 'scale-100 opacity-100' : 'scale-70 opacity-0'
        }`}
        style={{ 
          fontFamily: "'Impact', 'Arial Black', 'Bebas Neue', sans-serif", 
          letterSpacing: '0.01em'
        }}
      >
        {mainTitle}
      </h1>

      <h2 
        className={`text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-[#FFD600] uppercase mb-6 font-black transition-all duration-1000 ease-out transform ${
          subtitle ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}
        style={{ 
          fontFamily: "'Impact', 'Arial Black', 'Bebas Neue', sans-serif", 
          letterSpacing: '0.01em'
        }}
      >
        {subTitle}
      </h2>

      <p 
        className={`text-sm sm:text-base md:text-lg text-white mb-8 md:mb-10 leading-relaxed transition-all duration-700 ease-out transform px-4 ${
          text ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {description}
      </p>
      <div className="flex justify-center">
        <button
          onClick={() => scrollToSection("reservar")}
          className="bg-[#FFD600] text-black px-4 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-md font-bold text-sm sm:text-base md:text-lg 
          hover:bg-[#ffeb3b] hover:scale-105 hover:shadow-xl 
          active:bg-[#ffeb3b] active:scale-105 active:shadow-xl
          focus:bg-[#ffeb3b] focus:scale-105 focus:shadow-xl
          transition-all duration-300 transform cursor-pointer shadow-lg"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}