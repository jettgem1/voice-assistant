// app/components/CalButton.jsx

'use client'; // This directive ensures the component is treated as a Client Component

import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function CalButton() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ "namespace": "appointment" });

      // Initialize the floating button
      cal("floatingButton", {
        "calLink": "jettgem1/appointment", // Replace with your Cal.com link
        "config": {
          "layout": "month_view"
        },
        "buttonText": "Check Availability",
        "buttonColor": "#fffc3e",
        "buttonTextColor": "#000000"
      });

      // Customize the UI if needed
      cal("ui", {
        "styles": {
          "branding": {
            "brandColor": "#000000"
          }
        },
        "hideEventTypeDetails": false,
        "layout": "month_view"
      });
    })();
  }, []);

  return null; // This component doesn't render anything visible
}
