import React, { useState, useMemo } from 'react';
import { PRODUCTS, CATEGORIES } from '../data/mock';
import { Product } from '../types';

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

interface ProductFormState {
  id?: string;
  name: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  stock: number;
  lowStockThreshold: number;
  screen: 'kitchen' | 'bar';
}

const emptyForm: ProductFormState = {
  name: '',
  price: 0,
  imageUrl: 'https://picsum.photos/seed/new-product/200',
  categoryId: CATEGORIES[0].id,
  stock: 0,
  lowStockThreshold: 5,
  screen: 'kitchen',
};

const Inventory: React.FC = () => {
  const [inventory, setInventory] = useState<Product[]>(PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductFormState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const categoriesMap = useMemo(() => {
    return CATEGORIES.reduce(
      (acc, cat) => {
        acc[cat.id] = cat.name;
        return acc;
      },
      {} as Record<string, string>
    );
  }, []);

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [inventory, searchQuery]);

  const getStatus = (item: Product) => {
    if (item.stock === 0) {
      return { text: 'نفد', color: 'bg-red-100 text-red-800' };
    }
    if (item.lowStockThreshold && item.stock <= item.lowStockThreshold) {
      return { text: 'مخزون منخفض', color: 'bg-yellow-100 text-yellow-800' };
    }
    return { text: 'متوفر', color: 'bg-green-100 text-green-800' };
  };

  const openAddModal = () => {
    setEditingProduct({ ...emptyForm });
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      categoryId: product.categoryId,
      stock: product.stock,
      lowStockThreshold: product.lowStockThreshold ?? 5,
      screen: product.screen,
    });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (editingProduct.id) {
      // Update existing
      setInventory((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: editingProduct.name,
                price: editingProduct.price,
                imageUrl: editingProduct.imageUrl,
                categoryId: editingProduct.categoryId,
                stock: editingProduct.stock,
                lowStockThreshold: editingProduct.lowStockThreshold,
                screen: editingProduct.screen,
              }
            : p
        )
      );
    } else {
      // Create new
      const newProduct: Product = {
        id: `p${Date.now()}`,
        name: editingProduct.name,
        price: editingProduct.price,
        imageUrl: editingProduct.imageUrl,
        categoryId: editingProduct.categoryId,
        stock: editingProduct.stock,
        lowStockThreshold: editingProduct.lowStockThreshold,
        screen: editingProduct.screen,
      };
      setInventory((prev) => [newProduct, ...prev]);
    }
    setModalOpen(false);
    setEditingProduct(null);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setInventory((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">إدارة المخزون</h1>
        <button
          onClick={openAddModal}
          className="px-6 py-2 bg-sea-maroon text-white font-semibold rounded-lg shadow-md hover:bg-sea-maroon-dark transition"
        >
          إضافة منتج جديد
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="ابحث عن منتج..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sea-blue-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-600 tracking-wider">المنتج</th>
                <th className="p-4 text-sm font-semibold text-gray-600 tracking-wider">الفئة</th>
                <th className="p-4 text-sm font-semibold text-gray-600 tracking-wider">الكمية المتاحة</th>
                <th className="p-4 text-sm font-semibold text-gray-600 tracking-wider">حد المخزون المنخفض</th>
                <th className="p-4 text-sm font-semibold text-gray-600 tracking-wider">الحالة</th>
                <th className="p-4 text-sm font-semibold text-gray-600 tracking-wider">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-md object-cover ml-4" />
                      <span className="font-medium text-gray-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap text-gray-600">{categoriesMap[item.categoryId]}</td>
                  <td className="p-4 whitespace-nowrap font-semibold text-gray-700">{item.stock}</td>
                  <td className="p-4 whitespace-nowrap text-gray-600">{item.lowStockThreshold || 'N/A'}</td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatus(item).color}`}>
                      {getStatus(item).text}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex space-x-2 space-x-reverse">
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-sea-blue-600 hover:text-sea-blue-800 p-2 rounded-md bg-sea-blue-50 hover:bg-sea-blue-100 transition"
                        title="تعديل"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-md bg-red-50 hover:bg-red-100 transition"
                        title="حذف"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredInventory.length === 0 && (
        <div className="text-center py-12 bg-white rounded-b-xl shadow-lg">
          <p className="text-gray-500">لا توجد نتائج مطابقة للبحث.</p>
        </div>
      )}

      {/* Add / Edit modal */}
      {modalOpen && editingProduct && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">
              {editingProduct.id ? 'تعديل المنتج' : 'إضافة منتج جديد'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sea-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">السعر (ر.س)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sea-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المخزون</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editingProduct.stock}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sea-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الفئة</label>
                  <select
                    value={editingProduct.categoryId}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, categoryId: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sea-blue-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الشاشة</label>
                  <select
                    value={editingProduct.screen}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        screen: e.target.value as 'kitchen' | 'bar',
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sea-blue-500"
                  >
                    <option value="kitchen">المطبخ</option>
                    <option value="bar">المشروبات</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رابط الصورة</label>
                <input
                  type="url"
                  value={editingProduct.imageUrl}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, imageUrl: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sea-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  حد المخزون المنخفض
                </label>
                <input
                  type="number"
                  min="0"
                  value={editingProduct.lowStockThreshold}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      lowStockThreshold: Number(e.target.value),
                    })
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
              هل أنت متأكد من حذف المنتج <span className="font-semibold">{deleteTarget.name}</span>؟
              لا يمكن التراجع عن هذا الإجراء.
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

export default Inventory;
