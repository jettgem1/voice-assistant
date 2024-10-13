"use client";

import { useEffect, useRef, useState } from "react";
import {
  LiveConnectionState,
  LiveTranscriptionEvent,
  LiveTranscriptionEvents,
  useDeepgram,
} from "./context/DeepgramContextProvider";
import {
  MicrophoneEvents,
  MicrophoneState,
  useMicrophone,
} from "./context/MicrophoneContextProvider";
import Visualizer from "./context/Visualizer";
import { Phone } from "lucide-react";

const App: React.FC = () => {
  const [messages, setMessages] = useState<
    Array<{ role: string; content: string }>
  >([]);
  const [isLaunched, setIsLaunched] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false); // New state for processing
  const { connection, connectToDeepgram, connectionState } = useDeepgram();
  const {
    setupMicrophone,
    microphone,
    startMicrophone,
    stopMicrophone,
    microphoneState,
  } = useMicrophone();
  const captionTimeout = useRef<any>();
  const keepAliveInterval = useRef<any>();
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const triggerInitialMessage = async () => {
    const initialMessage = {
      role: "user",
      content: "hello",
    };

    try {

      const response = await fetch("/api/togetherai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [initialMessage],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        console.error("Error from AI:", data.error);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, I couldn't process that." },
        ]);
      } else {
        const aiMessage = data.aiMessage;

        const ttsResponse = await fetch("/api/tts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: aiMessage }),
        });

        if (!ttsResponse.ok) {
          throw new Error(`TTS HTTP error! status: ${ttsResponse.status}`);
        }

        const ttsData = await ttsResponse.json();

        if (ttsData.error) {
          console.error("Error generating audio:", ttsData.error);
        } else {
          const audioContent = ttsData.audioContent; // Base64 string

          await playAudio(audioContent);

          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: aiMessage },
          ]);
        }
      }
    } catch (error) {
      console.error("Error in getAIResponse:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
    }
  };

  // Initialize microphone
  useEffect(() => {
    const initializeMicrophone = async () => {
      try {
        await setupMicrophone();
      } catch (err) {
        console.error("Microphone setup failed:", err);
        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            content:
              "Microphone access denied. Please enable it in your browser settings.",
          },
        ]);
      }
    };

    initializeMicrophone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Connect to Deepgram once the microphone is ready
  useEffect(() => {
    if (isLaunched && microphoneState === MicrophoneState.Ready) {
      connectToDeepgram({
        model: "nova-2",
        interim_results: true,
        smart_format: true,
        filler_words: true,
        utterance_end_ms: 5000,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microphoneState, isLaunched]);

  // Handle transcript and AI response
  useEffect(() => {
    if (!microphone || !isLaunched) return;
    if (!connection) return;

    const onData = (e: BlobEvent) => {
      if (e.data.size > 0) {
        connection?.send(e.data);
      }
    };

    const onTranscript = async (data: LiveTranscriptionEvent) => {
      const { is_final: isFinal, speech_final: speechFinal } = data;
      const transcript = data.channel.alternatives[0].transcript.trim();

      if (transcript !== "") {
        if (speechFinal) {
          // Update messages and then get AI response
          setMessages((prevMessages) => {
            const updatedMessages = [
              ...prevMessages,
              { role: "user", content: transcript },
            ];
            getAIResponse(updatedMessages); // Send the updated messages to the AI
            return updatedMessages;
          });
        }
      }

      if (isFinal && speechFinal) {
        clearTimeout(captionTimeout.current);
        setIsListening(true);
        captionTimeout.current = setTimeout(() => {
          setIsListening(false);
          clearTimeout(captionTimeout.current);
        }, 3000);
      }
    };

    if (connectionState === LiveConnectionState.OPEN) {
      connection.addListener(LiveTranscriptionEvents.Transcript, onTranscript);
      microphone.addEventListener(MicrophoneEvents.DataAvailable, onData);

      startMicrophone();
      setIsListening(true);
    }

    return () => {
      connection.removeListener(
        LiveTranscriptionEvents.Transcript,
        onTranscript
      );
      microphone.removeEventListener(
        MicrophoneEvents.DataAvailable,
        onData
      );
      clearTimeout(captionTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionState, isLaunched]);

  // Keep the Deepgram connection alive
  useEffect(() => {
    if (!connection) return;

    if (
      microphoneState !== MicrophoneState.Open &&
      connectionState === LiveConnectionState.OPEN
    ) {
      connection.keepAlive();

      keepAliveInterval.current = setInterval(() => {
        connection.keepAlive();
      }, 10000);
    } else {
      clearInterval(keepAliveInterval.current);
    }

    return () => {
      clearInterval(keepAliveInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microphoneState, connectionState]);

  // Fetch AI response and process TTS
  const getAIResponse = async (
    conversationHistory: Array<{ role: string; content: string }>
  ) => {
    try {
      setIsProcessing(true); // Start processing

      // Filter out "Listening..." and "AI is processing..." messages before sending to AI
      const filteredHistory = conversationHistory.filter(
        (message) =>
          message.content !== "Listening..." &&
          message.content !== "AI is processing..."
      );

      const response = await fetch("/api/togetherai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: filteredHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        console.error("Error from AI:", data.error);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, I couldn't process that." },
        ]);
      } else {
        const aiMessage = data.aiMessage;
        const ttsResponse = await fetch("/api/tts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: aiMessage }),
        });

        if (!ttsResponse.ok) {
          throw new Error(`TTS HTTP error! status: ${ttsResponse.status}`);
        }

        const ttsData = await ttsResponse.json();

        if (ttsData.error) {
          console.error("Error generating audio:", ttsData.error);
        } else {
          const audioContent = ttsData.audioContent; // Base64 string

          // Play the audio and wait until it finishes before updating the messages
          await playAudio(audioContent);

          // Now update the messages to display the assistant's response
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: aiMessage },
          ]);
        }
      }
    } catch (error) {
      console.error("Error in getAIResponse:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
    } finally {
      setIsProcessing(false); // End processing
    }
  };

  const playAudio = async (base64Audio: string) => {
    const audioSrc = "data:audio/wav;base64," + base64Audio;

    // If there's an existing audio, pause and reset it
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }

    // Create a new Audio object and assign it to the ref
    const audio = new Audio(audioSrc);
    currentAudioRef.current = audio;

    return new Promise<void>((resolve, reject) => {
      audio.onended = () => {
        currentAudioRef.current = null;
        resolve();
      };
      audio.onerror = (error) => {
        console.error("Error playing audio:", error);
        currentAudioRef.current = null;
        reject(error);
      };
      audio
        .play()
        .then(() => {
        })
        .catch((error) => {
          console.error("Error initiating audio playback:", error);
          currentAudioRef.current = null;
          reject(error);
        });
    });
  };

  // Clean up audio on component unmount
  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.currentTime = 0; // Reset playback position
        currentAudioRef.current = null;
      }
    };
  }, []);

  const endCall = () => {
    setIsLaunched(false);
    stopMicrophone();

    // Also stop any ongoing audio playback
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0; // Reset playback position
      currentAudioRef.current = null;
    }

    setIsProcessing(false); // Ensure processing state is reset

    // Reset messages to initial value
    setMessages([]);
  };

  return (
    <div className="flex h-full antialiased text-gray-900 dark:text-white transition-colors duration-300">
      {/* Parent div adjusts background and text based on dark mode */}
      <div className="flex flex-col h-full w-full overflow-x-hidden">
        {!isLaunched ? (
          <div className="flex items-center justify-center h-screen">
            <button
              onClick={() => {
                setIsLaunched(true);
                triggerInitialMessage(); // Trigger the initial hello message when the app is launched
              }}
              className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-400 text-white p-4 rounded shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <span>
                <Phone className="size-4 opacity-50" strokeWidth={2} stroke={"currentColor"} />
              </span>
              <span>Start Call</span>
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col flex-auto h-full p-4 space-y-4 overflow-y-auto">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-4 rounded max-w-lg break-words ${msg.role === "user"
                    ? "bg-blue-700 text-white self-end dark:bg-blue-500"
                    : msg.role === "assistant"
                      ? "bg-green-700 text-white self-start dark:bg-green-500"
                      : "bg-gray-700 text-white self-center dark:bg-gray-600"
                    }`}
                >
                  {msg.content}
                </div>
              ))}
              {isProcessing ? (
                // Display "AI is processing" when processing
                <div className="p-4 rounded max-w-lg bg-yellow-600 text-white self-center dark:bg-yellow-500">
                  AI is processing...
                </div>
              ) : isListening ? (
                // Otherwise, display "Listening..."
                <div className="p-4 rounded max-w-lg bg-purple-600 text-white self-center dark:bg-purple-400">
                  Listening...
                </div>
              ) : null}
            </div>
            <div className="flex justify-center items-center w-full h-full">
              <div className="relative w-1/3 h-32 p-4 bg-white rounded-lg shadow-sm flex items-center">
                <div className="flex justify-center items-center w-2/3 h-1/4">
                  {microphone && <Visualizer microphone={microphone} />}
                </div>
                <div className="ml-4">
                  <button
                    onClick={endCall}
                    className="flex items-center gap-1 bg-red-700 hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-400 text-white pt-4 pb-4 pl-3 pr-3 rounded shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    <span>
                      <Phone className="size-4 opacity-50" strokeWidth={2} stroke={"currentColor"} />
                    </span>
                    <span>End Call</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
