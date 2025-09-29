import React from 'react'
import { ArrowLeft, Shield, Zap, Maximize, Star, CheckCircle, Award } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const AluminiumKozijnen: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-600 to-gray-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-100 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Terug naar home</span>
          </button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6 backdrop-blur-sm">
              <Award className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Aluminium Kozijnen
            </h1>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed text-gray-100">
              De premium keuze voor moderne architectuur. Sterk, duurzaam en perfect 
              voor grote glasoppervlakken en strakke designs.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introductie */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Waarom kiezen voor aluminium kozijnen?
            </h2>
            <div className="prose prose-lg text-gray-700">
              <p className="mb-4">
                Aluminium kozijnen zijn de eerste keuze voor architecten en eigenaren die streven naar 
                een moderne, strakke uitstraling. Door de hoge sterkte van aluminium kunnen zeer slanke 
                profielen worden gerealiseerd, wat resulteert in maximale glasoppervlakken en optimale 
                lichtinval.
              </p>
              <p className="mb-4">
                Bij FT-Kozijnen werken we uitsluitend met hoogwaardige aluminium systemen van toonaangevende 
                Europese fabrikanten. Onze kozijnen worden thermisch onderbroken uitgevoerd voor optimale 
                isolatie en zijn verkrijgbaar in elke gewenste RAL-kleur.
              </p>
              <p>
                Aluminium kozijnen zijn bijzonder geschikt voor grote constructies, moderne architectuur 
                en situaties waar maximale duurzaamheid en minimaal onderhoud gewenst zijn.
              </p>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="/alumiium kozijn fabriek.jpg" 
              alt="Aluminium kozijnen productie" 
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
          </div>
        </div>

        {/* Voordelen */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Voordelen van Aluminium Kozijnen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Extreem Sterk</h3>
              <p className="text-gray-600">
                Aluminium is veel sterker dan andere materialen, waardoor zeer slanke profielen 
                mogelijk zijn en grote glasoppervlakken gerealiseerd kunnen worden.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Maximize className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Maximaal Glas</h3>
              <p className="text-gray-600">
                Door de sterkte van aluminium kunnen zeer smalle profielen worden gebruikt, 
                wat resulteert in maximale glasoppervlakken en optimale lichtinval.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Premium Uitstraling</h3>
              <p className="text-gray-600">
                Aluminium kozijnen hebben een moderne, strakke uitstraling die perfect past 
                bij hedendaagse architectuur en design.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Onderhoudsarm</h3>
              <p className="text-gray-600">
                Aluminium roest niet en heeft een zeer lange levensduur. Minimaal onderhoud 
                is voldoende om ze er decennialang perfect uit te laten zien.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Energiezuinig</h3>
              <p className="text-gray-600">
                Moderne aluminium kozijnen zijn thermisch onderbroken en behalen uitstekende 
                isolatiewaarden, vergelijkbaar met andere materialen.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">100% Recyclebaar</h3>
              <p className="text-gray-600">
                Aluminium is volledig recyclebaar zonder kwaliteitsverlies, wat het een 
                zeer duurzame keuze maakt voor milieubewuste consumenten.
              </p>
            </div>
          </div>
        </section>

        {/* Systemen */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Onze Aluminium Systemen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Draai-Kiep Systemen</h3>
              <p className="text-gray-600 mb-4">
                Traditionele draai-kiep systemen in aluminium uitvoering. Perfect voor standaard 
                raamopeningen met de voordelen van aluminium: sterk, duurzaam en onderhoudsarm.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Inbouwdiepte: 68-78mm</li>
                <li>• Uf-waarde: vanaf 1,4 W/m²K</li>
                <li>• Geschikt voor dubbel en triple glas</li>
                <li>• Alle RAL-kleuren mogelijk</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Schuifsystemen</h3>
              <p className="text-gray-600 mb-4">
                Moderne schuifsystemen voor grote glasoppervlakken. Ideaal voor terrasdeuren 
                en situaties waar maximale opening gewenst is zonder inwaaiende vleugels.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Grote glasoppervlakken mogelijk</li>
                <li>• Soepel glijdend mechanisme</li>
                <li>• Minimale profielzichtmaten</li>
                <li>• Uitstekende isolatiewaarden</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Vouwwand Systemen</h3>
              <p className="text-gray-600 mb-4">
                Spectaculaire vouwwand systemen die complete wanden kunnen openen. Perfect voor 
                het verbinden van binnen- en buitenruimtes in moderne architectuur.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Openingen tot 8 meter breed</li>
                <li>• Meerdere vouwrichtingen mogelijk</li>
                <li>• Minimale drempelhoogte</li>
                <li>• Spectaculaire ruimtelijke effecten</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Curtain Wall Systemen</h3>
              <p className="text-gray-600 mb-4">
                Voor commerciële projecten en moderne woningen bieden we curtain wall systemen 
                aan. Deze creëren volledig glazen gevels met minimale profielzichtmaten.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Volledig glazen gevels</li>
                <li>• Structurele beglazing mogelijk</li>
                <li>• Uitstekende isolatiewaarden</li>
                <li>• Architectonische vrijheid</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Afwerkingen */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Afwerkingen en Kleuren</h2>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Poedercoating</h3>
                <p className="text-gray-600 mb-4">
                  De standaard afwerking voor aluminium kozijnen. Duurzaam, krasbestendig 
                  en verkrijgbaar in alle RAL-kleuren.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Alle RAL-kleuren</li>
                  <li>• Mat, zijdeglans of hoogglans</li>
                  <li>• Structuurlakken mogelijk</li>
                  <li>• 15 jaar kleurgarantie</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Anodiseren</h3>
                <p className="text-gray-600 mb-4">
                  Een elektrochemische behandeling die het aluminium een natuurlijke, 
                  metallic uitstraling geeft met uitstekende duurzaamheid.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Natuurlijk aluminium look</li>
                  <li>• Extreem duurzaam</li>
                  <li>• Verschillende tinten mogelijk</li>
                  <li>• Onderhoudsvrij</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Houtlook Coating</h3>
                <p className="text-gray-600 mb-4">
                  Speciale coatings die de uitstraling van hout nabootsen, maar met 
                  alle voordelen van aluminium.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Realistische houtstructuur</li>
                  <li>• Verschillende houtsoorten</li>
                  <li>• Onderhoudsvrij</li>
                  <li>• UV-bestendig</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-800 text-sm">
                <strong>Maatwerk:</strong> Naast standaard afwerkingen zijn ook speciale effectlakken, 
                twee-kleurige uitvoeringen en custom kleuren mogelijk. Vraag naar de mogelijkheden!
              </p>
            </div>
          </div>
        </section>

        {/* Toepassingen */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Ideale Toepassingen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Moderne Architectuur</h3>
              <p className="text-blue-800 text-sm">
                Perfect voor strakke, moderne woningen waar maximale glasoppervlakken 
                en minimale profielzichtmaten gewenst zijn.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Grote Openingen</h3>
              <p className="text-green-800 text-sm">
                Ideaal voor grote ramen, schuifpuien en vouwwanden waar andere materialen 
                te zwak zouden zijn.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">Commerciële Projecten</h3>
              <p className="text-purple-800 text-sm">
                Uitstekend geschikt voor kantoren, winkels en andere commerciële gebouwen 
                die een professionele uitstraling vereisen.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-900 mb-3">Renovatieprojecten</h3>
              <p className="text-orange-800 text-sm">
                Perfect voor het moderniseren van oudere gebouwen, waarbij de sterkte van 
                aluminium nieuwe mogelijkheden biedt.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-red-900 mb-3">Extreme Omstandigheden</h3>
              <p className="text-red-800 text-sm">
                Ideaal voor locaties met extreme weersomstandigheden, zeelucht of 
                andere agressieve omgevingen.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">Duurzaamheid</h3>
              <p className="text-yellow-800 text-sm">
                Voor projecten waar duurzaamheid en recycleerbaarheid belangrijke 
                criteria zijn in de materiaalkeuze.
              </p>
            </div>
          </div>
        </section>


        {/* CTA Section */}
        <section className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Klaar voor Aluminium Kozijnen?
          </h2>
          <p className="text-gray-100 mb-6 max-w-2xl mx-auto">
            Ontdek de mogelijkheden van aluminium kozijnen voor uw project. Onze specialisten 
            adviseren u graag over de beste oplossing voor uw situatie.
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

export default AluminiumKozijnen