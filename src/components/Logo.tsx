import React from "react";

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-8 h-8" }) => {
  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      {/* Subtle brand glow behind logo */}
      <div className="absolute inset-0 bg-white/5 rounded-full blur-xl pointer-events-none" />

      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-white transition-all duration-500 hover:scale-105"
      >
        <defs>
          {/* Clip path for vertical rays so they terminate mathematically at the inner circle border */}
          <clipPath id="logoCircleClip">
            <circle cx="50" cy="50" r="44" />
          </clipPath>
        </defs>

        {/* Outer Solid Brand Circle Ring */}
        <circle
          cx="50"
          cy="50"
          r="45.5"
          stroke="currentColor"
          strokeWidth="3.2"
          fill="none"
        />

        {/* Clipped Internal Elements */}
        <g clipPath="url(#logoCircleClip)">
          {/* Fine vertical connection/acceleration lines */}
          {[
            41.0, 42.5, 44.0, 45.5, 47.0, 48.5, 50.0, 51.5, 53.0, 54.5, 56.0, 57.5, 59.0
          ].map((xVal, idx) => (
            <line
              key={`ray-${idx}`}
              x1={xVal}
              y1={4}
              x2={xVal}
              y2={76}
              stroke="currentColor"
              strokeWidth="0.32"
              strokeOpacity="0.45"
            />
          ))}

          {/* Solid Left Pillar (Slanted cut pointing upwards towards the center) */}
          <polygon
            points="43.2,73 43.2,42.5 45.8,39.5 45.8,72"
            fill="currentColor"
          />

          {/* Solid Center Pillar (Tallest, diamond/sword pointed top) */}
          <polygon
            points="48.7,70 48.7,35.0 50.0,32.4 51.3,35.0 51.3,70"
            fill="currentColor"
          />

          {/* Solid Right Pillar (Slanted cut pointing upwards towards the center) */}
          <polygon
            points="54.2,72 54.2,39.5 56.8,42.5 56.8,73"
            fill="currentColor"
          />

          {/* Beautiful Mountain Peaked Ground Foundation (Cuts flat at y=75 and peaks at y=66 under central pillar) */}
          <path
            d="M 10 75.5 
               L 31 75.5 
               C 39 75.5, 42 74.0, 45 70.8 
               C 47.8 67.8, 49 66.2, 50 66.2 
               C 51 66.2, 52.2 67.8, 55 70.8 
               C 58 74.0, 61 75.5, 69 75.5 
               L 90 75.5 
               A 44 44 0 0 1 10 75.5 Z"
            fill="currentColor"
          />
        </g>
      </svg>
    </div>
  );
};

