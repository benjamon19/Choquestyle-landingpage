import React from 'react';
import DisciplineCard from './DisciplineCard';
import { disciplines, sectionContent } from './disciplinesData';

export default function DisciplinesSection() {
  // Triplicamos las disciplinas
  const triplicatedDisciplines = [...disciplines, ...disciplines, ...disciplines];
  
  return (
    <section 
      className="py-20 bg-gray-900 w-full"
      style={{ backgroundColor: '#121212' }}
      id="disciplinas"
    >
      <style>
        {`
          @keyframes scroll-desktop {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-400px * 5));
            }
          }
          
          @keyframes scroll-mobile {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-320px * 5));
            }
          }
          
          .scroll-animation {
            animation: scroll-desktop 35s linear infinite;
          }
          
          /* Responsive */
          @media (max-width: 768px) {
            .scroll-animation {
              animation: scroll-mobile 25s linear infinite;
            }
          }
        `}
      </style>
      
      {/* Títulos centrados con contenedor normal */}
      <div className="container mx-auto px-6 mb-16">
        <h2 
          className="text-4xl md:text-5xl text-[#FFD600] uppercase leading-tight text-center mb-6 font-bold"
          style={{
            fontFamily: "'Impact', 'Arial Black', 'Bebas Neue', sans-serif",
            letterSpacing: '0.05em',
          }}
        >
          {sectionContent.title}
        </h2>
        <p className="text-center text-gray-300 text-sm max-w-3xl mx-auto leading-relaxed">
          {sectionContent.description}
        </p>
      </div>
      
      {/* Carrusel de ancho completo - SIN container */}
      <div className="w-full overflow-hidden">
        <div 
          className="flex scroll-animation"
          style={{
            width: 'calc(400px * 15)', // Desktop: 400px por carta
          }}
        >
          {triplicatedDisciplines.map((discipline, index) => (
            <DisciplineCard
              key={index}
              iconName={discipline.iconName}
              title={discipline.title}
              description={discipline.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}