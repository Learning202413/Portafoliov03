export type PageType =
  | 'inicio' | 'semanas' | 'sobre_mi'
  | 'login'  | 'admin_semanas' | 'admin_usuarios';

export interface WeekData {
  id: string;
  subtitle?: string;
  title: string;
  description: string;
  topics: string[];
  pdfUrl: string;
  pdfSize: string;
  createdAt: number;
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  createdAt: number;
}