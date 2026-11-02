export const MAX_DOCUMENTS = 2;
export const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;

const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

export const DOCUMENT_LIMIT_MESSAGE = `You can upload up to ${MAX_DOCUMENTS} documents. You have reached this limit.`;

export function validateDocumentFile(file: File): string | null {
  if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
    return `"${file.name}" can't be uploaded. Only PDF, JPEG, and PNG files are allowed.`;
  }
  if (file.size > MAX_DOCUMENT_SIZE) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    return `"${file.name}" is ${sizeInMB} MB. Documents must be 10 MB or smaller.`;
  }
  return null;
}

// Documents flagged by staff don't count, so the student can replace them
export function countActiveDocuments(docs: { reviewStatus?: string; status?: string }[]): number {
  return docs.filter((doc) => (doc.reviewStatus || doc.status || '').toLowerCase() !== 'needs replacement').length;
}
