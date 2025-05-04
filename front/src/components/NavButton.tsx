import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';

interface NavButtonProps {
  to: string;
  isActive: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const NavButton: React.FC<NavButtonProps> = ({ to, isActive, fullWidth = false, children }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  // Animation for the glow effect
  const glowSpring = useSpring({
    opacity: isHovering || isActive ? 1 : 0,
    scale: isPressed ? 0.92 : isHovering || isActive ? 1 : 0.8,
    config: { mass: 1, tension: 280, friction: 60 }
  });
  
  // Animation for the content
  const contentSpring = useSpring({
    y: isPressed ? 1 : isHovering ? -1 : 0,
    scale: isPressed ? 0.97 : isHovering ? 1.03 : 1,
    config: { mass: 1, tension: 300, friction: 20 }
  });
  
  // Animation for the background
  const bgSpring = useSpring({
    opacity: isActive ? 1 : isHovering ? 0.8 : 0.6,
    scale: isPressed ? 0.97 : isHovering || isActive ? 1 : 0.97,
    config: { mass: 1, tension: 200, friction: 26 }
  });
  
  // Animation for the gradient angle
  const gradientAngleSpring = useSpring({
    angle: isHovering ? 45 : 0,
    config: { mass: 1, tension: 120, friction: 14 }
  });
  
  return (
    <Link to={to} className={`relative ${fullWidth ? 'w-full' : 'flex-shrink-0'}`}>
      <button
        ref={buttonRef}
        className={`relative px-3 sm:px-6 py-2 sm:py-3 rounded-sm overflow-hidden transition-colors duration-300 text-sm sm:text-base font-inter whitespace-nowrap ${
          isActive ? 'text-primary-foreground font-medium' : 'text-foreground'
        } ${fullWidth ? 'w-full' : ''}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setIsPressed(false);
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
      >
        {/* Base background */}
        <div className="absolute inset-0 rounded-sm bg-black/40 backdrop-blur-sm" />
        
        {/* Animated gradient background */}
        <animated.div 
          style={{
            opacity: bgSpring.opacity,
            transform: bgSpring.scale.to(s => `scale(${s})`),
            background: gradientAngleSpring.angle.to(
              angle => `linear-gradient(${angle}deg, #202A38, #332D28, #2D2333, #001A24)`
            ),
            backgroundSize: '300% 300%',
            animation: isActive || isHovering ? 'gradient-shift 3s ease infinite' : 'none'
          }}
          className="absolute inset-0 rounded-sm" 
        />
        
        {/* Glow effect */}
        <animated.div 
          style={{
            opacity: glowSpring.opacity,
            transform: glowSpring.scale.to(s => `scale(${s})`),
            background: isActive 
              ? 'radial-gradient(circle, rgba(68, 215, 235, 0.3) 0%, rgba(45, 35, 51, 0.2) 70%, transparent 100%)'
              : 'radial-gradient(circle, rgba(68, 215, 235, 0.2) 0%, rgba(45, 35, 51, 0.1) 70%, transparent 100%)'
          }}
          className="absolute inset-0 rounded-sm blur-md"
        />
        
        {/* Content */}
        <animated.div 
          style={{
            transform: contentSpring.y.to(y => `translateY(${y}px) scale(${contentSpring.scale.get()})`),
          }}
          className="relative z-10"
        >
          {children}
        </animated.div>
      </button>
    </Link>
  );
};

export default NavButton; 