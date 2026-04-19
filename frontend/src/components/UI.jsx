import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'px-6 py-2 rounded-lg font-semibold transition duration-300';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    success: 'bg-green-600 text-white hover:bg-green-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Badge = ({ children, color = 'blue' }) => {
  const colorMap = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colorMap[color]}`}>
      {children}
    </span>
  );
};

export const ProgressBar = ({ progress, label }) => {
  return (
    <div className="w-full">
      {label && <p className="text-sm font-semibold text-gray-700 mb-2">{label}</p>}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
        />
      </div>
      <p className="text-xs text-gray-600 mt-1">{progress}%</p>
    </div>
  );
};
