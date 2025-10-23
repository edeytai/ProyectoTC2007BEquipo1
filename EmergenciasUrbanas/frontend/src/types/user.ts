export type UserRole = 'brigadista' | 'coordinador' | 'autoridad' | 'admin';

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatar?: string;
}