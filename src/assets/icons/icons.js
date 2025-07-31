import { 
  GiBoxingGlove,
  GiKarateUniform,
  GiKickScooter,
  GiSwordman,
  GiWeightLiftingUp
} from 'react-icons/gi';
import { 
  FaClock,
  FaUserFriends,
  FaImage,
  FaCalendarAlt,
  FaPhoneAlt
} from 'react-icons/fa';

export const disciplineIcons = {
  boxing: <GiBoxingGlove className="text-yellow-500 text-4xl" />,
  muaythai: <GiKickScooter className="text-yellow-500 text-4xl" />,
  k1: <GiSwordman className="text-yellow-500 text-4xl" />,
  mma: <GiKarateUniform className="text-yellow-500 text-4xl" />,
  kick: <GiWeightLiftingUp className="text-yellow-500 text-4xl" />
};

export const sectionIcons = {
  schedule: <FaClock className="text-yellow-500" />,
  trainers: <FaUserFriends className="text-yellow-500" />,
  gallery: <FaImage className="text-yellow-500" />,
  booking: <FaCalendarAlt className="text-yellow-500" />,
  contact: <FaPhoneAlt className="text-yellow-500" />
};