import React from 'react'
import { ArrowLeft, Shield, Leaf, Home, Star, CheckCircle, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HoutenKozijnen: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-amber-600 to-amber-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-amber-100 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Terug naar home</span>
          </button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6 backdrop-blur-sm">
              <Leaf className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Houten Kozijnen
            </h1>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed text-amber-100">
              Tijdloze elegantie en natuurlijke warmte voor uw woning. 
              Houten kozijnen bieden een klassieke uitstraling met moderne prestaties.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introductie */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Waarom kiezen voor houten kozijnen?
            </h2>
            <div className="prose prose-lg text-gray-700">
              <p className="mb-4">
                Houten kozijnen zijn de klassieke keuze voor woningeigenaren die waarde hechten aan 
                natuurlijke materialen en tijdloze schoonheid. Hout biedt een warme, uitnodigende 
                uitstraling die perfect past bij zowel traditionele als moderne architectuur.
              </p>
              <p className="mb-4">
                Bij FT-Kozijnen gebruiken we uitsluitend hoogwaardige houtsoorten met FSC-certificering, 
                wat garandeert dat het hout afkomstig is uit duurzaam beheerde bossen. Onze houten kozijnen 
                worden vakkundig vervaardigd en behandeld voor optimale duurzaamheid.
              </p>
              <p>
                Met de juiste behandeling en onderhoud kunnen houten kozijnen decennialang meegaan en 
                zelfs in waarde stijgen, waardoor ze een uitstekende investering vormen voor uw woning.
              </p>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="/Scherm­afbeelding 2025-07-25 om 13.46.43.png" 
              alt="Houten kozijnen productie" 
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Voordelen */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Voordelen van Houten Kozijnen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Natuurlijk & Duurzaam</h3>
              <p className="text-gray-600">
                Hout is een hernieuwbare grondstof die CO2 opslaat. Onze kozijnen zijn FSC-gecertificeerd 
                en komen uit duurzaam beheerde bossen.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Tijdloze Schoonheid</h3>
              <p className="text-gray-600">
                Houten kozijnen hebben een natuurlijke warmte en elegantie die nooit uit de mode raakt. 
                Elke houtnerf is uniek en voegt karakter toe aan uw woning.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Uitstekende Isolatie</h3>
              <p className="text-gray-600">
                Hout is van nature een goede isolator. Moderne houten kozijnen behalen uitstekende 
                isolatiewaarden en dragen bij aan energiebesparing.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Home className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Waardevermeerdering</h3>
              <p className="text-gray-600">
                Houten kozijnen verhogen de waarde van uw woning. Ze worden gezien als een premium 
                keuze die de uitstraling en het comfort van uw huis verbetert.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Repareerbaar</h3>
              <p className="text-gray-600">
                In tegenstelling tot andere materialen kunnen houten kozijnen lokaal gerepareerd worden. 
                Kleine beschadigingen zijn eenvoudig te herstellen.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Veelzijdig</h3>
              <p className="text-gray-600">
                Hout kan in elke gewenste kleur worden geschilderd of gebeitst. U kunt de uitstraling 
                aanpassen aan uw persoonlijke smaak en woonstijl.
              </p>
            </div>
          </div>
        </section>

        {/* Houtsoorten */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Onze Houtsoorten</h2>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Mahonie</h3>
              <p className="text-gray-600 mb-4">
                Mahonie is een premium tropische houtsoort die bekend staat om zijn rijke, warme kleur 
                en uitstekende duurzaamheid. Het heeft een prachtige natuurlijke houtnerf en is zeer 
                geschikt voor hoogwaardige kozijnen.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Premium kwaliteit houtsoort</li>
                <li>• Rijke, warme roodbruine kleur</li>
                <li>• Uitstekende duurzaamheid en stabiliteit</li>
                <li>• Prachtige natuurlijke houtnerf</li>
                <li>• Bestand tegen weersinvloeden</li>
                <li>• FSC-gecertificeerd beschikbaar</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Onderhoud */}
        <section className="mb-16">
          <div className="bg-amber-50 rounded-lg p-8">
            <div className="flex items-center mb-6">
              <AlertTriangle className="h-8 w-8 text-amber-600 mr-3" />
              <h2 className="text-2xl font-bold text-amber-900">Onderhoud van Houten Kozijnen</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-amber-900 mb-4">Regulier Onderhoud</h3>
                <ul className="space-y-2 text-amber-800">
                  <li>• <strong>Jaarlijks:</strong> Schoonmaken met milde zeep en water</li>
                  <li>• <strong>Jaarlijks:</strong> Controle op beschadigingen en slijtage</li>
                  <li>• <strong>Om de 2-3 jaar:</strong> Bijwerken van lak of beits</li>
                  <li>• <strong>Om de 5-7 jaar:</strong> Volledig opnieuw lakken/beitsen</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-amber-900 mb-4">Tips voor Langere Levensduur</h3>
                <ul className="space-y-2 text-amber-800">
                  <li>• Gebruik hoogwaardige verf of beits</li>
                  <li>• Zorg voor goede ventilatie rond de kozijnen</li>
                  <li>• Repareer kleine beschadigingen direct</li>
                  <li>• Laat onderhoud uitvoeren door professionals</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-amber-100 rounded-lg">
              <p className="text-amber-900 text-sm">
                <strong>Tip:</strong> Bij FT-Kozijnen bieden we onderhoudscontracten aan zodat u zich geen zorgen 
                hoeft te maken over het onderhoud van uw houten kozijnen. Vraag naar de mogelijkheden!
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Klaar voor Houten Kozijnen?
          </h2>
          <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
            Ontdek de mogelijkheden van houten kozijnen voor uw woning. Onze specialisten 
            adviseren u graag over de beste keuze voor uw situatie.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/configurator')}
              className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Start Configurator
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="bg-primary-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-900 transition-colors"
            >
              Neem Contact Op
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default HoutenKozijnen