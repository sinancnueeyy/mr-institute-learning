import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from './config';

export const storage = getStorage(app);

export const StorageService = {
  uploadFile: async (
    file: File, 
    path: string, 
    onProgress?: (progress: number) => void
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Create a unique filename to prevent overwrites
      const uniqueFilename = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `${path}/${uniqueFilename}`);
      
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (onProgress) {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          }
        },
        (error) => {
          console.error('Storage upload error:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  },

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
