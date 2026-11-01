'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { saveDocument, getDocuments, deleteDocument, saveDraft, getDraft } from '@/lib/draftStorage';
import { Button, Badge } from '@/components/ui';
import { ApplyHeading, ApplySection } from '@/components/apply/ApplyParts';
import { Upload, FileText, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';

export default function ApplyDocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<{ id: string; fileName: string; fileType: string; fileSize: number }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadDocs = useCallback(async () => {
    const docs = await getDocuments();
    setDocuments(docs.map(({ id, fileName, fileType, fileSize }) => ({ id, fileName, fileType, fileSize })));
  }, []);

  useEffect(() => {
    let active = true;
    getDocuments().then((docs) => {
      if (active) {
        setDocuments(docs.map(({ id, fileName, fileType, fileSize }) => ({ id, fileName, fileType, fileSize })));
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    // Validate
    const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowed.includes(file.type)) {
      setError('Only PDF, JPEG, and PNG files are allowed');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File must be under 10MB');
      return;
    }

    setUploading(true);
    try {
      await saveDocument({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        file,
      });
      await loadDocs();
    } catch {
      setError('Failed to save file');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDocument(id);
    await loadDocs();
  };

  const handleNext = async () => {
    const draft = await getDraft();
    await saveDraft({
      profile: draft?.profile || {},
      payment: draft?.payment || {},
      currentStep: 2,
    });
    // [Payment disabled] was: router.push('/apply/payment');
    router.push('/apply/submit');
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-8">
      <ApplyHeading title="Upload your documents">
        <p>Add your transcripts and certificates. They stay on this device until you submit.</p>
      </ApplyHeading>

      {error && (
        <div className="bg-red-bg text-red-text px-4 py-3 rounded-[10px] text-sm border border-red/30">
          {error}
        </div>
      )}

      {/* Upload Area */}
      <ApplySection title="Add a document" hint="PDF, JPEG or PNG, up to 10MB each.">
        <button
          type="button"
          className="w-full bg-surface border-2 border-dashed border-[color:var(--btn-secondary-border)] rounded-[10px] p-8 text-center hover:border-ocean cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? (
            <div>
              <div className="animate-spin h-6 w-6 border-2 border-ocean border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-sm text-dim-grey">Saving to device...</p>
            </div>
          ) : (
            <>
              <Upload size={28} className="mx-auto text-ocean mb-2" />
              <p className="font-medium text-carbon">Choose a file to upload</p>
            </>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={handleUpload}
        />
      </ApplySection>

      {/* Document List */}
      <ApplySection title={`Your documents (${documents.length})`}>
        {documents.length === 0 ? (
          <div className="text-center py-6 text-dim-grey">
            <FileText size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No documents added yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-surface border border-line rounded-[10px]">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-ocean flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-carbon truncate">{doc.fileName}</p>
                    <p className="text-xs text-dim-grey">{doc.fileType.split('/')[1].toUpperCase()} • {formatSize(doc.fileSize)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="blue">Saved locally</Badge>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    aria-label={`Remove ${doc.fileName}`}
                    className="p-1.5 text-dim-grey hover:text-red transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ApplySection>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="secondary" onClick={() => router.push('/apply/profile')}>
          <ArrowLeft size={16} /> Back
        </Button>
        <Button onClick={handleNext} variant="accent">
          Continue to Submit <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
