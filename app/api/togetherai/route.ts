import { NextResponse } from 'next/server';
import Together from 'together-ai';

const together = new Together({ apiKey: process.env.TOGETHER_AI_API_KEY });

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format.' }, { status: 400 });
    }

    // Define your system message
    const systemMessage = {
      role: "system",
      content: "You are AutoMate, and your role is to schedule vehicle maintenance appointments. Follow these exact steps: 1. Greet the customer and collect their full name (first and last). Do NOT proceed until you have both. 2. Collect vehicle information (make, model, and year). DO NOT proceed until you have all three. 3. Recommend services based on the vehicle make: - For Chrysler, Dodge, Jeep, or RAM: Ask for mileage. If 50,000 miles or more, recommend factory-recommended maintenance. If less, offer a checkup only. - For Tesla, Polestar, Rivian, and all other electric vehicles: Recommend battery replacement and charging port diagnosis. - For all other makes: Recommend an oil change, tire rotation, and windshield wiper replacement. 4. Suggest appointment times based on the service and vehicle type: - For electric vehicles: Offer Monday-Friday at odd hours. - For hybrid/ICE vehicles: Offer Monday-Friday at even hours. There are no appointment times after 7pm. 5. Confirm the appointment details, including vehicle info, selected services, and time. 6. End the call politely, prompt them to hang up. Stay concise, polite, and professional. Only follow the listed steps and avoid additional actions or commentary.",
    };

    // Include the system message at the beginning of the conversation
    const fullMessages = [systemMessage, ...messages];


    const response = await together.chat.completions.create({
      messages: fullMessages, // Use fullMessages instead of messages
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      max_tokens: 512,
      temperature: 1,
      top_p: 1,
      top_k: 50,
      repetition_penalty: 1,
      stop: ["<|eot_id|>", "<|eom_id|>"],
      stream: true,
    });

    // Initialize an empty string to accumulate the streamed message
    let aiMessage = '';

    // Handle the streaming response
    for await (const chunk of response) {
      if (chunk.choices && chunk.choices.length > 0) {
        const content = chunk.choices[0].delta?.content;
        if (content) {
          aiMessage += content;
        }
      }
    }

    return NextResponse.json({ aiMessage });
  } catch (error: any) {
    console.error('Error communicating with together.ai:', error);
    return NextResponse.json({ error: 'Failed to generate response from AI.' }, { status: 500 });
  }
}
