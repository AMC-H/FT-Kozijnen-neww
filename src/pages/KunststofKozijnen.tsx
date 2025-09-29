import React from 'react'
import { ArrowLeft, Shield, Zap, Wrench, Star, CheckCircle, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const KunststofKozijnen: React.FC = () => {
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
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Kunststof Kozijnen
            </h1>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed text-blue-100">
            <span className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed text-primary-100">
              De populairste keuze voor moderne woningen. Onderhoudsvrij, energiezuinig 
              en verkrijgbaar in vele kleuren en stijlen.
            </span>
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introductie */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Waarom kiezen voor kunststof kozijnen?
            </h2>
            <div className="prose prose-lg text-gray-700">
              <p className="mb-4">
                Kunststof kozijnen zijn de meest gekozen optie in Nederland en dat is niet zonder reden. 
                Ze bieden een uitstekende combinatie van prestaties, duurzaamheid en betaalbaarheid. 
                Met moderne productietechnieken zijn kunststof kozijnen niet meer te onderscheiden van 
                andere materialen qua uitstraling.
              </p>
              <p className="mb-4">
                Bij FT-Kozijnen gebruiken we uitsluitend hoogwaardige PVC-profielen van gerenommeerde 
                Europese fabrikanten. Onze kozijnen zijn voorzien van meerkamer-profielen voor optimale 
                isolatie en worden geleverd met de nieuwste generatie beglazing.
              </p>
              <p>
                Het grootste voordeel van kunststof kozijnen is dat ze praktisch onderhoudsvrij zijn. 
                Een keer per jaar schoonmaken is voldoende om ze er jarenlang als nieuw uit te laten zien.
              </p>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="/kunstsof kozijn fabriek.jpg" 
              alt="Kunststof kozijnen productie" 
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
          </div>
        </div>

        {/* Voordelen */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Voordelen van Kunststof Kozijnen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Wrench className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Onderhoudsvrij</h3>
              <p className="text-gray-600">
                Kunststof kozijnen hoeven niet geschilderd of gebeitst te worden. Een keer per jaar 
                schoonmaken met water en zeep is voldoende.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Energiezuinig</h3>
              <p className="text-gray-600">
                Moderne kunststof kozijnen behalen uitstekende isolatiewaarden dankzij meerkamer-profielen 
                en hoogwaardige beglazing.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Betaalbaar</h3>
              <p className="text-gray-600">
                Kunststof kozijnen bieden de beste prijs-kwaliteitverhouding en zijn toegankelijk 
                voor elk budget.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Veelzijdig Design</h3>
              <p className="text-gray-600">
                Verkrijgbaar in vele kleuren, houtimitaties en stijlen. Van klassiek wit tot 
                moderne antraciet en houtlook.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Weerbestendig</h3>
              <p className="text-gray-600">
                Kunststof is bestand tegen alle weersomstandigheden en verkleurt niet door 
                UV-straling dankzij moderne stabilisatoren.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Lange Levensduur</h3>
              <p className="text-gray-600">
                Met een levensduur van 40-50 jaar zijn kunststof kozijnen een duurzame investering 
                voor uw woning.
              </p>
            </div>
          </div>
        </section>

        {/* Profielsystemen */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Onze Profielsystemen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">5-Kamer Profiel</h3>
              <p className="text-gray-600 mb-4">
                Ons standaard 5-kamer profiel biedt uitstekende isolatie en is geschikt voor de 
                meeste toepassingen. Met een inbouwdiepte van 70mm behaalt dit profiel zeer goede 
                isolatiewaarden.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Inbouwdiepte: 70mm</li>
                <li>• Uf-waarde: 1,3 W/m²K</li>
                <li>• Geschikt voor dubbel en HR++ glas</li>
                <li>• Uitstekende prijs-kwaliteitverhouding</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">6-Kamer Profiel</h3>
              <p className="text-gray-600 mb-4">
                Voor optimale isolatie bieden we 6-kamer profielen aan. Deze profielen hebben een 
                grotere inbouwdiepte en extra isolatiekamers voor de beste energieprestaties.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Inbouwdiepte: 82mm</li>
                <li>• Uf-waarde: 1,0 W/m²K</li>
                <li>• Geschikt voor triple glas</li>
                <li>• Maximale energiebesparing</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Passivhaus Profiel</h3>
              <p className="text-gray-600 mb-4">
                Voor passieve woningen en maximale energiebesparing bieden we speciale passivhaus 
                profielen aan. Deze behalen de strengste isolatie-eisen.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Inbouwdiepte: 92mm</li>
                <li>• Uf-waarde: 0,8 W/m²K</li>
                <li>• Passivhaus gecertificeerd</li>
                <li>• Geschikt voor triple glas</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Schuifsystemen</h3>
              <p className="text-gray-600 mb-4">
                Voor grote glasoppervlakken bieden we moderne schuifsystemen aan. Deze combineren 
                maximaal licht met uitstekende isolatie en gebruiksgemak.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Grote glasoppervlakken mogelijk</li>
                <li>• Soepel glijdend mechanisme</li>
                <li>• Uitstekende isolatiewaarden</li>
                <li>• Moderne, strakke uitstraling</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Kleuren en Afwerkingen */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Kleuren en Afwerkingen</h2>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Standaard Kleuren</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded"></div>
                    <span className="text-gray-700">Wit</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-100 border border-gray-300 rounded"></div>
                    <span className="text-gray-700">Crème</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-400 rounded"></div>
                    <span className="text-gray-700">Grijs</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-800 rounded"></div>
                    <span className="text-gray-700">Antraciet</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Premium Kleuren</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-700 rounded"></div>
                    <span className="text-gray-700">Donkergroen</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-900 rounded"></div>
                    <span className="text-gray-700">Donkerblauw</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-red-800 rounded"></div>
                    <span className="text-gray-700">Bordeaux</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-yellow-800 rounded"></div>
                    <span className="text-gray-700">Goudbruin</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Houtlook Afwerkingen</h3>
                <div className="space-y-2 text-gray-700">
                  <div>• Golden Oak</div>
                  <div>• Mahonie</div>
                  <div>• Noten</div>
                  <div>• Winchester</div>
                  <div>• Rosewood</div>
                </div>
              </div>
            </div>
            
            <div className="bg-primary-50 p-4 rounded-lg">
              <p className="text-primary-800 text-sm">
                <strong>Tip:</strong> Alle kleuren zijn ook verkrijgbaar in verschillende binnen- en buitenkleuren. 
                Zo kunt u bijvoorbeeld wit aan de binnenzijde combineren met antraciet aan de buitenzijde.
              </p>
            </div>
          </div>
        </section>

        {/* Onderhoud */}
        <section className="mb-16">
          <div className="bg-green-50 rounded-lg p-8">
            <div className="flex items-center mb-6">
              <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-green-900">Onderhoud van Kunststof Kozijnen</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-green-900 mb-4">Eenvoudig Onderhoud</h3>
                <ul className="space-y-2 text-green-800">
                  <li>• <strong>Jaarlijks:</strong> Schoonmaken met lauwwarm water en milde zeep</li>
                  <li>• <strong>Jaarlijks:</strong> Controle en smering van scharnieren en sluitwerk</li>
                  <li>• <strong>Jaarlijks:</strong> Controle van rubbers en afdichtingen</li>
                  <li>• <strong>Geen schilderwerk:</strong> Kunststof hoeft nooit opnieuw geschilderd</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-green-900 mb-4">Wat NIET te doen</h3>
                <ul className="space-y-2 text-green-800">
                  <li>• Geen schurende schoonmaakmiddelen gebruiken</li>
                  <li>• Geen hogedrukreiniger op korte afstand</li>
                  <li>• Geen oplosmiddelen of agressieve chemicaliën</li>
                  <li>• Geen scherpe voorwerpen voor het verwijderen van vuil</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-green-100 rounded-lg">
              <p className="text-green-900 text-sm">
                <strong>Garantie:</strong> Op onze kunststof kozijnen geven we 10 jaar garantie op het profiel 
                en 5 jaar op het hang- en sluitwerk. Bij juist onderhoud gaan ze echter veel langer mee!
              </p>
            </div>
          </div>
        </section>


        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Klaar voor Kunststof Kozijnen?
          </h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Ontdek waarom kunststof kozijnen de populairste keuze zijn. Onze specialisten 
            helpen u graag bij het maken van de juiste keuze.
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

export default KunststofKozijnen