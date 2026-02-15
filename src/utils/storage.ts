
import { supabase } from '@/integrations/supabase/client';

export const uploadImageToStorage = async (file: File, bucket: string, path: string) => {
  try {
    // Try to upload the file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      // If bucket doesn't exist, create it
      if (uploadError.message.includes('Bucket not found')) {
        const { error: bucketError } = await supabase.storage.createBucket(bucket, {
          public: true
        });
        
        if (bucketError) {
          throw bucketError;
        }
        
        // Retry upload after creating bucket
        const { data: retryData, error: retryError } = await supabase.storage
          .from(bucket)
          .upload(path, file, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (retryError) {
          throw retryError;
        }
        
        return retryData;
      }
      throw uploadError;
    }

    return uploadData;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

export const deleteImage = async (bucket: string, path: string) => {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) {
    throw error;
  }
};
