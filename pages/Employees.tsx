import React, { useState, useMemo } from 'react';
import { EMPLOYEES } from '../data/mock';
import { Employee, UserRole } from '../types';

const roleMap: Record<Employee['role'], string> = {
  supervisor: 'مشرف',
  waiter: 'نادل',
  kitchen: 'مطبخ',
  bar: 'مشروبات',
};

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
    <path
      fillRule="evenodd"
      d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
      clipRule="evenodd"
    />
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
      clipRule="evenodd"
    />
  </svg>
);

interface EmployeeFormState {
  id?: string;
  name: string;
  role: UserRole;
  pin: string;
  status: 'Active' | 'Inactive';
  avatarUrl: string;
}

const emptyForm: EmployeeFormState = {
  name: '',
  role: 'waiter',
  pin: '',
  status: 'Active',
  avatarUrl: 'https://i.pravatar.cc/150?u=new',
};

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(EMPLOYEES);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeFormState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [employees, searchQuery]);

  const openAddModal = () => {
    setEditingEmployee({ ...emptyForm });
    setModalOpen(true);
  };

  const openEditModal = (emp: Employee) => {
    setEditingEmployee({
      id: emp.id,
      name: emp.name,
      role: emp.role,
      pin: emp.pin,
      status: emp.status,
      avatarUrl: emp.avatarUrl,
    });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee || editingEmployee.pin.length < 3) return;

    if (editingEmployee.id) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === editingEmployee.id
            ? {
                ...emp,
                name: editingEmployee.name,
                role: editingEmployee.role,
                pin: editingEmployee.pin,
                status: editingEmployee.status,
                avatarUrl: editingEmployee.avatarUrl,
              }
            : emp
        )
      );
    } else {
      const newEmployee: Employee = {
        id: `e${Date.now()}`,
        name: editingEmployee.name,
        role: editingEmployee.role,
        pin: editingEmployee.pin,
        status: editingEmployee.status,
        avatarUrl: editingEmployee.avatarUrl,
      };
      setEmployees((prev) => [newEmployee, ...prev]);
    }
    setModalOpen(false);
    setEditingEmployee(null);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setEmployees((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const toggleStatus = (id: string) => {
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: e.status === 'Active' ? 'Inactive' : 'Active' } : e
      )
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">إدارة الموظفين</h1>
        <button
          onClick={openAddModal}
          className="px-6 py-2 bg-sea-maroon text-white font-semibold rounded-lg shadow-md hover:bg-sea-maroon-dark transition"
        >
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
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            className="bg-white rounded-xl shadow-lg p-6 text-center flex flex-col items-center transform hover:-translate-y-1 transition-transform duration-300"
          >
            <img
              src={emp.avatarUrl}
              alt={emp.name}
              className="w-24 h-24 rounded-full object-cover mb-4 ring-4 ring-gray-100"
            />
            <h3 className="text-xl font-bold text-gray-800">{emp.name}</h3>
            <p className="text-gray-500 mb-2">{roleMap[emp.role]}</p>
            <button
              onClick={() => toggleStatus(emp.id)}
              title="اضغط لتبديل الحالة"
              className={`px-3 py-1 text-sm font-semibold rounded-full mb-3 transition ${
                emp.status === 'Active'
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-red-100 text-red-800 hover:bg-red-200'
              }`}
            >
              {emp.status === 'Active' ? 'نشط' : 'غير نشط'}
            </button>
            <div className="mt-2 flex space-x-2 space-x-reverse w-full justify-center">
              <button
                onClick={() => openEditModal(emp)}
                className="flex-1 text-sea-blue-600 hover:text-white font-semibold py-2 px-4 rounded-md bg-sea-blue-50 hover:bg-sea-blue-600 transition"
                title="تعديل"
              >
                تعديل
              </button>
              <button
                onClick={() => setDeleteTarget(emp)}
                className="flex-1 text-red-600 hover:text-white font-semibold py-2 px-4 rounded-md bg-red-50 hover:bg-red-600 transition"
                title="حذف"
              >
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

      {/* Add / Edit modal */}
      {modalOpen && editingEmployee && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">
              {editingEmployee.id ? 'تعديل الموظف' : 'إضافة موظف جديد'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
                <input
                  type="text"
                  required
                  value={editingEmployee.name}
                  onChange={(e) =>
                    setEditingEmployee({ ...editingEmployee, name: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sea-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الدور</label>
                  <select
                    value={editingEmployee.role}
                    onChange={(e) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        role: e.target.value as UserRole,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sea-blue-500"
                  >
                    <option value="waiter">نادل</option>
                    <option value="kitchen">مطبخ</option>
                    <option value="bar">مشروبات</option>
                    <option value="supervisor">مشرف</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الرمز السري (PIN)</label>
                  <input
                    type="text"
                    required
                    minLength={3}
                    value={editingEmployee.pin}
                    onChange={(e) =>
                      setEditingEmployee({ ...editingEmployee, pin: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sea-blue-500"
                    placeholder="***"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                <select
                  value={editingEmployee.status}
                  onChange={(e) =>
                    setEditingEmployee({
                      ...editingEmployee,
                      status: e.target.value as 'Active' | 'Inactive',
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sea-blue-500"
                >
                  <option value="Active">نشط</option>
                  <option value="Inactive">غير نشط</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رابط الصورة</label>
                <input
                  type="url"
                  value={editingEmployee.avatarUrl}
                  onChange={(e) =>
                    setEditingEmployee({ ...editingEmployee, avatarUrl: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sea-blue-500"
                />
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-sea-blue-600 text-white rounded-lg hover:bg-sea-blue-700 transition"
                >
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-2">تأكيد الحذف</h3>
            <p className="text-gray-600 mb-6">
              هل أنت متأكد من حذف الموظف{' '}
              <span className="font-semibold">{deleteTarget.name}</span>؟
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                إلغاء
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
