export interface User {
  id: number;
  name: string;
  email: string;
  role:  'PRODUCT_MANAGER' | 'FINANCE_MANAGER' | 'ADMIN';
   tasks?: string[];
}