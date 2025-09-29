import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "npm:@supabase/supabase-js@2.50.4"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

interface CustomerDetails {
  full_name: string
  address: string
  postal_code: string
  city: string
  phone: string
}

interface QuoteItem {
  model: string
  categorie: string
  formulier: {
    breedte?: string
    hoogte?: string
    materiaal?: string
    kleurBinnen?: string
    kleurBuiten?: string
    kleurBewegendeDelen?: string
    glasoptie?: string
    profielKeuze?: string
    draairichting?: string
    hor?: string
    dorpel?: string
    hangEnSluitwerk?: string
    aanslag?: string
    opmerkingen?: string
    photoIds?: string[]
    modelImageUrl?: string
    photoUrls?: string[]
    [key: string]: any
  }
}

interface EmailRequest {
  customer_details: CustomerDetails
  items: QuoteItem[]
  quote_id: string
  customer_email?: string
}

const formatFieldName = (key: string): string => {
  const fieldNames: Record<string, string> = {
    breedte: 'Breedte (mm)',
    hoogte: 'Hoogte (mm)',
    materiaal: 'Materiaal',
    kleurBinnen: 'Kleur binnenzijde',
    kleurBuiten: 'Kleur buitenzijde',
    kleurBewegendeDelen: 'Kleur bewegende delen',
    glasoptie: 'Glasoptie',
    profielKeuze: 'Profiel keuze',
    draairichting: 'Draairichting',
    hor: 'Hor (insectenscreen)',
    dorpel: 'Dorpel',
    hangEnSluitwerk: 'Hang- en sluitwerk',
    aanslag: 'Aanslag',
    opmerkingen: 'Opmerkingen'
  }
  return fieldNames[key] || key
}

