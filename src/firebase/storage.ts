import { auth } from './auth';

// Define the StorageService object with exactly the same shape as before
export const StorageService = {
  uploadFile: async (
    file: File, 
    _path: string, // Kept for interface compatibility, but the API now dictates the secure path
    onProgress?: (progress: number) => void
  ): Promise<string> => {
    try {
      // 1. Get current user's token
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated. Please log in again.');
      }
      
      const token = await user.getIdToken();

      // 2. Request signed upload URL from Vercel API
      const res = await fetch('/api/storage/upload-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          size: file.size
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to get upload URL: ${res.statusText}`);
      }

      const { signedUrl, publicUrl } = await res.json();

      if (!signedUrl || !publicUrl) {
        throw new Error('Invalid response from upload API');
      }

      // 3. Upload file directly to Supabase via XMLHttpRequest to track progress
      const uploadRes = await new Promise<XMLHttpRequest>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', signedUrl, true);
        
        // Supabase signed URLs usually work best with the content type they were signed for (or without it, but setting it explicitly is safe).
        xhr.setRequestHeader('Content-Type', file.type);

        if (onProgress) {
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              onProgress((event.loaded / event.total) * 100);
            }
          };
        }

        xhr.onload = () => resolve(xhr);
        xhr.onerror = () => reject(new Error('Network error during file upload'));
        
        xhr.send(file);
      });

      if (uploadRes.status < 200 || uploadRes.status >= 300) {
        throw new Error(`Upload failed with status: ${uploadRes.status}`);
      }

      // 4. Return the public URL for Firestore to save
      return publicUrl;
      
    } catch (error) {
      console.error('Storage upload error:', error);
      throw error;
    }
  },

  // Legacy wrappers are maintained for compatibility but now ignore the provided path
  uploadApplicationDocument: async (file: File, applicationId: string, onProgress?: (progress: number) => void): Promise<string> => {
    return StorageService.uploadFile(file, `documents/applications/${applicationId}`, onProgress);
  },

  uploadScholarshipDocument: async (file: File, scholarshipId: string, onProgress?: (progress: number) => void): Promise<string> => {
    return StorageService.uploadFile(file, `documents/scholarships/${scholarshipId}`, onProgress);
  },

  uploadStudentDocument: async (file: File, studentId: string, onProgress?: (progress: number) => void): Promise<string> => {
    return StorageService.uploadFile(file, `documents/students/${studentId}`, onProgress);
  }
};
