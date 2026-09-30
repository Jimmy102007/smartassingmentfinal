import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({ 
  className = '', 
  size = 'md',
  showText = false,
  textColor
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-12 h-12 rounded-2xl',
    xl: 'w-16 h-16 rounded-3xl',
  };

  const textSizes = {
    sm: 'text-sm font-bold',
    md: 'text-base font-extrabold',
    lg: 'text-xl font-extrabold',
    xl: 'text-2xl font-black',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`relative shrink-0 overflow-hidden shadow-md shadow-blue-500/20 ring-1 ring-blue-500/20 bg-white dark:bg-slate-800 ${sizeClasses[size]} transition-transform hover:scale-105`}>
        <img
          src="/logo.jpg"
          alt="Smart Assignment Logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            // Fallback to internal path if relative doesn't resolve
            const target = e.currentTarget;
            if (target.src !== `${window.location.origin}/src/assets/images/app_logo_1790222755264.jpg`) {
              target.src = '/src/assets/images/app_logo_1790222755264.jpg';
            }
          }}
        />
      </div>

      {showText && (
        <div className="leading-tight">
          <span className={`tracking-tight ${textColor || 'text-slate-900 dark:text-white'} ${textSizes[size]}`}>
            Smart Assignment
          </span>
          <span className="block text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider">
            Student Portal
          </span>
        </div>
      )}
    </div>
  );
};
