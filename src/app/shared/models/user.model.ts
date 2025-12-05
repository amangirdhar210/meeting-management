export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  created_at: number;
  updated_at: number;
}
