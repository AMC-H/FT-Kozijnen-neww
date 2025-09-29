import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Model {
  naam: string
  afbeelding: string
}

interface ModelCarouselProps {
  models: Model[]
  onSelectModel: (model: Model) => void
}

const ModelCarousel: React.FC<ModelCarouselProps> = ({ models, onSelectModel }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % models.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + models.length) % models.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (!models || models.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Geen modellen beschikbaar voor deze categorie</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Main carousel */}
      <div className="relative overflow-hidden rounded-lg bg-gray-100">
        <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {models.map((model, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 flex items-center justify-center p-8">
                <img
                  src={model.afbeelding}
                  alt={model.naam}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400'
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        {models.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>
          </>
        )}
      </div>

      {/* Model info and select button */}
      <div className="mt-6 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {models[currentIndex]?.naam}
        </h3>
        <button
          onClick={() => onSelectModel(models[currentIndex])}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
        >
          Selecteer dit model
        </button>
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center space-x-2 mt-4">
        {models.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-primary-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default ModelCarousel