import { NextResponse } from 'next/server';
import { createClient } from '@deepgram/sdk';
import { PassThrough } from 'stream';
import { pipeline } from 'stream/promises';

export async function POST(request: Request) {
  try {
    const { text, model } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided.' }, { status: 400 });
    }
    const key = process.env.DEEPGRAM_API_KEY

    const deepgram = createClient(process.env.DEEPGRAM_API_KEY as string);

    // Request audio from Deepgram TTS
    const response = await deepgram.speak.request(
      { text },
      {
        model: model || 'aura-asteria-en',
      }
    );

    const stream = await response.getStream();
    if (!stream) {
      throw new Error('No stream found in Deepgram response');
    }

    // Collect stream chunks into a buffer
    const audioBuffer = await getAudioBuffer(stream);

    // Convert the buffer to base64 and return it
    const base64Audio = audioBuffer.toString('base64');
    return NextResponse.json({ audioContent: base64Audio });
  } catch (error) {
    console.error('Error generating audio:', error);
    return NextResponse.json({ error: 'Error generating audio.' }, { status: 500 });
  }
}

// Helper function to convert the stream into a Buffer
async function getAudioBuffer(stream: ReadableStream<Uint8Array>): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const dataArray = chunks.reduce(
    (acc, chunk) => Uint8Array.from([...acc, ...chunk]),
    new Uint8Array(0)
  );

  return Buffer.from(dataArray.buffer);
}
