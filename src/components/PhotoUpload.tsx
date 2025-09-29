import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Upload, X, ImageIcon } from 'lucide-react';

interface PhotoUploadProps {
  userId: string;
  onPhotosUploaded: (photoIds: string[]) => void;
  existingPhotoIds?: string[];
  maxFiles?: number;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ userId, onPhotosUploaded, existingPhotoIds = [], maxFiles = 5 }) => {
  const [uploading, setUploading] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});
  const [currentPhotoIds, setCurrentPhotoIds] = useState<string[]>(existingPhotoIds);

  // Update currentPhotoIds when existingPhotoIds changes
  useEffect(() => {
    setCurrentPhotoIds(existingPhotoIds);
  }, [existingPhotoIds]);

  const sanitizeFilename = (filename: string): string => {
    return filename
      .replace(/[\s\u00AD]+/g, '-') // Replace spaces and soft hyphens with hyphens
      .replace(/[^a-zA-Z0-9.-]/g, '') // Remove any other non-alphanumeric characters except dots and hyphens
      .replace(/-+/g, '-') // Replace multiple consecutive hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  };

  const getPhotoUrl = async (path: string) => {
    const { data, error } = await supabase.storage
      .from('customer-photos')
      .createSignedUrl(path, 3600) // 1 hour expiry
    
    if (error) {
      console.error('Error creating signed URL:', error)
      return null
    }
    
    return data?.signedUrl || null
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    if (currentPhotoIds.length + files.length > maxFiles) {
      alert(`U kunt maximaal ${maxFiles} foto's uploaden.`)
      return
    }

    setUploading(true)

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const sanitizedFilename = sanitizeFilename(file.name)
        const filePath = `${userId}/${Date.now()}-${sanitizedFilename}`
        
        // Upload file to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('customer-photos')
          .upload(filePath, file)
        
        if (uploadError) {
          throw new Error(`Upload mislukt: ${uploadError.message}`)
        }
        
        // Save metadata to database
        const { data: metadataData, error: metadataError } = await supabase
          .from('photo_metadata')
          .insert([
            {
              user_id: userId,
              filename: filePath,
              original_name: file.name,
              file_size: file.size,
              mime_type: file.type,
              storage_path: uploadData.path
            }
          ])
          .select()
          .single()
        
        if (metadataError) {
          throw new Error(`Metadata opslaan mislukt: ${metadataError.message}`)
        }
        
        return metadataData.id // Return metadata ID instead of file path
      })

      const uploadedIds = await Promise.all(uploadPromises)
      const newPhotoIds = [...currentPhotoIds, ...uploadedIds]
      setCurrentPhotoIds(newPhotoIds)
      onPhotosUploaded(newPhotoIds)

    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : 'Er ging iets onbekends mis.')
    } finally {
      setUploading(false)
    }

    event.target.value = '' // Reset file input
  }

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('Weet u zeker dat u deze foto wilt verwijderen?')) return

    // Get photo metadata first
    const { data: metadata, error: fetchError } = await supabase
      .from('photo_metadata')
      .select('storage_path')
      .eq('id', photoId)
      .single()
    
    if (fetchError || !metadata) {
      alert('Fout bij het ophalen van foto informatie')
      return
    }
    
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('customer-photos')
      .remove([metadata.storage_path])
    
    if (storageError) {
      alert(`Verwijderen uit storage mislukt: ${storageError.message}`)
      return
    }
    
    // Delete metadata from database
    const { error: dbError } = await supabase
      .from('photo_metadata')
      .delete()
      .eq('id', photoId)

    if (dbError) {
      alert(`Verwijderen uit database mislukt: ${dbError.message}`)
    } else {
      const newPhotoIds = currentPhotoIds.filter(id => id !== photoId)
      setCurrentPhotoIds(newPhotoIds)
      onPhotosUploaded(newPhotoIds)
    }
  }

  // Effect to load URLs when photo IDs change
  useEffect(() => {
    const loadUrls = async () => {
      const urlPromises = currentPhotoIds.map(async (photoId) => {
        try {
          // Get metadata first
          const { data: metadata, error: metadataError } = await supabase
            .from('photo_metadata')
            .select('storage_path')
            .eq('id', photoId)
            .single()
          
          if (metadataError || !metadata) {
            console.error('Error fetching photo metadata:', metadataError)
            return { id: photoId, url: null }
          }
          
          // Get signed URL
          const url = await getPhotoUrl(metadata.storage_path)
          return { id: photoId, url }
        } catch (error) {
          console.error('Error loading photo URL:', error)
          return { id: photoId, url: null }
        }
      })
      
      const results = await Promise.all(urlPromises)
      const newUrls: Record<string, string> = {}
      results.forEach(result => {
        if (result.url) {
          newUrls[result.id] = result.url
        }
      })
      setPhotoUrls(newUrls)
    }
    
    if (currentPhotoIds.length) {
      loadUrls()
    }
  }, [currentPhotoIds])


  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          id="photo-upload"
          onChange={handleFileSelect}
          disabled={uploading || currentPhotoIds.length >= maxFiles}
        />
        <label htmlFor="photo-upload" className="cursor-pointer">
          <div className="text-gray-600">
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                <p className="text-sm">Foto's uploaden...</p>
              </div>
            ) : (
              <>
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p className="text-sm font-medium">
                  {currentPhotoIds.length >= maxFiles
                    ? `Maximum aantal foto's bereikt (${maxFiles})`
                    : 'Klik om foto\'s te uploaden'
                  }
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG tot 5MB • {currentPhotoIds.length}/{maxFiles} foto's
                </p>
              </>
            )}
          </div>
        </label>
      </div>

      {currentPhotoIds.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {currentPhotoIds.map((photoId) => (
            <div key={photoId} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                {photoUrls[photoId] ? (
                  <img src={photoUrls[photoId]} alt="Uploaded" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <button
                onClick={() => handleDeletePhoto(photoId)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="Foto verwijderen"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;