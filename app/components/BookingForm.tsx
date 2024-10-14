// components/BookingForm.tsx

import { useState } from 'react';

interface Attendee {
  name: string;
  email: string;
  timeZone?: string;
  language?: string;
}

const BookingForm = () => {
  const [eventName, setEventName] = useState('');
  const [start, setStart] = useState('');
  const [attendee, setAttendee] = useState<Attendee>({
    name: '',
    email: '',
    timeZone: 'America/New_York',
    language: 'en',
  });
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic frontend validation can be added here

    const bookingData = {
      start,
      eventName,
      attendee,
    };

    try {
      const response = await fetch('/api/cal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(`Error: ${result.error}`);
      } else {
        setMessage('Booking successful!');
        // Optionally, handle the successful booking data
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An unexpected error occurred.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h2 className="text-2xl mb-4">Create a Booking</h2>

      <div className="mb-4">
        <label className="block mb-1">Event Name</label>
        <input
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Start Time (UTC)</label>
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(new Date(e.target.value).toISOString())}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <small className="text-gray-500">
          Please select a date and time in UTC.
        </small>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Attendee Name</label>
        <input
          type="text"
          value={attendee.name}
          onChange={(e) => setAttendee({ ...attendee, name: e.target.value })}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Attendee Email</label>
        <input
          type="email"
          value={attendee.email}
          onChange={(e) => setAttendee({ ...attendee, email: e.target.value })}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Optional Fields */}
      <div className="mb-4">
        <label className="block mb-1">Time Zone</label>
        <input
          type="text"
          value={attendee.timeZone}
          onChange={(e) => setAttendee({ ...attendee, timeZone: e.target.value })}
          placeholder="e.g., America/New_York"
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Language</label>
        <input
          type="text"
          value={attendee.language}
          onChange={(e) => setAttendee({ ...attendee, language: e.target.value })}
          placeholder="e.g., en"
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
      >
        Book Now
      </button>

      {message && (
        <p className="mt-4 text-center text-red-500">{message}</p>
      )}
    </form>
  );
};

export default BookingForm;
