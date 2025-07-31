import { useRef } from 'react';
import DisciplineCard from './DisciplineCard';
import useDisciplinesAnimation from './useDisciplinesAnimation';
import { disciplines, sectionContent } from './disciplinesData';

export default function DisciplinesSection() {
  const containerRef = useRef(null);
  useDisciplinesAnimation(containerRef);

  return (
    <section 
      className="py-20 bg-gray-900"
      style={{ backgroundColor: '#121212' }}
      id="disciplinas"
    >
      <div ref={containerRef} className="container mx-auto px-6">
        <h2 
          className="text-4xl md:text-5xl text-[#FFD600] uppercase leading-tight text-center mb-6 font-bold"
          style={{ 
            fontFamily: "'Impact', 'Arial Black', 'Bebas Neue', sans-serif", 
            letterSpacing: '0.05em',
          }}
        >
          {sectionContent.title}
        </h2>
        <p className="text-center text-white text-lg mb-16 max-w-3xl mx-auto leading-relaxed">
          {sectionContent.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {disciplines.map((discipline, index) => (
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