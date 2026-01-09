"use client";

import React, { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="
        px-4 py-2 rounded-full
        bg-blue-600 text-white
        hover:bg-blue-700
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors
      "
    >
      {children}
    </button>
  );
};

export default Button; // <<< default export
