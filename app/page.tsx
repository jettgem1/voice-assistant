"use client";

import Image from "next/image";
import App from "./App";
import Tts from "./context/TtsTest";

const Home = () => {
  return (
    <>
      <div className="h-full overflow-hidden">
        <main className="mx-auto">
          <App />
        </main>

      </div>
    </>
  );
};

export default Home;
