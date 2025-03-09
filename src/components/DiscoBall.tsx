
import { useState, useEffect } from 'react';

interface DiscoBallProps {
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
  className?: string;
}

export default function DiscoBall({ 
  size = 'md', 
  position = 'top-right',
  className = ''
}: DiscoBallProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  // Sizes mapping
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };
  
  // Position mapping
  const positionMap = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
  };
  
  useEffect(() => {
    // Animate in after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div 
      className={`fixed ${positionMap[position]} z-10 transition-all duration-700 pointer-events-none ${className} ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
    >
      <div className={`${sizeMap[size]} rounded-full disco-pulse`} style={{
        background: 'radial-gradient(circle at 30% 30%, #ffffff, #00eeff 20%, #ff00f7 35%, #242435 60%)',
        boxShadow: '0 0 20px 5px rgba(255, 0, 247, 0.5), 0 0 40px 10px rgba(0, 238, 255, 0.3)',
      }}>
        {/* Reflective surfaces */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white/20 rounded-full"
            style={{
              width: `${Math.random() * 5 + 2}px`,
              height: `${Math.random() * 5 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              boxShadow: '0 0 3px #fff',
              animation: `pulse-slow ${Math.random() * 2 + 1}s infinite alternate`
            }}
          />
        ))}
      </div>
      
      {/* Light beams */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-30 pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = (i * 72) % 360;
          return (
            <div 
              key={i}
              className="absolute top-1/2 left-1/2 h-1 w-[200px] origin-left"
              style={{
                background: i % 2 === 0 ? 'linear-gradient(90deg, #ff00f7, transparent)' : 'linear-gradient(90deg, #00eeff, transparent)',
                transform: `rotate(${angle}deg) translateY(-50%)`,
                animation: `pulse-slow ${1 + i * 0.2}s infinite alternate`
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
