import React from 'react';
import ScheduleTable from './ScheduleTable';

const ScheduleContent = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 
          className="text-4xl md:text-5xl text-[#FFD600] uppercase leading-tight text-center mb-6 font-bold"
          style={{ 
            fontFamily: "'Anton SC', 'Impact', 'Arial Black', sans-serif",
          }}
        >
          HORARIO DE CLASES
        </h2>
      </div>

      <ScheduleTable />
      
      <div className="mt-8 text-center">
        <p className="text-gray-300 text-sm">
          * Los horarios pueden estar sujetos a cambios. Consulta siempre con recepción | 
          Las clases de Jhonatan se pagan por sesión, las clases de Daniel se pagan por mensualidad.
        </p>
      </div>
    </div>
  );
};

export default ScheduleContent;