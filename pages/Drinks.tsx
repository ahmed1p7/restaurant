import React, { useState, useMemo } from 'react';
import { ORDERS } from '../data/mock';
import { Order, OrderItem, OrderStatus } from '../types';
import { useAuth } from '../contexts/AuthContext';

const Drinks: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(ORDERS);
  const { logout } = useAuth();

  const barOrders = useMemo(() => {
    return orders
      .map(order => ({
        ...order,
        items: order.items.filter(item => item.screen === 'bar'),
      }))
      .filter(order => order.items.length > 0);
  }, [orders]);


  const moveOrder = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };
  
  const getStatusColorClass = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.NEW: return 'bg-green-500';
      case OrderStatus.PREPARING: return 'bg-yellow-500';
      case OrderStatus.READY: return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  const OrderCard: React.FC<{ order: Order & { items: OrderItem[] } }> = ({ order }) => {
    const timeSince = Math.floor((new Date().getTime() - order.createdAt.getTime()) / 60000);
    
    return (
        <div className="bg-white rounded-lg shadow-md flex flex-col h-full">
            <div className={`p-2 text-white font-bold rounded-t-lg flex justify-between items-center ${getStatusColorClass(order.status)}`}>
                <span>#{order.id.slice(-4)} - {order.type}</span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 10.586V6z" clipRule="evenodd"></path></svg>
                  {timeSince} د
                </span>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
                {order.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <span className="font-bold text-lg">{item.quantity}x</span>
                        <span className="text-gray-700">{item.name}</span>
                    </div>
                ))}
            </div>
            <div className="p-2 border-t">
                {order.status === OrderStatus.NEW && (
                    <button onClick={() => moveOrder(order.id, OrderStatus.PREPARING)} className="w-full bg-yellow-500 text-white font-bold py-2 rounded-md hover:bg-yellow-600 transition">بدء التحضير</button>
                )}
                {order.status === OrderStatus.PREPARING && (
                    <button onClick={() => moveOrder(order.id, OrderStatus.READY)} className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition">جاهز</button>
                )}
                {order.status === OrderStatus.READY && (
                    <button onClick={() => moveOrder(order.id, OrderStatus.COMPLETED)} className="w-full bg-gray-500 text-white font-bold py-2 rounded-md hover:bg-gray-600 transition">إكمال</button>
                )}
            </div>
        </div>
    );
  };
  
  const columns: { title: string; status: OrderStatus; orders: (Order & {items: OrderItem[]})[] }[] = [
    { title: 'جديد', status: OrderStatus.NEW, orders: barOrders.filter(o => o.status === OrderStatus.NEW) },
    { title: 'قيد التحضير', status: OrderStatus.PREPARING, orders: barOrders.filter(o => o.status === OrderStatus.PREPARING) },
    { title: 'جاهز', status: OrderStatus.READY, orders: barOrders.filter(o => o.status === OrderStatus.READY) },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50 p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">شاشة المشروبات</h1>
        <button onClick={logout} className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition">تسجيل الخروج</button>
      </header>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
        {columns.map(col => (
          <div key={col.title} className="bg-sea-green-50 rounded-xl p-4 flex flex-col">
            <h2 className="text-2xl font-extrabold text-center mb-4 text-sea-green-800">{col.title} ({col.orders.length})</h2>
            <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                {col.orders.sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime()).map(order => (
                    <OrderCard key={order.id} order={order} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Drinks;