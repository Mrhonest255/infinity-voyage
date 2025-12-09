import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Beem SMS API Configuration
// Auth token = base64(apiKey:secretKey)
const BEEM_AUTH_TOKEN = "MjEzNzhhNmJkYmM2NWExNzpNelExWWpoaE5HVTBabU13WVdGa056VmlaalptTXprMk1qZ3pNMk0zWmpFMVlUbGtaVE16WlRKaE1HUTVPVFl6TTJJMVpXUXdNVGMwTnpGbFl6RXpNdz09";
const BEEM_SENDER_ID = "Z-MATE";
const ADMIN_PHONE = "255690000128"; // Admin phone number for notifications

interface BookingSmsRequest {
  customerName: string;
  customerPhone?: string;
  tourName: string;
  travelDate: string;
  numberOfGuests: number;
}

async function sendBeemSms(recipient: string, message: string): Promise<boolean> {
  try {
    console.log("Attempting to send SMS to:", recipient);
    console.log("Using Auth Token:", BEEM_AUTH_TOKEN ? "SET (length: " + BEEM_AUTH_TOKEN.length + ")" : "NOT SET");
    
    const requestBody = {
      source_addr: BEEM_SENDER_ID,
      schedule_time: "",
      encoding: 0,
      message: message,
      recipients: [
        {
          recipient_id: 1,
          dest_addr: recipient,
        },
      ],
    };
    
    console.log("Sending to Beem API...");
    
    const response = await fetch("https://apisms.beem.africa/v1/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${BEEM_AUTH_TOKEN}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Beem SMS failed - Status:", response.status, "Response:", errorData);
      return false;
    }

    const result = await response.json();
    console.log("Beem SMS sent successfully:", JSON.stringify(result));
    return true;
  } catch (error) {
    console.error("Beem SMS error:", error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const booking: BookingSmsRequest = await req.json();

    console.log("Sending SMS notification for booking:", booking.customerName);

    // Format admin notification message (no emojis for better compatibility)
    const adminMessage = `NEW BOOKING!\n\nCustomer: ${booking.customerName}\nTour: ${booking.tourName}\nDate: ${booking.travelDate}\nGuests: ${booking.numberOfGuests}\n${booking.customerPhone ? `Phone: ${booking.customerPhone}` : ''}\n\nCheck dashboard for details.`;

    // Send SMS to admin
    const smsSent = await sendBeemSms(ADMIN_PHONE, adminMessage);

    if (smsSent) {
      console.log("Admin SMS notification sent successfully");
    } else {
      console.error("Failed to send admin SMS notification");
    }

    return new Response(
      JSON.stringify({ 
        success: smsSent, 
        message: smsSent ? "SMS sent successfully" : "SMS sending failed" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error sending SMS:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
