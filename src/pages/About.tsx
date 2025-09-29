import React from 'react'
import { Award, Users, Clock, MapPin, Phone, Mail } from 'lucide-react'

const About: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-600 to-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Over FT Kozijnen B.V.
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              <span className="font-medium leading-relaxed">
                Betrouwbaarheid, vakmanschap en service dat is waar FT Kozijnen voor staat.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6 text-lg text-gray-600">
              <p>
                Sinds onze oprichting in 2019 zijn wij uitgegroeid tot een betrouwbare naam in de wereld van kunststof en aluminium kozijnen. Dankzij onze persoonlijke aanpak en oog voor kwaliteit bieden wij maatwerkoplossingen voor zowel particuliere als zakelijke klanten.
              </p>
              <p>
                Wat ons écht onderscheidt, is de nauwe samenwerking met enkele van de grootste kozijnenfabrieken ter wereld. Hierdoor kunnen wij hoogwaardige producten leveren tegen eerlijke prijzen, met snelle levertijden en volgens de nieuwste technische standaarden.
              </p>
              <p>
                Achter FT Kozijnen staat een eigenaar met meer dan 20 jaar ervaring in de branche. Als tussenpersoon heeft hij jarenlang bruggen gebouwd tussen klanten en toonaangevende kozijnenleveranciers in binnen- en buitenland. Die kennis en dat netwerk vormen de solide basis van ons bedrijf.
              </p>
              <p>
                Of het nu gaat om nieuwe kozijnen, deuren, schuifpuien of gevelbekleding — wij zorgen voor een oplossing die perfect aansluit bij uw woning of project. Onze producten voldoen aan de strengste eisen op het gebied van isolatie, veiligheid en duurzaamheid.
              </p>
              <p>
                Kiezen voor FT Kozijnen is kiezen voor zekerheid. Van het eerste gesprek tot en met de montage staan wij voor u klaar met helder advies, duidelijke communicatie en professioneel vakmanschap.
              </p>
              <p>
                Benieuwd wat wij voor u kunnen betekenen? Neem vrijblijvend contact met ons op — we denken graag met u mee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Onze Waarden
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Deze principes vormen de basis van alles wat we doen
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Kwaliteit</h3>
              <p className="text-gray-600">
                We hanteren de hoogste kwaliteitsnormen en gebruiken alleen 
                de beste materialen voor onze kozijnen.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Service</h3>
              <p className="text-gray-600">
                Persoonlijke begeleiding en uitstekende klantenservice staan 
                centraal in onze aanpak.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Betrouwbaarheid</h3>
              <p className="text-gray-600">
                We houden ons aan afspraken en zorgen voor tijdige levering 
                zonder kwaliteitsverlies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Image above contact section */}
      <div className="py-8">
        <img 
          src="/ChatGPT Image 25 jul 2025, 15_47_14.png" 
          alt="FT-Kozijnen contact afbeelding" 
          className="block mx-auto mb-12 max-w-full h-auto rounded-lg shadow-lg"
        />
      </div>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Neem Contact Op
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Heeft u vragen of wilt u meer informatie? We helpen u graag verder.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Telefoon</h3>
              <p className="text-gray-600">+31 639 430 243</p>
              <p className="text-sm text-gray-500 mt-2">Ma-vr: 08:00 - 17:00</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">info@ftkozijnen.nl</p>
              <p className="text-sm text-gray-500 mt-2">We reageren binnen 24 uur</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Adres</h3>
              <p className="text-gray-600">Industrieweg 17 Opslag 6</p>
              <p className="text-gray-600">4561 GH Hulst, Nederland</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About