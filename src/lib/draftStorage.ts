const DB_NAME = 'glory-edu-drafts';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('drafts')) {
        db.createObjectStore('drafts', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('documents')) {
        db.createObjectStore('documents', { keyPath: 'id' });
      }
    };
  });
}

// --- Draft (profile + payment + step state) ---

export interface DraftData {
  id: string;
  profile: Record<string, unknown>;
  payment: Record<string, unknown>;
  currentStep: number;
  updatedAt: string;
}

export async function saveDraft(draft: Omit<DraftData, 'id' | 'updatedAt'>): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('drafts', 'readwrite');
    tx.objectStore('drafts').put({
      id: 'current',
      ...draft,
      updatedAt: new Date().toISOString(),
    });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getDraft(): Promise<DraftData | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('drafts', 'readonly');
    const req = tx.objectStore('drafts').get('current');
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function clearDraft(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('drafts', 'readwrite');
    tx.objectStore('drafts').delete('current');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// --- Documents (file blobs) ---

export interface StoredDocument {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  file: Blob;
  uploaded: boolean;
  backendUrl?: string;
}

export async function saveDocument(doc: Omit<StoredDocument, 'id' | 'uploaded'>): Promise<StoredDocument> {
  const db = await openDB();
  const id = `doc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const entry: StoredDocument = { ...doc, id, uploaded: false };

  return new Promise((resolve, reject) => {
    const tx = db.transaction('documents', 'readwrite');
    tx.objectStore('documents').put(entry);
    tx.oncomplete = () => resolve(entry);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getDocuments(): Promise<StoredDocument[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('documents', 'readonly');
    const req = tx.objectStore('documents').getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function markDocumentUploaded(id: string, backendUrl: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('documents', 'readwrite');
    const store = tx.objectStore('documents');
    const req = store.get(id);
    req.onsuccess = () => {
      const doc = req.result;
      if (doc) {
        doc.uploaded = true;
        doc.backendUrl = backendUrl;
        store.put(doc);
      }
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteDocument(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('documents', 'readwrite');
    tx.objectStore('documents').delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function clearDocuments(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('documents', 'readwrite');
    tx.objectStore('documents').clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// --- Sync: upload IndexedDB docs to backend ---

import { studentsAPI } from '@/lib/api';

export async function syncToBackend(studentId: string): Promise<{ synced: number; failed: number }> {
  const docs = await getDocuments();
  let synced = 0;
  let failed = 0;

  for (const doc of docs) {
    if (doc.uploaded) continue;
    try {
      const formData = new FormData();
      formData.append('file', doc.file, doc.fileName);
      const res = await studentsAPI.uploadDocument(studentId, formData);
      const remoteUrl = res.data?.document?.cloudinaryUrl || res.data?.url || '';
      await markDocumentUploaded(doc.id, remoteUrl);
      synced++;
    } catch {
      failed++;
    }
  }

  return { synced, failed };
}
