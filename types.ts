export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  stock: number;
  screen: 'kitchen' | 'bar';
  lowStockThreshold?: number;
}

export interface OrderItem extends Product {
  quantity: number;
}

export enum OrderStatus {
  NEW = 'جديد',
  PREPARING = 'قيد التحضير',
  READY = 'جاهز',
  COMPLETED = 'مكتمل',
  CANCELLED = 'ملغي',
}

export enum OrderType {
  DINE_IN = 'داخلي',
  TAKEAWAY = 'خارجي',
  DELIVERY = 'توصيل',
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  type: OrderType;
  tableId?: string;
  createdAt: Date;
}

export enum TableStatus {
    AVAILABLE = 'متاح',
    OCCUPIED = 'مشغول',
    RESERVED = 'محجوز',
}

export interface Table {
    id: string;
    name: string;
    status: TableStatus;
    seats: number;
    orderId?: string;
}

export type UserRole = 'supervisor' | 'waiter' | 'kitchen' | 'bar';

export interface User {
  name: string;
  role: UserRole;
}

export interface Employee {
  id: string;
  name: string;
  role: UserRole;
  pin: string;
  status: 'Active' | 'Inactive';
  avatarUrl: string;
}
