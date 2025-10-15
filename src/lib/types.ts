
import { Timestamp } from 'firebase/firestore';

export interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'pending' | 'contacted' | 'closed';
  createdAt: Timestamp;
}
