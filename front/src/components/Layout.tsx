import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransistionStage] = useState("fadeIn");
  
  useEffect(() => {
    if (location !== displayLocation) {
      setTransistionStage("fadeOut");
    }
  }, [location, displayLocation]);
  
  const handleAnimationEnd = () => {
    if (transitionStage === "fadeOut") {
      setTransistionStage("fadeIn");
      setDisplayLocation(location);
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-screen-xl pt-24">
        <main 
          className={`mb-0 ${transitionStage}`}
          onAnimationEnd={handleAnimationEnd}
          style={{
            animationDuration: '0.3s',
            animationFillMode: 'both'
          }}
        >
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
