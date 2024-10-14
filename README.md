# Toma Voice AI Agent

This is a voice-based AI agent developed for a take home assignment for Toma. The agent collects vehicle information from users, recommends services based on the vehicle type, and books appointments using Cal.com. It integrates speech-to-text (STT), language model (LLM), and text-to-speech (TTS) APIs to provide a seamless conversational experience.

The project is live at [https://voice-assistant-mu.vercel.app/](https://voice-assistant-mu.vercel.app/).

## Features

1. **Voice Interaction Flow:**
   - **Collect User Info:** The agent collects the user's full name and vehicle information (make, model, year).
   - **Service Recommendations:** Based on the vehicle, it recommends appropriate services:
     - **Chrysler, Dodge, Jeep, RAM:** Factory-recommended maintenance at 50k miles.
     - **Tesla, Polestar, Rivian, EVs:** Battery replacement or charging port diagnosis.
     - **Other makes:** Oil change, tire rotation, windshield wiper replacement.
   - **Scheduling:** 
     - **EVs:** Available on odd hours until 5pm (Mon-Fri).
     - **Hybrid/ICE:** Available on even hours until 6pm (Mon-Fri).
   - **Confirmation:** Confirms the appointment details (vehicle, service, time) before ending.

2. **API Integration:**
   - **Deepgram STT** for speech-to-text.
   - **Together AI LLM** for conversational responses.
   - **Deepgram TTS** for text-to-speech responses.
   - **Cal.com Integration** for booking appointments.

3. **Optimized Performance:**
   - **High accuracy** and **low latency** focus.
   - **Support for multiple concurrent connections**.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jettgem1/voice-assistant
   cd voice-assistant
   ```

2. Install dependencies:
   ```bash
   bun install
   pip install -r requirements.txt
   ```

3. Set up environment variables in a `.env.local` file:
   ```.env.local
  DEEPGRAM_API_KEY=YOUR_DEEPGRAM_API_KEY
  TOGETHER_API_KEY=YOUR_TOGETHER_API_KEY
  DEEPGRAM_ENV=YOUR_DEEPGRAM_ENV
  CAL_API_KEY=YOUR_CAL_API_KEY
  CAL_API_VERSION=2024-08-13
  EVENT_TYPE_ID=YOUR_EVENT_TYPE_ID
  OPENAI_API=YOUR_OPENAI_API

   ```

4. Start the development server:
   ```bash
   bun start
   ```
```
### Usage

- Open [http://localhost:3000](http://localhost:3000) in your browser.
- Interact with the AI agent using your microphone to schedule vehicle services.


### QUESTIONS:

## Handling 100 Concurrent Conversations

To handle 100 concurrent phone conversations, I would implement the following optimizations:
1. **Horizontal Scaling:** Use container orchestration services like Docker with Kubernetes or AWS ECS to scale the application horizontally. I believe currently the site could handle +10 connections, but I have not tested it that far.
2. **Load Balancing:** Introduce a load balancer to distribute traffic across multiple instances.
3. **WebSockets/Server-Sent Events (SSE):** Implement WebSockets or SSE for real-time communication, ensuring low latency even with high traffic.
4. **Queueing System:** Introduce a queueing system such as RabbitMQ or Redis to manage tasks efficiently, preventing bottlenecks.

## Fallback Strategies

I did not end up implementing many fallback strategies besides console.logs, so this is hypothetical:
1. **STT Failure:** If the Deepgram STT service fails, fallback to an alternate STT service or prompt the user to retry the input.
2. **LLM Timeout:** On LLM failure, cache common conversational responses for specific service requests to provide quick fallback responses.
3. **TTS Timeout:** If TTS fails, display text-based responses as a fallback and provide a prompt to retry.

## Testing

I did not end up implementing automated testing, but this is how I would do it:
1. **Unit Testing:** Use Jest with mock API calls to simulate the STT, LLM, and TTS endpoints.
2. **Integration Tests:** Create end-to-end tests with Cypress to validate the full flow from user speech to appointment confirmation.
3. **Simulated Conversations:** Implement a set of pre-recorded voice inputs to test the repeatability of conversations and confirm consistent responses.

## LLM Function Calling & Cal.com Integration

This is how I implemented Cal.com
1. Set up OpenAI Structured output to match Cal.com booking format.
2. Call the OpenAI api when "end call" is clicked with all the messages that were generated
3. After converting this data into structured output, call the Cal.com api and book an appointment

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## Contact

For any questions, reach out to Jett at jettgem1@gmail.com

