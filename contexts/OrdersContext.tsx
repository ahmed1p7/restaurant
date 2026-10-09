import React, { createContext, useState, useContext, useCallback } from 'react';
import { Order, OrderItem, OrderStatus, OrderType } from '../types';
import { ORDERS } from '../data/mock';

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  getOrdersByScreen: (screen: 'kitchen' | 'bar') => Order[];
}

const OrdersContext = createContext<OrdersContextType | null>(null);

let orderCounter = ORDERS.length;

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(ORDERS);

  const addOrder = useCallback(
    (order: Omit<Order, 'id' | 'createdAt' | 'status'>): Order => {
      orderCounter += 1;
      const newOrder: Order = {
        ...order,
        id: `ord${orderCounter}`,
        status: OrderStatus.NEW,
        createdAt: new Date(),
      };
      setOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    },
    []
  );

  const updateOrderStatus = useCallback(
    (orderId: string, newStatus: OrderStatus) => {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    },
    []
  );

  // Returns orders filtered by screen (kitchen / bar) and that still have items.
  const getOrdersByScreen = useCallback(
    (screen: 'kitchen' | 'bar') => {
      return orders
        .map((order) => ({
          ...order,
          items: order.items.filter((item) => item.screen === screen),
        }))
        .filter((order) => order.items.length > 0);
    },
    [orders]
  );

  return (
    <OrdersContext.Provider
      value={{ orders, addOrder, updateOrderStatus, getOrdersByScreen }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};
