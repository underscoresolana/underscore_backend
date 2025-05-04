import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import NavButton from './NavButton';

const Header = () => {
  const [isIconHovered, setIsIconHovered] = useState(false);
  const [isIconPressed, setIsIconPressed] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  // Check screen width on mount and resize
  useEffect(() => {
    const checkWidth = () => {
      setIsNarrow(window.innerWidth < 480);
    };
    
    checkWidth(); // Initial check
    window.addEventListener('resize', checkWidth);
    
    return () => {
      window.removeEventListener('resize', checkWidth);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-black/70 backdrop-blur-sm border-b border-border rounded-none">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Company Icon with external link */}
              <div style={{ position: 'relative', width: '40px', height: '40px' }}>
                <a 
                  href="https://underscorelabs.dev/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    borderRadius: '2px',
                    position: 'relative',
                    transform: isIconPressed ? 'scale(0.95)' : isIconHovered ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseEnter={() => setIsIconHovered(true)}
                  onMouseLeave={() => {
                    setIsIconHovered(false);
                    setIsIconPressed(false);
                  }}
                  onMouseDown={() => setIsIconPressed(true)}
                  onMouseUp={() => setIsIconPressed(false)}
                >
                  {/* Glow effect */}
                  {isIconHovered && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(68, 215, 235, 0.2)',
                      borderRadius: '2px',
                      filter: 'blur(8px)',
                      zIndex: 1
                    }} />
                  )}
                  
                  {/* Icon image - larger size with absolute positioning */}
                  <div style={{
                    position: 'absolute',
                    width: '60px',
                    height: '60px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2
                  }}>
                    <img 
                      src="/icon.png" 
                      alt="Underscore Labs" 
                      style={{ 
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                </a>
          </div>
              
              {/* Title */}
              <Link to="/" className="title-link">
                <h1 className="title-gradient font-medium font-inter text-xl sm:text-2xl tracking-tight">
                  : app
                </h1>
            </Link>
            </div>
          </div>
          
          {/* Navigation buttons */}
          <nav className={`flex mt-3 sm:mt-0 sm:w-auto font-inter ${
            isNarrow 
              ? 'flex-col items-stretch gap-2 w-full' 
              : 'flex-row items-center justify-center sm:justify-end w-full overflow-x-auto gap-2 sm:gap-5'
          }`}>
            <NavButton to="/" isActive={currentPath === '/'} fullWidth={isNarrow}>
              Dashboard
            </NavButton>
            <NavButton to="/markets" isActive={currentPath === '/markets'} fullWidth={isNarrow}>
              Markets
            </NavButton>
            <NavButton to="/deep-dive" isActive={currentPath === '/deep-dive'} fullWidth={isNarrow}>
              Deep Dive
            </NavButton>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
