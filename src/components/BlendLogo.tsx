
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
          
          // Create vibrant color shifting
          const hue = (frame + i * 40) % 360;
          const saturation = 85 + (Math.sin(frame * 0.01 + i) * 10);
          const lightness = 65 + (Math.sin(frame * 0.02 + i) * 10);
          circle.setAttribute('fill', `hsl(${hue}, ${saturation}%, ${lightness}%)`);
          
          // Add subtle position animation
          const posX = parseFloat(circle.getAttribute('data-center-x') || circle.getAttribute('cx') || '0');
          const posY = parseFloat(circle.getAttribute('data-center-y') || circle.getAttribute('cy') || '0');
          const offsetX = Math.sin(frame * 0.02 + i * 1.5) * 2;
          const offsetY = Math.cos(frame * 0.02 + i * 1.5) * 2;
          
          circle.setAttribute('cx', `${posX + offsetX}`);
          circle.setAttribute('cy', `${posY + offsetY}`);
        });

        // Animate connection lines
        const lines = svgRef.current?.querySelectorAll('line');
        if (lines) {
          lines.forEach((line) => {
            const x1 = parseFloat(line.getAttribute('x1') || '0');
            const y1 = parseFloat(line.getAttribute('y1') || '0');
            const x2 = parseFloat(line.getAttribute('x2') || '0');
            const y2 = parseFloat(line.getAttribute('y2') || '0');
            
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
              
              // Update opacity based on distance for a glowing effect
              const opacity = 0.3 + Math.sin(frame * 0.05) * 0.2;
              line.setAttribute('stroke-opacity', opacity.toString());
              line.setAttribute('stroke-width', (1 + Math.sin(frame * 0.05) * 0.5).toString());
            }
          });
        }
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 100 100"
      className={`w-full h-full ${small ? 'scale-90' : ''}`}
    >
      <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" className="animate-pulse-slow" />
      
      {/* Animated elements */}
      <circle cx="30" cy="40" r="15" data-original-r="15" data-center-x="30" data-center-y="40" fill="#9b87f5" fillOpacity="0.8" />
      <circle cx="70" cy="40" r="15" data-original-r="15" data-center-x="70" data-center-y="40" fill="#D946EF" fillOpacity="0.8" />
      <circle cx="50" cy="70" r="15" data-original-r="15" data-center-x="50" data-center-y="70" fill="#8B5CF6" fillOpacity="0.8" />
      
      {/* Enhanced connection lines */}
      <line x1="30" y1="40" x2="70" y2="40" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
      <line x1="30" y1="40" x2="50" y2="70" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
      <line x1="70" y1="40" x2="50" y2="70" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
      
      {/* Add subtle glow effect */}
      <filter id="glow">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      
      <g filter="url(#glow)">
        <circle cx="30" cy="40" r="3" fill="#ffffff" fillOpacity="0.7" />
        <circle cx="70" cy="40" r="3" fill="#ffffff" fillOpacity="0.7" />
        <circle cx="50" cy="70" r="3" fill="#ffffff" fillOpacity="0.7" />
      </g>
    </svg>
  );
}
