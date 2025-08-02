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
      className="flex-shrink-0 w-80 bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center text-center mx-4"
      style={{
        borderRadius: '0.75rem',
        backgroundColor: '#1E1E1E',
        border: '2px solid #333333',
      }}
    >
      <div className="mb-4">
        <Icon className="text-yellow-400 text-4xl" />
      </div>
      <h3 className="text-2xl font-bold text-white uppercase mb-3 tracking-wide">
        {title}
      </h3>
      <p className="text-white leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}