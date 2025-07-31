import logo from '../../assets/images/logo.svg';

export default function Logo() {
  if (!logo) return null;
  
  return (
    <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full overflow-hidden transition-all duration-300">
      <img
        src={logo}
        alt="Logo ChoquStyle"
        className="w-full h-full object-cover"
      />
    </div>
  );
}