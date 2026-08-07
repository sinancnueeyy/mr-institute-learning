import { requestNotificationPermission, onForegroundMessage } from '../firebase/messaging';
import { db } from '../firebase/firestore';
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc } from 'firebase/firestore';

export const NotificationService = {
  async registerDevice(userId: string) {
    try {
      const token = await requestNotificationPermission();
      if (!token) return false;

      // Check if token already exists for this user
      const tokensRef = collection(db, 'deviceTokens');
      const q = query(tokensRef, where('token', '==', token), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await addDoc(tokensRef, {
          token,
          userId,
          platform: 'web',
          createdAt: serverTimestamp(),
          lastActive: serverTimestamp()
        });
      } else {
        // Update last active
        await updateDoc(querySnapshot.docs[0].ref, {
          lastActive: serverTimestamp()
        });
      }
      return true;
    } catch (error) {
      console.error('Failed to register device for push notifications', error);
      return false;
    }
  },

  listenForMessages(onMessageReceived: (payload: any) => void) {
    onForegroundMessage((payload) => {
      onMessageReceived(payload);
    });
  }
};
