import { supabase } from './supabase'

export interface PhotoUploadResult {
  success: boolean
  photoIds?: string[]
  error?: string
}

export const uploadPhotos = async (files: FileList, userId: string, quoteId?: string): Promise<PhotoUploadResult> => {
  try {
    // First, let's check if the bucket exists and is accessible
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError)
      return { 
        success: false, 
        error: `Storage toegang fout: ${bucketsError.message}` 
      }
    }
    
    const customerBucket = buckets?.find(bucket => bucket.name === 'customer-photos')
    if (!customerBucket) {
      return { 
        success: false, 
        error: `Storage bucket "customer-photos" niet gevonden. Maak deze bucket aan in uw Supabase Dashboard.`
      }
    }
    
    const photoIds: string[] = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Validate file
      if (!file.type.startsWith('image/')) {
        return { success: false, error: 'Alleen afbeeldingen zijn toegestaan' }
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        return { success: false, error: 'Bestanden mogen maximaal 5MB groot zijn' }
      }
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('customer-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (uploadError) {
        console.error('Upload error:', uploadError)
        console.error('Upload error details:', {
          message: uploadError.message,
          statusCode: uploadError.statusCode,
          error: uploadError.error
        })
        
        // Check if it's a bucket not found error
        if (uploadError.message?.includes('Bucket not found') || 
            uploadError.message?.includes('bucket does not exist') ||
            uploadError.message?.includes('The resource you requested does not exist')) {
          return { 
            success: false, 
            error: `Storage bucket "customer-photos" niet toegankelijk. Controleer of de bucket bestaat en publiek is ingesteld. Error: ${uploadError.message}` 
          }
        }
        
        return { success: false, error: `Upload fout: ${uploadError.message}` }
      }
      
      // Save metadata to database
      const { data: metadataData, error: metadataError } = await supabase
        .from('photo_metadata')
        .insert([
          {
            user_id: userId,
            quote_id: quoteId || null,
            filename: fileName,
            original_name: file.name,
            file_size: file.size,
            mime_type: file.type,
            storage_path: uploadData.path
          }
        ])
        .select()
        .single()
      
      if (metadataError) {
        console.error('Metadata error:', metadataError)
        // Try to clean up uploaded file
        await supabase.storage.from('customer-photos').remove([fileName])
        return { success: false, error: `Database fout: ${metadataError.message}` }
      }
      
      photoIds.push(metadataData.id)
    }
    
    return { success: true, photoIds }
  } catch (error) {
    console.error('Photo upload error:', error)
    return { success: false, error: 'Er ging iets mis bij het uploaden van de foto\'s' }
  }
}

export const getPhotoUrl = async (photoId: string): Promise<string | null> => {
  try {
    // First get the metadata to find the storage path
    const { data: metadata, error: metadataError } = await supabase
      .from('photo_metadata')
      .select('storage_path')
      .eq('id', photoId)
      .single()
    
    if (metadataError || !metadata) {
      console.error('Error fetching photo metadata:', metadataError)
      // Fallback: try using photoId directly as storage path
      const { data } = await supabase.storage
        .from('customer-photos')
        .createSignedUrl(photoId, 3600)
      return data?.signedUrl || null
    }
    
    // Use storage_path from metadata
    const { data, error } = await supabase.storage
      .from('customer-photos')
      .createSignedUrl(metadata.storage_path, 3600)
    
    if (error) {
      console.error('Error creating signed URL:', error)
      return null
    }
    
    return data?.signedUrl || null
  } catch (error) {
    console.error('Error getting photo URL:', error)
    return null
  }
}

export const deletePhoto = async (photoId: string): Promise<boolean> => {
  try {
    // Get photo metadata first
    const { data: metadata, error: fetchError } = await supabase
      .from('photo_metadata')
      .select('storage_path')
      .eq('id', photoId)
      .single()
    
    if (fetchError || !metadata) {
      console.error('Error fetching photo metadata:', fetchError)
      return false
    }
    
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('customer-photos')
      .remove([metadata.storage_path])
    
    if (storageError) {
      console.error('Error deleting from storage:', storageError)
      return false
    }
    
    // Delete metadata from database
    const { error: dbError } = await supabase
      .from('photo_metadata')
      .delete()
      .eq('id', photoId)
    
    if (dbError) {
      console.error('Error deleting photo metadata:', dbError)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error deleting photo:', error)
    return false
  }
}
export const storageUrl = (relPath: string) =>
  `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${relPath}`;
}