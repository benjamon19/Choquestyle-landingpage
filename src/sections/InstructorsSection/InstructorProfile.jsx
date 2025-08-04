import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

// Importa tus imágenes
import danielChoqueImgWebp from "../../assets/images/couch1.webp";
import danielChoqueImgJpeg from "../../assets/images/couch1.jpeg";
import jhonatanLeuchImgWebp from "../../assets/images/couch2.webp";
import jhonatanLeuchImgJpeg from "../../assets/images/couch2.jpeg";

const imageMap = {
  "Daniel Choque": {
    webp: danielChoqueImgWebp,
    jpeg: danielChoqueImgJpeg,
  },
  "Jhonatan Leuch": {
    webp: jhonatanLeuchImgWebp,
    jpeg: jhonatanLeuchImgJpeg,
  },
};

const instructorDescriptions = {
  "Daniel Choque": "Campeón con 14 títulos nacionales e internacionales. Especialista en kickboxing y muay thai con experiencia en Brasil, Chile y Argentina.",
  "Jhonatan Leuch": "Peleador profesional y cinturón negro especializado en clases personalizadas de MMA, Boxeo y K1. Campeón con 5 títulos profesionales entre Brasil y Chile."
};

const InstructorProfile = ({ instructor }) => {
  const [showAchievements, setShowAchievements] = useState(false);
  const imageSrc = imageMap[instructor.name];

  return (
    <div className="flex flex-col items-center text-center space-y-6 bg-[#121212] text-white">
      {/* Imagen con borde amarillo */}
      <div
        className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden shadow-xl transition-shadow duration-300"
        style={{
          backgroundColor: "#000",
          border: "4px solid #FFD600",
        }}
      >
        <picture>
          <source srcSet={imageSrc?.webp} type="image/webp" />
          <img
            src={imageSrc?.jpeg}
            alt={instructor.name}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.target.style.opacity = "0.6";
              e.target.style.backgroundColor = "#111";
            }}
          />
        </picture>
      </div>

      {/* Contenido */}
      <div className="space-y-4 max-w-md px-4">
        <h3
          className="text-3xl sm:text-4xl md:text-5xl font-bold"
          style={{
            fontFamily: "'Impact', 'Arial Black', 'Bebas Neue', sans-serif",
            color: "#FFFFFF",
          }}
        >
          {instructor.name}
        </h3>

        <p
          className="text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-wide"
          style={{
            fontFamily: "'Impact', 'Arial Black', sans-serif",
            color: "#FFD600",
          }}
        >
          {instructor.title}
        </p>

        {instructor.achievements && (
          <div className="space-y-4">
            <p className="text-sm sm:text-base leading-relaxed text-gray-300">
              {instructorDescriptions[instructor.name]}
            </p>

            {/* Solo este elemento fue modificado */}
            <button
              onClick={() => setShowAchievements(!showAchievements)}
              className="flex items-center justify-center mx-auto text-[#FFD600] hover:text-white transition-colors duration-300 text-sm font-medium cursor-pointer"
            >
              <span className="underline">
                {showAchievements ? "Ocultar logros" : "Ver logros completos"}
              </span>
              <span className="ml-2">
                {showAchievements ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
              </span>
            </button>

            {/* Caja de logros */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                showAchievements ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="mt-3 mx-auto max-w-xs rounded-md bg-[#121212] px-3 py-2 space-y-2 overflow-y-auto max-h-40 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                {instructor.achievements.map((achievement, idx) => (
                  <div
                    key={idx}
                    className="text-sm text-[#E0E0E0] py-1 px-2 rounded-md border-l-4 border-[#FFD600] hover:bg-gray-800/40 transition-colors"
                  >
                    • {achievement}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorProfile;