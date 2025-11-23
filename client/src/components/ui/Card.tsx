import React, { FC, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl border border-slate-100 shadow-lg shadow-slate-100/50 ${className}`}>
    {children}
  </div>
);