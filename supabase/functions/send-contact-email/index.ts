import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

const generateContactEmailHTML = (data: ContactFormData): string => {
  return `
    <!DOCTYPE html>
    <html lang="nl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nieuw Contact Bericht - FT-Kozijnen</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
      
      <div style="background-color: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #2563eb; margin-bottom: 10px; font-size: 32px; font-weight: bold;">
            🏠 FT-Kozijnen
          </h1>
          <h2 style="color: #1e40af; margin-bottom: 20px; font-size: 24px;">
            📧 Nieuw Contact Bericht
          </h2>
          <p style="color: #6b7280; font-size: 16px;">
            Ontvangen via contactformulier website
          </p>
        </div>
        
        <div style="margin-bottom: 40px; padding: 25px; background-color: #f1f5f9; border-radius: 8px; border-left: 4px solid #2563eb;">
          <h3 style="color: #1e40af; margin-bottom: 20px; font-size: 20px;">👤 Contactgegevens</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 12px 0; font-weight: 600; color: #475569; width: 30%;">Naam:</td>
              <td style="padding: 12px 0; color: #64748b; font-size: 16px;">${data.name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 12px 0; font-weight: 600; color: #475569;">Email:</td>
              <td style="padding: 12px 0; color: #64748b; font-size: 16px;">
                <a href="mailto:${data.email}" style="color: #2563eb; text-decoration: none;">
                  ${data.email}
                </a>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 12px 0; font-weight: 600; color: #475569;">Telefoon:</td>
              <td style="padding: 12px 0; color: #64748b; font-size: 16px;">
                <a href="tel:${data.phone}" style="color: #2563eb; text-decoration: none;">
                  ${data.phone || 'Niet opgegeven'}
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-weight: 600; color: #475569;">Onderwerp:</td>
              <td style="padding: 12px 0; color: #64748b; font-size: 16px;">${data.subject}</td>
            </tr>
          </table>
        </div>
        
        <div style="margin-bottom: 40px; padding: 25px; background-color: #f0f9ff; border-radius: 8px; border-left: 4px solid #0ea5e9;">
          <h3 style="color: #0c4a6e; margin-bottom: 20px; font-size: 20px;">💬 Bericht</h3>
          <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e0f2fe;">
            <p style="color: #374151; margin: 0; white-space: pre-wrap; font-size: 16px; line-height: 1.6;">
              ${data.message}
            </p>
          </div>
        </div>
        
        <div style="margin-top: 40px; padding: 25px; background-color: #fef3c7; border-radius: 8px; text-align: center; border-left: 4px solid #f59e0b;">
          <h4 style="color: #92400e; margin-bottom: 15px; font-size: 18px;">⚡ Actie Vereist</h4>
          <p style="color: #92400e; margin: 0;">
            Neem binnen 24 uur contact op met deze klant voor de beste service!
          </p>
        </div>
        
        <div style="margin-top: 40px; padding: 20px; background-color: #f8fafc; border-radius: 8px; text-align: center; border-top: 2px solid #e2e8f0;">
          <p style="color: #64748b; margin: 0; font-size: 14px;">
            📧 Dit bericht is automatisch gegenereerd door het FT-Kozijnen contactformulier
          </p>
          <p style="color: #64748b; margin: 8px 0 0 0; font-size: 14px;">
            🕒 Ontvangen op: ${new Date().toLocaleDateString('nl-NL', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
      
    </body>
    </html>
  `
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const formData: ContactFormData = await req.json()
    console.log('Received contact form data:', JSON.stringify(formData, null, 2))

    // Validate required data
    if (!formData.name || !formData.email || !formData.message) {
      console.error('Missing required fields')
      return new Response(
        JSON.stringify({ 
          error: "Naam, email en bericht zijn verplicht" 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    // Get Resend API key from environment
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not found in environment')
      return new Response(
        JSON.stringify({ error: "Email service niet beschikbaar" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    // Generate email content
    const emailHTML = generateContactEmailHTML(formData)
    const subject = `📧 Nieuw Contact: ${formData.name} - ${formData.subject}`

    console.log('Sending contact email...')

    // Send email to business
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'FT-Kozijnen Contact <onboarding@resend.dev>',
        to: ['alainh1990@gmail.com'],
        reply_to: `${formData.name} <${formData.email}>`,
        subject: subject,
        html: emailHTML,
      }),
    })

    const result = await emailResponse.text()
    console.log('Email response:', result)

    if (!emailResponse.ok) {
      console.error('Failed to send email:', result)
      return new Response(
        JSON.stringify({ 
          error: "Fout bij versturen email",
          details: result
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Bericht succesvol verzonden",
        result: JSON.parse(result)
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )

  } catch (error) {
    console.error('Error in send-contact-email function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: "Server fout",
        details: error instanceof Error ? error.message : "Onbekende fout"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  }
})