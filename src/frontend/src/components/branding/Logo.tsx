import { LOGO_URL } from '../../utils/logoAsset';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
  };

  // Runtime safeguard: ensure LOGO_URL is always used
  const logoSrc = LOGO_URL;

  return (
    <img
      src={logoSrc}
      alt="Purwanchal Job Center"
      className={`rounded-full shadow-lg object-cover ${sizeClasses[size]} ${className}`}
    />
  );
}
