import React from 'react';

export const FishIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}
    >
        <path d="M16.5 22a2.5 2.5 0 0 0-3.5-3.5l-6.5-6.5a2.5 2.5 0 0 0 0-3.5l-2-2a2.5 2.5 0 0 0-3.5 0l-1.5 1.5a2.5 2.5 0 0 0 0 3.5l2 2a2.5 2.5 0 0 0 3.5 0l6.5 6.5a2.5 2.5 0 0 0 3.5 3.5Z"></path>
        <path d="m18 8 4 4"></path>
        <path d="M14 4 6 12"></path>
    </svg>
);
