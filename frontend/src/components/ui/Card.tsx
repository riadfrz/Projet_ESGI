import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'glass' | 'solid' | 'bordered';
  hoverEffect?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'glass',
  hoverEffect = false,
  ...props
}) => {
  const variants = {
    glass: 'glass-panel',
    solid: 'bg-dark-surface border border-white/5',
    bordered: 'bg-transparent border border-white/10',
  };

  const hoverStyles = hoverEffect 
    ? 'transition-all duration-300 hover:border-neon-blue/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:-translate-y-1' 
    : '';

  return (
    <div 
      className={`rounded-xl p-6 ${variants[variant]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
