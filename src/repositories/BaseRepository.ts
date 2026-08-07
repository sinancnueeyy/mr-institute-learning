import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  type DocumentData,
  QueryConstraint,
  writeBatch,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/firestore';
import { type PaginationParams, type QueryFilter, type RepositoryResponse, type RepositoryListResponse, type AppError } from '../types';

export class BaseRepository<T extends { id?: string }> {
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  protected getCollectionRef() {
    return collection(db, this.collectionName);
  }

  protected getDocRef(id: string) {
    return doc(db, this.collectionName, id);
  }

  protected handleError(error: any): AppError {
    console.error(`[Repository Error - ${this.collectionName}]:`, error);
    return {
      code: error.code || 'unknown',
      message: error.message || 'An unknown error occurred.',
      details: error
    };
  }

  async getById(id: string): Promise<RepositoryResponse<T>> {
    try {
      const docSnap = await getDoc(this.getDocRef(id));
      if (docSnap.exists()) {
        return { data: { id: docSnap.id, ...docSnap.data() } as T };
      }
      return { data: null, error: { code: 'not-found', message: 'Document not found' } };
    } catch (error) {
      return { data: null, error: this.handleError(error) };
    }
  }

  async create(data: Omit<T, 'id'>, customId?: string): Promise<RepositoryResponse<T>> {
    try {
      const ref = customId ? this.getDocRef(customId) : doc(this.getCollectionRef());
      const id = ref.id;
      const payload = { ...data, id, createdAt: Date.now(), updatedAt: Date.now() };
      await setDoc(ref, payload);
      return { data: payload as unknown as T };
    } catch (error) {
      return { data: null, error: this.handleError(error) };
    }
  }

  async update(id: string, data: Partial<T>): Promise<RepositoryResponse<T>> {
    try {
      const payload = { ...data, updatedAt: Date.now() };
      await updateDoc(this.getDocRef(id), payload as DocumentData);
      return this.getById(id);
    } catch (error) {
      return { data: null, error: this.handleError(error) };
    }
  }

  async delete(id: string): Promise<RepositoryResponse<boolean>> {
    try {
      await deleteDoc(this.getDocRef(id));
      return { data: true };
    } catch (error) {
      return { data: null, error: this.handleError(error) };
    }
  }

  async query(
    filters: QueryFilter[] = [], 
    pagination?: PaginationParams
  ): Promise<RepositoryListResponse<T>> {
    try {
      const constraints: QueryConstraint[] = [];

      filters.forEach(f => constraints.push(where(f.field, f.operator, f.value)));
      
      if (pagination?.orderBy) {
        constraints.push(orderBy(pagination.orderBy, pagination.direction || 'asc'));
      }

      if (pagination?.limit) {
        constraints.push(limit(pagination.limit));
      }

      if (pagination?.lastDocId) {
        const lastDocSnap = await getDoc(this.getDocRef(pagination.lastDocId));
        if (lastDocSnap.exists()) {
          constraints.push(startAfter(lastDocSnap));
        }
      }

      const q = query(this.getCollectionRef(), ...constraints);
      const snapshot = await getDocs(q);
      
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
      const lastDoc = snapshot.docs[snapshot.docs.length - 1];

      return {
        data,
        lastDocId: lastDoc?.id,
        hasMore: pagination?.limit ? data.length === pagination.limit : false
      };
    } catch (error) {
      return { data: [], hasMore: false, error: this.handleError(error) };
    }
  }

  async getAll(): Promise<RepositoryListResponse<T>> {
    try {
      const q = query(this.getCollectionRef());
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
      return {
        data,
        hasMore: false
      };
    } catch (error) {
      return { data: [], hasMore: false, error: this.handleError(error) };
    }
  }

  // Real-time listener
  listen(id: string, callback: (data: T | null, error?: AppError) => void): () => void {
    return onSnapshot(
      this.getDocRef(id),
      (doc) => {
        if (doc.exists()) {
          callback({ id: doc.id, ...doc.data() } as T);
        } else {
          callback(null, { code: 'not-found', message: 'Document not found' });
        }
      },
      (error) => {
        callback(null, this.handleError(error));
      }
    );
  }

  // Real-time collection listener
  listenAll(callback: (data: T[], error?: AppError) => void): () => void {
    return onSnapshot(
      this.getCollectionRef(),
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
        callback(data);
      },
      (error) => {
        callback([], this.handleError(error));
      }
    );
  }

  // Batch operations
  async batchCreate(items: Omit<T, 'id'>[]): Promise<RepositoryResponse<boolean>> {
    try {
      const batch = writeBatch(db);
      items.forEach(item => {
        const ref = doc(this.getCollectionRef());
        batch.set(ref, { ...item, id: ref.id, createdAt: Date.now(), updatedAt: Date.now() });
      });
      await batch.commit();
      return { data: true };
    } catch (error) {
      return { data: null, error: this.handleError(error) };
    }
  }
}
