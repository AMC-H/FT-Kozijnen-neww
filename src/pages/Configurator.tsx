import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Upload, X, Image as ImageIcon, Camera, Settings, Home, Package } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import ModelCarousel from '../components/ModelCarousel'
import PhotoUpload from '../components/PhotoUpload'
import modellen from '../data/modellen.json'

const Configurator: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [step, setStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedModel, setSelectedModel] = useState<any>(null)
  const [formData, setFormData] = useState<any>({})
  const [photoIds, setPhotoIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // Check for URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const preSelectedCategory = location.state?.preSelectedCategory
    const ekolinePanel = urlParams.get('ekolinePanel')
    const ekolineVariant = urlParams.get('ekolineVariant')
    const ekovitrePanel = urlParams.get('ekovitrePanel')
    const classiclinePanel = urlParams.get('classiclinePanel')
    const despiroPanelSlug = urlParams.get('despiroPanelSlug')

    if (preSelectedCategory) {
      setSelectedCategory(preSelectedCategory)
      setStep(2)
    } else if (ekolinePanel && ekolineVariant) {
      // Handle Ekoline panel selection
      setSelectedCategory('buitendeuren')
      setSelectedModel({
        naam: `Ekoline Paneel ${ekolinePanel} (${ekolineVariant} overlay)`,
        afbeelding: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/kozijnen-photos/basic/ekoline-panelen/vbpaneel-${ekolinePanel}-k-${ekolineVariant}.jpg`,
        type: 'ekoline',
        velden: ['materiaal', 'breedte', 'hoogte', 'kleurBinnen', 'kleurBuiten', 'glasoptie', 'dorpel', 'draairichting', 'hangEnSluitwerk', 'aanslag', 'opmerkingen', 'fotoUpload']
      })
      setStep(3)
    } else if (ekovitrePanel) {
      // Handle EkoVitre panel selection
      setSelectedCategory('buitendeuren')
      setSelectedModel({
        naam: `EkoVitre Glaspaneel ${ekovitrePanel}`,
        afbeelding: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/kozijnen-photos/EkoVitre-glaspanelen-${ekovitrePanel}-k.jpg`,
        type: 'ekovitre',
        velden: ['materiaal', 'breedte', 'hoogte', 'kleurBinnen', 'kleurBuiten', 'glasoptie', 'dorpel', 'draairichting', 'hangEnSluitwerk', 'aanslag', 'opmerkingen', 'fotoUpload']
      })
      setStep(3)
    } else if (classiclinePanel) {
      // Handle ClassicLine panel selection
      setSelectedCategory('buitendeuren')
      setSelectedModel({
        naam: `ClassicLine Paneel ${classiclinePanel}`,
        afbeelding: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/kozijnen-photos/ClassicLine-panelen-${classiclinePanel}-k.jpg`,
        type: 'classicline',
        velden: ['materiaal', 'breedte', 'hoogte', 'kleurBinnen', 'kleurBuiten', 'glasoptie', 'dorpel', 'draairichting', 'hangEnSluitwerk', 'aanslag', 'opmerkingen', 'fotoUpload']
      })
      setStep(3)
    } else if (despiroPanelSlug) {
      // Handle Despiro panel selection
      setSelectedCategory('buitendeuren')
      setSelectedModel({
        naam: `Despiro Paneel (${despiroPanelSlug})`,
        afbeelding: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/kozijnen-photos/despiro/${despiroPanelSlug}.jpg`,
        type: 'despiro',
        velden: ['materiaal', 'breedte', 'hoogte', 'kleurBinnen', 'kleurBuiten', 'glasoptie', 'dorpel', 'draairichting', 'hangEnSluitwerk', 'aanslag', 'opmerkingen', 'fotoUpload']
      })
      setStep(3)
    }
  }, [location])

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setSelectedModel(null)
    setFormData({})
    setPhotoIds([])
    setStep(2)
  }

  const handleModelSelect = (model: any) => {
    setSelectedModel(model)
    setFormData({})
    setPhotoIds([])
    setStep(3)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePhotosUploaded = (newPhotoIds: string[]) => {
    setPhotoIds(newPhotoIds)
  }

  const handleSubmit = async () => {
    if (!user?.id) {
      navigate('/login')
      return
    }

    setLoading(true)

    try {
      // Get or create a concept quote
      let { data: existingQuote, error: fetchError } = await supabase
        .from('quotes')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'concept')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      let quoteId: string

      if (fetchError && fetchError.code === 'PGRST116') {
        // No existing concept quote, create new one
        const { data: newQuote, error: createError } = await supabase
          .from('quotes')
          .insert([
            {
              user_id: user.id,
              items: [],
              status: 'concept'
            }
          ])
          .select()
          .single()

        if (createError) {
          console.error('Error creating quote:', createError)
          alert('Er ging iets mis bij het aanmaken van de offerte')
          return
        }

        quoteId = newQuote.id
        existingQuote = newQuote
      } else if (fetchError) {
        console.error('Error fetching quote:', fetchError)
        alert('Er ging iets mis bij het ophalen van de offerte')
        return
      } else {
        quoteId = existingQuote.id
      }

      // Prepare the new kozijn item
      const newKozijn = {
        id: Date.now().toString(),
        model: selectedModel?.naam || 'Onbekend model',
        categorie: selectedCategory,
        formulier: {
          ...formData,
          photoIds: photoIds,
          modelImageUrl: selectedModel?.afbeelding
        }
      }

      // Add to existing items
      const currentItems = Array.isArray(existingQuote.items) ? existingQuote.items : []
      const updatedItems = [...currentItems, newKozijn]

      // Update the quote with new item
      const { error: updateError } = await supabase
        .from('quotes')
        .update({ items: updatedItems })
        .eq('id', quoteId)

      if (updateError) {
        console.error('Error updating quote:', updateError)
        alert('Er ging iets mis bij het opslaan van het kozijn')
        return
      }

      // Navigate to quotes page with success message
      navigate('/quotes', {
        state: {
          success: 'kozijn-added',
          kozijnModel: selectedModel?.naam || 'Onbekend model',
          kozijnCategorie: selectedCategory
        }
      })

    } catch (error) {
      console.error('Error:', error)
      alert('Er ging iets mis bij het opslaan')
    } finally {
      setLoading(false)
    }
  }

  const getAvailableModels = () => {
    switch (selectedCategory) {
      case 'ramen':
        return modellen.ramen || []
      case 'buitendeuren':
        return modellen.buitendeuren || []
      case 'schuifsystemen':
        return modellen.schuifsystemen || []
      default:
        return []
    }
  }

  const renderFormField = (field: string) => {
    const commonInputClass = "w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
    
    switch (field) {
      case 'materiaal':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Materiaal *
            </label>
            <select
              value={formData.materiaal || ''}
              onChange={(e) => handleInputChange('materiaal', e.target.value)}
              className={commonInputClass}
              required
            >
              <option value="">Kies materiaal</option>
              <option value="kunststof">Kunststof (PVC)</option>
              <option value="aluminium">Aluminium</option>
              <option value="hout">Hout</option>
            </select>
          </div>
        )

      case 'breedte':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Breedte (mm) *
            </label>
            <input
              type="number"
              value={formData.breedte || ''}
              onChange={(e) => handleInputChange('breedte', e.target.value)}
              className={commonInputClass}
              placeholder="bijv. 1200"
              min="400"
              max="3000"
              required
            />
          </div>
        )

      case 'hoogte':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hoogte (mm) *
            </label>
            <input
              type="number"
              value={formData.hoogte || ''}
              onChange={(e) => handleInputChange('hoogte', e.target.value)}
              className={commonInputClass}
              placeholder="bijv. 1500"
              min="600"
              max="2500"
              required
            />
          </div>
        )

      case 'kleurBinnen':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kleur binnenzijde *
            </label>
            <select
              value={formData.kleurBinnen || ''}
              onChange={(e) => handleInputChange('kleurBinnen', e.target.value)}
              className={commonInputClass}
              required
            >
              <option value="">Kies kleur binnenzijde</option>
              
              <optgroup label="🎨 Standaard RAL Kleuren">
                <option value="ral-9016">RAL 9016 - Verkeerswit</option>
                <option value="ral-9010">RAL 9010 - Zuiver wit</option>
                <option value="ral-9001">RAL 9001 - Crème wit</option>
                <option value="ral-7035">RAL 7035 - Lichtgrijs</option>
                <option value="ral-7040">RAL 7040 - Venstergrijs</option>
                <option value="ral-7016">RAL 7016 - Antracietgrijs</option>
                <option value="ral-8019">RAL 8019 - Grijsbruin</option>
                <option value="ral-6005">RAL 6005 - Mosgroen</option>
                <option value="ral-6009">RAL 6009 - Dennegroen</option>
                <option value="ral-5010">RAL 5010 - Gentiaanblauw</option>
                <option value="ral-5011">RAL 5011 - Staalblauw</option>
                <option value="ral-3004">RAL 3004 - Purperrood</option>
                <option value="ral-3009">RAL 3009 - Oxiderood</option>
                <option value="ral-8017">RAL 8017 - Chocoladebruin</option>
                <option value="ral-8014">RAL 8014 - Sepiabruin</option>
              </optgroup>
              
              <optgroup label="🌳 Houtlook Kleuren">
                <option value="golden-oak">Golden Oak - Licht eiken</option>
                <option value="irish-oak">Irish Oak - Donker eiken</option>
                <option value="winchester">Winchester - Grijs eiken</option>
                <option value="mahonie">Mahonie - Roodbruin</option>
                <option value="noten">Noten - Donkerbruin</option>
                <option value="rosewood">Rosewood - Rood hout</option>
                <option value="teak">Teak - Goudbruin</option>
                <option value="douglas">Douglas - Natuurlijk</option>
              </optgroup>
            </select>
          </div>
        )

      case 'kleurBuiten':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kleur buitenzijde *
            </label>
            <select
              value={formData.kleurBuiten || ''}
              onChange={(e) => handleInputChange('kleurBuiten', e.target.value)}
              className={commonInputClass}
              required
            >
              <option value="">Kies kleur buitenzijde</option>
              
              <optgroup label="🎨 Standaard RAL Kleuren">
                <option value="ral-9016">RAL 9016 - Verkeerswit</option>
                <option value="ral-9010">RAL 9010 - Zuiver wit</option>
                <option value="ral-9001">RAL 9001 - Crème wit</option>
                <option value="ral-7035">RAL 7035 - Lichtgrijs</option>
                <option value="ral-7040">RAL 7040 - Venstergrijs</option>
                <option value="ral-7016">RAL 7016 - Antracietgrijs</option>
                <option value="ral-8019">RAL 8019 - Grijsbruin</option>
                <option value="ral-6005">RAL 6005 - Mosgroen</option>
                <option value="ral-6009">RAL 6009 - Dennegroen</option>
                <option value="ral-5010">RAL 5010 - Gentiaanblauw</option>
                <option value="ral-5011">RAL 5011 - Staalblauw</option>
                <option value="ral-3004">RAL 3004 - Purperrood</option>
                <option value="ral-3009">RAL 3009 - Oxiderood</option>
                <option value="ral-8017">RAL 8017 - Chocoladebruin</option>
                <option value="ral-8014">RAL 8014 - Sepiabruin</option>
              </optgroup>
              
              <optgroup label="🌳 Houtlook Kleuren">
                <option value="golden-oak">Golden Oak - Licht eiken</option>
                <option value="irish-oak">Irish Oak - Donker eiken</option>
                <option value="winchester">Winchester - Grijs eiken</option>
                <option value="mahonie">Mahonie - Roodbruin</option>
                <option value="noten">Noten - Donkerbruin</option>
                <option value="rosewood">Rosewood - Rood hout</option>
                <option value="teak">Teak - Goudbruin</option>
                <option value="douglas">Douglas - Natuurlijk</option>
              </optgroup>
            </select>
          </div>
        )

      case 'kleurBewegendeDelen':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kleur bewegende delen
            </label>
            <select
              value={formData.kleurBewegendeDelen || ''}
              onChange={(e) => handleInputChange('kleurBewegendeDelen', e.target.value)}
              className={commonInputClass}
            >
              <option value="">Kies kleur bewegende delen</option>
              
              <optgroup label="🎨 Standaard RAL Kleuren">
                <option value="ral-9016">RAL 9016 - Verkeerswit</option>
                <option value="ral-9010">RAL 9010 - Zuiver wit</option>
                <option value="ral-9001">RAL 9001 - Crème wit</option>
                <option value="ral-7035">RAL 7035 - Lichtgrijs</option>
                <option value="ral-7040">RAL 7040 - Venstergrijs</option>
                <option value="ral-7016">RAL 7016 - Antracietgrijs</option>
                <option value="ral-8019">RAL 8019 - Grijsbruin</option>
                <option value="ral-6005">RAL 6005 - Mosgroen</option>
                <option value="ral-6009">RAL 6009 - Dennegroen</option>
                <option value="ral-5010">RAL 5010 - Gentiaanblauw</option>
                <option value="ral-5011">RAL 5011 - Staalblauw</option>
                <option value="ral-3004">RAL 3004 - Purperrood</option>
                <option value="ral-3009">RAL 3009 - Oxiderood</option>
                <option value="ral-8017">RAL 8017 - Chocoladebruin</option>
                <option value="ral-8014">RAL 8014 - Sepiabruin</option>
              </optgroup>
              
              <optgroup label="🌳 Houtlook Kleuren">
                <option value="golden-oak">Golden Oak - Licht eiken</option>
                <option value="irish-oak">Irish Oak - Donker eiken</option>
                <option value="winchester">Winchester - Grijs eiken</option>
                <option value="mahonie">Mahonie - Roodbruin</option>
                <option value="noten">Noten - Donkerbruin</option>
                <option value="rosewood">Rosewood - Rood hout</option>
                <option value="teak">Teak - Goudbruin</option>
                <option value="douglas">Douglas - Natuurlijk</option>
              </optgroup>
            </select>
          </div>
        )

      case 'glasoptie':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Glasoptie *
            </label>
            <select
              value={formData.glasoptie || ''}
              onChange={(e) => handleInputChange('glasoptie', e.target.value)}
              className={commonInputClass}
              required
            >
              <option value="">Kies glasoptie</option>
              <option value="hr++">HR++ glas (standaard)</option>
              <option value="triple">Triple glas (extra isolatie)</option>
              <option value="mat">Mat glas (privacy)</option>
              <option value="gelaagd">Gelaagd glas (veiligheid)</option>
              <option value="zonwerend">Zonwerend glas</option>
            </select>
          </div>
        )

      case 'profielKeuze':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profiel keuze
            </label>
            <select
              value={formData.profielKeuze || ''}
              onChange={(e) => handleInputChange('profielKeuze', e.target.value)}
              className={commonInputClass}
            >
              <option value="">Kies profiel</option>
              <option value="ideal-7000">Ideal 7000 (standaard)</option>
              <option value="ideal-8000">Ideal 8000 (premium)</option>
            </select>
          </div>
        )

      case 'draairichting':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Draairichting
            </label>
            <select
              value={formData.draairichting || ''}
              onChange={(e) => handleInputChange('draairichting', e.target.value)}
              className={commonInputClass}
            >
              <option value="">Kies draairichting</option>
              <option value="links">Links</option>
              <option value="rechts">Rechts</option>
            </select>
          </div>
        )

      case 'hor':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hor (insectenscreen)
            </label>
            <select
              value={formData.hor || ''}
              onChange={(e) => handleInputChange('hor', e.target.value)}
              className={commonInputClass}
            >
              <option value="">Kies optie</option>
              <option value="ja">Ja, hor gewenst</option>
              <option value="nee">Nee, geen hor</option>
            </select>
          </div>
        )

      case 'dorpel':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dorpel
            </label>
            <select
              value={formData.dorpel || ''}
              onChange={(e) => handleInputChange('dorpel', e.target.value)}
              className={commonInputClass}
            >
              <option value="">Kies dorpel type</option>
              <option value="standaard">Standaard dorpel</option>
              <option value="lage-dorpel">Lage dorpel</option>
              <option value="geen-dorpel">Geen dorpel</option>
            </select>
          </div>
        )

      case 'hangEnSluitwerk':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hang- en sluitwerk
            </label>
            <select
              value={formData.hangEnSluitwerk || ''}
              onChange={(e) => handleInputChange('hangEnSluitwerk', e.target.value)}
              className={commonInputClass}
            >
              <option value="">Kies hang- en sluitwerk</option>
              <option value="standaard">Standaard</option>
              <option value="veiligheid">Veiligheidsslot</option>
              <option value="anti-inbraak">Anti-inbraak</option>
            </select>
          </div>
        )

      case 'aanslag':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aanslag
            </label>
            <select
              value={formData.aanslag || ''}
              onChange={(e) => handleInputChange('aanslag', e.target.value)}
              className={commonInputClass}
            >
              <option value="">Kies aanslag</option>
              <option value="ja">Ja</option>
              <option value="nee">Nee</option>
            </select>
          </div>
        )

      case 'schuifrichting':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schuifrichting
            </label>
            <select
              value={formData.schuifrichting || ''}
              onChange={(e) => handleInputChange('schuifrichting', e.target.value)}
              className={commonInputClass}
            >
              <option value="">Kies schuifrichting</option>
              <option value="links">Links</option>
              <option value="rechts">Rechts</option>
            </select>
          </div>
        )

      case 'aantalDelen':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aantal delen
            </label>
            <select
              value={formData.aantalDelen || ''}
              onChange={(e) => handleInputChange('aantalDelen', e.target.value)}
              className={commonInputClass}
            >
              <option value="">Kies aantal delen</option>
              <option value="2">2 delen</option>
              <option value="3">3 delen</option>
              <option value="4">4 delen</option>
              <option value="5">5 delen</option>
            </select>
          </div>
        )

      case 'opmerkingen':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opmerkingen
            </label>
            <textarea
              value={formData.opmerkingen || ''}
              onChange={(e) => handleInputChange('opmerkingen', e.target.value)}
              className={commonInputClass}
              rows={4}
              placeholder="Eventuele bijzonderheden of wensen..."
            />
          </div>
        )

      case 'fotoUpload':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto's uploaden
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Upload foto's van de huidige situatie of gewenste uitstraling (optioneel)
            </p>
            <PhotoUpload
              userId={user?.id || ''}
              onPhotosUploaded={handlePhotosUploaded}
              existingPhotoIds={photoIds}
              maxFiles={5}
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kozijn Configurator</h1>
            <p className="text-gray-600">Configureer uw ideale kozijn in 3 eenvoudige stappen</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Terug naar home</span>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= stepNumber ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNumber ? 'bg-primary-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Stap {step} van 3: {
                  step === 1 ? 'Kies categorie' :
                  step === 2 ? 'Selecteer model' :
                  'Configureer details'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          {/* Step 1: Category Selection */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                Kies uw kozijn categorie
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  onClick={() => handleCategorySelect('ramen')}
                  className="group p-6 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <div className="text-center">
                    <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                      <Home className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Ramen</h3>
                    <p className="text-gray-600">Draai-kiep ramen, vaste ramen en meer</p>
                  </div>
                </button>

                <button
                  onClick={() => handleCategorySelect('buitendeuren')}
                  className="group p-6 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <div className="text-center">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                      <Package className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Buitendeuren</h3>
                    <p className="text-gray-600">Voordeuren, achterdeuren en tuindeuren</p>
                  </div>
                </button>

                <button
                  onClick={() => handleCategorySelect('schuifsystemen')}
                  className="group p-6 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <div className="text-center">
                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                      <Settings className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Schuifsystemen</h3>
                    <p className="text-gray-600">Schuifpuien en harmonica deuren</p>
                  </div>
                </button>
              </div>

            {/* Buitendeuren Button */}
            <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  Speciale Paneel Collecties
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => navigate('/configurator/ekoline')}
                    className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-md transition-all text-center"
                  >
                    <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Package className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-medium text-gray-900">Ekoline</h4>
                    <p className="text-xs text-gray-600">Decoratieve panelen</p>
                  </button>

                  <button
                    onClick={() => navigate('/configurator/ekovitre')}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-center"
                  >
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-gray-900">EkoVitre</h4>
                    <p className="text-xs text-gray-600">Glaspanelen</p>
                  </button>

                  <button
                    onClick={() => navigate('/configurator/classicline')}
                    className="p-4 border border-gray-200 rounded-lg hover:border-amber-500 hover:shadow-md transition-all text-center"
                  >
                    <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Package className="h-6 w-6 text-amber-600" />
                    </div>
                    <h4 className="font-medium text-gray-900">ClassicLine</h4>
                    <p className="text-xs text-gray-600">Reliëf panelen</p>
                  </button>

                  <button
                    onClick={() => navigate('/configurator/et')}
                    className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition-all text-center"
                  >
                    <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Package className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-medium text-gray-900">ET Panelen</h4>
                    <p className="text-xs text-gray-600">Premium panelen</p>
                  </button>
                </div>
              </div>
            
            {/* Buitendeuren Button */}
            <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  Of kies uit onze buitendeuren
                </h3>
                <div className="text-center">
                  <button
                    onClick={() => navigate('/configurator/buitendeuren')}
                    className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="h-8 w-8 text-orange-600" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Buitendeuren</h4>
                    <p className="text-gray-600">Bekijk alle buitendeur modellen</p>
                  </button>
                </div>
              </div>

          )}

          {/* Step 2: Model Selection */}
          {step === 2 && selectedCategory && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Kies uw {selectedCategory === 'ramen' ? 'raam' : selectedCategory === 'buitendeuren' ? 'deur' : 'schuifsysteem'} model
                </h2>
                <button
                  onClick={() => setStep(1)}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← Terug naar categorieën
                </button>
              </div>
              
              <ModelCarousel
                models={getAvailableModels()}
                onSelectModel={handleModelSelect}
              />
            </div>
          )}

          {/* Step 3: Configuration Form */}
          {step === 3 && selectedModel && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Configureer: {selectedModel.naam}
                </h2>
                <button
                  onClick={() => setStep(2)}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← Terug naar modellen
                </button>
              </div>

              {/* Model Image */}
              <div className="mb-8 text-center">
                <img
                  src={selectedModel.afbeelding}
                  alt={selectedModel.naam}
                  className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400'
                  }}
                />
              </div>

              {/* Configuration Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedModel.velden?.map((field: string) => (
                  <div key={field}>
                    {renderFormField(field)}
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="mt-8 text-center">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-4 px-8 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Opslaan...</span>
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-5 w-5" />
                      <span>Kozijn toevoegen aan offerte</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Configurator