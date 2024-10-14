// app/api/cal/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

// Constants for Cal.com API
const CAL_API_URL = 'https://api.cal.com/v2/bookings';
const CAL_API_VERSION = '2024-08-13';

// Fetch the API key from environment variables
const CAL_API_KEY = process.env.CAL_API_KEY;

if (!CAL_API_KEY) {
  throw new Error('CAL_API_KEY is not defined in environment variables.');
}

// Define the structure of the booking request
interface BookingRequest {
  start: string; // ISO string in UTC, e.g., "2024-10-14T15:00:00Z"
  eventName: string;
  attendee: {
    name: string;
    email: string;
    timeZone?: string; // Optional: Defaults to 'America/New_York'
    language?: string;  // Optional: Defaults to 'en'
    notes?: string;    // Optional: Additional notes
  };
}

// Handler for POST requests
export async function POST(request: NextRequest) {
  try {
    // Parse the incoming JSON request
    const { start, eventName, attendee }: BookingRequest = await request.json();

    // Basic validation
    if (!start || !eventName || !attendee) {
      return NextResponse.json(
        { error: 'Missing required fields: start, eventName, attendee.' },
        { status: 400 }
      );
    }

    // Parse the start time
    const startDateUTC = parseISO(start);
    if (isNaN(startDateUTC.getTime())) {
      return NextResponse.json(
        { error: 'Invalid start time format. Use ISO string format.' },
        { status: 400 }
      );
    }

    // Convert UTC time to PST
    const timeZone = 'America/Los_Angeles';
    const zonedDate = toZonedTime(startDateUTC, timeZone);

    // Get day of the week (0 = Sunday, 6 = Saturday)
    const dayOfWeek = zonedDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return NextResponse.json(
        { error: 'Bookings are only allowed from Monday to Friday.' },
        { status: 400 }
      );
    }

    // Get hour in PST
    const hour = zonedDate.getHours();
    if (hour < 7 || hour >= 19) {
      return NextResponse.json(
        { error: 'Bookings are only allowed from 7 AM to 7 PM PST.' },
        { status: 400 }
      );
    }

    // Prepare the payload for Cal.com API
    const payload = {
      start,
      eventTypeId: 1274448, // Replace with your actual Event Type ID if different
      attendee: {
        name: attendee.name,
        email: attendee.email,
        timeZone: attendee.timeZone || 'America/Los_Angeles',
        language: attendee.language || 'en',
      },
    };

    // Make the POST request to Cal.com API
    const response = await fetch(CAL_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CAL_API_KEY}`,
        'cal-api-version': CAL_API_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: 'Failed to create booking.', details: errorData },
        { status: response.status }
      );
    }

    // Parse and return the successful response
    const data = await response.json();
    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Internal Server Error.' },
      { status: 500 }
    );
  }
}