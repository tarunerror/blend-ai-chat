
import { useEffect, useRef } from "react";

interface BlendLogoProps {
  small?: boolean;
}

export default function BlendLogo({ small = false }: BlendLogoProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    // Simple animation loop for the logo
    let frame = 0;
    const interval = setInterval(() => {
      frame += 1;
      const circles = svgRef.current?.querySelectorAll('circle');
      
      if (circles) {
        circles.forEach((circle, i) => {
          // Create pulsing effect
          const phase = (frame + i * 15) % 360;
          const scale = 0.9 + Math.sin(phase * Math.PI / 180) * 0.1;
          circle.setAttribute('r', `${parseFloat(circle.getAttribute('data-original-r') || '0') * scale}`);
          
          // Create gentle color shifting
          const hue = (frame + i * 40) % 360;
          circle.setAttribute('fill', `hsl(${hue}, 90%, 70%)`);
        });
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
      <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" />
      
      {/* Animated elements */}
      <circle cx="30" cy="40" r="15" data-original-r="15" fill="#9b87f5" fillOpacity="0.7" />
      <circle cx="70" cy="40" r="15" data-original-r="15" fill="#8B5CF6" fillOpacity="0.7" />
      <circle cx="50" cy="70" r="15" data-original-r="15" fill="#D946EF" fillOpacity="0.7" />
      
      {/* Connection lines */}
      <line x1="30" y1="40" x2="70" y2="40" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
      <line x1="30" y1="40" x2="50" y2="70" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
      <line x1="70" y1="40" x2="50" y2="70" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
    </svg>
  );
}
