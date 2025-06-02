import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { cn } from "@/utils";
import { DeepgramContextProvider } from "./context/DeepgramContextProvider";
import { MicrophoneContextProvider } from "./context/MicrophoneContextProvider";
// import CalButton from './components/CalButton';

export const metadata: Metadata = {
  title: "AutoMate Voice Assistant",
  description: "An AI-powered voice assistant for scheduling automotive service appointments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          GeistSans.variable,
          GeistMono.variable,
          "flex flex-col min-h-screen"
        )}
      >
        <Nav />
        <MicrophoneContextProvider>
          <DeepgramContextProvider>
            {children}
            {/* <CalButton /> */}
          </DeepgramContextProvider>
        </MicrophoneContextProvider>
      </body>
    </html >
  );
}
