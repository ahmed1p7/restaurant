import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useOrders } from '../contexts/OrdersContext';
import { PRODUCTS, CATEGORIES, EMPLOYEES } from '../data/mock';
import { OrderStatus } from '../types';

const Reports: React.FC = () => {
  const { orders } = useOrders();

  // Sales by day-of-week (mock weekly data + real completed sales today).
  const weeklyData = useMemo(() => {
    const days = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
    const today = new Date().getDay();
    const todayIdx = today === 6 ? 0 : today + 1;
    const realToday = orders
      .filter((o) => o.status !== OrderStatus.CANCELLED)
      .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.price * i.quantity, 0), 0);

    const baseValues = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
    return days.map((day, i) => ({
      name: day,
      sales: i === todayIdx ? Math.max(realToday, baseValues[i]) : baseValues[i],
    }));
  }, [orders]);

  // Top products by quantity sold.
  const topProducts = useMemo(() => {
    const counter: Record<string, number> = {};
    orders.forEach((o) =>
      o.items.forEach((i) => {
        counter[i.name] = (counter[i.name] || 0) + i.quantity;
      })
    );
    return Object.entries(counter)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [orders]);

  // Sales by category (pie chart).
  const salesByCategory = useMemo(() => {
    const counter: Record<string, number> = {};
    CATEGORIES.forEach((c) => (counter[c.id] = 0));
    orders.forEach((o) =>
      o.items.forEach((i) => {
        const product = PRODUCTS.find((p) => p.id === i.id);
        if (product) counter[product.categoryId] += i.price * i.quantity;
      })
    );
    return CATEGORIES.map((c) => ({
      name: c.name,
      value: counter[c.id],
    })).filter((c) => c.value > 0);
  }, [orders]);

  const totalSales = weeklyData.reduce((s, d) => s + d.sales, 0);
  const completedOrders = orders.filter((o) => o.status === OrderStatus.COMPLETED).length;
  const cancelledOrders = orders.filter((o) => o.status === OrderStatus.CANCELLED).length;
  const activeEmployees = EMPLOYEES.filter((e) => e.status === 'Active').length;

  const pieColors = ['#0ea5e9', '#22c55e', '#facc15', '#ef4444', '#a855f7'];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">التقارير والتحليلات</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-gray-600 text-sm">إجمالي المبيعات الأسبوعية</p>
          <p className="text-3xl font-bold text-sea-blue-600 mt-2">
            {totalSales.toLocaleString('ar-EG')} ر.س
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-gray-600 text-sm">الطلبات المكتملة</p>
          <p className="text-3xl font-bold text-sea-green-600 mt-2">{completedOrders}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-gray-600 text-sm">الطلبات الملغية</p>
          <p className="text-3xl font-bold text-red-500 mt-2">{cancelledOrders}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-gray-600 text-sm">الموظفون النشطون</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{activeEmployees}</p>
        </div>
      </div>

      {/* Weekly sales bar chart */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">المبيعات الأسبوعية</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontFamily: 'Tajawal',
              }}
              cursor={{ fill: 'rgba(14, 165, 233, 0.1)' }}
            />
            <Legend wrapperStyle={{ fontFamily: 'Tajawal' }} />
            <Bar dataKey="sales" fill="#0ea5e9" name="المبيعات (ر.س)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by category pie chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">المبيعات حسب الفئة</h3>
          {salesByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={salesByCategory}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry: any) => `${entry.name}`}
                >
                  {salesByCategory.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontFamily: 'Tajawal',
                  }}
                  formatter={(value: number) => `${value.toLocaleString('ar-EG')} ر.س`}
                />
                <Legend wrapperStyle={{ fontFamily: 'Tajawal' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 mt-12">لا توجد بيانات مبيعات بعد.</p>
          )}
        </div>

        {/* Top products bar chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">المنتجات الأكثر مبيعاً</h3>
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={topProducts}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 60, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="name" type="category" stroke="#6b7280" width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontFamily: 'Tajawal',
                  }}
                  cursor={{ fill: 'rgba(34, 197, 94, 0.1)' }}
                />
                <Bar dataKey="qty" fill="#22c55e" name="الكمية المباعة" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 mt-12">لا توجد بيانات مبيعات بعد.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
