import React, { useState, useEffect } from 'react'
import { MapPin, Phone, Mail, Clock, Send, User, MessageSquare, CheckCircle, Award, Shield, Star } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const Contact: React.FC = () => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Auto-fill form if user is logged in
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        // Set email from auth
        setFormData(prev => ({
          ...prev,
          email: user.email || ''
        }))

        // Try to get full name from profile
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('full_name, phone')
            .eq('id', user.id)
            .single()

          if (!error && profile) {
            setFormData(prev => ({
              ...prev,
              name: profile.full_name || '',
              phone: profile.phone || ''
            }))
          }
        } catch (error) {
          console.log('Could not load profile data:', error)
        }
      }
    }

    loadUserData()
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Send email via Supabase Edge Function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Er ging iets mis bij het versturen')
      }

      setSuccess(true)
      
      // Reset form after 5 seconds (but keep user data if logged in)
      setTimeout(() => {
        setSuccess(false)
        if (user) {
          // Keep user data, only reset message fields
          setFormData(prev => ({
            ...prev,
            subject: '',
            message: ''
          }))
        } else {
          // Reset all fields for non-logged in users
          setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
          })
        }
      }, 5000)

    } catch (error) {
      console.error('Contact form error:', error)
      alert(error instanceof Error ? error.message : 'Er ging iets mis bij het versturen van uw bericht')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-20 right-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-10 left-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6 backdrop-blur-sm">
              <MessageSquare className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent">
              Neem Contact Op
            </h1>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed text-primary-100">
              Uw droomkozijnen beginnen met een gesprek. Onze experts staan klaar om u te helpen 
              bij het realiseren van de perfecte ramen en deuren voor uw woning.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-full backdrop-blur-sm">
                <Star className="h-5 w-5 text-yellow-300" />
                <span className="text-sm font-medium">4.9/5 Klantbeoordeling</span>
              </div>
              <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-full backdrop-blur-sm">
                <Award className="h-5 w-5 text-yellow-300" />
                <span className="text-sm font-medium">20+ Jaar Ervaring</span>
              </div>
              <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-full backdrop-blur-sm">
                <Shield className="h-5 w-5 text-green-300" />
                <span className="text-sm font-medium">Kwaliteitsgarantie</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-4">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Persoonlijk Contact
                </h2>
                <p className="text-gray-600">
                  Praat direct met onze kozijnspecialisten
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-6">
                <div className="group bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary-500 p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Direct Bellen</h3>
                      <p className="text-primary-600 font-medium text-lg">
                        <a href="tel:+31639430243" className="hover:text-primary-800 transition-colors">
                          +31 639 430 243
                        </a>
                      </p>
                      <p className="text-sm text-gray-600">Ma-vr: 08:00 - 17:00 • Za: 09:00 - 15:00</p>
                    </div>
                  </div>
                </div>

                <div className="group bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-500 p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Email Ons</h3>
                      <p className="text-green-600 font-medium">
                        <a href="mailto:info@ftkozijnen.nl" className="hover:text-green-800 transition-colors">
                          info@ftkozijnen.nl
                        </a>
                      </p>
                      <p className="text-sm text-gray-600">Reactie binnen 4 uur op werkdagen</p>
                    </div>
                  </div>
                </div>

                <div className="group bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center space-x-4">
                    <div className="bg-orange-500 p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Bezoek Showroom</h3>
                      <p className="text-gray-700 font-medium">
                        Industrieweg 17 Opslag 6<br />
                        4561 GH Hulst, Nederland
                      </p>
                      <p className="text-sm text-gray-600">Afspraak maken aanbevolen</p>
                    </div>
                  </div>
                </div>

                <div className="group bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-500 p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Openingstijden</h3>
                      <div className="text-gray-700 text-sm space-y-1">
                        <p><span className="font-medium">Ma-Vr:</span> 08:00 - 17:00</p>
                        <p><span className="font-medium">Zaterdag:</span> 09:00 - 15:00</p>
                        <p><span className="font-medium">Zondag:</span> <span className="text-red-600">Gesloten</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">500+</div>
                    <div className="text-xs text-gray-600">Tevreden klanten</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">4.9★</div>
                    <div className="text-xs text-gray-600">Gemiddelde score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">24u</div>
                    <div className="text-xs text-gray-600">Reactietijd</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-4">
                  <Send className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Stuur Ons Een Bericht
                </h2>
                <p className="text-gray-600">
                  Vertel ons over uw project en ontvang binnen 24 uur een persoonlijke reactie
                </p>
              </div>

              {success ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 mb-4">
                    Bericht Succesvol Verzonden! 🎉
                  </h3>
                  <div className="bg-green-50 rounded-xl p-6 max-w-md mx-auto">
                    <p className="text-green-700 mb-4">
                      Bedankt voor uw bericht! We hebben uw aanvraag ontvangen en nemen zo snel mogelijk contact met u op.
                    </p>
                    <div className="space-y-2 text-sm text-green-600">
                      <p>✓ Uw bericht is veilig ontvangen</p>
                      <p>✓ Een specialist bekijkt uw aanvraag</p>
                      <p>✓ U hoort binnen 24 uur van ons</p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        <User className="inline h-4 w-4 mr-1" />
                        Volledige Naam *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full border-2 border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-300 group-hover:border-gray-300"
                        placeholder="Uw voor- en achternaam"
                      />
                    </div>

                    <div className="group">
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        <Mail className="inline h-4 w-4 mr-1" />
                        Email Adres *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full border-2 border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-300 group-hover:border-gray-300"
                        placeholder="uw@email.nl"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      <Phone className="inline h-4 w-4 mr-1" />
                      Telefoonnummer
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-300 group-hover:border-gray-300"
                      placeholder="06-12345678"
                    />
                  </div>

                  <div className="group">
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                      Onderwerp *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-300 group-hover:border-gray-300"
                    >
                      <option value="">Kies een onderwerp</option>
                      <option value="offerte">🏠 Offerte aanvragen</option>
                      <option value="informatie">ℹ️ Algemene informatie</option>
                      <option value="service">🔧 Service & onderhoud</option>
                      <option value="showroom">🏢 Showroom bezoek</option>
                      <option value="klacht">⚠️ Klacht</option>
                      <option value="anders">💬 Anders</option>
                    </select>
                  </div>

                  <div className="group">
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      <MessageSquare className="inline h-4 w-4 mr-1" />
                      Uw Bericht *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-300 group-hover:border-gray-300 resize-none"
                      placeholder="Vertel ons over uw project, wensen en eventuele vragen. Hoe meer details, hoe beter we u kunnen helpen!"
                    />
                  </div>

                  <div className="bg-primary-50 rounded-xl p-4 border border-primary-200">
                    <p className="text-sm text-primary-800">
                      <Shield className="inline h-4 w-4 mr-1" />
                      Uw gegevens worden vertrouwelijk behandeld en alleen gebruikt voor het beantwoorden van uw vraag.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:transform-none disabled:shadow-none flex items-center justify-center space-x-3"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span>Bericht Verzenden...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-6 w-6" />
                        <span>Verstuur Bericht</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Bezoek Onze Showroom
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kom langs in onze moderne showroom en ervaar de kwaliteit van onze kozijnen. 
              Onze experts adviseren u graag persoonlijk.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="aspect-w-16 aspect-h-9 h-96 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2485.123456789!2d4.0123456!3d51.2345678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sIndustrieweg%2017%2C%204561%20GH%20Hulst!5e0!3m2!1snl!2snl!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="FT-Kozijnen Locatie"
                className="rounded-t-2xl"
              />
            </div>
            <div className="p-8 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">FT-Kozijnen B.V.</h3>
                  <p className="text-gray-700 mb-2">Industrieweg 17 Opslag 6, 4561 GH Hulst</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Phone className="h-4 w-4" />
                      <span>+31 639 430 243</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Ma-Vr: 08:00-17:00</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://maps.google.com/?q=Industrieweg+17+Opslag+6,+4561+GH+Hulst"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <MapPin className="h-5 w-5" />
                    <span>Routebeschrijving</span>
                  </a>
                  <a
                    href="tel:+31639430243"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <Phone className="h-5 w-5" />
                    <span>Direct Bellen</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Veelgestelde Vragen
            </h2>
            <p className="text-xl text-gray-600">
              Snel antwoord op de meest gestelde vragen
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Hoe lang duurt de levering?</h3>
              <p className="text-gray-600">Standaard kozijnen worden binnen 2-3 weken geleverd. Voor maatwerk rekenen we 4-6 weken.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Bieden jullie montage aan?</h3>
              <p className="text-gray-600">Ja, wij verzorgen professionele montage door ervaren vakmensen. Dit is inbegrepen in onze service.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Wat kost een offerte?</h3>
              <p className="text-gray-600">Een offerte is altijd gratis en vrijblijvend. We komen graag bij u langs voor een persoonlijk advies.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Welke garantie krijg ik?</h3>
              <p className="text-gray-600">Wij bieden 10 jaar garantie op onze kozijnen en 5 jaar op de montage. Kwaliteit staat bij ons voorop.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact