import { openai } from '@ai-sdk/openai';
import { JSONParseError, TypeValidationError, generateObject } from 'ai';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { NON_STANDARD_NODE_ENV } from 'next/dist/lib/constants';

// Define the prompt for OpenAI
const instructions = `
You are an assistant that extracts appointment details from chat logs. Given the following conversation between a user and an assistant about making a car appointment, extract the following information:

- First Name
- Last Name
- Day of Appointment (Monday, Tuesday, etc.)
- Appointment Time (HH:MM in 24-hour format) (ASSUME ALL TIMES ARE IN PDT)
- Car Make
- Car Model
- Car Year
- Purpose of the Appointment

### Now convert this information into the following BookingRequest format:

interface BookingRequest {
  start: string; // ISO string in UTC, e.g., "2024-10-14T15:00:00Z" (time of appointment) (ALL DATES are 2024-10 and week of the 14th) (Monday = 2024-10-14 and so on)
  eventName: string; // Format: "Car Appointment with {firstName} {lastName}"
  attendee: {
    name: string; // Full name: "{firstName} {lastName}"
    email: {firstName}.{lastName}@gmail.com;
    notes?: string; // Car details (Make, Model, Year) and appointment purpose.
  };
}

The appointment time should be converted to UTC format as an ISO 8601 string.


The following is the scheme you must stick to:
const AppointmentSchema = z.object({
  start: z.string().refine((isoString) => {
    return !isNaN(Date.parse(isoString));
  }, "Invalid ISO string for start time."),
  eventName: z.string().min(1, "Event name is required."),
  attendee: z.object({
    name: z.string().min(1, "Attendee name is required."),
    email: z.string().email("Invalid email format."),
    notes: z.string().optional(),
  }),
});
`;


const AppointmentSchema = z.object({
  start: z.string().refine((isoString) => {
    return !isNaN(Date.parse(isoString));
  }, "Invalid ISO string for start time."),
  eventName: z.string().min(1, "Event name is required."),
  attendee: z.object({
    name: z.string().min(1, "Attendee name is required."),
    email: z.string().email("Invalid email format."),
    notes: z.string().optional(),
  }),
});
type Appointment = z.infer<typeof AppointmentSchema>;

// Export the generateBet function
async function generateAppointment(
  content: string,
): Promise<
  | { type: 'success'; appointment: Appointment }
  | { type: 'parse-error'; text: string }
  | { type: 'validation-error'; value: unknown }
  | { type: 'unknown-error'; error: unknown }
> {
  try {
    const result = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: AppointmentSchema,
      prompt: `${instructions}${content}`,
    });
    console.log('API Response:', result);

    return { type: 'success', appointment: result.object };
  } catch (error) {
    if (TypeValidationError.isTypeValidationError(error)) {
      return { type: 'validation-error', value: error.value };
    } else if (JSONParseError.isJSONParseError(error)) {
      return { type: 'parse-error', text: error.text };
    } else {
      return { type: 'unknown-error', error };
    }
  }
}


export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input. "content" must be a non-empty string.' },
        { status: 400 }
      );
    }
    const result = await generateAppointment(content);

    if (result.type === 'success') {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: String(error) },
      { status: 500 }
    );
  }
}