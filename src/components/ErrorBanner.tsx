// src/components/ErrorBanner.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useErrorContext } from "@/context/ErrorContext";
import { FiX, FiAlertTriangle } from "react-icons/fi";

export default function ErrorBanner() {
  const { error, clearError } = useErrorContext();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setIsVisible(true);
      // Automatically hide after 4 seconds for better user experience
      const timer = setTimeout(() => {
        handleClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleClose = () => {
    setIsVisible(false);
    // Delay clearing the error to allow the fade-out transition
    setTimeout(() => {
      clearError();
    }, 300); // Match this duration with the CSS transition duration
  };

  return (
    <>
      {/* Error Banner */}
      <div
        className={`fixed top-5 left-5 z-50 w-full max-w-sm bg-red-600 text-white shadow-lg rounded-lg transform transition-all duration-300 ${
          isVisible
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
        role="alert"
        aria-live="assertive"
      >
        <div className="flex items-start p-4">
          {/* Error Icon */}
          <div className="flex-shrink-0">
            <FiAlertTriangle className="h-6 w-6 text-white" aria-hidden="true" />
          </div>

          {/* Error Message */}
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">{error}</p>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="ml-4 flex-shrink-0 text-white hover:text-gray-200 focus:outline-none"
            aria-label="Close"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
      </div>
    </>
  );
}
