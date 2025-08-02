import React from 'react';
import { scheduleData, days } from './ScheduleData.js';
import useScheduleAnimation from './useScheduleAnimation.js';

const ScheduleTable = () => {
  const {
    getCellClasses,
    handleMobileClick,
    handleCellEnter,
    handleCellLeave,
    activeCell,
  } = useScheduleAnimation();

  const dayKeys = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

  const renderCell = (content, dayKey, rowIndex) => {
    const hasContent = !!content;
    const cellKey = `${dayKey}-${rowIndex}`;
    const isActive = activeCell === cellKey;

    let mainText = '';
    let subText = '';

    if (hasContent) {
      const parts = content.split(' (');
      mainText = parts[0];
      subText = parts[1]?.replace(')', '');
    }
    
    return (
      <div
        key={cellKey}
        className={`
          ${getCellClasses(hasContent, dayKey, rowIndex)} 
          min-h-[36px] sm:min-h-[64px] 
          px-2 sm:px-4 
          flex items-center justify-center
        `}
        onMouseEnter={hasContent ? () => handleCellEnter(dayKey, rowIndex) : undefined}
        onMouseLeave={hasContent ? handleCellLeave : undefined}
        onTouchStart={hasContent ? () => handleMobileClick(dayKey, rowIndex) : undefined}
        style={{ cursor: 'default' }}
      >
        {hasContent && (
          <div className="text-center leading-tight">
            <span
              style={{
                color: isActive ? '#000' : '#fff',
                fontWeight: 600,
              }}
              className="block text-[10px] sm:text-xs md:text-sm whitespace-nowrap"
            >
              {mainText}
            </span>
            {subText && (
              <span className="block text-[9px] text-gray-400 mt-0.5">
                {subText}
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto my-8 px-4">
      {/* Scroll horizontal para móviles */}
      <div className="overflow-x-auto">
        {/* Contenedor de la tabla */}
        <div className="min-w-[800px] rounded-xl overflow-hidden shadow-2xl border border-[#454445]">
          {/* Header */}
          <div className="grid grid-cols-7 gap-0 text-sm">
            <div
              className="bg-[#FFD600] text-black font-bold text-center py-3 px-2 border-r border-[#454445] sm:py-4 sm:px-4"
              style={{ cursor: 'default' }}
            >
              HORA
            </div>
            {days.map((day) => (
              <div
                key={day}
                className="bg-[#FFD600] text-black font-bold text-center py-3 px-2 border-r border-[#454445] sm:py-4 sm:px-4 last:border-r-0 text-xs sm:text-sm"
                style={{ cursor: 'default' }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Filas */}
          {scheduleData.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`grid grid-cols-7 gap-0 ${
                rowIndex === 3
                  ? 'border-t-2 border-t-[#FFD600]'
                  : 'border-t border-[#454445]'
              }`}
            >
              {/* Hora */}
              <div
                className="bg-[#1c1c1c] text-white text-center py-2 px-2 font-medium border-r border-[#454445] text-xs sm:py-6 sm:px-4 sm:text-sm"
                style={{ cursor: 'default' }}
              >
                {row.time}
              </div>

              {/* Celdas */}
              {dayKeys.map((dayKey) => renderCell(row[dayKey], dayKey, rowIndex))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduleTable;
