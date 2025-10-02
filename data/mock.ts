import { Category, Product, Order, Table, OrderStatus, OrderType, TableStatus, Employee } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'cat1', name: 'أطباق رئيسية' },
  { id: 'cat2', name: 'مقبلات' },
  { id: 'cat3', name: 'مشروبات' },
  { id: 'cat4', name: 'حلويات' },
];

export const PRODUCTS: Product[] = [
  // أطباق رئيسية
  { id: 'p1', name: 'برجر لحم', price: 35, imageUrl: 'https://picsum.photos/seed/burger/200', categoryId: 'cat1', stock: 50, lowStockThreshold: 10, screen: 'kitchen' },
  { id: 'p2', name: 'بيتزا مارجريتا', price: 45, imageUrl: 'https://picsum.photos/seed/pizza/200', categoryId: 'cat1', stock: 30, lowStockThreshold: 5, screen: 'kitchen' },
  { id: 'p3', name: 'دجاج مشوي', price: 55, imageUrl: 'https://picsum.photos/seed/chicken/200', categoryId: 'cat1', stock: 25, lowStockThreshold: 10, screen: 'kitchen' },
  { id: 'p4', name: 'باستا ألفريدو', price: 40, imageUrl: 'https://picsum.photos/seed/pasta/200', categoryId: 'cat1', stock: 4, lowStockThreshold: 5, screen: 'kitchen' },
  // مقبلات
  { id: 'p5', name: 'بطاطا مقلية', price: 15, imageUrl: 'https://picsum.photos/seed/fries/200', categoryId: 'cat2', stock: 100, lowStockThreshold: 20, screen: 'kitchen' },
  { id: 'p6', name: 'حلقات بصل', price: 18, imageUrl: 'https://picsum.photos/seed/onion/200', categoryId: 'cat2', stock: 80, lowStockThreshold: 20, screen: 'kitchen' },
  { id: 'p7', name: 'سلطة سيزر', price: 25, imageUrl: 'https://picsum.photos/seed/salad/200', categoryId: 'cat2', stock: 0, lowStockThreshold: 10, screen: 'kitchen' },
  // مشروبات
  { id: 'p8', name: 'كوكا كولا', price: 5, imageUrl: 'https://picsum.photos/seed/coke/200', categoryId: 'cat3', stock: 200, lowStockThreshold: 50, screen: 'bar' },
  { id: 'p9', name: 'عصير برتقال', price: 12, imageUrl: 'https://picsum.photos/seed/juice/200', categoryId: 'cat3', stock: 150, lowStockThreshold: 30, screen: 'bar' },
  { id: 'p10', name: 'ماء', price: 3, imageUrl: 'https://picsum.photos/seed/water/200', categoryId: 'cat3', stock: 300, lowStockThreshold: 50, screen: 'bar' },
  // حلويات
  { id: 'p11', name: 'تشيز كيك', price: 28, imageUrl: 'https://picsum.photos/seed/cheesecake/200', categoryId: 'cat4', stock: 40, lowStockThreshold: 10, screen: 'kitchen' },
  { id: 'p12', name: 'آيس كريم', price: 15, imageUrl: 'https://picsum.photos/seed/icecream/200', categoryId: 'cat4', stock: 70, lowStockThreshold: 20, screen: 'kitchen' },
];

export const EMPLOYEES: Employee[] = [
    { id: 'e1', name: 'أحمد محمود', role: 'supervisor', pin: 'admin123', status: 'Active', avatarUrl: 'https://i.pravatar.cc/150?u=e1' },
    { id: 'e2', name: 'فاطمة علي', role: 'waiter', pin: '101', status: 'Active', avatarUrl: 'https://i.pravatar.cc/150?u=e2' },
    { id: 'e3', name: 'خالد سعيد', role: 'waiter', pin: '102', status: 'Active', avatarUrl: 'https://i.pravatar.cc/150?u=e3' },
    { id: 'e4', name: 'سارة إبراهيم', role: 'kitchen', pin: '111', status: 'Active', avatarUrl: 'https://i.pravatar.cc/150?u=e4' },
    { id: 'e5', name: 'حسن طارق', role: 'bar', pin: '222', status: 'Active', avatarUrl: 'https://i.pravatar.cc/150?u=e5' },
    { id: 'e6', name: 'منى عبدالله', role: 'waiter', pin: '103', status: 'Inactive', avatarUrl: 'https://i.pravatar.cc/150?u=e6' },
];

export const TABLES: Table[] = Array.from({ length: 12 }, (_, i) => ({
    id: `t${i + 1}`,
    name: `طاولة ${i + 1}`,
    seats: (i % 3 + 1) * 2,
    status: i % 4 === 1 ? TableStatus.OCCUPIED : i % 4 === 3 ? TableStatus.RESERVED : TableStatus.AVAILABLE,
    orderId: i % 4 === 1 ? `ord${i+1}`: undefined,
}));

export const ORDERS: Order[] = [
  {
    id: 'ord1',
    items: [
      { ...PRODUCTS[0], quantity: 1 }, // Burger (kitchen)
      { ...PRODUCTS[4], quantity: 1 }, // Fries (kitchen)
      { ...PRODUCTS[7], quantity: 1 }, // Coke (bar)
    ],
    total: 55,
    status: OrderStatus.NEW,
    type: OrderType.DINE_IN,
    tableId: 't2',
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: 'ord2',
    items: [
      { ...PRODUCTS[1], quantity: 2 }, // Pizza (kitchen)
      { ...PRODUCTS[8], quantity: 2 }, // Juice (bar)
    ],
    total: 114,
    status: OrderStatus.PREPARING,
    type: OrderType.TAKEAWAY,
    createdAt: new Date(Date.now() - 12 * 60 * 1000),
  },
  {
    id: 'ord3',
    items: [
      { ...PRODUCTS[2], quantity: 1 }, // Chicken (kitchen)
      { ...PRODUCTS[6], quantity: 1 }, // Salad (kitchen)
    ],
    total: 80,
    status: OrderStatus.READY,
    type: OrderType.DELIVERY,
    createdAt: new Date(Date.now() - 25 * 60 * 1000),
  },
    {
    id: 'ord4',
    items: [
      { ...PRODUCTS[3], quantity: 1 }, // Pasta (kitchen)
      { ...PRODUCTS[9], quantity: 2 }, // Water (bar)
    ],
    total: 46,
    status: OrderStatus.NEW,
    type: OrderType.TAKEAWAY,
    createdAt: new Date(Date.now() - 2 * 60 * 1000),
  },
];
