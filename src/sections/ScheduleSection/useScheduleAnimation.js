// useScheduleAnimation.js
import { useState } from 'react';

export default function useScheduleAnimation() {
  const [activeCell, setActiveCell] = useState(null);

  const handleMobileClick = (day, rowIndex) => {
    const cellKey = `${day}-${rowIndex}`;
    setActiveCell(cellKey);
    setTimeout(() => {
      setActiveCell(null);
    }, 1000);
  };

  const handleCellEnter = (day, rowIndex) => {
    setActiveCell(`${day}-${rowIndex}`);
  };

  const handleCellLeave = () => {
    setActiveCell(null);
  };

  const getCellClasses = (hasContent, day, rowIndex) => {
    const cellKey = `${day}-${rowIndex}`;
    const isActive = activeCell === cellKey;

    return [
      'bg-[#333232] text-white text-center py-6 px-4 text-sm border-r border-[#454445] transition-all duration-150',
      hasContent
        ? 'hover:bg-[#FFD600] hover:text-black hover:scale-105 hover:font-bold'
        : '',
      isActive && hasContent
        ? 'bg-[#FFD600] scale-105 font-bold'
        : '',
    ].join(' ');
  };

  return {
    getCellClasses,
    handleMobileClick,
    handleCellEnter,
    handleCellLeave,
    activeCell,
  };
}