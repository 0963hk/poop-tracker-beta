import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'brown' | 'outline';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  ...props 
}) => {
  const baseStyle = "py-4 px-6 rounded-full font-fredoka text-xl font-bold transition-transform active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white shadow-purple-200",
    secondary: "bg-text-dark text-white shadow-gray-400",
    brown: "bg-accent-brown text-white shadow-orange-900/20",
    outline: "border-2 border-primary text-primary bg-transparent shadow-none hover:bg-purple-50",
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
