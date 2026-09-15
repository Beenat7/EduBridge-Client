export interface DirectMessage {
  id: string;
  schoolId: string;
  studentId: string;
  senderId: string;
  senderType: string;
  recipientId: string;
  recipientType: string;
  body: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  lastModifiedAt: string | null;
}

export interface CreateDirectMessageRequest {
  schoolId: string;
  studentId: string;
  senderId: string;
  senderType: 'Parent' | 'Teacher';
  recipientId: string;
  recipientType: 'Parent' | 'Teacher';
  body: string;
}