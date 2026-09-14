import React from 'react';

interface SideAdLayoutProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export function SideAdLayout({ children }: SideAdLayoutProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}

