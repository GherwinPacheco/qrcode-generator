import React, { useState, useEffect } from 'react';

const Carousel = ({className, images, ...rest }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const clickTimeout = setTimeout(() => {
        setIsClicked(false);
    }, 500 );
    return () => clearTimeout(clickTimeout);
  }, [isClicked]);

  const nextSlide = () => {
    if(!isClicked){
        setIsClicked(true);
        setCurrentIndex((prevIndex) => 
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    }
    
  };

  const prevSlide = () => {
    if(!isClicked){
        setIsClicked(true);
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
        
    }
    
  };

  return (
    <div 
        className={`relative overflow-hidden shadow-lg rounded-lg ${className}`}
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)} 
        {...rest}
    >
        <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
            {images.map((image, index) => (
            <img
                key={index}
                src={image}
                alt={`Slide ${index + 1}`}
                className="object-cover flex-shrink-0"
            />
            ))}
        </div>
        
        {/* Previous Button */}
        
        <button
            onClick={prevSlide}
            className={`${isHovered ? 'opacity-100' : 'opacity-0'} duration-300 absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-r-md`}
        >
            &#10094;
        </button>
        

        {/* Previous Button */}
        <button
            onClick={nextSlide}
            className={`${isHovered ? 'opacity-100' : 'opacity-0'} duration-300 absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-l-md`}
        >
            &#10095;
        </button>
            
    </div>
  );
};

export default Carousel;
