import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export function HandshakeIcon({ size = 88, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Two hands shaking, one green, one orange */}
      <path d="M10 40 L35 40 Q40 40 43 45 L55 58" stroke="#814900" strokeWidth="6" strokeLinecap="round" />
      <path d="M90 40 L65 40 Q60 40 57 45 L45 58" stroke="#3f5413" strokeWidth="6" strokeLinecap="round" />
      {/* Handshake fingers block */}
      <rect x="42" y="42" width="16" height="24" rx="8" fill="#fff8f6" stroke="#814900" strokeWidth="4" />
      <line x1="46" y1="48" x2="54" y2="48" stroke="#814900" strokeWidth="3" strokeLinecap="round" />
      <line x1="46" y1="54" x2="54" y2="54" stroke="#814900" strokeWidth="3" strokeLinecap="round" />
      <line x1="46" y1="60" x2="54" y2="60" stroke="#814900" strokeWidth="3" strokeLinecap="round" />
      {/* Cute sparkles */}
      <path d="M25 20 L27 25 L32 27 L27 29 L25 34 L23 29 L18 27 L23 25 Z" fill="#fd9923" />
      <path d="M75 22 L77 25 L82 27 L77 29 L75 34 L73 29 L68 27 L73 25 Z" fill="#a8c66c" />
    </svg>
  );
}

export function BadgeCheckIcon({ size = 48, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Heart badge */}
      <path d="M30 52 C5 40 5 15 30 10 C55 15 55 40 30 52 Z" fill="#fff8f6" stroke="#814900" strokeWidth="4" strokeLinejoin="round" />
      {/* Seal checkmark in primary green/secondary orange */}
      <circle cx="30" cy="28" r="14" fill="#a8c66c" stroke="#3f5413" strokeWidth="3" />
      <path d="M25 28 L28 31 L35 24" stroke="#3f5413" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TrendingUpIcon({ size = 88, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Sprout plant growing */}
      <path d="M50 85 V35" stroke="#3f5413" strokeWidth="6" strokeLinecap="round" />
      <path d="M50 65 Q30 55 32 40 Q45 40 50 55" fill="#a8c66c" stroke="#3f5413" strokeWidth="4" strokeLinejoin="round" />
      <path d="M50 50 Q70 40 68 25 Q55 25 50 40" fill="#a8c66c" stroke="#3f5413" strokeWidth="4" strokeLinejoin="round" />
      {/* Transparent glass dome or magnifying glass over it */}
      <circle cx="50" cy="45" r="35" stroke="#3f5413" strokeWidth="4" strokeDasharray="6 4" fill="rgba(168, 198, 108, 0.1)" />
      <path d="M75 70 L90 85" stroke="#3f5413" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

export function UsersRoundIcon({ size = 48, className, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Hugging bodies */}
      <path d="M8 52 C8 40, 28 40, 28 52" fill="#fd9923" stroke="#814900" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M32 52 C32 40, 52 40, 52 52" fill="#a8c66c" stroke="#3f5413" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M16 48 C16 35, 44 35, 44 48" fill="#fff8f6" stroke="#814900" strokeWidth="3.5" strokeLinecap="round" />
      {/* Heads */}
      <circle cx="18" cy="28" r="7" fill="#fd9923" stroke="#814900" strokeWidth="3" />
      <circle cx="42" cy="28" r="7" fill="#a8c66c" stroke="#3f5413" strokeWidth="3" />
      <circle cx="30" cy="24" r="8" fill="#fff8f6" stroke="#814900" strokeWidth="3" />
      {/* Floating Heart */}
      <path d="M30 12 C28.5 9.5, 25 9.5, 25 13 C25 17, 30 20, 30 21 C30 20, 35 17, 35 13 C35 9.5, 31.5 9.5, 30 12 Z" fill="#814900" />
    </svg>
  );
}

export function HeartHandshakeIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M19.414 14.414C21 12.828 22 11.5 22 9.5a5.5 5.5 0 0 0-9.591-3.676.6.6 0 0 1-.818.001A5.5 5.5 0 0 0 2 9.5c0 2.3 1.5 4 3 5.5l5.535 5.362a2 2 0 0 0 2.879.052 2.12 2.12 0 0 0-.004-3 2.124 2.124 0 1 0 3-3 2.124 2.124 0 0 0 3.004 0 2 2 0 0 0 0-2.828l-1.881-1.882a2.41 2.41 0 0 0-3.409 0l-1.71 1.71a2 2 0 0 1-2.828 0 2 2 0 0 1 0-2.828l2.823-2.762" />
    </svg>
  );
}

export function GlobeIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

export function ShareIcon({ size = 24, className, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
    </svg>
  );
}
