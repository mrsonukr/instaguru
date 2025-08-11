import 'swiper/css';
import 'swiper/css/autoplay'; // optional, for autoplay feature
import Routing from './Routing'; // Adjust the path if needed
import { LanguageProvider } from './context/LanguageContext';
import { debugLanguageDetection } from './utils/languageUtils';
import { initPerformanceOptimizations } from './utils/performanceUtils';
import { registerServiceWorker, checkServiceWorkerStatus } from './utils/serviceWorkerUtils';

const App = () => {
  // Debug language detection on app start
  debugLanguageDetection();
  
  // Initialize performance optimizations and service worker
  if (typeof window !== 'undefined') {
    // Initialize after a short delay to not block initial render
    setTimeout(() => {
      initPerformanceOptimizations();
      registerServiceWorker();
      checkServiceWorkerStatus();
    }, 100);
  }
  
  return (
    <LanguageProvider>
      <div>
        <Routing />
      </div>
    </LanguageProvider>
  );
};

export default App;
