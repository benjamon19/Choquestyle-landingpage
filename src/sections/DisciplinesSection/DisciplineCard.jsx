import { GiBoxingGlove, GiHighKick } from 'react-icons/gi';
import { FaPrayingHands, FaUserNinja } from 'react-icons/fa';
import { TbMoodKidFilled } from 'react-icons/tb';

const iconComponents = {
  boxing: GiBoxingGlove,
  kick: GiHighKick,
  muaythai: FaPrayingHands,
  mma: FaUserNinja,
  kids: TbMoodKidFilled
};

export default function DisciplineCard({ iconName, title, description }) {
  const Icon = iconComponents[iconName];
  
  return (
    <div 
      className="discipline-card opacity-0 translate-y-6 bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-out flex flex-col items-center text-center group hover:scale-105 cursor-default"
      style={{ 
        borderRadius: '0.75rem',
        backgroundColor: '#1E1E1E',
        border: '2px solid #333333',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#FFD600';
        e.currentTarget.style.transitionDelay = '0ms';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#333333';
        e.currentTarget.style.transitionDelay = '';
      }}
    >
      <div className="mb-4 discipline-icon transition-transform duration-300">
        <Icon className="text-yellow-400 text-4xl" />
      </div>
      <h3 className="text-2xl font-bold text-white uppercase mb-3 tracking-wide">
        {title}
      </h3>
      <p className="text-white leading-relaxed text-sm md:text-base">
        {description}
      </p>
    </div>
  );
}