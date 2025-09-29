import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'

const EkolineOverviewImage = 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'

interface EkolinePanel {
  number: string
  variant: 'met' | 'zonder'
  url: string
}

const EkolineConfigurator: React.FC = () => {
  const navigate = useNavigate()
  
  // Debug log to confirm component is rendering
  console.log('🔍 EkolineConfigurator component is rendering')
  console.log('🔍 Current working directory should contain:', '/home/project/public/ekoline-panels-overview.png')
  
  const [variant, setVariant] = useState<'met' | 'zonder'>('met')
  const [availableMet, setAvailableMet] = useState<{ number: string; path: string }[]>([])
  const [availableZonder, setAvailableZonder] = useState<{ number: string; path: string }[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAvailablePanels()
  }, [])

  const loadAvailablePanels = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔍 EKOLINE DEBUG: Loading panels from panelen_config table...')
      
      // Fetch panel configuration from panelen_config table
      const { data: panelConfigs, error } = await supabase
        .from('panelen_config')
        .select('paneelnummer, afbeelding_met, afbeelding_zonder')
        .order('paneelnummer', { ascending: true })
      
      if (error) {
        console.error('🔍 EKOLINE DEBUG: Error fetching panel configs:', error)
        setError(`Fout bij het laden van paneel configuraties: ${error.message}`)
        return
      }
      
      if (!panelConfigs || panelConfigs.length === 0) {
        console.log('🔍 EKOLINE DEBUG: No panel configs found in database')
        setError('Geen paneel configuraties gevonden in database')
        return
      }
      
      console.log('🔍 EKOLINE DEBUG: Panel configs from database:', panelConfigs)
      
      // Build met and zonder panels arrays from database data
      const metPanels: { number: string; path: string }[] = []
      const zonderPanels: { number: string; path: string }[] = []
      
      panelConfigs.forEach(config => {
        const panelNumber = config.paneelnummer.toString().padStart(2, '0')
        
        // Add to met panels if afbeelding_met exists
        if (config.afbeelding_met) {
          metPanels.push({
            number: panelNumber,
            path: config.afbeelding_met
          })
          console.log(`🔍 EKOLINE DEBUG: Added MET panel ${panelNumber}: ${config.afbeelding_met}`)
        }
        
        // Add to zonder panels if afbeelding_zonder exists
        if (config.afbeelding_zonder) {
          zonderPanels.push({
            number: panelNumber,
            path: config.afbeelding_zonder
          })
          console.log(`🔍 EKOLINE DEBUG: Added ZONDER panel ${panelNumber}: ${config.afbeelding_zonder}`)
        }
      })
      
      console.log('🔍 EKOLINE DEBUG: Final met panels:', metPanels)
      console.log('🔍 EKOLINE DEBUG: Final zonder panels:', zonderPanels)
      
      setAvailableMet(metPanels)
      setAvailableZonder(zonderPanels)
      
      // Set initial index to 0 if panels are available
      if (metPanels.length > 0) {
        console.log('🔍 EKOLINE DEBUG: Setting initial index to 0')
        setCurrentIndex(0)
      }

    } catch (error) {
      console.error('🔍 EKOLINE DEBUG: Catch block error:', error)
      setError(`Er ging iets mis bij het laden van de panelen: ${error instanceof Error ? error.message : 'Onbekende fout'}`)
    } finally {
      console.log('🔍 EKOLINE DEBUG: Loading finished, setting loading to false')
      setLoading(false)
    }
  }

  const getCurrentPanels = () => {
    return variant === 'met' ? availableMet : availableZonder
  }

  const getCurrentPanel = () => {
    const panels = getCurrentPanels()
    return panels[currentIndex] || null
  }

  const getPreviousPanel = () => {
    const panels = getCurrentPanels()
    if (panels.length === 0) return null
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : panels.length - 1
    return panels[prevIndex] || null
  }

  const getNextPanel = () => {
    const panels = getCurrentPanels()
    if (panels.length === 0) return null
    const nextIndex = currentIndex < panels.length - 1 ? currentIndex + 1 : 0
    return panels[nextIndex] || null
  }

  const getPanelImageUrl = (panelData: { number: string; path: string } | null) => {
    if (!panelData) return ''
    // panelData.path contains the filename directly from database
    return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/kozijnen-photos/${panelData.path}`
  }

  const handleVariantChange = (newVariant: 'met' | 'zonder') => {
    setVariant(newVariant)
    
    // Check if current panel exists in new variant
    const currentPanel = getCurrentPanel()
    const newPanels = newVariant === 'met' ? availableMet : availableZonder
    
    if (currentPanel && !newPanels.find(p => p.number === currentPanel.number)) {
      // Current panel doesn't exist in new variant, jump to first available
      setCurrentIndex(0)
    } else if (currentPanel) {
      // Find the index of current panel in new variant
      const newIndex = newPanels.findIndex(p => p.number === currentPanel.number)
      setCurrentIndex(newIndex >= 0 ? newIndex : 0)
    }
  }

  const handlePrevious = () => {
    const panels = getCurrentPanels()
    setCurrentIndex(prev => prev > 0 ? prev - 1 : panels.length - 1)
  }

  const handleNext = () => {
    const panels = getCurrentPanels()
    setCurrentIndex(prev => prev < panels.length - 1 ? prev + 1 : 0)
  }

  const handleSelectPanel = () => {
    const currentPanel = getCurrentPanel()
    if (currentPanel) {
      // Navigate back to configurator with ekoline parameters
      navigate(`/configurator?ekolinePanel=${currentPanel.number}&ekolineVariant=${variant}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ekoline panelen laden...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={() => navigate('/configurator')}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Terug naar configurator
          </button>
        </div>
      </div>
    )
  }

  const currentPanels = getCurrentPanels()
  const currentPanel = getCurrentPanel()

  if (currentPanels.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Geen panelen beschikbaar voor variant "{variant}"</p>
          <button
            onClick={() => navigate('/configurator')}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Terug naar configurator
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ekoline Panelen</h1>
            <p className="text-gray-600">Kies uw gewenste paneel design</p>
          </div>
          <button
            onClick={() => navigate('/configurator')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Terug naar configurator</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* Variant Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => handleVariantChange('met')}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-300 ${
                  variant === 'met'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Met overlay
              </button>
              <button
                onClick={() => handleVariantChange('zonder')}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-300 ${
                  variant === 'zonder'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Zonder overlay
              </button>
            </div>
          </div>

          {/* Panel Display */}
          <div className="text-center mb-8">
            <div className="relative w-full max-w-4xl mx-auto h-96 overflow-hidden">
              {/* Carousel Container */}
              <div className="flex items-center justify-center h-full relative">
                {/* Previous Panel (Left) */}
                <div className="absolute left-0 w-1/4 h-full flex items-center justify-center opacity-50 scale-75 transition-all duration-300">
                  {getPreviousPanel() && (
                    <img
                      src={getPanelImageUrl(getPreviousPanel())}
                      alt={`Vorig paneel ${getPreviousPanel()?.number}`}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                      onError={(e) => {
                        console.error(`Failed to load previous panel image`)
                      }}
                    />
                  )}
                </div>

                {/* Current Panel (Center) */}
                <div className="w-3/4 h-full flex items-center justify-center z-10">
                  <img
                    src={getPanelImageUrl(getCurrentPanel())}
                    alt={`Ekoline paneel ${getCurrentPanel()?.number} ${variant} overlay`}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-xl"
                    onError={(e) => {
                      console.error(`Failed to load image for panel ${getCurrentPanel()?.number} variant ${variant}`)
                    }}
                  />
                </div>

                {/* Next Panel (Right) */}
                <div className="absolute right-0 w-1/4 h-full flex items-center justify-center opacity-50 scale-75 transition-all duration-300">
                  {getNextPanel() && (
                    <img
                      src={getPanelImageUrl(getNextPanel())}
                      alt={`Volgend paneel ${getNextPanel()?.number}`}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                      onError={(e) => {
                        console.error(`Failed to load next panel image`)
                      }}
                    />
                  )}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-300 z-20 hover:scale-110"
                  aria-label="Vorig paneel"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-700" />
                </button>
                
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-300 z-20 hover:scale-110"
                  aria-label="Volgend paneel"
                >
                  <ChevronRight className="h-6 w-6 text-gray-700" />
                </button>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Paneel {currentPanel?.number} - {variant === 'met' ? 'Met' : 'Zonder'} overlay
              </h3>
            </div>
          </div>

          {/* Select Panel Button */}
          <div className="text-center">
            <button
              onClick={handleSelectPanel}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
            >
              <Check className="h-5 w-5" />
              <span>Kies dit paneel</span>
            </button>
          </div>

          {/* Ekoline Overview Image */}
        </div>
      </div>

      {/* Ekoline Information Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <img 
              src="/ekoline-panels-overview.png" 
              alt="Ekoline panelen overzicht" 
              className="w-full max-w-6xl mx-auto rounded-lg"
            />
          </div>
          <div className="max-w-4xl mx-auto space-y-6 text-gray-600 text-lg leading-relaxed">
            <p>
              EkoLine-panelen zijn beschikbaar in een versie zonder opleggingen, met INOX-opleggingen en met zwarte 
              opleggingen.
            </p>
            
            <p>
              EkoLine is een esthetische collectie van deurpanelen. De klant krijgt onder meer de mogelijkheid deuren te fabriceren 
              volgens zijn eigen ontwerp, waarbij de beste constructieve oplossingen worden aangehouden.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default EkolineConfigurator
