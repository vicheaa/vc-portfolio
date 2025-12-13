import React from "react";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Bottom Bar */}
        <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            © {currentYear} Vichea. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
