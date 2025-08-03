import React, { useRef, useEffect, useState } from 'react';

const GalleryCard = ({ gallery, onClick }) => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onClick={() => onClick(gallery)}
      className={`group relative overflow-hidden rounded-2xl bg-[#121212] hover:scale-105 transition-transform duration-500 shadow-lg cursor-pointer transform
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        transition-all duration-700 ease-out`}
    >
      <img
        src={gallery.image}
        alt={gallery.title}
        className="w-full h-64 object-cover object-center"
      />
    </div>
  );
};

export default GalleryCard;
