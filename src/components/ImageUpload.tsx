import React, { useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  currentImage?: string
  folder?: string
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageUploaded, 
  currentImage, 
  folder = 'products' 
}) => {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null)

  const uploadImage = async (file: File) => {
    try {
      setUploading(true)

      // Validate file
      if (!file.type.startsWith('image/')) {
        alert('Alleen afbeeldingen zijn toegestaan')
        return
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Bestand mag maximaal 5MB groot zijn')
        return
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Upload error:', error)
        alert(`Upload fout: ${error.message}`)
        return
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path)

      setPreviewUrl(publicUrl)
      onImageUploaded(publicUrl)
      
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Er ging iets mis bij het uploaden')
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      uploadImage(file)
    }
  }

  const removeImage = () => {
    setPreviewUrl(null)
    onImageUploaded('')
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        {previewUrl ? (
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-w-full max-h-48 mx-auto rounded-lg"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              title="Verwijder afbeelding"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="image-upload"
              onChange={handleFileSelect}
              disabled={uploading}
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <div className="text-gray-600">
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                    <p className="text-sm">Afbeelding uploaden...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm font-medium">Klik om afbeelding te uploaden</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, WebP tot 5MB</p>
                  </>
                )}
              </div>
            </label>
          </>
        )}
      </div>
    </div>
  )
}

export default ImageUpload