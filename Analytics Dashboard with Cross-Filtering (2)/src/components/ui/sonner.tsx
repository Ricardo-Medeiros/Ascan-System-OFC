"use client";

import { Toaster as Sonner, ToasterProps } from "sonner@2.0.3";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        style: {
          background: '#1e293b',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
