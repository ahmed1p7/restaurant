import React from 'react';

const ChefHatIcon: React.FC<{className?: string}> = ({className = "w-10 h-10"}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 1.94.81 3.71 2.12 4.99C7.05 14.25 7 14.62 7 15v1h10v-1c0-.38-.05-.75-.12-1.01C18.19 12.71 19 10.94 19 9c0-3.87-3.13-7-7-7zm0 2c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5z"/>
    <path d="M5 17v2h14v-2c-1.04 0-1.95-.5-2.58-1.25-.5-.6-.73-1.39-.7-2.19l-.02-.56H8.3l-.02.56c-.03.8-.2 1.59-.7 2.19C7.03 16.54 6.08 17 5 17z"/>
  </svg>
);

export default ChefHatIcon;
