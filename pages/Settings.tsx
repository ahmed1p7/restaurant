import React, { useState } from 'react';

interface SettingsState {
  restaurantName: string;
  phone: string;
  address: string;
  currency: string;
  taxRate: number;
  printerName: string;
  enableNotifications: boolean;
  lowStockAlerts: boolean;
}

const initialState: SettingsState = {
  restaurantName: 'SEA Restaurant',
  phone: '+966 50 000 0000',
  address: 'الرياض، المملكة العربية السعودية',
  currency: 'ر.س',
  taxRate: 15,
  printerName: 'EPSON TM-T20',
  enableNotifications: true,
  lowStockAlerts: true,
};

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>(initialState);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would persist to backend / localStorage.
    localStorage.setItem('restaurant_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const update = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">الإعدادات</h1>

      {saved && (
        <div className="mb-4 bg-sea-green-100 border border-sea-green-300 text-sea-green-800 rounded-lg p-3 text-center font-semibold">
          ✅ تم حفظ الإعدادات بنجاح.
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Restaurant Info */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">معلومات المطعم</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم المطعم</label>
              <input
                type="text"
                value={settings.restaurantName}
                onChange={(e) => update('restaurantName', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sea-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الهاتف</label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => update('phone', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sea-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => update('address', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sea-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Financial & Tax */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">الإعدادات المالية</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">العملة</label>
              <input
                type="text"
                value={settings.currency}
                onChange={(e) => update('currency', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sea-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نسبة الضريبة (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={settings.taxRate}
                onChange={(e) => update('taxRate', Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sea-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">طابعة الإيصالات</label>
              <input
                type="text"
                value={settings.printerName}
                onChange={(e) => update('printerName', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sea-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-800 mb-4">الإشعارات</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-700">تفعيل الإشعارات العامة</p>
                <p className="text-sm text-gray-500">إشعارات الطلبات الجديدة والتحديثات</p>
              </div>
              <input
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) => update('enableNotifications', e.target.checked)}
                className="w-6 h-6"
              />
            </label>
            <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-700">تنبيهات المخزون المنخفض</p>
                <p className="text-sm text-gray-500">تنبيه عند وصول أي منتج لحد المخزون المنخفض</p>
              </div>
              <input
                type="checkbox"
                checked={settings.lowStockAlerts}
                onChange={(e) => update('lowStockAlerts', e.target.checked)}
                className="w-6 h-6"
              />
            </label>
          </div>
        </div>

        <div className="lg:col-span-2 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-sea-maroon text-white font-semibold rounded-lg shadow-md hover:bg-sea-maroon-dark transition"
          >
            حفظ الإعدادات
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
