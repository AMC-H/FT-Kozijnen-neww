import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, Check } from 'lucide-react'

const EkoVitreSelector: React.FC = () => {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)

  const panels = Array.from({ length: 15 }, (_, i) => {
    const number = (i + 1).toString().padStart(2, '0')
    return {
      number,
      imageUrl: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/kozijnen-photos/EkoVitre-glaspanelen-${number}-k.jpg`
    }
  })

  const getCurrentPanel = () => {
    return panels[currentIndex] || null
  }

  const getPreviousPanel = () => {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : panels.length - 1
    return panels[prevIndex] || null
  }

  const getNextPanel = () => {
    const nextIndex = currentIndex < panels.length - 1 ? currentIndex + 1 : 0
    return panels[nextIndex] || null
  }

  const handlePrevious = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : panels.length - 1)
  }

  const handleNext = () => {
    setCurrentIndex(prev => prev < panels.length - 1 ? prev + 1 : 0)
  }

  const handleSelectPanel = () => {
    const currentPanel = getCurrentPanel()
    if (currentPanel) {
      navigate(`/configurator?ekovitrePanel=${currentPanel.number}`)
    }
  }

  const currentPanel = getCurrentPanel()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">EkoVitre Glaspanelen</h1>
            <p className="text-gray-600">Kies uw gewenste glaspaneel design</p>
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
          {/* Panel Display */}
          <div className="text-center mb-8">
            <div className="relative w-full max-w-4xl mx-auto h-96 overflow-hidden">
              {/* Carousel Container */}
              <div className="flex items-center justify-center h-full relative">
                {/* Previous Panel (Left) */}
                <div className="absolute left-0 w-1/4 h-full flex items-center justify-center opacity-50 scale-75 transition-all duration-300">
                  {getPreviousPanel() && (
                    <img
                      src={getPreviousPanel()!.imageUrl}
                      alt={`Vorig paneel ${getPreviousPanel()!.number}`}
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
                    src={currentPanel!.imageUrl}
                    alt={`EkoVitre glaspaneel ${currentPanel!.number}`}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-xl"
                    onError={(e) => {
                      console.error(`Failed to load image for panel ${currentPanel!.number}`)
                    }}
                  />
                </div>

                {/* Next Panel (Right) */}
                <div className="absolute right-0 w-1/4 h-full flex items-center justify-center opacity-50 scale-75 transition-all duration-300">
                  {getNextPanel() && (
                    <img
                      src={getNextPanel()!.imageUrl}
                      alt={`Volgend paneel ${getNextPanel()!.number}`}
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
                Paneel {currentPanel!.number} - EkoVitre Glaspaneel
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
        </div>

        {/* EkoVitre Information Section */}
      </div>
      
      {/* EkoVitre Information Section - Full Width */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-gray-600 leading-relaxed">
              Eko Vitre is niet alleen stijlvol, maar ook veilig en zeer energiezuinig. De panelen zijn gemaakt van twee bladen VSG-glas, waarvan er één een gezandstraald patroon heeft.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default EkoVitreSelector