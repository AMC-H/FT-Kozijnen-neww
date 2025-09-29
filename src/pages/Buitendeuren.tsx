import React from 'react'
import { ArrowLeft, DoorOpen as Door, Shield, Leaf, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Buitendeuren: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-primary-100 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Terug naar home</span>
          </button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6 backdrop-blur-sm">
              <Door className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Buitendeuren
            </h1>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed text-primary-100">
              Kies uw ideale buitendeur uit ons uitgebreide assortiment. Van klassieke voordeuren 
              tot moderne tuindeuren - wij hebben de perfecte oplossing voor uw woning.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Waarom kiezen voor onze buitendeuren?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Kwaliteit, veiligheid en energie-efficiëntie in één oplossing
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Veiligheid</h3>
              <p className="text-gray-600">
                Hoogwaardige sluitingen en versterkingen voor optimale beveiliging van uw woning.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Energie-efficiënt</h3>
              <p className="text-gray-600">
                Uitstekende isolatiewaarden die warmteverlies minimaliseren en uw energiekosten verlagen.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Duurzaam</h3>
              <p className="text-gray-600">
                Langdurige kwaliteit met minimaal onderhoud voor jarenlange tevredenheid.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Onze Collecties
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ontdek onze verschillende deurcollecties voor elke woonstijl
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Standard Deuren */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="h-64 bg-gray-200 overflow-hidden">
                <img 
                  src="/drzwizestawienie2xv2.png" 
                  alt="Standard buitendeuren" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Standard Deuren</h3>
                <p className="text-gray-600 mb-4">
                  Klassieke buitendeuren in verschillende materialen en stijlen. 
                  Van kunststof tot hout en aluminium.
                </p>
                <button
                  onClick={() => navigate('/configurator', { state: { preSelectedCategory: 'buitendeuren' } })}
                  className="text-primary-600 hover:text-primary-800 font-medium flex items-center space-x-1 transition-colors"
                >
                  <span>Configureer deur</span>
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </button>
              </div>
            </div>

            {/* Ekoline Panelen */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="h-64 bg-gray-200 overflow-hidden">
                <img 
                  src="https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/kozijnen-photos/basic/ekoline-panelen/vbpaneel-01-k-met.jpg"
                  alt="Ekoline panelen" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Ekoline Panelen</h3>
                <p className="text-gray-600 mb-4">
                  Decoratieve panelen voor een unieke uitstraling. Verkrijgbaar 
                  met en zonder overlay voor verschillende effecten.
                </p>
                <button
                  onClick={() => navigate('/configurator/ekoline')}
                  className="text-primary-600 hover:text-primary-800 font-medium flex items-center space-x-1 transition-colors"
                >
                  <span>Bekijk panelen</span>
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Klaar om uw buitendeur te configureren?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-primary-100">
            Start de configurator en kies uit ons uitgebreide assortiment buitendeuren.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/configurator', { state: { preSelectedCategory: 'buitendeuren' } })}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
            >
              <span>Standard Deuren</span>
              <ArrowLeft className="h-5 w-5 rotate-180" />
            </button>
            <button
              onClick={() => navigate('/configurator/ekoline')}
              className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
            >
              <span>Ekoline Panelen</span>
              <ArrowLeft className="h-5 w-5 rotate-180" />
            </button>
            <button 
              onClick={() => navigate('/configurator/classicline')}
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
            >
              <span>ClassicLine Panelen</span>
              <ArrowLeft className="h-5 w-5 rotate-180" />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Buitendeuren