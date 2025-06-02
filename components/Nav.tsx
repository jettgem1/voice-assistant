"use client";

import { useLayoutEffect, useState } from "react";
import AutoMateLogo from "./logos/AutoMate";
import { Button } from "../ui/button";
import { Moon, Sun, HelpCircle, X } from "lucide-react";
import Github from "./logos/GitHub";
import pkg from '@/package.json';

export const Nav = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useLayoutEffect(() => {
    const el = document.documentElement;

    if (el.classList.contains("dark")) {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }, []);

  const toggleDark = () => {
    const el = document.documentElement;
    el.classList.toggle("dark");
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div
      className={
        "px-4 py-2 flex items-center h-14 z-50 bg-card border-b border-border"
      }
    >
      <div>
        <a href="/">
          <AutoMateLogo className={"h-20 w-auto"} />
        </a>
      </div>
      <div className={"ml-auto flex items-center gap-1"}>
        <Button
          onClick={() => setShowInfo(true)}
          variant={"ghost"}
          className={"ml-auto flex items-center gap-1.5"}
        >
          <span>
            <HelpCircle className={"size-4"} />
          </span>
          <span>How I built it</span>
        </Button>
        <Button
          onClick={() => {
            window.open(
              pkg.homepage,
              "_blank",
              "noopener noreferrer"
            );
          }}
          variant={"ghost"}
          className={"ml-auto flex items-center gap-1.5"}
        >
          <span>
            <Github className={"size-4"} />
          </span>
          <span>Star on GitHub</span>
        </Button>
        <Button
          onClick={toggleDark}
          variant={"ghost"}
          className={"ml-auto flex items-center gap-1.5"}
        >
          <span>
            {isDarkMode ? (
              <Sun className={"size-4"} />
            ) : (
              <Moon className={"size-4"} />
            )}
          </span>
          <span>{isDarkMode ? "Light" : "Dark"} Mode</span>
        </Button>
      </div>

      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">How I Built It</h2>
              <button
                onClick={() => setShowInfo(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <section>
                <h3 className="text-xl font-semibold mb-2">Voice Processing Pipeline</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Real-time speech-to-text using Deepgram's Nova-3 model with:
                    <ul className="list-disc pl-5 mt-1">
                      <li>Smart formatting and punctuation</li>
                      <li>Utterance detection with 5-second end-of-speech timeout</li>
                      <li>16kHz sample rate with single channel audio</li>
                    </ul>
                  </li>
                  <li>Natural language processing via Together AI's Llama-3.2-11B model:
                    <ul className="list-disc pl-5 mt-1">
                      <li>Structured conversation flow for appointment scheduling</li>
                      <li>Vehicle-specific service recommendations</li>
                      <li>Time slot management based on vehicle type</li>
                    </ul>
                  </li>
                  <li>Text-to-speech using Deepgram's Aura-2-Thalia model:
                    <ul className="list-disc pl-5 mt-1">
                      <li>24kHz high-quality audio output</li>
                      <li>WAV format with linear16 encoding</li>
                    </ul>
                  </li>
                </ul>
              </section>
              <section>
                <h3 className="text-xl font-semibold mb-2">Voice Interaction Flow</h3>
                <p className="mb-4">The assistant follows a structured conversation flow, prompted to:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Collect user information:
                    <ul className="list-disc pl-5 mt-1">
                      <li>Full name</li>
                      <li>Vehicle details (make, model, year)</li>
                    </ul>
                  </li>
                  <li>Recommend services based on vehicle type:
                    <ul className="list-disc pl-5 mt-1">
                      <li>Chrysler, Dodge, Jeep, RAM: Factory-recommended maintenance at 50k miles</li>
                      <li>Tesla, Polestar, Rivian, EVs: Battery replacement or charging port diagnosis</li>
                      <li>Other makes: Oil change, tire rotation, windshield wiper replacement</li>
                    </ul>
                  </li>
                  <li>Schedule appointments with specific time slots:
                    <ul className="list-disc pl-5 mt-1">
                      <li>EVs: Odd hours until 5pm (Mon-Fri)</li>
                      <li>Hybrid/ICE: Even hours until 6pm (Mon-Fri)</li>
                    </ul>
                  </li>
                  <li>Confirm appointment details before ending the call</li>
                </ol>
              </section>
              <section>
                <h3 className="text-xl font-semibold mb-2">Technical Architecture</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Next.js 14 application with TypeScript and Tailwind CSS</li>
                  <li>Context-based state management for:
                    <ul className="list-disc pl-5 mt-1">
                      <li>Microphone handling and audio streaming</li>
                      <li>Deepgram connection management</li>
                      <li>Conversation state and message history</li>
                    </ul>
                  </li>
                  <li>API Integration:
                    <ul className="list-disc pl-5 mt-1">
                      <li>Secure API key management through environment variables</li>
                      <li>Server-side API routes for STT, TTS, and LLM processing</li>
                      <li>Cal.com integration for appointment booking (Temporarily disabled because I do not want these showing up on my calendar)</li>
                    </ul>
                  </li>
                </ul>
              </section>
              <section>
                <h3 className="text-xl font-semibold mb-2">Performance & Scalability</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Optimized audio processing:
                    <ul className="list-disc pl-5 mt-1">
                      <li>Efficient audio buffer management</li>
                      <li>Streaming responses for real-time interaction</li>
                      <li>Connection keepalive with 10-second intervals</li>
                    </ul>
                  </li>
                  <li>Scalability features:
                    <ul className="list-disc pl-5 mt-1">
                      <li>Support for multiple concurrent connections</li>
                      <li>Horizontal scaling capabilities</li>
                      <li>Load balancing ready</li>
                    </ul>
                  </li>
                </ul>
              </section>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setShowInfo(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
