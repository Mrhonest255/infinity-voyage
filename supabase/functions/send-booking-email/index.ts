import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const ADMIN_EMAIL = "info@infinityvoyagetours.com";
const FROM_EMAIL = "Infinity Voyage <info@infinityvoyagetours.com>";
const COMPANY_NAME = "Infinity Voyage Tours & Safaris";

interface BookingEmailRequest {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  tourName: string;
  travelDate: string;
  numberOfGuests: number;
  specialRequests?: string;
}

function generateAdminEmailHtml(booking: BookingEmailRequest): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; text-align: center;">
        <h1 style="color: #d4af37; margin: 0; font-size: 24px;">🦁 ${COMPANY_NAME}</h1>
        <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px;">New Booking Request</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px;">
        <h2 style="color: #1a1a2e; margin: 0 0 20px 0; font-size: 20px;">📋 Booking Details</h2>
        
        <table width="100%" cellspacing="0" cellpadding="8" style="border-collapse: collapse;">
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; font-weight: bold; width: 40%;">Customer Name</td>
            <td style="border: 1px solid #dee2e6;">${booking.customerName}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; font-weight: bold;">Email</td>
            <td style="border: 1px solid #dee2e6;"><a href="mailto:${booking.customerEmail}" style="color: #d4af37;">${booking.customerEmail}</a></td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; font-weight: bold;">Phone</td>
            <td style="border: 1px solid #dee2e6;">${booking.customerPhone || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; font-weight: bold;">Tour</td>
            <td style="border: 1px solid #dee2e6; color: #d4af37; font-weight: bold;">${booking.tourName}</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; font-weight: bold;">Travel Date</td>
            <td style="border: 1px solid #dee2e6;">${booking.travelDate}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #dee2e6; font-weight: bold;">Number of Guests</td>
            <td style="border: 1px solid #dee2e6;">${booking.numberOfGuests}</td>
          </tr>
          ${booking.specialRequests && booking.specialRequests !== 'None' ? `
          <tr style="background-color: #f8f9fa;">
            <td style="border: 1px solid #dee2e6; font-weight: bold;">Special Requests</td>
            <td style="border: 1px solid #dee2e6;">${booking.specialRequests}</td>
          </tr>
          ` : ''}
        </table>

        <div style="margin-top: 30px; padding: 20px; background-color: #fff3cd; border-radius: 8px; border-left: 4px solid #d4af37;">
          <p style="margin: 0; color: #856404; font-size: 14px;">
            ⏰ <strong>Action Required:</strong> Please respond to this inquiry within 24 hours.
          </p>
        </div>
      </td>
    </tr>
    <tr>
      <td style="background-color: #1a1a2e; padding: 20px; text-align: center;">
        <p style="color: #888; margin: 0; font-size: 12px;">
          ${COMPANY_NAME} | Tanzania & Zanzibar
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

function generateCustomerEmailHtml(booking: BookingEmailRequest): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px; text-align: center;">
        <h1 style="color: #d4af37; margin: 0; font-size: 28px;">🦁 ${COMPANY_NAME}</h1>
        <p style="color: #ffffff; margin: 15px 0 0 0; font-size: 16px;">Your African Adventure Awaits!</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="color: #1a1a2e; margin: 0 0 10px 0; font-size: 22px;">Jambo ${booking.customerName}! 👋</h2>
        <p style="color: #555; line-height: 1.6; font-size: 15px;">
          Thank you for your booking request! We're thrilled that you've chosen ${COMPANY_NAME} for your 
          <strong style="color: #d4af37;">${booking.tourName}</strong> adventure.
        </p>

        <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 10px; padding: 25px; margin: 25px 0;">
          <h3 style="color: #1a1a2e; margin: 0 0 15px 0; font-size: 18px;">📋 Your Booking Summary</h3>
          <table width="100%" cellspacing="0" cellpadding="5">
            <tr>
              <td style="color: #666; padding: 5px 0;">Tour:</td>
              <td style="color: #1a1a2e; font-weight: bold; text-align: right;">${booking.tourName}</td>
            </tr>
            <tr>
              <td style="color: #666; padding: 5px 0;">Travel Date:</td>
              <td style="color: #1a1a2e; font-weight: bold; text-align: right;">📅 ${booking.travelDate}</td>
            </tr>
            <tr>
              <td style="color: #666; padding: 5px 0;">Guests:</td>
              <td style="color: #1a1a2e; font-weight: bold; text-align: right;">👥 ${booking.numberOfGuests} ${booking.numberOfGuests === 1 ? 'person' : 'people'}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #d4f4dd; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #28a745;">
          <h4 style="color: #155724; margin: 0 0 10px 0;">✅ What Happens Next?</h4>
          <ol style="color: #155724; margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Our travel expert will review your request</li>
            <li>We'll contact you within 24 hours with details</li>
            <li>Once confirmed, you'll receive your itinerary</li>
            <li>Get ready for an unforgettable adventure!</li>
          </ol>
        </div>

        <p style="color: #1a1a2e; font-weight: bold; margin-top: 30px;">
          Asante sana! (Thank you very much!)<br>
          <span style="color: #d4af37;">The ${COMPANY_NAME} Team</span>
        </p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #1a1a2e; padding: 30px; text-align: center;">
        <p style="color: #d4af37; margin: 0 0 10px 0; font-size: 14px;">🌍 Tanzania & Zanzibar Specialists</p>
        <p style="color: #888; margin: 0; font-size: 12px;">
          ${COMPANY_NAME}<br>
          Email: ${ADMIN_EMAIL}<br>
          <a href="https://infinityvoyagetours.com" style="color: #d4af37;">www.infinityvoyagetours.com</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const booking: BookingEmailRequest = await req.json();

    console.log("Sending booking emails via Resend for:", booking.customerName);

    // Send email to admin
    const adminEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: `🦁 New Booking: ${booking.tourName} - ${booking.customerName}`,
        html: generateAdminEmailHtml(booking),
      }),
    });

    if (!adminEmailResponse.ok) {
      const errorData = await adminEmailResponse.text();
      console.error("Admin email failed:", errorData);
    } else {
      console.log("Admin email sent successfully");
    }

    // Send confirmation email to customer
    const customerEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [booking.customerEmail],
        subject: `✅ Booking Received - ${booking.tourName} | ${COMPANY_NAME}`,
        html: generateCustomerEmailHtml(booking),
      }),
    });

    if (!customerEmailResponse.ok) {
      const errorData = await customerEmailResponse.text();
      console.error("Customer email failed:", errorData);
    } else {
      console.log("Customer email sent successfully");
    }

    return new Response(
      JSON.stringify({ success: true, message: "Emails sent successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error sending emails:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
