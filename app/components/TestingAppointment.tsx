import React, { useEffect } from 'react';

function TestAppointmentAPI() {
  useEffect(() => {
    async function testAPI() {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: `
User: Hi, I need to schedule a car appointment.
Assistant: Sure, can I have your first and last name?
User: John Doe
Assistant: What is the make, model, and year of your car?
User: It's a 2018 Toyota Camry.
Assistant: What date and time would you like to schedule?
User:  Tuesday at 4pm.
Assistant: What's the purpose of the appointment?
User: Oil change and tire rotation.
            `,
          }),
        });

        const data = await response.json();
        console.log('API Response:', data);
      } catch (error) {
        console.error('Error calling API:', error);
      }
    }

    testAPI();
  }, []);

  return null; // This component doesn't render anything visible
}

export default TestAppointmentAPI;
