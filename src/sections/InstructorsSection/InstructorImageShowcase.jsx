import React, { useEffect, useRef, useState } from "react";
import InstructorProfile from "./InstructorProfile";
import { instructors } from "./instructorsData";

const InstructorImageShowcase = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Detectar si es móvil
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 px-4 sm:px-6 lg:px-8 w-full bg-[#121212]"
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-4xl md:text-5xl uppercase leading-tight text-center mb-16 font-bold"
          style={{
            fontFamily: "'Impact', 'Arial Black', sans-serif",
            letterSpacing: "0.05em",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            color: "#FFD600",
          }}
        >
          NUESTROS INSTRUCTORES
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {instructors.map((instructor, index) => (
            <div
              key={instructor.id}
              className={`transform-gpu will-change-transform transition-all duration-[1600ms] ease-out ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-24"
              }`}
              style={{
                transitionDelay: `${index * (isMobile ? 600 : 200)}ms`,
                backgroundColor: "#121212",
              }}
            >
              <InstructorProfile instructor={instructor} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstructorImageShowcase;