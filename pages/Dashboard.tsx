
import React from 'react';
import DashboardCard from '../components/DashboardCard';
import SalesChart from '../components/SalesChart';
import { ORDERS, PRODUCTS } from '../data/mock';
import { Order, OrderStatus } from '../types';

const Dashboard: React.FC = () => {
  const dailySales = 1250;
  const activeOrders = ORDERS.filter(o => o.status === OrderStatus.NEW || o.status === OrderStatus.PREPARING).length;
  const topProduct = PRODUCTS[0];

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.NEW: return 'bg-green-100 text-green-800';
      case OrderStatus.PREPARING: return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.READY: return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const recentOrders = ORDERS.slice(0, 4);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">الواجهة الرئيسية</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <DashboardCard 
          title="المبيعات اليومية" 
          value={`${dailySales} ر.س`} 
          color="bg-sea-blue-100 text-sea-blue-600"
          icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 10v-1m0 0c-1.657 0-3-.895-3-2s1.343-2 3-2 3-.895 3-2-1.343-2-3-2m0 0c-1.11 0-2.08-.402-2.599-1M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>}
        />
        <DashboardCard 
          title="الطلبات النشطة" 
          value={activeOrders.toString()} 
          color="bg-sea-green-100 text-sea-green-600"
          icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>}
        />
        <DashboardCard 
          title="المنتج الأكثر مبيعاً" 
          value={topProduct.name} 
          color="bg-yellow-100 text-yellow-600"
          icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>}
        />
        <DashboardCard 
          title="متوسط وقت التحضير" 
          value="12 دقيقة" 
          color="bg-red-100 text-red-600"
          icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <SalesChart />
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">آخر الطلبات</h3>
            <div className="space-y-4">
                {recentOrders.map((order: Order) => (
                    <div key={order.id} className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-gray-700">طلب #{order.id.slice(-4)}</p>
                            <p className="text-sm text-gray-500">{order.items.length} منتجات - {order.total} ر.س</p>
                        </div>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