const generateBusinessEmailHTML = (data: EmailRequest): string => {
  const { customer_details, items, quote_id } = data

  const generateItemsHTML = (): string => {
    return items.map((item, index) => {
      // Model afbeelding HTML
      const modelImageHTML = item.formulier.modelImageUrl ? `
        <div style="text-align: center; margin-bottom: 25px; padding: 20px; background-color: #f8fafc; border-radius: 12px; border: 2px solid #e5e7eb;">
          <h5 style="color: #1f2937; margin-bottom: 15px; font-size: 16px; font-weight: 600;">🏠 Gekozen Model</h5>
          <img src="${item.formulier.modelImageUrl}" alt="${item.model}" style="
            max-width: 100%; 
            width: 300px; 
            height: auto; 
            display: block; 
            margin: 0 auto; 
            border-radius: 8px; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
            border: 1px solid #d1d5db;
          " />
          <p style="margin: 12px 0 0 0; font-size: 14px; color: #6b7280; font-weight: 600;">
            Model: ${item.model}
          </p>
        </div>
      ` : `
        <div style="text-align: center; margin-bottom: 25px; padding: 20px; background-color: #fef3c7; border-radius: 12px; border: 2px solid #f59e0b;">
          <h5 style="color: #92400e; margin-bottom: 10px; font-size: 16px; font-weight: 600;">🏠 Gekozen Model</h5>
          <p style="margin: 0; font-size: 14px; color: #92400e; font-weight: 600;">
            ${item.model}
          </p>
          <p style="margin: 8px 0 0 0; font-size: 12px; color: #92400e;">
            (Geen model afbeelding beschikbaar)
          </p>
        </div>
      `
      
      // Klant foto's HTML
      const photosHTML = item.formulier.photoUrls && item.formulier.photoUrls.length > 0 ? `
        <div style="margin-top: 25px; padding: 25px; background-color: #ecfdf5; border-radius: 12px; border: 2px solid #10b981;">
          <h5 style="color: #065f46; margin-bottom: 20px; font-size: 16px; font-weight: 600;">
            📷 Klant Foto's (${item.formulier.photoUrls.length} ${item.formulier.photoUrls.length === 1 ? 'foto' : 'foto\'s'})
          </h5>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 20px;">
            ${item.formulier.photoUrls.map((url, photoIndex) => `
              <div style="text-align: center; background-color: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <img src="${url}" alt="Klant foto ${photoIndex + 1}" style="
                  max-width: 100%; 
                  width: 100%;
                  height: 200px; 
                  border-radius: 8px; 
                  box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
                  border: 1px solid #e5e7eb;
                  object-fit: cover;
                  display: block;
                " />
                <p style="margin: 12px 0 0 0; font-size: 12px; color: #065f46; font-weight: 600;">
                  Foto ${photoIndex + 1}
                </p>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''
      
      return `
      <div style="margin-bottom: 40px; padding: 30px; border: 2px solid #e5e7eb; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
        <h3 style="color: #1f2937; margin-bottom: 20px; font-size: 20px; font-weight: 700; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
          🪟 Kozijn ${index + 1}: ${item.model}
        </h3>
        
        ${modelImageHTML}
        
        <div style="margin-bottom: 20px; padding: 15px; background-color: #f1f5f9; border-radius: 8px;">
          <p style="margin: 0; color: #1e40af; font-weight: 600; font-size: 16px;">
            <strong>Categorie:</strong> ${item.categorie}
          </p>
        </div>
        
        <h4 style="color: #374151; margin-bottom: 15px; font-size: 18px; font-weight: 600;">📋 Specificaties:</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background-color: #f9fafb; border-radius: 8px; overflow: hidden;">
          ${Object.entries(item.formulier)
            .filter(([key, value]) => value && value !== '' && key !== 'photoIds' && key !== 'modelImageUrl' && key !== 'photoUrls')
            .map(([key, value]) => `
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 15px; font-weight: 600; color: #374151; width: 40%; background-color: #f8fafc;">
                  ${formatFieldName(key)}:
                </td>
                <td style="padding: 12px 15px; color: #6b7280; background-color: white;">
                  ${key === 'profielKeuze' ? (value === 'ideal-7000' ? 'Ideal 7000' : value === 'ideal-8000' ? 'Ideal 8000' : value) : 
                    key === 'aanslag' ? (value === 'ja' ? 'Ja' : 'Nee') : 
                    key === 'hor' ? (value === 'ja' ? 'Ja, gewenst' : 'Nee, niet gewenst') : 
                    value}
                </td>
              </tr>
            `).join('')}
        </table>
        
        ${photosHTML}
      </div>
      `
    }).join('')
  }

  return `
    <!DOCTYPE html>
    <html lang="nl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nieuwe Kozijn Offerte</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 900px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
      
      <div style="background-color: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #2563eb; margin-bottom: 10px; font-size: 32px; font-weight: bold;">
            🏠 FT-Kozijnen
          </h1>
          <h2 style="color: #1e40af; margin-bottom: 20px; font-size: 24px;">
            Nieuwe Kozijn Offerte-aanvraag
          </h2>
          <p style="color: #6b7280; font-size: 16px;">
            Offerte ID: #${quote_id.slice(0, 8)}
          </p>
        </div>
        
        <div style="margin-bottom: 40px; padding: 25px; background-color: #f1f5f9; border-radius: 8px; border-left: 4px solid #2563eb;">
          <h3 style="color: #1e40af; margin-bottom: 20px; font-size: 20px;">👤 Klantgegevens</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 12px 0; font-weight: 600; color: #475569; width: 30%;">Naam:</td>
              <td style="padding: 12px 0; color: #64748b; font-size: 16px;">${customer_details.full_name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 12px 0; font-weight: 600; color: #475569;">Adres:</td>
              <td style="padding: 12px 0; color: #64748b; font-size: 16px;">${customer_details.address}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 12px 0; font-weight: 600; color: #475569;">Postcode:</td>
              <td style="padding: 12px 0; color: #64748b; font-size: 16px;">${customer_details.postal_code}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 12px 0; font-weight: 600; color: #475569;">Woonplaats:</td>
              <td style="padding: 12px 0; color: #64748b; font-size: 16px;">${customer_details.city}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 12px 0; font-weight: 600; color: #475569;">Email:</td>
              <td style="padding: 12px 0; color: #64748b; font-size: 16px;">
                <a href="mailto:${data.customer_email}" style="color: #2563eb; text-decoration: none;">
                  ${data.customer_email}
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-weight: 600; color: #475569;">Telefoonnummer:</td>
              <td style="padding: 12px 0; color: #64748b; font-size: 16px;">
                <a href="tel:${customer_details.phone}" style="color: #2563eb; text-decoration: none;">
                  ${customer_details.phone}
                </a>
              </td>
            </tr>
          </table>
        </div>
        
        <div style="margin-bottom: 40px;">
          <h3 style="color: #1e40af; margin-bottom: 25px; font-size: 20px;">🪟 Geconfigureerde Kozijnen</h3>
          <div style="background-color: #ecfdf5; padding: 15px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #10b981;">
            <p style="color: #065f46; margin: 0; font-weight: 600; font-size: 16px;">
              📊 Totaal aantal kozijnen: ${items.length}
            </p>
          </div>
          
          ${generateItemsHTML()}
        </div>
        
        <div style="margin-top: 40px; padding: 25px; background-color: #fef3c7; border-radius: 8px; text-align: center; border-left: 4px solid #f59e0b;">
          <h4 style="color: #92400e; margin-bottom: 15px; font-size: 18px;">⚡ Volgende Stappen</h4>
          <ul style="color: #92400e; text-align: left; margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">Neem binnen 24 uur contact op met de klant</li>
            <li style="margin-bottom: 8px;">Maak een afspraak voor opname ter plaatse</li>
            <li style="margin-bottom: 8px;">Bereid een gedetailleerde prijsopgave voor</li>
            <li>Verstuur offerte naar klant</li>
          </ul>
        </div>
        
        <div style="margin-top: 40px; padding: 20px; background-color: #f8fafc; border-radius: 8px; text-align: center; border-top: 2px solid #e2e8f0;">
          <p style="color: #64748b; margin: 0; font-size: 14px;">
            📧 Deze offerte is automatisch gegenereerd door het FT-Kozijnen configuratiesysteem
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

const generateCustomerEmailHTML = (data: EmailRequest): string => {
  const { customer_details, items, quote_id } = data

  return `
    <!DOCTYPE html>
    <html lang="nl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Offerte Bevestiging - FT-Kozijnen</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
      
      <div style="background-color: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #2563eb; margin-bottom: 10px; font-size: 32px; font-weight: bold;">
            🏠 FT-Kozijnen
          </h1>
          <h2 style="color: #16a34a; margin-bottom: 20px; font-size: 24px;">
            ✅ Offerte Succesvol Ontvangen!
          </h2>
        </div>
        
        <div style="margin-bottom: 30px; padding: 25px; background-color: #f0f9ff; border-radius: 8px; border-left: 4px solid #2563eb;">
          <h3 style="color: #1e40af; margin-bottom: 15px; font-size: 18px;">Beste ${customer_details.full_name},</h3>
          <p style="color: #1e40af; margin-bottom: 15px;">
            Hartelijk dank voor uw interesse in FT-Kozijnen! We hebben uw offerte-aanvraag succesvol ontvangen.
          </p>
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            Offerte ID: #${quote_id.slice(0, 8)}
          </p>
        </div>
        
        <div style="margin-bottom: 30px; padding: 20px; background-color: #ecfdf5; border-radius: 8px; border-left: 4px solid #10b981;">
          <h4 style="color: #065f46; margin-bottom: 15px; font-size: 16px;">📋 Uw Aanvraag:</h4>
          <p style="color: #065f46; margin-bottom: 10px;">
            <strong>Aantal kozijnen:</strong> ${items.length}
          </p>
          <p style="color: #065f46; margin: 0;">
            <strong>Aangevraagd op:</strong> ${new Date().toLocaleDateString('nl-NL', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        
        <div style="margin-bottom: 30px; padding: 20px; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
          <h4 style="color: #92400e; margin-bottom: 15px; font-size: 16px;">⏰ Wat gebeurt er nu?</h4>
          <ul style="color: #92400e; margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">We beoordelen uw aanvraag binnen 24 uur</li>
            <li style="margin-bottom: 8px;">Een van onze specialisten neemt contact met u op</li>
            <li style="margin-bottom: 8px;">We plannen een afspraak voor opname ter plaatse</li>
            <li>U ontvangt een gedetailleerde prijsopgave</li>
          </ul>
        </div>
        
        <div style="margin-bottom: 30px; padding: 20px; background-color: #f1f5f9; border-radius: 8px; text-align: center;">
          <h4 style="color: #475569; margin-bottom: 15px; font-size: 16px;">📞 Contact</h4>
          <p style="color: #64748b; margin-bottom: 10px;">
            <strong>Telefoon:</strong> <a href="tel:+31639430243" style="color: #2563eb; text-decoration: none;">+31 639 430 243</a>
          </p>
          <p style="color: #64748b; margin-bottom: 10px;">
            <strong>Email:</strong> <a href="mailto:info@ftkozijnen.nl" style="color: #2563eb; text-decoration: none;">info@ftkozijnen.nl</a>
          </p>
          <p style="color: #64748b; margin: 0;">
            <strong>Adres:</strong> Industrieweg 17 Opslag 6, 4561 GH Hulst
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; background-color: #f8fafc; border-radius: 8px; border-top: 2px solid #e2e8f0;">
          <p style="color: #64748b; margin: 0; font-size: 14px;">
            Met vriendelijke groet,<br>
            <strong style="color: #2563eb;">Het FT-Kozijnen Team</strong>
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
    const requestData: EmailRequest = await req.json()
    console.log('✅ Received email request:', JSON.stringify(requestData, null, 2))

    // Initialize Supabase client with service role key for full access
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
      return new Response(
        JSON.stringify({ error: "Missing Supabase configuration" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Validate required data
    if (!requestData.customer_details || !requestData.items || !Array.isArray(requestData.items)) {
      console.error('❌ Missing required data')
      return new Response(
        JSON.stringify({ 
          error: "Missing required data: customer_details and items array are required" 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    // Process photos for each item
    console.log('📸 Processing photos for items...')
    for (const item of requestData.items) {
      if (item.formulier.photoIds && item.formulier.photoIds.length > 0) {
        console.log(`📸 Processing ${item.formulier.photoIds.length} photos for item: ${item.model}`)
        
        try {
          // Get photo metadata from database
          const { data: photoMetadata, error: metadataError } = await supabase
            .from('photo_metadata')
            .select('storage_path')
            .in('id', item.formulier.photoIds)
          
          if (metadataError) {
            console.error('❌ Error fetching photo metadata:', metadataError)
            continue
          }
          
          if (photoMetadata && photoMetadata.length > 0) {
            console.log(`📸 Found ${photoMetadata.length} photo metadata records`)
            
            // Generate public URLs for each photo
            const photoUrls: string[] = []
            for (const metadata of photoMetadata) {
              const { data } = supabase.storage
                .from('customer-photos')
                .getPublicUrl(metadata.storage_path)
              
              if (data?.publicUrl) {
                photoUrls.push(data.publicUrl)
                console.log(`📸 Generated public URL for photo: ${metadata.storage_path}`)
              }
            }
            
            // Add photo URLs to the item
            item.formulier.photoUrls = photoUrls
            console.log(`📸 Added ${photoUrls.length} photo URLs to item: ${item.model}`)
          } else {
            console.log(`📸 No photo metadata found for item: ${item.model}`)
          }
        } catch (error) {
          console.error('❌ Error processing photos for item:', item.model, error)
        }
      }
    }

    // Validate customer details
    const { customer_details } = requestData
    const requiredFields = ['full_name', 'address', 'postal_code', 'city', 'phone']
    const missingFields = requiredFields.filter(field => !customer_details[field as keyof CustomerDetails])
    
    if (missingFields.length > 0) {
      console.error('❌ Missing customer details:', missingFields)
      return new Response(
        JSON.stringify({ 
          error: `Missing customer details: ${missingFields.join(', ')}` 
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
      console.error('❌ RESEND_API_KEY not found in environment')
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY environment variable is not set" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    console.log('✅ RESEND_API_KEY found, generating emails...')

    // Generate email content
    const businessEmailHTML = generateBusinessEmailHTML(requestData)
    const customerEmailHTML = generateCustomerEmailHTML(requestData)
    
    const businessSubject = `🏠 Nieuwe Kozijn Offerte: ${customer_details.full_name}`
    const customerSubject = `✅ Bevestiging Offerte-aanvraag - FT-Kozijnen`

    console.log('📧 Sending emails...')

    // Send business email
    const businessEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'FT-Kozijnen <onboarding@resend.dev>',
        to: ['alainh1990@gmail.com'],
        reply_to: `${customer_details.full_name} <${requestData.customer_email || 'onboarding@resend.dev'}>`,
        subject: businessSubject,
        html: businessEmailHTML,
      }),
    })

    // Send customer confirmation email
    const customerEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'FT-Kozijnen <onboarding@resend.dev>',
        to: [requestData.customer_email || 'onboarding@resend.dev'],
        subject: customerSubject,
        html: customerEmailHTML,
      }),
    })

    const businessResult = await businessEmailResponse.text()
    const customerResult = await customerEmailResponse.text()

    console.log('📧 Business email response:', businessResult)
    console.log('📧 Customer email response:', customerResult)

    const businessSuccess = businessEmailResponse.ok
    const customerSuccess = customerEmailResponse.ok

    if (!businessSuccess && !customerSuccess) {
      console.error('❌ Both emails failed')
      return new Response(
        JSON.stringify({ 
          error: "Failed to send both emails",
          businessError: businessResult,
          customerError: customerResult
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    const results = {
      success: true,
      businessEmail: {
        success: businessSuccess,
        result: businessSuccess ? JSON.parse(businessResult) : businessResult,
        recipient: 'alainh1990@gmail.com'
      },
      customerEmail: {
        success: customerSuccess,
        result: customerSuccess ? JSON.parse(customerResult) : customerResult,
        recipient: requestData.customer_email || 'geen email opgegeven'
      }
    }

    console.log('✅ Email sending completed:', results)

    return new Response(
      JSON.stringify(results),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )

  } catch (error) {
    console.error('❌ Error in send-quote-email function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  }
})