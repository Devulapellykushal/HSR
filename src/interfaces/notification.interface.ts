export interface Notification {
  id: string;
  userId: string;
  type: 'PUSH' | 'EMAIL' | 'SMS' | 'IN_APP';
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  sentAt?: Date;
  readAt?: Date;
  createdAt: Date;
}

export interface CreateNotificationDto {
  userId: string;
  type: 'PUSH' | 'EMAIL' | 'SMS' | 'IN_APP';
  title: string;
  message: string;
  data?: Record<string, any>;
}

export interface PushNotificationDto {
  token: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

export interface EmailNotificationDto {
  to: string;
  subject: string;
  html: string;
  text?: string;
}
