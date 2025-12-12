import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  onClick,
}) => {
  const Component = hover ? motion.div : "div";

  return (
    <Component
      className={cn(
        "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700",
        hover && "cursor-pointer transition-shadow hover:shadow-md",
        className
      )}
      onClick={onClick}
      {...(hover && {
        whileHover: { y: -4 },
        transition: { duration: 0.2 },
      })}
    >
      {children}
    </Component>
  );
};
