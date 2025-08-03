// Importar imágenes WebP
import gallery1 from '../../assets/images/gallery/1.webp';
import gallery2 from '../../assets/images/gallery/2.webp';
import gallery3 from '../../assets/images/gallery/3.webp';
import gallery4 from '../../assets/images/gallery/4.webp';
import gallery5 from '../../assets/images/gallery/5.webp';
import gallery6 from '../../assets/images/gallery/6.webp';

// Importar imágenes fallback (JPEG/JPG)
import gallery1Fallback from '../../assets/images/gallery/1.jpeg';
import gallery2Fallback from '../../assets/images/gallery/2.jpeg';
import gallery3Fallback from '../../assets/images/gallery/3.jpeg';
import gallery4Fallback from '../../assets/images/gallery/4.jpeg';
import gallery5Fallback from '../../assets/images/gallery/5.jpeg';
import gallery6Fallback from '../../assets/images/gallery/6.jpeg';

export const galleries = [
  { id: 1, title: 'Galería 1', image: gallery1, fallback: gallery1Fallback },
  { id: 2, title: 'Galería 2', image: gallery2, fallback: gallery2Fallback },
  { id: 3, title: 'Galería 3', image: gallery3, fallback: gallery3Fallback },
  { id: 4, title: 'Galería 4', image: gallery4, fallback: gallery4Fallback },
  { id: 5, title: 'Galería 5', image: gallery5, fallback: gallery5Fallback },
  { id: 6, title: 'Galería 6', image: gallery6, fallback: gallery6Fallback },
];