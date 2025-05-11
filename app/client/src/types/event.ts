export interface User {
  _id: string;
  name: string;
  email?: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: 'workshop' | 'charity' | 'social' | 'networking' | 'conference' | 'other';
  image?: string;
  creator?: User;
  attendees?: User[];
  createdAt?: string;
  updatedAt?: string;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  image?: string;
}