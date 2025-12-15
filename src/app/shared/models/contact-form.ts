export interface ContactForm {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  inquiryType: string;
  message: string;
  submittedAt?: Date;
  isRead?: boolean;
}