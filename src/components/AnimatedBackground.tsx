
import React, { useEffect, useRef } from 'react';

export function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create floating particles effect
    const container = containerRef.current;
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
      createParticle(container);
    }
    
    return () => {
      const particles = container.querySelectorAll('.animated-particle');
      particles.forEach(particle => particle.remove());
    };
  }, []);
  
  const createParticle = (container: HTMLDivElement) => {
    const particle = document.createElement('div');
    particle.classList.add('animated-particle');
    
    // Random position
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    
    // Random size (smaller)
    const size = 1 + Math.random() * 5;
    
    // Random animation duration and delay
    const duration = 15 + Math.random() * 30;
    const delay = Math.random() * 10;
    
    // Apply styles
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.opacity = (0.1 + Math.random() * 0.3).toString();
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    
    container.appendChild(particle);
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Animated cosmic blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 animate-blobs filter blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/5 animate-blobs filter blur-3xl" style={{ animationDelay: '2s' }}></div>
      
      {/* New animated blob in center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/3 animate-blobs filter blur-3xl" style={{ animationDelay: '4s' }}></div>
      
      {/* Gradient overlay with animated rotation */}
      <div className="absolute inset-0 bg-nebula-gradient opacity-5 animate-spin-slow" style={{ animationDuration: '120s' }}></div>
      
      {/* Instead of using the jsx attribute in style, we'll use a regular style tag */}
      <style>
        {`
          .animated-particle {
            position: absolute;
            background-color: white;
            border-radius: 50%;
            animation: float-around linear infinite;
          }
          
          @keyframes float-around {
            0% {
              transform: translate(0, 0);
            }
            33% {
              transform: translate(30px, -50px);
            }
            66% {
              transform: translate(-20px, 20px);
            }
            100% {
              transform: translate(0, 0);
            }
          }
        `}
      </style>
    </div>
  );
}

export default AnimatedBackground;
