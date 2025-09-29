import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Award, Users, Clock, Star, Quote } from 'lucide-react'
import Slider from 'react-slick'
import { supabase } from '../lib/supabase'
import ScrollReveal from '../components/ScrollReveal'

const carouselSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  pauseOnHover: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    }
  ]
}

const Home: React.FC = () => {
  const [tuindeuren, setTuindeuren] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTuindeuren()
  }, [])

  const fetchTuindeuren = async () => {
    try {
      const { data, error } = await supabase
        .from('stock_items')
        .select('*')
        .eq('category', 'deuren')
        .eq('is_active', true)
        .ilike('name', '%tuindeur%')
        .limit(4)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching tuindeuren:', error)
      } else {
        setTuindeuren(data || [])
      }
    } catch (error) {
      console.error('Error loading tuindeuren:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(price)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Kwaliteit Kozijnen voor
              <span className="block text-primary-300">Uw Droomhuis</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Bij FT-Kozijnen leveren we hoogwaardige ramen, deuren en kozijnen 
              die perfect aansluiten bij uw wensen en budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/configurator"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <span>Start Configurator</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/shop"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-primary-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Bekijk Shop
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">
                Waarom kiezen voor FT-Kozijnen?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Kies uit hoogwaardige materialen die perfect passen bij uw woning en budget
              </p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={200}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Hoogste Kwaliteit</h3>
                <p className="text-gray-600">
                  Superieure kozijnen met vakkundig vakmanschap en duurzame materialen
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Gecertificeerd</h3>
                <p className="text-gray-600">
                  Alle kozijnen voldoen aan de hoogste kwaliteitsnormen en certificeringen
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Persoonlijke Service</h3>
                <p className="text-gray-600">
                  Persoonlijk advies en begeleiding van ontwerp tot installatie
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Snelle Levering</h3>
                <p className="text-gray-600">
                  Korte levertijden zonder in te boeten op kwaliteit
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-800 mb-4">
              Webshop
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto">
              Ontdek ons complete assortiment van hoogwaardige kozijnen
            </p>
          </div>
          
          <div className="carousel-container">
            <Slider {...carouselSettings}>
            {loading ? (
              // Loading skeleton
              [...Array(4)].map((_, index) => (
                <div key={index} className="animate-pulse px-4">
                  <div className="bg-gray-300 h-64 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))
            ) : tuindeuren.length > 0 ? (
              // Show actual tuindeuren from database
              tuindeuren.map((tuindeur) => (
                <div key={tuindeur.id} className="px-4">
                  <Link 
                  to={`/product/${tuindeur.id}`}
                  className="group cursor-pointer block"
                  >
                  <div className="bg-gray-200 h-64 rounded-lg mb-4 overflow-hidden relative">
                    <img 
                      src={tuindeur.image_url} 
                      alt={tuindeur.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400'
                      }}
                    />
                    {tuindeur.discount_percentage && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                        -{tuindeur.discount_percentage}%
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      {tuindeur.stock_quantity} op voorraad
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {tuindeur.name}
                  </h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-primary-600">
                      {formatPrice(parseFloat(tuindeur.price))}
                    </span>
                  </div>
                  </Link>
                </div>
              ))
            ) : (
              // Fallback products
              <>
                <div className="group cursor-pointer px-4">
                  <div className="bg-gray-200 h-64 rounded-lg mb-4 overflow-hidden">
                    <img 
                      src="https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=400" 
                      alt="Ramen" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Ramen</h3>
                  <p className="text-gray-600">Energie-efficiënte ramen in diverse stijlen</p>
                </div>
                
                <div className="group cursor-pointer px-4">
                  <div className="bg-gray-200 h-64 rounded-lg mb-4 overflow-hidden">
                    <img 
                      src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400" 
                      alt="Deuren" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <Link to="/buitendeuren">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">Buitendeuren</h3>
                    <p className="text-gray-600">Veilige en stijlvolle buitendeuren</p>
                  </Link>
                </div>
                
                <div className="group cursor-pointer px-4">
                  <div className="bg-gray-200 h-64 rounded-lg mb-4 overflow-hidden">
                    <img 
                      src="https://images.pexels.com/photos/1571461/pexels-photo-1571461.jpeg?auto=compress&cs=tinysrgb&w=400" 
                      alt="Schuifpuien" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Schuifpuien</h3>
                  <p className="text-gray-600">Moderne schuifpuien voor optimaal licht</p>
                </div>
                
                <div className="group cursor-pointer px-4">
                  <div className="bg-gray-200 h-64 rounded-lg mb-4 overflow-hidden">
                    <img 
                      src="https://images.pexels.com/photos/1571462/pexels-photo-1571462.jpeg?auto=compress&cs=tinysrgb&w=400" 
                      alt="Tuindeuren" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Tuindeuren</h3>
                  <p className="text-gray-600">Elegante verbinding tussen binnen en buiten</p>
                </div>
              </>
            )}
            </Slider>
          </div>
        </div>
      </section>

      {/* Materials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">
                Waarom kiezen voor FT-Kozijnen?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Kies uit hoogwaardige materialen die perfect passen bij uw woning en budget
              </p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={200}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Houten kozijnen */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="h-64 bg-gray-200 overflow-hidden">
                  <img 
                    src="/houten kozijnen fabriek copy copy copy.jpg" 
                    alt="Houten kozijnen" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Houten kozijnen</h3>
                  <p className="text-gray-600 mb-4">
                    Houten kozijnen zijn veelal gemaakt van hardhout met een keurmerk. De kozijnen zijn 
                    in het algemeen iets duurder in aanschaf en hebben meer onderhoud nodig dan de twee 
                    andere materialen.
                  </p>
                  <a 
                    href="/houten-kozijnen" 
                    className="text-primary-600 hover:text-primary-800 font-medium flex items-center space-x-1 transition-colors"
                  >
                    <span>Over Houten kozijnen</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Kunststof kozijnen */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="h-64 bg-gray-200 overflow-hidden">
                  <img 
                    src="/kunstsof kozijn fabriek.jpg" 
                    alt="Kunststof kozijnen" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Kunststof kozijnen</h3>
                  <p className="text-gray-600 mb-4">
                    Het overgrote deel van onze klanten kiest tegenwoordig voor kunststof kozijnen. De 
                    levensduur is minimaal 50 jaar en hebben weinig tot geen onderhoud nodig. Ook is er 
                    veel keuze in kleur en uitstraling.
                  </p>
                  <a 
                    href="/kunststof-kozijnen" 
                    className="text-primary-600 hover:text-primary-800 font-medium flex items-center space-x-1 transition-colors"
                  >
                    <span>Over Kunststof kozijnen</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Aluminium kozijnen */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="h-64 bg-gray-200 overflow-hidden">
                  <img 
                    src="/alumiium kozijn fabriek.jpg" 
                    alt="Aluminium kozijnen" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Aluminium kozijnen</h3>
                  <p className="text-gray-600 mb-4">
                    Aluminium is uitermate geschikt voor bepaalde constructies en grote ramen omdat 
                    het materiaal erg licht is. De kosten van aluminium zijn hoog maar de levensduur 
                    mits goed onderhouden is lang.
                  </p>
                  <a 
                    href="/aluminium-kozijnen" 
                    className="text-primary-600 hover:text-primary-800 font-medium flex items-center space-x-1 transition-colors"
                  >
                    <span>Over Aluminium kozijnen</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Klaar om te beginnen?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Gebruik onze kozijnconfigurator om uw ideale kozijnen samen te stellen 
            en vraag direct een offerte aan.
          </p>
          <Link
            to="/configurator"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
          >
            <span>Start nu</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* References Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">
                Wat onze klanten zeggen
              </h2>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                Lees ervaringen van tevreden FT-Kozijnen klanten
              </p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={200}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center mb-4">
                  <Quote className="h-8 w-8 text-primary-600" />
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "FT-Kozijnen heeft onze verwachtingen overtroffen! De nieuwe kunststof kozijnen zien er fantastisch uit en de installatie was vlekkeloos. Zeer professioneel en vriendelijk team."
                </p>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900">- Familie Jansen</p>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center mb-4">
                  <Quote className="h-8 w-8 text-primary-600" />
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "De houten kozijnen die we via FT-Kozijnen hebben besteld, zijn van topkwaliteit. Ze geven ons huis precies de warme uitstraling die we zochten. Snelle levering en uitstekende service!"
                </p>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900">- Dhr. de Vries</p>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-gray-300" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center mb-4">
                  <Quote className="h-8 w-8 text-primary-600" />
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Fantastisch advies gekregen over aluminium schuifpuien. Het resultaat is prachtig en de lichtinval is enorm verbeterd. Een aanrader voor iedereen die kwaliteit zoekt."
                </p>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900">- Mevr. Bakker</p>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Image above footer */}
      <div className="py-8">
        <img 
          src="/ChatGPT Image 25 jul 2025, 15_47_14 copy.png" 
          alt="FT-Kozijnen contact afbeelding" 
          className="block mx-auto mb-12 max-w-full h-auto rounded-lg shadow-lg"
        />
      </div>

    </div>
  )
}

export default Home