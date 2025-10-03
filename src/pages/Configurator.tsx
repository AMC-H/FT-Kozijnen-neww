import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ImageIcon, DoorOpen as Door } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import PhotoUpload from '../components/PhotoUpload'
import modellen from '../data/modellen.json'
import EkolineGrid from '../components/EkolineGrid'
import { publicUrl } from '../lib/supabaseClient'

const Configurator: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [categorie, setCategorie] = useState<string | null>(null)
  const [deurType, setDeurType] = useState<string | null>(null)
  const [model, setModel] = useState<any | null>(null)
  const [formulier, setFormulier] = useState<Record<string, string>>({})
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const [photoIds, setPhotoIds] = useState<string[]>([])
  const [selectedEkolinePanel, setSelectedEkolinePanel] = useState<number>(1)
  const [showEkolineConfig, setShowEkolineConfig] = useState(false)

  // Check if we have pre-selected category from navigation state
  React.useEffect(() => {
    if (location.state?.preSelectedCategory) {
      setCategorie(location.state.preSelectedCategory)
      setCurrentStep(2) // Go to step 2 for door type selection
    }
  }, [location.state])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formulier.breedte || !formulier.hoogte) {
      alert('Vul minimaal de breedte en hoogte in')
      return
    }

    const newItem = {
      categorie: categorie,
      deurType: deurType,
      model: model?.naam,
      formulier: {
        ...formulier,
        photoIds: photoIds.length > 0 ? photoIds : undefined,
        modelImageUrl: model?.afbeelding
      },
      timestamp: new Date().toISOString()
    }

    try {
      // Check if user has an existing concept quote
      const { data: existingQuotes, error: fetchError } = await supabase
        .from('quotes')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'concept')
        .order('created_at', { ascending: false })
        .limit(1)
      
      if (fetchError) {
        console.error('Error fetching existing quotes:', fetchError)
        alert(`Database fout: ${fetchError.message}`)
        return
      }
      
      let quoteData
      
      if (existingQuotes && existingQuotes.length > 0) {
        // Add to existing concept quote
        const existingQuote = existingQuotes[0]
        const currentItems = Array.isArray(existingQuote.items) ? existingQuote.items : []
        const updatedItems = [...currentItems, newItem]
        
        const { data, error } = await supabase
          .from('quotes')
          .update({ 
            items: updatedItems,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingQuote.id)
          .select()
        
        if (error) {
          console.error('Error updating existing quote:', error)
          alert(`Database fout: ${error.message}`)
          return
        }
        
        quoteData = data
        console.log('Added kozijn to existing quote:', data)
      } else {
        // Create new concept quote
        const { data, error } = await supabase
          .from('quotes')
          .insert([
            {
              user_id: user.id,
              items: [newItem],
              status: 'concept'
            }
          ])
          .select()
        
        if (error) {
          console.error('Error creating new quote:', error)
          alert(`Database fout: ${error.message}`)
          return
        }
        
        quoteData = data
        console.log('Created new quote with kozijn:', data)
      }

      // Reset form
      setFormulier({})
      setPhotoIds([])
      
      // Add helper function for pad2
      const pad2 = (n: number) => n.toString().padStart(2, '0')
      
      // Navigate to quotes page with success message
      navigate('/quotes', { 
        state: { 
          success: 'kozijn-added',
          kozijnModel: model?.naam,
          kozijnCategorie: categorie
        } 
      })
      
    } catch (error) {
      console.error('Error:', error)
      alert(`Er ging iets mis: ${error instanceof Error ? error.message : 'Onbekende fout'}`)
    }
  }

  // Helper function for padding numbers
  const pad2 = (n: number) => n.toString().padStart(2, '0')

  const handleImageError = (imageSrc: string) => {
    setImageErrors(prev => ({ ...prev, [imageSrc]: true }))
  }

  const ImageWithFallback: React.FC<{ src: string; alt: string; className: string }> = ({ src, alt, className }) => {
    if (imageErrors[src]) {
      return (
        <div className={`${className} bg-gray-200 flex items-center justify-center`}>
          <div className="text-center text-gray-500">
            <ImageIcon className="h-12 w-12 mx-auto mb-2" />
            <p className="text-sm">{alt}</p>
          </div>
        </div>
      )
    }

    return (
      <img 
        src={src} 
        alt={alt} 
        className={className}
        onError={(e) => {
          handleImageError(src)
        }}
        loading="lazy"
      />
    )
  }

  const renderField = (veld: string) => {
    const commonClasses = "w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    
    switch (veld) {
      case 'materiaal':
        return (
          <select
            className={commonClasses}
            value={formulier[veld] || ''}
            onChange={(e) => setFormulier({ ...formulier, [veld]: e.target.value })}
          >
            <option value="">Kies materiaal</option>
            <option value="kunststof">Kunststof</option>
            <option value="hout">Hout</option>
            <option value="aluminium">Aluminium</option>
          </select>
        )
      
      case 'glasoptie':
        return (
          <select
            className={commonClasses}
            value={formulier[veld] || ''}
            onChange={(e) => setFormulier({ ...formulier, [veld]: e.target.value })}
          >
            <option value="">Kies glasoptie</option>
            <option value="hr++">HR++ glas</option>
            <option value="triple">Triple glas</option>
            <option value="mat">Mat glas</option>
          </select>
        )
      
      case 'kleurBinnen':
      case 'kleurBuiten':
      case 'kleurBewegendeDelen':
        return (
          <select
            className={commonClasses}
            value={formulier[veld] || ''}
            onChange={(e) => setFormulier({ ...formulier, [veld]: e.target.value })}
          >
            <option value="">Kies kleur</option>
            <option value="wit">Wit</option>
            <option value="creme">Crème</option>
            <option value="grijs">Grijs</option>
            <option value="antraciet">Antraciet</option>
            <option value="zwart">Zwart</option>
            <option value="bruin">Bruin</option>
            <option value="groen">Groen</option>
            <option value="blauw">Blauw</option>
          </select>
        )
      
      case 'aanslag':
        return (
          <select
            className={commonClasses}
            value={formulier[veld] || ''}
            onChange={(e) => setFormulier({ ...formulier, [veld]: e.target.value })}
          >
            <option value="">Kies aanslag</option>
            <option value="ja">Ja</option>
            <option value="nee">Nee</option>
          </select>
        )
      
      case 'profielKeuze':
        return (
          <select
            className={commonClasses}
            value={formulier[veld] || ''}
            onChange={(e) => setFormulier({ ...formulier, [veld]: e.target.value })}
          >
            <option value="">Kies profiel</option>
            <option value="ideal-7000">Ideal 7000</option>
            <option value="ideal-8000">Ideal 8000</option>
          </select>
        )
      
      case 'scharnierzijde':
        return (
          <select
            className={commonClasses}
            value={formulier[veld] || ''}
            onChange={(e) => setFormulier({ ...formulier, [veld]: e.target.value })}
          >
            <option value="">Kies scharnierzijde</option>
            <option value="links">Links</option>
            <option value="rechts">Rechts</option>
          </select>
        )
      
      case 'schuifrichting':
        return (
          <select
            className={commonClasses}
            value={formulier[veld] || ''}
            onChange={(e) => setFormulier({ ...formulier, [veld]: e.target.value })}
          >
            <option value="">Kies schuifrichting</option>
            <option value="links">Links</option>
            <option value="rechts">Rechts</option>
          </select>
        )
      
      case 'aantalDelen':
        return (
          <select
            className={commonClasses}
            value={formulier[veld] || ''}
            onChange={(e) => setFormulier({ ...formulier, [veld]: e.target.value })}
          >
            <option value="">Aantal delen</option>
            <option value="2">2 delen</option>
            <option value="3">3 delen</option>
            <option value="4">4 delen</option>
            <option value="5">5 delen</option>
          </select>
        )
      
      case 'draairichting':
        return (
          <select
            className={commonClasses}
            value={formulier[veld] || ''}
            onChange={(e) => setFormulier({ ...formulier, [veld]: e.target.value })}
          >
            <option value="">Kies draairichting</option>
            <option value="links">Links</option>
            <option value="rechts">Rechts</option>
          </select>
        )
      
      case 'hor':
        return (
          <select
            className={commonClasses}
            value={formulier[veld] || ''}
            onChange={(e) => setFormulier({ ...formulier, [veld]: e.target.value })}
          >
            <option value="">Hor gewenst?</option>
            <option value="ja">Ja, hor gewenst</option>
            <option value="nee">Nee, geen hor</option>
          </select>
        )
      
      case 'dorpel':
        return (
          <select
            className={commonClasses}
            value={formulier[veld] || ''}
            onChange={(e) => setFormulier({ ...formulier, [veld]: e.target.value })}
          >
            <option value="">Kies dorpel</option>
            <option value="standaard">Standaard dorpel</option>
            <option value="lage">Lage dorpel</option>
            <option value="drempelloze">Drempelloze overgang</option>
            <option value="verhoogde">Verhoogde dorpel</option>
          </select>
        )
      
      case 'hangEnSluitwerk':
        return (
          <select
            className={commonClasses}
            value={formulier[veld] || ''}
            onChange={(e) => setFormulier({ ...formulier, [veld]: e.target.value })}
          >
            <option value="">Kies hang- en sluitwerk</option>
            <option value="standaard">Standaard hang- en sluitwerk</option>
            <option value="veiligheid">Veiligheidsslot</option>
            <option value="meerpunts">Meerpuntsluiting</option>
            <option value="anti-inbraak">Anti-inbraak beslag</option>
            <option value="comfort">Comfort hang- en sluitwerk</option>
          </select>
        )
      
      case 'breedte':
      case 'hoogte':
        return (
          <input
            type="number"
            min="500"
            max="5000"
            step="10"
            placeholder={veld === 'breedte' ? 'Breedte in mm' : 'Hoogte in mm'}
            className={commonClasses}
            value={formulier[veld] || ''}
            onChange={(e) => setFormulier({ ...formulier, [veld]: e.target.value })}
          />
        )
      
      case 'opmerkingen':
        return (
          <textarea
            className={commonClasses}
            rows={3}
            placeholder="Voeg hier eventuele opmerkingen toe..."
            value={formulier[veld] || ''}
            onChange={(e) => setFormulier({ ...formulier, [veld]: e.target.value })}
          />
        )
      
      case 'fotoUpload':
        return (
          <PhotoUpload
            userId={user?.id || ''}
            onPhotosUploaded={setPhotoIds}
            existingPhotoIds={photoIds}
            maxFiles={5}
          />
        )
      
      default:
        return (
          <input
            type="text"
            className={commonClasses}
            placeholder={`Voer ${veld} in`}
            value={formulier[veld] || ''}
            onChange={(e) => setFormulier({ ...formulier, [veld]: e.target.value })}
          />
        )
    }
  }

  const getFieldLabel = (veld: string) => {
    const labels: Record<string, string> = {
      materiaal: 'Materiaal',
      breedte: 'Breedte (mm)',
      hoogte: 'Hoogte (mm)',
      kleurBinnen: 'Kleur binnenzijde',
      kleurBuiten: 'Kleur buitenzijde',
      kleurBewegendeDelen: 'Kleur bewegende delen',
      glasoptie: 'Glasoptie',
      scharnierzijde: 'Scharnierzijde',
      schuifrichting: 'Schuifrichting',
      aantalDelen: 'Aantal delen',
      draairichting: 'Draairichting',
      hor: 'Hor (insectenscreen)',
      dorpel: 'Dorpel',
      hangEnSluitwerk: 'Hang- en sluitwerk',
      aanslag: 'Aanslag',
      opmerkingen: 'Opmerkingen',
      fotoUpload: 'Foto uploaden',
      profielKeuze: 'Profiel keuze'
    }
    return labels[veld] || veld
  }

  // Get unique door types from buitendeuren models
  const getDoorTypes = () => {
    const buitendeuren = (modellen as any).buitendeuren || []
    const types = [...new Set(buitendeuren.map((m: any) => m.type || 'kunststof'))]
    return types.map(type => ({
      value: type,
      label: type === 'kunststof' ? 'Basic Deuren' :
             type === 'tuindeur' ? 'Tuindeuren' :
             type === 'ekoline' ? 'Ekoline Deuren' :
             type === 'aluminium' ? 'Aluminium Deuren' :
             type === 'houten' ? 'Houten Deuren' :
             type
    }))
  }

  // Get models filtered by category and door type
  const getFilteredModels = () => {
    if (!categorie) return []
    
    const categoryModels = (modellen as any)[categorie] || []
    
    if (categorie === 'buitendeuren' && deurType) {
      return categoryModels.filter((m: any) => (m.type || 'kunststof') === deurType)
    }
    
    return categoryModels
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {categorie === 'buitendeuren' ? 'Configureer uw exclusieve deur' : 'Configureer uw ideale kozijnen'}
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* Step 1: Category Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 text-center">
                Kies uw categorie
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {Object.keys(modellen).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategorie(cat)
                      setCurrentStep(cat === 'buitendeuren' ? 2 : 3)
                    }}
                    className="group border-2 border-gray-200 rounded-xl p-6 text-center hover:border-primary-500 hover:bg-primary-50 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="mb-4 flex justify-center">
                      {cat === 'ramen' && (
                        <img 
                          src="/ChatGPT Image 11 jul 2025, 11_26_43.png" 
                          alt="Ramen" 
                          className="w-48 h-48 object-contain rounded-lg"
                        />
                      )}
                      {cat === 'buitendeuren' && (
                        <img 
                          src="/drzwizestawienie2xv2.png" 
                          alt="Buitendeuren" 
                          className="w-64 h-48 object-contain rounded-lg"
                        />
                      )}
                      {cat === 'schuifsystemen' && (
                        <ImageWithFallback
                          src="/schuifsystemen/ChatGPT Image 11 jul 2025, 11_24_06.png" 
                          alt="Schuifsystemen" 
                          className="w-48 h-48 object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 capitalize">
                      {cat}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {cat === 'ramen' && 'Voor optimaal licht en ventilatie'}
                      {cat === 'buitendeuren' && 'Veilige en stijlvolle toegang'}
                      {cat === 'schuifsystemen' && 'Moderne ruimtelijke oplossingen'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Door Type Selection (only for buitendeuren) */}
          {currentStep === 2 && categorie === 'buitendeuren' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Kies het type deur
                </h2>
                <button 
                  onClick={() => setCurrentStep(1)} 
                  className="text-primary-600 hover:text-primary-800 font-medium"
                >
                  ← Terug naar categorieën
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {getDoorTypes().map((type) => (
                  <button
                    key={type.value}
                    onClick={() => {
                      setDeurType(type.value)
                      setCurrentStep(3)
                    }}
                    className="group border-2 border-gray-200 rounded-xl p-6 text-center hover:border-primary-500 hover:bg-primary-50 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="mb-4 flex justify-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        type.value === 'kunststof' ? 'bg-blue-100' :
                        type.value === 'tuindeur' ? 'bg-green-100' :
                        type.value === 'aluminium' ? 'bg-gray-100' :
                        type.value === 'houten' ? 'bg-amber-100' :
                        'bg-primary-100'
                      }`}>
                        <Door className={`h-8 w-8 ${
                          type.value === 'kunststof' ? 'text-blue-600' :
                          type.value === 'tuindeur' ? 'text-green-600' :
                          type.value === 'aluminium' ? 'text-gray-600' :
                          type.value === 'houten' ? 'text-amber-600' :
                          'text-primary-600'
                        }`} />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600">
                      {type.label}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {type.value === 'kunststof' && 'Onderhoudsvrij en energiezuinig'}
                      {type.value === 'tuindeur' && 'Perfect voor toegang tot uw tuin'}
                      {type.value === 'aluminium' && 'Modern en duurzaam'}
                      {type.value === 'houten' && 'Klassieke uitstraling'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Model Selection */}
          {currentStep === 3 && categorie && (categorie !== 'buitendeuren' || deurType) && !model && !showEkolineConfig && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Kies een model
                  {categorie === 'buitendeuren' && deurType && (
                    <span className="text-lg font-normal text-gray-600 ml-2">
                      ({deurType === 'kunststof' ? 'Basic Deuren' :
                        deurType === 'tuindeur' ? 'Tuindeuren' :
                        deurType === 'aluminium' ? 'Aluminium Deuren' :
                        deurType === 'houten' ? 'Houten Deuren' :
                        deurType})
                    </span>
                  )}
                </h2>
                <button 
                  onClick={() => {
                    if (categorie === 'buitendeuren') {
                      setCurrentStep(2)
                      setDeurType(null)
                    } else {
                      setCurrentStep(1)
                      setCategorie(null)
                    }
                  }} 
                  className="text-primary-600 hover:text-primary-800 font-medium"
                >
                  ← Terug naar {categorie === 'buitendeuren' ? 'deurtypes' : 'categorieën'}
                </button>
              </div>
              
              {categorie === 'buitendeuren' && deurType === 'ekoline' ? (
                <div className="space-y-6">
                  <EkolineGrid onSelect={(num) => {
                    setSelectedEkolinePanel(num)
                    const ekolineImagePath = `met-overlay/vbpaneel-${pad2(num)}-k-zonder.jpg`
                    const ekolineImageUrl = publicUrl(ekolineImagePath, 'ekoline-panels')
                    
                    setModel({
                      naam: `Ekoline Paneel ${pad2(num)}`,
                      afbeelding: ekolineImageUrl,
                      velden: ["materiaal", "breedte", "hoogte", "kleurBinnen", "kleurBuiten", "kleurBewegendeDelen", "glasoptie", "dorpel", "draairichting", "hangEnSluitwerk", "aanslag", "opmerkingen", "fotoUpload"]
                    })
                    setShowEkolineConfig(true)
                    setCurrentStep(4)
                  }} />
                  
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredModels().map((m: any) => (
                    <button
                      key={m.naam}
                      onClick={() => {
                        setModel(m)
                        setCurrentStep(categorie === 'buitendeuren' ? 4 : 3)
                      }}
                      className="group border-2 border-gray-200 rounded-xl overflow-hidden text-left hover:border-primary-500 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <ImageWithFallback
                          src={m.afbeelding} 
                          alt={m.naam} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {m.naam}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Klik om te configureren
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4/3: Configuration Form */}
          {currentStep === (categorie === 'buitendeuren' ? 4 : 3) && model && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Configureer uw {model?.naam}
                </h2>
                <button 
                  onClick={() => {
                    setModel(null)
                    setShowEkolineConfig(false)
                    setCurrentStep(3)
                  }} 
                  className="text-primary-600 hover:text-primary-800 font-medium"
                >
                  ← Terug naar modellen
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Model Image */}
                <div className="order-2 lg:order-1">
                  <div className="sticky top-6">
                    <ImageWithFallback
                      src={model?.afbeelding} 
                      alt={model?.naam} 
                      className="w-full rounded-lg shadow-md"
                    />
                    <div className="mt-4 bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{model?.naam}</h4>
                      <p className="text-sm text-gray-600">
                        Categorie: <span className="font-medium capitalize">{categorie}</span>
                        {categorie === 'buitendeuren' && deurType && (
                          <span className="block">
                            Type: <span className="font-medium">
                              {deurType === 'kunststof' ? 'Basic' :
                               deurType === 'tuindeur' ? 'Tuindeur' :
                               deurType === 'ekoline' ? 'Ekoline' :
                               deurType === 'aluminium' ? 'Aluminium' :
                               deurType === 'houten' ? 'Houten' :
                               deurType}
                            </span>
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Configuration Form */}
                <div className="order-1 lg:order-2">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {model?.velden.map((veld: string) => (
                      <div key={veld}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {getFieldLabel(veld)}
                        </label>
                        {renderField(veld)}
                      </div>
                    ))}

                    <div className="pt-6 border-t">
                      <button
                        type="submit"
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-300 transform hover:scale-105"
                      >
                        Toevoegen aan dashboard
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Configurator