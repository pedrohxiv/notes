export interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
