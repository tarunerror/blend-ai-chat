
import { useEffect, useRef } from "react";

interface BlendLogoProps {
  small?: boolean;
}

export default function BlendLogo({ small = false }: BlendLogoProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    // Enhanced animation loop for the logo
    let frame = 0;
    const interval = setInterval(() => {
      frame += 1;
      const circles = svgRef.current?.querySelectorAll('circle');
      
      if (circles) {
        circles.forEach((circle, i) => {
          // Create dynamic pulsing effect
          const phase = (frame + i * 15) % 360;
          const scale = 0.9 + Math.sin(phase * Math.PI / 180) * 0.1;
          circle.setAttribute('r', `${parseFloat(circle.getAttribute('data-original-r') || '0') * scale}`);
          
          // Create vibrant color shifting with improved transitions
          const hue = (frame + i * 40) % 360;
          const saturation = 85 + (Math.sin(frame * 0.01 + i) * 10);
          const lightness = 65 + (Math.sin(frame * 0.02 + i) * 10);
          circle.setAttribute('fill', `hsl(${hue}, ${saturation}%, ${lightness}%)`);
          
          // Add more dynamic position animation
          const posX = parseFloat(circle.getAttribute('data-center-x') || circle.getAttribute('cx') || '0');
          const posY = parseFloat(circle.getAttribute('data-center-y') || circle.getAttribute('cy') || '0');
          const offsetX = Math.sin(frame * 0.02 + i * 1.5) * 3;
          const offsetY = Math.cos(frame * 0.02 + i * 1.5) * 3;
          
          circle.setAttribute('cx', `${posX + offsetX}`);
          circle.setAttribute('cy', `${posY + offsetY}`);
        });

        // Animate connection lines with improved effects
        const lines = svgRef.current?.querySelectorAll('line');
        if (lines) {
          lines.forEach((line) => {
            // Update line positions to follow circles
            const circles = svgRef.current?.querySelectorAll('circle');
            if (circles && circles.length >= 3) {
              const circle1 = circles[0];
              const circle2 = circles[1];
              const circle3 = circles[2];
              
              line.setAttribute('x1', circle1.getAttribute('cx') || '0');
              line.setAttribute('y1', circle1.getAttribute('cy') || '0');
              line.setAttribute('x2', circle2.getAttribute('cx') || '0');
              line.setAttribute('y2', circle2.getAttribute('cy') || '0');
              
              // Update opacity and width for a more dynamic glowing effect
              const opacity = 0.3 + Math.sin(frame * 0.05) * 0.2;
              const width = 1 + Math.sin(frame * 0.05) * 0.8;
              line.setAttribute('stroke-opacity', opacity.toString());
              line.setAttribute('stroke-width', width.toString());
              
              // Add gradient animation
              const gradientOffset = (frame * 0.01) % 100;
              const gradient = svgRef.current?.querySelector('#line-gradient');
              if (gradient) {
                const stops = gradient.querySelectorAll('stop');
                if (stops.length >= 2) {
                  stops[0].setAttribute('offset', `${gradientOffset}%`);
                  stops[1].setAttribute('offset', `${gradientOffset + 50}%`);
                }
              }
            }
          });
        }
      }
    }, 30); // Smoother animation with higher frame rate
    
    return () => clearInterval(interval);
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 100 100"
      className={`w-full h-full ${small ? 'scale-90' : ''}`}
    >
      {/* Enhanced glow effect */}
      <filter id="glow-effect">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      
      {/* Improved background radial gradient */}
      <radialGradient id="bg-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="rgba(155, 135, 245, 0.15)" />
        <stop offset="100%" stopColor="rgba(217, 70, 239, 0.08)" />
      </radialGradient>
      
      {/* Background circle with subtle animation */}
      <circle cx="50" cy="50" r="48" fill="url(#bg-gradient)" className="animate-pulse-slow" />
      
      {/* Outer circle with enhanced pulse animation */}
      <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" className="animate-pulse-slow" />
      
      {/* Animated elements with enhanced styling */}
      <circle cx="30" cy="40" r="15" data-original-r="15" data-center-x="30" data-center-y="40" fill="#9b87f5" fillOpacity="0.8" filter="url(#glow-effect)" />
      <circle cx="70" cy="40" r="15" data-original-r="15" data-center-x="70" data-center-y="40" fill="#D946EF" fillOpacity="0.8" filter="url(#glow-effect)" />
      <circle cx="50" cy="70" r="15" data-original-r="15" data-center-x="50" data-center-y="70" fill="#8B5CF6" fillOpacity="0.8" filter="url(#glow-effect)" />
      
      {/* Enhanced connection lines with animated gradient */}
      <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(155, 135, 245, 0.7)" />
        <stop offset="100%" stopColor="rgba(217, 70, 239, 0.7)" />
      </linearGradient>
      
      <line x1="30" y1="40" x2="70" y2="40" stroke="url(#line-gradient)" strokeWidth="1.5" strokeOpacity="0.6" />
      <line x1="30" y1="40" x2="50" y2="70" stroke="url(#line-gradient)" strokeWidth="1.5" strokeOpacity="0.6" />
      <line x1="70" y1="40" x2="50" y2="70" stroke="url(#line-gradient)" strokeWidth="1.5" strokeOpacity="0.6" />
      
      {/* Enhanced glow effect for circle centers */}
      <filter id="center-glow">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      
      <g filter="url(#center-glow)">
        <circle cx="30" cy="40" r="3" fill="#ffffff" fillOpacity="0.8" className="animate-pulse-slow" />
        <circle cx="70" cy="40" r="3" fill="#ffffff" fillOpacity="0.8" className="animate-pulse-slow" style={{animationDelay: '0.5s'}} />
        <circle cx="50" cy="70" r="3" fill="#ffffff" fillOpacity="0.8" className="animate-pulse-slow" style={{animationDelay: '1s'}} />
      </g>
      
      {/* Enhanced decorative sparkles */}
      <circle cx="20" cy="30" r="1" fill="#ffffff" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
      <circle cx="80" cy="50" r="1" fill="#ffffff" className="animate-pulse" style={{ animationDelay: '0.7s' }} />
      <circle cx="40" cy="80" r="1" fill="#ffffff" className="animate-pulse" style={{ animationDelay: '1.1s' }} />
      <circle cx="60" cy="20" r="1" fill="#ffffff" className="animate-pulse" style={{ animationDelay: '1.5s' }} />
      <circle cx="75" cy="75" r="1" fill="#ffffff" className="animate-pulse" style={{ animationDelay: '1.9s' }} />
    </svg>
  );
}
