import { useEffect } from 'react';

export default function useDisciplinesAnimation(containerRef) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            entry.target.style.transitionDelay = `${index * 100}ms`;
            entry.target.classList.remove('opacity-0', 'translate-y-6');
            entry.target.classList.add('opacity-100', 'translate-y-0');

            setTimeout(() => {
              entry.target.style.transitionDelay = '';
            }, 600);
          }
        });
      },
      { threshold: 0.05 }
    );

    const handleMouseEnter = (e) => {
      const icon = e.currentTarget.querySelector('.discipline-icon');
      if (icon) {
        icon.style.transform = 'translateY(-10px) rotate(10deg) scale(1.1)';
        icon.style.transition = 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1.5)';
      }
    };

    const handleMouseLeave = (e) => {
      const icon = e.currentTarget.querySelector('.discipline-icon');
      if (icon) {
        icon.style.transform = '';
        icon.style.transition = 'all 0.3s ease-out';
      }
    };

    const handleClick = (e) => {
      // Solo en móvil
      if (window.innerWidth <= 768) {
        const icon = e.currentTarget.querySelector('.discipline-icon');
        if (icon) {
          icon.style.transform = 'translateY(-15px) rotate(15deg) scale(1.2)';
          setTimeout(() => {
            icon.style.transform = '';
          }, 300);
        }
      }
    };

    const cards = containerRef.current?.querySelectorAll('.discipline-card');
    cards?.forEach((card) => {
      observer.observe(card);
      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);
      card.addEventListener('click', handleClick);
    });

    return () => {
      cards?.forEach((card) => {
        observer.unobserve(card);
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mouseleave', handleMouseLeave);
        card.removeEventListener('click', handleClick);
      });
    };
  }, [containerRef]);
}