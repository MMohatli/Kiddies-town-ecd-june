import React from 'react';

export default function KiddiesTownLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`${className} shrink-0 select-none`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Circle with gentle border */}
      <circle cx="50" cy="50" r="48" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="45" fill="white" />

      {/* Balloon Threads coming down to a central bow */}
      <path d="M50 78 C44 68, 35 50, 35 45" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M50 78 C48 68, 45 50, 45 42" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M50 78 C52 68, 55 50, 55 42" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M50 78 C56 68, 65 50, 65 45" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />

      {/* Balloon 1: Red (Care) */}
      <g transform="translate(0, -3)">
        <circle cx="34" cy="42" r="12" fill="#F87171" />
        <path d="M34 54 L32 57 L36 57 Z" fill="#EF4444" />
        <ellipse cx="30" cy="38" rx="2.5" ry="4.5" fill="white" opacity="0.4" transform="rotate(-30 30 38)" />
      </g>

      {/* Balloon 2: Yellow/Gold (Educate) */}
      <g transform="translate(0, -3)">
        <circle cx="50" cy="34" r="13" fill="#FBBF24" />
        <path d="M50 47 L48 50 L52 50 Z" fill="#F59E0B" />
        <ellipse cx="46" cy="30" rx="3" ry="5" fill="white" opacity="0.45" transform="rotate(-30 46 30)" />
        {/* Smiling Face in Yellow Balloon for cute Kid Vibe */}
        <circle cx="47" cy="32" r="1" fill="#78350F" />
        <circle cx="53" cy="32" r="1" fill="#78350F" />
        <path d="M46 36 Q50 39 54 36" stroke="#78350F" strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* Balloon 3: Green (Play) */}
      <g transform="translate(0, -3)">
        <circle cx="66" cy="42" r="12" fill="#34D399" />
        <path d="M66 54 L64 57 L68 57 Z" fill="#10B981" />
        <ellipse cx="62" cy="38" rx="2.5" ry="4.5" fill="white" opacity="0.4" transform="rotate(-30 62 38)" />
      </g>

      {/* Balloon 4: Indigo (Develop) */}
      <g transform="translate(0, -3)">
        <circle cx="50" cy="50" r="11" fill="#818CF8" />
        <path d="M50 61 L48 64 L52 64 Z" fill="#6366F1" />
        <ellipse cx="47" cy="46" rx="2" ry="4" fill="white" opacity="0.45" transform="rotate(-30 47 46)" />
      </g>

      {/* Sweet little yellow star tying the balloon knot */}
      <path d="M50 71 L51.2 73.5 L54 73.5 L51.8 75.1 L52.6 77.6 L50 76 L47.4 77.6 L48.2 75.1 L46 73.5 L48.8 73.5 Z" fill="#FBBF24" />
    </svg>
  );
}
