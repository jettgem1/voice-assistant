// app/page.js

'use client';

import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const createBooking = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    const bookingData = {
      startDateTime: '2024-10-14T14:00:00-04:00', // Oct 14th at 2 PM EST
      attendeeName: 'John Doe',
      attendeeEmail: 'john.doe@example.com',
      timeZone: 'America/New_York',
      language: 'en', // Assuming English; change as needed
      guests: ['guest1@example.com', 'guest2@example.com'],
      meetingUrl: 'https://example.com/meeting',
      location: 'https://example.com/meeting',
      customFields: {
        customField: 'customValue'
      }
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'An error occurred while creating the booking.');
      } else {
        setResponse(data);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Create a Baking Time Booking</h1>
      <button
        onClick={createBooking}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Creating Booking...' : 'Create Booking'}
      </button>

      {error && (
        <div className="mt-4 text-red-500">
          <p>Error: {JSON.stringify(error)}</p>
        </div>
      )}

      {response && (
        <div className="mt-4 text-green-500">
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
