
import React from 'react';

const Settings: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">الإعدادات</h1>
      <div className="mt-8 p-12 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold text-gray-700">قيد التطوير</h2>
        <p className="text-gray-500 mt-2">
          هذه الشاشة مخصصة للتحكم في إعدادات النظام العامة مثل معلومات المطعم، الضرائب، والطابعات.
        </p>
      </div>
    </div>
  );
};

export default Settings;
