export default function Logo() {
  return (
    <div className="w-12 h-12 md:w-13 md:h-13 flex items-center justify-center rounded-full overflow-hidden transition-all duration-300">
      <img
        src="/images/logo.svg" 
        alt="Logo ChoquStyle"
        className="w-full h-full object-cover"
      />
    </div>
  );
}