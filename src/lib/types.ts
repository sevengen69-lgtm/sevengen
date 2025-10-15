
import { Timestamp } from 'firebase/firestore';

export interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  status: 'pending' | 'contacted' | 'closed';
  createdAt: Timestamp;
  userId?: string;
  isRegisteredUser?: boolean;
}

export type IconName = 'Wrench' | 'Zap' | 'CircuitBoard' | 'HardHat' | 'ShoppingCart' | 'Repeat' | 'HeartPulse';

export interface ServiceContent {
  icon: IconName;
  title: string;
  description: string;
}

export interface HomepageContent {
  id: string;
  logoUrl?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  aboutTitle: string;
  aboutText: string;
  aboutImageUrl: string;
  services: ServiceContent[];
}
