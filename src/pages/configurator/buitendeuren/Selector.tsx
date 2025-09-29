import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import modellen from '../../../data/modellen.json'

const BuitendeurenSelector: React.FC = () => {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)

  const buitendeuren = modellen.buitendeuren || []

  const getCurrentDeur = () => {
    return buitendeuren[currentIndex] || null
  }

  const getPreviousDeur = () => {
    if (buitendeuren.length === 0) return null
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : buitendeuren.length - 1
    return buitendeuren[prevIndex] || null
  }

  const getNextDeur = () => {
    if (buitendeuren.length === 0) return null
    const nextIndex = currentIndex < buitendeuren.length - 1 ? currentIndex + 1 : 0
    return buitendeuren[nextIndex] || null
  }

  const handlePrevious = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : buitendeuren.length - 1)
  }

  const handleNext = () => {
    setCurrentIndex(prev => prev < buitendeuren.length - 1 ? prev + 1 : 0)
  }

  const handleSelectDeur = () => {
    const currentDeur = getCurrentDeur()
    if (currentDeur) {
      navigate(`/configurator?selectedModel=${encodeURIComponent(JSON.stringify(currentDeur))}&category=buitendeuren`)
    }
  }

  if (buitendeuren.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Geen buitendeuren beschikbaar</p>
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

  const currentDeur = getCurrentDeur()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Buitendeuren</h1>
            <p className="text-gray-600">Kies uw gewenste buitendeur model</p>
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
          {/* Deur Display */}
          <div className="text-center mb-8">
            <div className="relative w-full max-w-4xl mx-auto h-96 overflow-hidden">
              {/* Carousel Container */}
              <div className="flex items-center justify-center h-full relative">
                {/* Previous Deur (Left) */}
                <div className="absolute left-0 w-1/4 h-full flex items-center justify-center opacity-50 scale-75 transition-all duration-300">
                  {getPreviousDeur() && (
                    <img
                      src={getPreviousDeur()!.afbeelding}
                      alt={`Vorige deur ${getPreviousDeur()!.naam}`}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400'
                      }}
                    />
                  )}
                </div>

                {/* Current Deur (Center) */}
                <div className="w-3/4 h-full flex items-center justify-center z-10">
                  <img
                    src={currentDeur!.afbeelding}
                    alt={currentDeur!.naam}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-xl"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400'
                    }}
                  />
                </div>

                {/* Next Deur (Right) */}
                <div className="absolute right-0 w-1/4 h-full flex items-center justify-center opacity-50 scale-75 transition-all duration-300">
                  {getNextDeur() && (
                    <img
                      src={getNextDeur()!.afbeelding}
                      alt={`Volgende deur ${getNextDeur()!.naam}`}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400'
                      }}
                    />
                  )}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-300 z-20 hover:scale-110"
                  aria-label="Vorige deur"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-700" />
                </button>
                
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-300 z-20 hover:scale-110"
                  aria-label="Volgende deur"
                >
                  <ChevronRight className="h-6 w-6 text-gray-700" />
                </button>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {currentDeur!.naam}
              </h3>
              <p className="text-gray-600 mt-2">
                Type: {currentDeur!.type || 'Buitendeur'}
              </p>
            </div>
          </div>

          {/* Select Deur Button */}
          <div className="text-center">
            <button
              onClick={handleSelectDeur}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
            >
              <Check className="h-5 w-5" />
              <span>Kies deze deur</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuitendeurenSelector