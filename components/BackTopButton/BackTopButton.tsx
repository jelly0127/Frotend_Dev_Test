import React from 'react';
import { FaArrowUp } from "react-icons/fa";
import { useEffect, useState } from 'react';

const BackTopButton = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className='fixed bottom-16 right-5 bg-gray-500/80 rounded-full p-2'>
      <FaArrowUp className='text-white text-xl' />
    </button>
  );
};

export default BackTopButton;