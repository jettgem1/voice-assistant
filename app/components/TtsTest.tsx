import { useState } from "react";

const TtsTest: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const fetchWithTimeout = (url: string, options: RequestInit, timeout = 60000) => {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Request timed out'));
      }, timeout);

      fetch(url, options)
        .then((response) => {
          clearTimeout(timeoutId);
          resolve(response);
        })
        .catch((err) => {
          clearTimeout(timeoutId);
          reject(err);
        });
    });
  };

  const fetchAndPlayTTS = async () => {
    const text = "Hello! This is a test of the text to speech system. TESTING TESTING TESTING";

    try {
      setIsPlaying(true);
      console.log("Requesting TTS for text:", text);

      // Request TTS from the backend API
      const response: any = await fetchWithTimeout("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }, 60000); // Set 60-second timeout

      if (!response.ok) {
        throw new Error(`TTS HTTP error! status: ${response.status}`);
      }

      const ttsData = await response.json();
      const audioContent = ttsData.audioContent; // Base64-encoded audio

      console.log("TTS data received:", audioContent);

      // Play the audio using the Audio API
      await playAudio(audioContent);
    } catch (error) {
      console.error("Error fetching TTS:", error);
    } finally {
      setIsPlaying(false);
    }
  };

  const playAudio = async (base64Audio: string) => {
    const audioSrc = "data:audio/wav;base64," + base64Audio; // Correct MIME type for WAV
    const audio = new Audio(audioSrc);

    return new Promise<void>((resolve, reject) => {
      audio.onended = () => {
        console.log("Audio playback finished.");
        resolve();
      };
      audio.onerror = (error) => {
        console.error("Error playing audio:", error);
        reject(error);
      };
      audio.play().catch((error) => {
        console.error("Error initiating audio playback:", error);
        reject(error);
      });
    });
  };

  return (
    <div>
      <h1>TTS Test</h1>
      <button onClick={fetchAndPlayTTS} disabled={isPlaying}>
        {isPlaying ? "Playing..." : "Play TTS"}
      </button>
    </div>
  );
};

export default TtsTest;
