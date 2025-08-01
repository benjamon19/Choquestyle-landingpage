// ScheduleTable.js
import React from 'react';
import { scheduleData, days } from './scheduleData.js';
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

    return (
      <div
        key={cellKey}
        className={getCellClasses(hasContent, dayKey, rowIndex)}
        onMouseEnter={hasContent ? () => handleCellEnter(dayKey, rowIndex) : undefined}
        onMouseLeave={hasContent ? handleCellLeave : undefined}
        onTouchStart={hasContent ? () => handleMobileClick(dayKey, rowIndex) : undefined}
        style={{ cursor: 'default' }}
      >
        {content && (
          <span
            style={{
              color: isActive ? '#000' : '#fff',
              fontWeight: isActive ? 'bold' : 'bold', // ✅ Siempre negrita
            }}
            className="block font-bold transition-colors duration-150"
          >
            {content}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto overflow-x-auto my-8">
      <div className="min-w-[800px] rounded-xl overflow-hidden shadow-2xl border border-[#454445]">
        
        {/* Header */}
        <div className="grid grid-cols-7 gap-0">
          <div 
            className="bg-[#FFD600] text-black font-bold text-center py-6 px-4 text-sm border-r border-[#454445]"
            style={{ cursor: 'default' }}
          >
            HORA
          </div>
          {days.map((day) => (
            <div
              key={day}
              className="bg-[#FFD600] text-black font-bold text-center py-6 px-4 text-sm border-r border-[#454445] last:border-r-0"
              style={{ cursor: 'default' }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Filas */}
        {scheduleData.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-7 gap-0 border-t border-[#454445]">
            {/* Hora */}
            <div
              className="bg-[#1c1c1c] text-white text-center py-6 px-4 text-sm font-medium border-r border-[#454445]"
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
  );
};

export default ScheduleTable;