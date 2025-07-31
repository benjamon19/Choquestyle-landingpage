import { Suspense, lazy } from 'react';
import NavigationBar from "./components/Navbar/NavigationBar";
import HeroBanner from "./sections/HeroSection/HeroBanner";

// Carga diferida de secciones
const DisciplinesSection = lazy(() => import('./sections/DisciplinesSection/DisciplinesSection'));

export default function App() {
  return (
    <>
      <NavigationBar />
      <HeroBanner />
      <DisciplinesSection />
    </>
  );
}