import { FaUserPlus, FaFistRaised, FaClock } from 'react-icons/fa';

export const reservationContent = {
  title: "RESERVA TU CLASE",
  subtitle: "Da el primer paso hacia tu transformación. Tu primera clase te espera.",
  reservationUrl: "https://api.nfit.app/shared?href=58d9a368e992fb69fc575aefeed8b281"
};

export const features = [
  {
    id: 1,
    icon: FaFistRaised,
    title: "Primera Experiencia",
    description: "Conoce nuestro método de entrenamiento"
  },
  {
    id: 2,
    icon: FaClock,
    title: "Sin Compromiso", 
    description: "Prueba sin obligación de inscribirte"
  },
  {
    id: 3,
    icon: FaUserPlus,
    title: "Solo Nuevos",
    description: "Exclusivo para alumnos nuevos"
  }
];

export const rules = [
  {
    id: 1,
    title: "Solo para alumnos nuevos:",
    description: "Esta clase está diseñada exclusivamente para personas que nunca han entrenado en Choquestyle."
  },
  {
    id: 2,
    title: "Una sola vez por persona:",
    description: "Cada persona puede tomar únicamente una clase de prueba gratuita."
  },
  {
    id: 3,
    title: "Alumnos actuales:",
    description: "Si ya eres parte de nuestra familia Choquestyle, utiliza los canales regulares para reservar tus clases."
  },
];

export const texts = {
  badgeText: "Clase de Prueba Gratuita",
  rulesToggle: {
    show: "Ver reglas importantes",
    hide: "Ocultar reglas"
  },
  rulesTitle: "Reglas para la Clase de Prueba",
  buttonText: "¿A qué esperas",
  buttonSubtext: "Al hacer clic serás redirigido a nuestro sistema de reservas"
};