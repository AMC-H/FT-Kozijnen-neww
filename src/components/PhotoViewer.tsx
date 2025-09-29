import React, { useState, useEffect } from 'react'
import { Image as ImageIcon, X } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface PhotoViewerProps {
  photoIds: string[]
  className?: string
}

const PhotoViewer: React.FC<PhotoViewerProps> = ({ photoIds, className = '' }) => {
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({})
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getPhotoUrl = async (photoId: string): Promise<string | null> => {
      try {
        // First try to get the photo metadata
        const { data: metadata, error: metadataError } = await supabase
          .from('photo_metadata')
          .select('storage_path')
          .eq('id', photoId)
          .single()
        
        if (metadataError || !metadata) {
          console.error('Error fetching photo metadata:', metadataError)
          // If metadata lookup fails, try using photoId directly as storage path
          const { data } = await supabase.storage
            .from('customer-photos')
            .createSignedUrl(photoId, 3600)
          return data?.signedUrl || null
        }
        
        // Use storage_path from metadata
        const { data } = await supabase.storage
          .from('customer-photos')
          .createSignedUrl(metadata.storage_path, 3600)
        
        return data?.signedUrl || null
      } catch (error) {
        console.error('Error getting photo URL:', error)
        return null
      }
    }

    const loadPhotoUrls = async () => {
      setLoading(true)
      const urls: Record<string, string> = {}
      
      for (const photoId of photoIds) {
        const url = await getPhotoUrl(photoId)
        if (url) {
          urls[photoId] = url
        }
      }
      
      setPhotoUrls(urls)
      setLoading(false)
    }

    if (photoIds.length > 0) {
      loadPhotoUrls()
    } else {
      setLoading(false)
    }
  }, [photoIds])

  console.log('PhotoViewer - photoIds:', photoIds)
  console.log('PhotoViewer - photoUrls:', photoUrls)

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (photoIds.length === 0) {
    return (
      <div className={`text-center text-gray-500 p-4 ${className}`}>
        <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm">Geen foto's beschikbaar</p>
      </div>
    )
  }

  return (
    <>
      <div className={`grid grid-cols-2 md:grid-cols-3 gap-2 ${className}`}>
        {photoIds.map((photoId) => (
          <div key={photoId} className="relative group cursor-pointer">
            <div 
              className="aspect-square bg-gray-100 rounded-lg overflow-hidden hover:opacity-75 transition-opacity"
              onClick={() => setSelectedPhoto(photoUrls[photoId] || null)}
            >
              {photoUrls[photoId] ? (
                <img
                  src={photoUrls[photoId]}
                  alt="Kozijn foto"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors z-10"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={selectedPhoto}
              alt="Kozijn foto (groot)"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  )
}

export default PhotoViewer