import { Suspense, lazy } from 'react';
import NavigationBar from "./components/Navbar/NavigationBar";
import HeroBanner from "./sections/HeroSection/HeroBanner";
import FooterBar from './components/Footer/FooterBar';

// Carga diferida de secciones
const DisciplinesSection = lazy(() => import('./sections/DisciplinesSection/DisciplinesSection'));
const InstructorsSection = lazy(() => import('./sections/InstructorsSection/InstructorsSection'));
const ScheduleSection = lazy(() => import('./sections/ScheduleSection/ScheduleSection'));
const GallerySection = lazy(() => import('./sections/GallerySection/GallerySection'));
const ReservationSection = lazy(() => import('./sections/ReservationSection/ReservationSection'));
const ContactSection = lazy(() => import('./sections/ContactSection/ContactSection'));

export default function App() {
  return (
    <>
      <NavigationBar />
      <HeroBanner />
        <DisciplinesSection />
        <InstructorsSection />
        <ScheduleSection />
        <GallerySection />
        <ReservationSection />
        <ContactSection />
        <FooterBar />
    </>
  );
}