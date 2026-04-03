export type Page = 'home' | 'about' | 'activities' | 'seva-vivara' | 'events' | 'gallery' | 'slokas' | 'contact' | 'feedback' | 'donate' | 'booking';

export interface Seva {
  id: string;
  name: string;
  price: number;
}

export interface BookingData {
  seva: Seva;
  userDetails: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  poojaDetails: {
    date: string;
    count: number;
    gothra: string;
    nakshathra: string;
    rashi: string;
    vedha: string;
    message?: string;
    transactionId?: string;
  };
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  content: string;
}
