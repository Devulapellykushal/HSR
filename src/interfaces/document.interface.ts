export interface Document {
  id: string;
  ownerId: string; // references Person
  type: 'PAN' | 'AADHAAR' | 'PASSPORT' | 'DL' | 'INSURANCE' | 'OTHER';
  title: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  expiryDate?: Date;
  encrypted: boolean;
  sharedWith?: string[]; // Person IDs
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDocumentDto {
  ownerId: string;
  type: 'PAN' | 'AADHAAR' | 'PASSPORT' | 'DL' | 'INSURANCE' | 'OTHER';
  title: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  expiryDate?: Date;
  encrypted?: boolean;
  sharedWith?: string[];
}

export interface UpdateDocumentDto {
  title?: string;
  expiryDate?: Date;
  sharedWith?: string[];
}

export interface DocumentShareDto {
  documentId: string;
  sharedWith: string[];
}
