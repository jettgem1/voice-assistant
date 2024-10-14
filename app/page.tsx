"use client";

import Image from "next/image";
import App from "./App";
import Tts from "./components/TtsTest";
import TestCal from "./components/TestCal";

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
