import React, { useEffect, useState, useRef } from 'react';
import '../index.css'; // Import the CSS file where keyframes are defined


export const Fade = ({ children, direction = 'left', className = '', ...rest}) => {

  // Determine the animation classes based on direction and visibility
  const animationClass = `fade-in-from-${direction}`;

  return (
      <div
        className={`transition-opacity duration-1000 ${animationClass} ${className}`}
        {...rest}
      >
        {children}
      </div>
  );
};



export const ScrollFade = ({ children, direction = 'left', className = '', delay = 0, ...rest}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);
  const renderDelay = delay * 1000;
  const containerRef = useRef(null);


  const handleScroll = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      const isInView = rect.top <= viewHeight;
      setIsVisible(isInView);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check visibility on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if(isVisible){
      const timer = setTimeout(() => {
        setShouldRender(true);
      }, renderDelay);
  
      return () => clearTimeout(timer);
    }
    else{
      setShouldRender(false);
    }
  }, [isVisible]);


  
  

  // Determine the animation classes based on direction and visibility
  const animationClass = (isVisible && shouldRender)
    ? `transition-opacity duration-1000  fade-in-from-${direction}` 
    : `transition-opacity duration-1000  fade-out-from-${direction}`;

  return (
    <div ref={containerRef} className={className}>
      <div
        className={`opacity-0 ${animationClass}`}
        {...rest}
      >
        {children}
      </div>
      
    </div>
    
    
  );
};

