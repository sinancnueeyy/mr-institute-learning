export interface PendingSubmission {
  id: string;
  repository: string;
  payload: any;
  timestamp: number;
}

export const OfflineQueue = {
  QUEUE_KEY: 'mr_institute_offline_queue',

  getQueue(): PendingSubmission[] {
    try {
      const stored = localStorage.getItem(this.QUEUE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  enqueue(repository: string, payload: any) {
    const queue = this.getQueue();
    const item: PendingSubmission = {
      id: `pending-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      repository,
      payload,
      timestamp: Date.now()
    };
    queue.push(item);
    localStorage.setItem(this.QUEUE_KEY, JSON.stringify(queue));
    return item;
  },

  clearQueue() {
    localStorage.removeItem(this.QUEUE_KEY);
  },

  dequeue(id: string) {
    const queue = this.getQueue();
    const newQueue = queue.filter(item => item.id !== id);
    localStorage.setItem(this.QUEUE_KEY, JSON.stringify(newQueue));
  },

  async syncWithServer(repositoriesMap: Record<string, any>) {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return;
    }

    const queue = this.getQueue();
    if (queue.length === 0) return;

    console.log(`[OfflineSync] Attempting to sync ${queue.length} pending items...`);
    for (const item of queue) {
      const repo = repositoriesMap[item.repository];
      if (repo) {
        try {
          await repo.create(item.payload);
          this.dequeue(item.id);
          console.log(`[OfflineSync] Successfully synced item ${item.id}`);
        } catch (error) {
          console.error(`[OfflineSync] Failed to sync item ${item.id}`, error);
          // Stop syncing if we hit an error (likely network dropped again)
          break;
        }
      }
    }
  }
};
