import { supabase } from '../supabase/client';

export const BUCKET_MEDIA = 'mr-institute-media';
export const BUCKET_DOCUMENTS = 'mr-institute-documents';

export interface BucketPathResolution {
  bucket: string;
  storagePath: string;
}

/**
 * Resolves the appropriate Supabase bucket and internal storage path based on file path conventions.
 */
export function resolveBucketAndPath(path: string, fileName?: string): BucketPathResolution {
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  let bucket = BUCKET_MEDIA;
  let storagePath = cleanPath;

  if (cleanPath.startsWith('documents/')) {
    bucket = BUCKET_DOCUMENTS;
    storagePath = cleanPath.replace(/^documents\//, '');
  } else if (cleanPath.startsWith(`${BUCKET_DOCUMENTS}/`)) {
    bucket = BUCKET_DOCUMENTS;
    storagePath = cleanPath.replace(new RegExp(`^${BUCKET_DOCUMENTS}/`), '');
  } else if (cleanPath.startsWith(`${BUCKET_MEDIA}/`)) {
    bucket = BUCKET_MEDIA;
    storagePath = cleanPath.replace(new RegExp(`^${BUCKET_MEDIA}/`), '');
  } else if (cleanPath.startsWith('media/') || cleanPath.startsWith('cms/')) {
    bucket = BUCKET_MEDIA;
    storagePath = cleanPath;
  } else if (
    cleanPath.includes('document') || 
    cleanPath.includes('submission') || 
    cleanPath.includes('application') ||
    cleanPath.includes('scholarship') ||
    cleanPath.includes('student')
  ) {
    bucket = BUCKET_DOCUMENTS;
    storagePath = cleanPath;
  }

  // Ensure documents bucket paths are nested under submissions/ to satisfy RLS storage policy
  if (bucket === BUCKET_DOCUMENTS && !storagePath.startsWith('submissions/')) {
    storagePath = `submissions/${storagePath}`;
  }

  // Ensure storagePath contains filename if it was passed separately
  if (fileName && !storagePath.endsWith(fileName) && !storagePath.match(/\.[a-zA-Z0-9]+$/)) {
    storagePath = `${storagePath}/${fileName}`;
  }

  return { bucket, storagePath };
}

/**
 * Parses a Supabase storage URL back into its bucket and storage path.
 */
export function parseStorageUrl(url: string): BucketPathResolution | null {
  try {
    const match = url.match(/\/storage\/v1\/object\/(?:public|sign)\/([^/?#]+)\/([^?#]+)/);
    if (match) {
      return {
        bucket: match[1],
        storagePath: decodeURIComponent(match[2])
      };
    }
  } catch {
    // Ignore parse error
  }
  return null;
}

export const StorageService = {
  /**
   * Uploads a file to the appropriate Supabase Storage bucket and returns a direct HTTPS URL.
   */
  uploadFile: async (
    file: File | Blob,
    path: string,
    onProgress?: (progress: number) => void
  ): Promise<string> => {
    try {
      if (onProgress) onProgress(15);

      const fileName = (file as any).name || 'upload';
      const { bucket, storagePath } = resolveBucketAndPath(path, fileName);
      const contentType = file.type || 'application/octet-stream';

      if (onProgress) onProgress(45);

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(storagePath, file, {
          contentType,
          upsert: false
        });

      if (error) {
        throw new Error(`Upload to ${bucket}/${storagePath} failed: ${error.message}`);
      }

      if (onProgress) onProgress(85);

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data ? data.path : storagePath);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error('Failed to retrieve URL from Supabase storage.');
      }

      if (onProgress) onProgress(100);

      return publicUrlData.publicUrl;
    } catch (error: any) {
      console.error('[StorageService Upload Error]:', error);
      throw error;
    }
  },

  /**
   * Helper to upload application documents into the documents bucket.
   */
  uploadApplicationDocument: async (
    file: File,
    applicationId: string,
    onProgress?: (progress: number) => void
  ): Promise<string> => {
    return StorageService.uploadFile(file, `documents/submissions/applications/${applicationId}/${file.name}`, onProgress);
  },

  /**
   * Helper to upload scholarship documents into the documents bucket.
   */
  uploadScholarshipDocument: async (
    file: File,
    scholarshipId: string,
    onProgress?: (progress: number) => void
  ): Promise<string> => {
    return StorageService.uploadFile(file, `documents/submissions/scholarships/${scholarshipId}/${file.name}`, onProgress);
  },

  /**
   * Helper to upload student records into the documents bucket.
   */
  uploadStudentDocument: async (
    file: File,
    studentId: string,
    onProgress?: (progress: number) => void
  ): Promise<string> => {
    return StorageService.uploadFile(file, `documents/submissions/students/${studentId}/${file.name}`, onProgress);
  },

  /**
   * Generates a signed URL for secure document access by staff.
   */
  getSignedDocumentUrl: async (
    pathOrUrl: string,
    expiresInSeconds: number = 3600
  ): Promise<string | null> => {
    try {
      if (!pathOrUrl) return null;
      let bucket = BUCKET_DOCUMENTS;
      let storagePath = pathOrUrl;

      const parsed = parseStorageUrl(pathOrUrl);
      if (parsed) {
        bucket = parsed.bucket;
        storagePath = parsed.storagePath;
      } else {
        const resolved = resolveBucketAndPath(pathOrUrl);
        bucket = resolved.bucket;
        storagePath = resolved.storagePath;
      }

      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(storagePath, expiresInSeconds);

      if (error || !data) {
        console.error('Failed to create signed URL:', error?.message);
        return null;
      }

      return data.signedUrl;
    } catch (error) {
      console.error('Error creating signed URL:', error);
      return null;
    }
  },

  /**
   * Deletes a file from Supabase Storage given a URL or relative path.
   */
  deleteFile: async (pathOrUrl: string): Promise<boolean> => {
    try {
      let bucket = BUCKET_MEDIA;
      let storagePath = pathOrUrl;

      const parsed = parseStorageUrl(pathOrUrl);
      if (parsed) {
        bucket = parsed.bucket;
        storagePath = parsed.storagePath;
      } else {
        const resolved = resolveBucketAndPath(pathOrUrl);
        bucket = resolved.bucket;
        storagePath = resolved.storagePath;
      }

      const { error } = await supabase.storage
        .from(bucket)
        .remove([storagePath]);

      if (error) {
        console.error(`Failed to delete ${bucket}/${storagePath}:`, error.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error('[StorageService Delete Error]:', error);
      return false;
    }
  }
};
