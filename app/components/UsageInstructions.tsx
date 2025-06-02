"use client";

import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";

export const UsageInstructions = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClose = () => {
    setShowInstructions(false);
    localStorage.setItem("hasSeenInstructions", "true");
  };

  if (!showInstructions) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-2xl w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">Welcome to AutoMate Voice Assistant</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-4">
          <section>
            <h3 className="text-xl font-semibold mb-2">How to Use</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Click the microphone button to start the conversation</li>
              <li>Speak clearly when prompted for information</li>
              <li>The AI will guide you through:
                <ul className="list-disc pl-5 mt-2">
                  <li>Collecting your name and vehicle information</li>
                  <li>Recommending appropriate services</li>
                  <li>Scheduling an appointment</li>
                </ul>
              </li>
              <li>Click the red microphone button to end the call</li>
            </ol>
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-2">Tips</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Speak clearly and at a normal pace</li>
              <li>Wait for the AI to finish speaking before responding</li>
              <li>Make sure your microphone is properly connected and working</li>
            </ul>
          </section>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}; 