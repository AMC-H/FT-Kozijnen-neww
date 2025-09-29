// src/pages/configurator/Despiro/Selector.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'
import { ArrowLeft, ChevronLeft, ChevronRight, Check } from 'lucide-react'

type Row = { 
  slug: string; 
  naam: string; 
  image_path: string | null;
  design_kenmerk: string | null;
  beglazing_standaard: string | null;
}

// Define storageUrl outside the component to avoid re-creation on re-renders
const storageUrl = (relPath: string) => {
  const baseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!baseUrl) {
    console.error('ERROR: VITE_SUPABASE_URL is not defined in DespiroSelector.tsx');
    // Fallback to a generic placeholder or handle this error more gracefully
    return ''; 
  }
  return `${baseUrl}/storage/v1/object/public/${relPath}`;
}

export default function DespiroSelector(){
  const nav = useNavigate()
  const [items, setItems] = useState<Array<{
    slug: string;
    naam: string;
    imageUrl: string;
    design_kenmerk: string | null;
    beglazing_standaard: string | null;
  }>>([])
  const [i, setI] = useState(0)
  const [loading, setLoading] = useState(true); // Add loading state
  const [fetchError, setFetchError] = useState<string | null>(null); // Add error state

  useEffect(() => {
    (async () => {
      console.log('DEBUG: VITE_SUPABASE_URL in DespiroSelector:', import.meta.env.VITE_SUPABASE_URL); // Verify env var
      console.log('DEBUG: Fetching despiro_panelen from Supabase...');
      
      setLoading(true); // Set loading to true at the start of fetch
      setFetchError(null); // Clear previous errors

      const { data, error } = await supabase
        .from('despiro_panelen')
        .select('slug,naam,image_path,design_kenmerk,beglazing_standaard')
        .order('naam')
      
      if (error) {
        console.error('ERROR: Error fetching despiro_panelen:', error);
        setFetchError(`Fout bij het laden van panelen: ${error.message}`);
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        console.log('DEBUG: No data returned from despiro_panelen query or data is empty.');
        setFetchError('Geen Despiro panelen gevonden in de database.');
        setLoading(false);
        return;
      }
      
      console.log('DEBUG: Raw data from despiro_panelen:', data);
      console.log('DEBUG: Number of panels found:', data.length);
      
      const list = data.map((r: Row) => {
        let imagePath = r.image_path || 'kozijnen-photos/placeholder.jpg';
        
        const imageUrl = storageUrl(imagePath);
        console.log(`DEBUG: Panel ${r.naam}, image_path: ${r.image_path}, generated imageUrl: ${imageUrl}`);
        return {
          slug: r.slug,
          naam: r.naam,
          imageUrl: imageUrl,
          design_kenmerk: r.design_kenmerk,
          beglazing_standaard: r.beglazing_standaard
        }
      })
      
      setItems(list)
      console.log('DEBUG: Items state updated, total items:', list.length);
      setLoading(false);
    })()
  }, [])

  const prev = () => setI(v => v > 0 ? v - 1 : items.length - 1)
  const next = () => setI(v => v < items.length - 1 ? v + 1 : 0)
  const cur = items[i]

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div><p className="text-gray-600">Laden…</p></div></div>;
  }

  if (fetchError) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><p className="text-red-600 mb-4">{fetchError}</p><button onClick={() => nav('/configurator')} className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">Terug naar configurator</button></div></div>;
  }

  if (!cur) { // This case should now be covered by fetchError if items is empty
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><p className="text-gray-600 mb-4">Geen panelen beschikbaar.</p><button onClick={() => nav('/configurator')} className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">Terug naar configurator</button></div></div>;
  }
  
  console.log('DEBUG: Current panel:', cur);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Despiro Panelen</h1>
            <p className="text-gray-600">Kies uw gewenste paneel design</p>
          </div>
          <button
            onClick={() => nav('/configurator')}
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
                  {items[i > 0 ? i - 1 : items.length - 1] && (
                    <img
                      src={items[i > 0 ? i - 1 : items.length - 1].imageUrl}
                      alt={items[i > 0 ? i - 1 : items.length - 1].naam}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                      onError={(e) => {
                        console.error(`ERROR: Failed to load image for previous panel ${items[i > 0 ? i - 1 : items.length - 1].naam}: ${e.currentTarget.src}`);
                        if (!e.currentTarget.src.startsWith('data:image/svg+xml')) {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                        }
                      }}
                    />
                  )}
                </div>

                {/* Current Panel (Center) */}
                <div className="w-3/4 h-full flex items-center justify-center z-10">
                  <img
                    src={cur.imageUrl}
                    alt={cur.naam}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-xl"
                    onError={(e) => {
                      console.error(`ERROR: Failed to load image for current panel ${cur.naam}: ${e.currentTarget.src}`);
                      if (!e.currentTarget.src.startsWith('data:image/svg+xml')) {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                      }
                    }}
                  />
                </div>

                {/* Next Panel (Right) */}
                <div className="absolute right-0 w-1/4 h-full flex items-center justify-center opacity-50 scale-75 transition-all duration-300">
                  {items[i < items.length - 1 ? i + 1 : 0] && (
                    <img
                      src={items[i < items.length - 1 ? i + 1 : 0].imageUrl}
                      alt={items[i < items.length - 1 ? i + 1 : 0].naam}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                      onError={(e) => {
                        console.error(`ERROR: Failed to load image for next panel ${items[i < items.length - 1 ? i + 1 : 0].naam}: ${e.currentTarget.src}`);
                        if (!e.currentTarget.src.startsWith('data:image/svg+xml')) {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                        }
                      }}
                    />
                  )}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={prev}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-300 z-20 hover:scale-110"
                  aria-label="Vorig paneel"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-700" />
                </button>
                
                <button
                  onClick={next}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all duration-300 z-20 hover:scale-110"
                  aria-label="Volgend paneel"
                >
                  <ChevronRight className="h-6 w-6 text-gray-700" />
                </button>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {cur.naam}
              </h3>
              {/* Display new fields from despiro_panelen */}
              <div className="mt-2 text-sm text-gray-600 space-y-1">
                {cur.design_kenmerk && (
                  <div>• Design: {cur.design_kenmerk}</div>
                )}
                {cur.beglazing_standaard && (
                  <div>• Standaard Beglazing: {cur.beglazing_standaard}</div>
                )}
              </div>
            </div>
          </div>

          {/* Select Panel Button */}
          <div className="text-center">
            <button
              onClick={() => nav(`/configurator?despiroPanelSlug=${cur.slug}`)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
            >
              <Check className="h-5 w-5" />
              <span>Kies dit paneel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}