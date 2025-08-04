import React from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaChevronDown, FaChevronUp } from 'react-icons/fa';

// Componente para el título principal
export const ReservationTitle = ({ title }) => (
  <h2
    className="text-4xl md:text-5xl uppercase leading-tight mb-6 font-bold tracking-wide"
    style={{
      fontFamily: "'Impact', 'Arial Black', sans-serif",
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
      color: '#FFD600',
    }}
  >
    {title}
  </h2>
);

// Componente para el subtítulo
export const ReservationSubtitle = ({ subtitle }) => (
  <p className="text-center text-white leading-relaxed text-lg max-w-2xl mx-auto mb-12">
    {subtitle}
  </p>
);

// Componente para las características/features
export const FeaturesGrid = ({ features }) => (
  <div className="grid md:grid-cols-3 gap-6 mb-8">
    {features.map((feature) => {
      const IconComponent = feature.icon;
      return (
        <div key={feature.id} className="flex flex-col items-center text-center space-y-3">
          <div className="w-16 h-16 bg-[#FFD600] rounded-full flex items-center justify-center">
            <IconComponent className="text-black text-xl" />
          </div>
          <h3 className="text-white font-bold text-lg uppercase tracking-wide">{feature.title}</h3>
          <p className="text-white leading-relaxed text-sm">{feature.description}</p>
        </div>
      );
    })}
  </div>
);

// Componente para el botón de toggle de reglas (mejorado con cursor pointer)
export const RulesToggle = ({ showRules, onToggle, texts }) => (
  <button
    onClick={onToggle}
    className="flex items-center justify-center mx-auto text-[#FFD600] hover:text-white transition-colors duration-300 mb-6 text-sm font-medium cursor-pointer"
  >
    <span className="underline">{showRules ? texts.rulesToggle.hide : texts.rulesToggle.show}</span>
    <span className="ml-2">
      {showRules ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
    </span>
  </button>
);

// Componente para las reglas expandibles
export const RulesSection = ({ showRules, rules, rulesTitle }) => (
  <div className={`overflow-hidden transition-all duration-500 ease-in-out mb-6 ${
    showRules ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
  }`}>
    <div 
      className="rounded-xl p-6 border-l-4"
      style={{
        backgroundColor: '#1E1E1E',
        border: '2px solid #333333',
        borderLeft: '4px solid #FFD600'
      }}
    >
      <div className="flex items-start space-x-3 mb-4">
        <FaExclamationTriangle className="text-[#FFD600] mt-1 flex-shrink-0" />
        <div>
          <h4 className="text-white font-bold text-lg mb-2 uppercase tracking-wide">{rulesTitle}</h4>
          <div className="space-y-3 text-white text-sm">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-start space-x-2">
                <FaCheckCircle className="text-green-400 mt-0.5 flex-shrink-0" />
                <span><strong>{rule.title}</strong> {rule.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Componente para el botón principal
export const ReservationButton = ({ onReservation, buttonText, buttonSubtext }) => (
  <div>
    <button
      onClick={onReservation}
      className="w-full bg-[#FFD600] text-black px-4 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-md text-sm sm:text-base md:text-lg uppercase tracking-wide 
        transition-all duration-300 transform cursor-pointer shadow-lg
        hover:bg-[#ffeb3b] hover:scale-105 hover:shadow-xl
        active:bg-[#ffeb3b] active:scale-105 active:shadow-xl
        focus:bg-[#ffeb3b] focus:scale-105 focus:shadow-xl"
      style={{
        fontFamily: "'Impact', 'Arial Black', sans-serif",
      }}
    >
      {buttonText}
    </button>
    <p className="text-gray-300 text-xs mt-4">
      {buttonSubtext}
    </p>
  </div>
);