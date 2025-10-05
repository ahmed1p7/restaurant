import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ChefHatIcon from '../components/icons/ChefHatIcon';
import SupervisorIcon from '../components/icons/SupervisorIcon';
import WaiterIcon from '../components/icons/WaiterIcon';
import ScreenIcon from '../components/icons/ScreenIcon';
import KitchenScreenIcon from '../components/icons/KitchenScreenIcon';
import DrinksScreenIcon from '../components/icons/DrinksScreenIcon';


const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'waiter' | 'supervisor' | 'screens'>('waiter');
  const { login } = useAuth();
  const [error, setError] = useState('');

  // Form states
  const [waiterPin, setWaiterPin] = useState('');
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [kitchenPin, setKitchenPin] = useState('');
  const [drinksPin, setDrinksPin] = useState('');

  const handleLogin = async (e: React.FormEvent, role: 'waiter' | 'supervisor' | 'kitchen' | 'bar') => {
    e.preventDefault();
    setError('');
    let pin: string | undefined;
    let username: string | undefined;

    switch(role) {
      case 'waiter': pin = waiterPin; break;
      case 'supervisor': pin = adminPass; username = adminUser; break;
      case 'kitchen': pin = kitchenPin; break;
      case 'bar': pin = drinksPin; break;
    }
    
    const success = await login(role, pin, username);
    if (!success) {
      setError('بيانات الاعتماد غير صحيحة. يرجى المحاولة مرة أخرى.');
    }
  };


  const renderForm = () => {
    switch (activeTab) {
      case 'waiter':
        return (
          <form onSubmit={(e) => handleLogin(e, 'waiter')}>
            <label htmlFor="waiter-pin" className="block text-sm font-medium text-gray-700">رقم النادل (مثال: 101)</label>
            <input
              id="waiter-pin"
              type="password"
              value={waiterPin}
              onChange={(e) => setWaiterPin(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sea-maroon focus:border-sea-maroon text-lg"
              placeholder="أدخل رقم النادل الخاص بك"
              required
            />
            <p className="mt-2 text-xs text-gray-500">للتجربة، استخدم: 101</p>
            <button type="submit" className="mt-6 w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-sea-maroon hover:bg-sea-maroon-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sea-maroon">
              <WaiterIcon className="w-5 h-5 ml-2"/>
              تسجيل الدخول كنادل
            </button>
          </form>
        );
      case 'supervisor':
        return (
          <form onSubmit={(e) => handleLogin(e, 'supervisor')}>
            <div className="space-y-4">
               <div>
                 <label htmlFor="admin-user" className="block text-sm font-medium text-gray-700">اسم المستخدم</label>
                 <input
                   id="admin-user"
                   type="text"
                   value={adminUser}
                   onChange={(e) => setAdminUser(e.target.value)}
                   className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sea-maroon focus:border-sea-maroon text-lg"
                   placeholder="أدخل اسم المستخدم"
                   required
                 />
               </div>
               <div>
                  <label htmlFor="admin-pass" className="block text-sm font-medium text-gray-700">كلمة المرور</label>
                  <input
                    id="admin-pass"
                    type="password"
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sea-maroon focus:border-sea-maroon text-lg"
                    placeholder="أدخل كلمة المرور"
                    required
                  />
               </div>
            </div>
             <p className="mt-2 text-xs text-gray-500">للتجربة، استخدم (اسم المستخدم: admin) (كلمة المرور: admin123)</p>
            <button type="submit" className="mt-6 w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-sea-maroon hover:bg-sea-maroon-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sea-maroon">
              <SupervisorIcon className="w-5 h-5 ml-2" />
              تسجيل الدخول كمشرف
            </button>
          </form>
        );
      case 'screens':
        return (
          <div className="space-y-6">
            <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
               <h3 className="text-lg font-bold text-blue-800 flex items-center mb-2"><KitchenScreenIcon className="w-6 h-6 ml-2" /> شاشة المطبخ</h3>
               <form onSubmit={(e) => handleLogin(e, 'kitchen')} className="flex items-center space-x-2 space-x-reverse">
                  <input
                    type="password"
                    value={kitchenPin}
                    onChange={(e) => setKitchenPin(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="أدخل رمز شاشة المطبخ"
                    required
                    />
                  <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">دخول</button>
               </form>
               <p className="mt-1 text-xs text-gray-500">الرمز للتجربة: 111</p>
            </div>
            <div className="p-4 border rounded-lg bg-green-50 border-green-200">
               <h3 className="text-lg font-bold text-green-800 flex items-center mb-2"><DrinksScreenIcon className="w-6 h-6 ml-2" /> شاشة المشروبات</h3>
                <form onSubmit={(e) => handleLogin(e, 'bar')} className="flex items-center space-x-2 space-x-reverse">
                    <input
                        type="password"
                        value={drinksPin}
                        onChange={(e) => setDrinksPin(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="أدخل رمز شاشة المشروبات"
                        required
                    />
                    <button type="submit" className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700">دخول</button>
                </form>
                <p className="mt-1 text-xs text-gray-500">الرمز للتجربة: 222</p>
            </div>
          </div>
        );
    }
  };

  const TabButton = ({ role, label, icon }: { role: 'waiter' | 'supervisor' | 'screens', label: string, icon: React.ReactNode }) => (
    <button
      onClick={() => setActiveTab(role)}
      className={`flex-1 flex items-center justify-center p-3 text-lg font-semibold border-b-4 transition-colors ${activeTab === role ? 'border-sea-maroon text-sea-maroon' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
    >
      {icon}
      <span className="mr-2">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-sea-beige px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-sea-maroon">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-block bg-sea-maroon text-white rounded-full p-4 mb-4">
              <ChefHatIcon />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">نظام إدارة المطعم</h2>
            <p className="mt-2 text-md text-gray-600">أدخل بيانات تسجيل الدخول</p>
          </div>

          <div className="bg-gray-100 rounded-lg mb-6">
            <div className="flex">
                <TabButton role="waiter" label="نادل" icon={<WaiterIcon />} />
                <TabButton role="supervisor" label="مشرف" icon={<SupervisorIcon />} />
                <TabButton role="screens" label="شاشات" icon={<ScreenIcon />} />
            </div>
          </div>
          
          <div>
            {renderForm()}
            {error && <p className="mt-4 text-center text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;