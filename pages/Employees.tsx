import React, { useState, useMemo } from 'react';
import { EMPLOYEES } from '../data/mock';
import { Employee } from '../types';

const roleMap: Record<Employee['role'], string> = {
    supervisor: 'مشرف',
    waiter: 'نادل',
    kitchen: 'مطبخ',
    bar: 'مشروبات'
};

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(EMPLOYEES);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [employees, searchQuery]);
  
  return (
    <div>
       <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">إدارة الموظفين</h1>
        <button className="px-6 py-2 bg-sea-maroon text-white font-semibold rounded-lg shadow-md hover:bg-sea-maroon-dark transition">
            إضافة موظف جديد
        </button>
      </div>

       <div className="mb-4">
        <input
          type="text"
          placeholder="ابحث عن موظف..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sea-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredEmployees.map(emp => (
          <div key={emp.id} className="bg-white rounded-xl shadow-lg p-6 text-center flex flex-col items-center transform hover:-translate-y-1 transition-transform duration-300">
            <img src={emp.avatarUrl} alt={emp.name} className="w-24 h-24 rounded-full object-cover mb-4 ring-4 ring-gray-100" />
            <h3 className="text-xl font-bold text-gray-800">{emp.name}</h3>
            <p className="text-gray-500 mb-2">{roleMap[emp.role]}</p>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${emp.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {emp.status === 'Active' ? 'نشط' : 'غير نشط'}
            </span>
             <div className="mt-6 flex space-x-2 space-x-reverse w-full justify-center">
                <button className="flex-1 text-sea-blue-600 hover:text-white font-semibold py-2 px-4 rounded-md bg-sea-blue-50 hover:bg-sea-blue-600 transition" title="تعديل">
                    تعديل
                </button>
                <button className="flex-1 text-red-600 hover:text-white font-semibold py-2 px-4 rounded-md bg-red-50 hover:bg-red-600 transition" title="حذف">
                    حذف
                </button>
            </div>
          </div>
        ))}
      </div>
      {filteredEmployees.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg mt-6">
                <p className="text-gray-500">لا يوجد موظفون مطابقون للبحث.</p>
            </div>
        )}
    </div>
  );
};

export default Employees;
