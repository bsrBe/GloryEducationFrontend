'use client';

import { useEffect, useState, useRef } from 'react';
import { studentsAPI } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { Card, Button, Badge, LoadingSpinner, ErrorState } from '@/components/ui';
import { Upload, FileText, CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';

interface Document {
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  status: string;
}

export default function DocumentsPage() {
  const user = useAuthStore((s) => s.user);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDocuments();
  }, [user]);

  const loadDocuments = async () => {
    if (!user?._id) return;
    try {
      const res = await studentsAPI.get(user._id);
      setDocuments(res.data.documents || []);
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to load documents'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?._id) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await studentsAPI.uploadDocument(user._id, formData);
      loadDocuments();
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Upload failed'
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const statusBadge = (s: string) => {
    switch (s) {
      case 'approved':
        return <Badge variant="green"><CheckCircle size={12} /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="red"><XCircle size={12} /> Rejected</Badge>;
      default:
        return <Badge variant="yellow"><Clock size={12} /> Pending</Badge>;
    }
  };

  if (loading) return <LoadingSpinner text="Loading documents..." />;
  if (error && !documents.length) return <ErrorState message={error} />;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-carbon">Documents</h1>
        <p className="text-dim-grey text-sm mt-1">
          Upload your academic documents (PDF, JPEG, PNG — max 10MB)
        </p>
      </div>

      {/* Upload Area */}
      <Card>
        <div
          className="border-2 border-dashed border-charcoal/30 rounded-xl p-8 text-center hover:border-ocean transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={32} className="mx-auto text-dim-grey mb-3" />
          {uploading ? (
            <div>
              <div className="animate-spin h-6 w-6 border-2 border-ocean border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-sm text-dim-grey">Uploading...</p>
            </div>
          ) : (
            <>
              <p className="font-medium text-carbon">Click to upload or drag and drop</p>
              <p className="text-sm text-dim-grey mt-1">PDF, JPEG, or PNG (max 10MB)</p>
            </>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={handleUpload}
        />
      </Card>

      {/* Document List */}
      <Card>
        <h3 className="font-semibold text-carbon mb-4">Uploaded Documents</h3>
        {documents.length === 0 ? (
          <div className="text-center py-8 text-dim-grey">
            <FileText size={32} className="mx-auto mb-2 opacity-50" />
            <p>No documents uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-porcelain rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-ocean" />
                  <div>
                    <p className="font-medium text-carbon text-sm">{doc.name}</p>
                    <p className="text-xs text-dim-grey">
                      {doc.type} • {new Date(doc.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {statusBadge(doc.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
