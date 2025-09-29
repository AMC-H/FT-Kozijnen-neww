import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Profile, CustomerDetails } from '../types'
import { User, MapPin, Phone, Mail, Send, ArrowLeft } from 'lucide-react'

const FinalizeQuote: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState<CustomerDetails>({
    full_name: '',
    address: '',
    postal_code: '',
    city: '',
    phone: '',
    email: ''
  })
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [conceptQuotes, setConceptQuotes] = useState<any[]>([])

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    
    loadUserData()
  }, [user, navigate])

  const loadUserData = async () => {
    try {
      setLoading(true)
      
      // Load existing profile if it exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)

      if (profileError) {
        console.error('Error loading profile:', profileError)
      } else if (profile && profile.length > 0) {
        const userProfile = profile[0]
        setFormData({
          full_name: userProfile.full_name || '',
          address: userProfile.address || '',
          postal_code: userProfile.postal_code || '',
          city: userProfile.city || '',
          phone: userProfile.phone || '',
          email: user?.email || ''
        })
      }

      // Load concept quotes
      const { data: quotes, error: quotesError } = await supabase
        .from('quotes')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'concept')
        .order('created_at', { ascending: false })

      if (quotesError) {
        console.error('Error loading quotes:', quotesError)
        setError('Fout bij het laden van offertes')
      } else {
        setConceptQuotes(quotes || [])
        if (!quotes || quotes.length === 0) {
          setError('Geen concept offertes gevonden om in te dienen')
        }
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Er ging iets mis bij het laden van gegevens')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('🔥 SUBMIT STARTED - handleSubmit aangeroepen')
    
    if (!user?.id) {
      console.log('❌ SUBMIT FAILED - Geen user ID')
      setError('Gebruiker niet gevonden')
      return
    }

    if (conceptQuotes.length === 0) {
      console.log('❌ SUBMIT FAILED - Geen concept quotes')
      setError('Geen concept offertes om in te dienen')
      return
    }

    // Validate required fields
    if (!formData.full_name || !formData.address || !formData.postal_code || !formData.city || !formData.phone || !formData.email) {
      console.log('❌ SUBMIT FAILED - Ontbrekende velden:', {
        full_name: !!formData.full_name,
        address: !!formData.address,
        postal_code: !!formData.postal_code,
        city: !!formData.city,
        phone: !!formData.phone,
        email: !!formData.email
      })
      setError('Vul alle velden in')
      return
    }

    console.log('✅ VALIDATION PASSED - Alle validaties geslaagd')
    console.log('📊 Form data:', formData)
    console.log('📋 Concept quotes:', conceptQuotes.length)

    setSubmitting(true)
    setError('')

    // TEST EMAIL EERST - voordat we database updates doen
    console.log('🚀 TESTING EMAIL FIRST...')
    try {
      const emailData = {
        customer_details: formData,
        items: conceptQuotes.flatMap(quote => Array.isArray(quote.items) ? quote.items : [quote.items]),
        quote_id: conceptQuotes[0]?.id || 'test-id',
        customer_email: formData.email
      }
      
      console.log('📧 Email data being sent:', emailData)
      console.log('🌐 Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
      console.log('🔑 Has anon key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)
      
      const emailResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-quote-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      })

      console.log('📬 Email response status:', emailResponse.status)
      console.log('📬 Email response ok:', emailResponse.ok)
      
      const result = await emailResponse.text()
      console.log('📬 Email response body:', result)
      
      if (!emailResponse.ok) {
        console.error('❌ Email sending failed:', result)
        alert(`Email fout: ${result}`)
      } else {
        console.log('✅ Email sent successfully!')
        alert('Email test succesvol!')
      }
    } catch (emailError) {
      console.error('❌ Email error:', emailError)
      alert(`Email error: ${emailError}`)
    }

    try {
      console.log('💾 Starting database updates...')
      
      // Step 1: Upsert profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: formData.full_name,
          address: formData.address,
          postal_code: formData.postal_code,
          city: formData.city,
          phone: formData.phone
        })

      if (profileError) {
        console.error('❌ Profile upsert error:', profileError)
        console.error('Profile upsert error:', profileError)
        setError('Fout bij het opslaan van profielgegevens')
        return
      }

      console.log('✅ Profile updated successfully')

      // Step 2: Update all concept quotes to 'ingediend' status with customer details
      const updatePromises = conceptQuotes.map(quote => 
        supabase
          .from('quotes')
          .update({
            status: 'submitted',
            customer_details: formData
          })
          .eq('id', quote.id)
          .eq('user_id', user.id)
      )

      const results = await Promise.all(updatePromises)
      
      // Check for any errors
      const hasErrors = results.some(result => result.error)
      if (hasErrors) {
        console.error('❌ Quote update errors:', results.filter(r => r.error))
        console.error('Quote update errors:', results.filter(r => r.error))
        setError('Fout bij het indienen van offertes')
        return
      }

      console.log('✅ All quotes updated successfully')

      // Success - navigate to success page
      navigate('/quotes', { 
        state: { 
          success: true,
          submittedCount: conceptQuotes.length,
          customerName: formData.full_name 
        } 
      })

    } catch (error) {
      console.error('❌ Submission error:', error)
      console.error('Submission error:', error)
      setError('Er ging iets mis bij het indienen')
    } finally {
      console.log('🏁 SUBMIT FINISHED - setSubmitting(false)')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Gegevens laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Offerte Indienen</h1>
              <p className="text-gray-600 mt-1">
                Vul uw contactgegevens in om {conceptQuotes.length} offerte{conceptQuotes.length !== 1 ? 's' : ''} in te dienen
              </p>
            </div>
            <button
              onClick={() => navigate('/account')}
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Terug</span>
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          {conceptQuotes.length > 0 && (
            <div className="bg-primary-50 border border-primary-200 rounded-md p-4 mb-6">
              <h3 className="font-medium text-primary-900 mb-2">
                Te verzenden offertes ({conceptQuotes.length})
              </h3>
              <ul className="text-sm text-primary-800 space-y-1">
                {conceptQuotes.map((quote, index) => (
                  <li key={quote.id}>
                    • Offerte #{index + 1}: {Array.isArray(quote.items) ? quote.items.length : 1} item(s)
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline h-4 w-4 mr-1" />
                Volledige naam *
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Voor- en achternaam"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Adres *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Straatnaam en huisnummer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-2">
                  Postcode *
                </label>
                <input
                  type="text"
                  id="postal_code"
                  name="postal_code"
                  required
                  value={formData.postal_code}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="1234 AB"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  Woonplaats *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Amsterdam"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline h-4 w-4 mr-1" />
                Email adres *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="uw@email.nl"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline h-4 w-4 mr-1" />
                Telefoonnummer *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="06-12345678"
              />
            </div>

            <div className="pt-6 border-t">
              <button
                type="submit"
                disabled={submitting || conceptQuotes.length === 0}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Indienen...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Kozijn{conceptQuotes.length !== 1 ? 'en' : ''} Indienen</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FinalizeQuote