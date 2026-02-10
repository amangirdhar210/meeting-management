export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'superadmin';
  created_at: number;
  updated_at: number;
}
