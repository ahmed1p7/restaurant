import React, { useState } from 'react';
import { CATEGORIES, PRODUCTS, TABLES } from '../data/mock';
import { Category, Product, OrderItem, Table, TableStatus, OrderType } from '../types';
import { useOrders } from '../contexts/OrdersContext';

const POS: React.FC = () => {
  const { addOrder } = useOrders();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(CATEGORIES[0].id);
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [activeView, setActiveView] = useState<'menu' | 'tables'>('menu');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [orderType, setOrderType] = useState<OrderType>(OrderType.DINE_IN);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleProductClick = (product: Product) => {
    setPaymentSuccess(false);
    setCurrentOrder((prevOrder) => {
      const existingItem = prevOrder.find((item) => item.id === product.id);
      if (existingItem) {
        return prevOrder.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Reject out-of-stock items.
      if (product.stock <= 0) return prevOrder;
      return [...prevOrder, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, amount: number) => {
    setCurrentOrder((prevOrder) => {
      const updatedOrder = prevOrder.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + amount } : item
      );
      return updatedOrder.filter((item) => item.quantity > 0);
    });
  };

  const calculateTotal = () => {
    return currentOrder.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTableColor = (status: TableStatus) => {
    switch (status) {
      case TableStatus.AVAILABLE:
        return 'border-sea-green-500 bg-sea-green-50';
      case TableStatus.OCCUPIED:
        return 'border-yellow-500 bg-yellow-50';
      case TableStatus.RESERVED:
        return 'border-red-500 bg-red-50';
    }
  };

  const handleCheckout = () => {
    if (currentOrder.length === 0) return;
    const total = calculateTotal() * 1.15;
    addOrder({
      items: currentOrder,
      total,
      type: orderType,
      tableId: orderType === OrderType.DINE_IN ? selectedTable?.id : undefined,
    });

    setPaymentSuccess(true);
    setCurrentOrder([]);
    setSelectedTable(null);

    // Hide the success banner after a few seconds.
    setTimeout(() => setPaymentSuccess(false), 3500);
  };

  const filteredProducts = PRODUCTS.filter((p) => p.categoryId === selectedCategoryId);
  const orderTotal = calculateTotal();

  const orderTypeOptions: { value: OrderType; label: string }[] = [
    { value: OrderType.DINE_IN, label: 'داخلي' },
    { value: OrderType.TAKEAWAY, label: 'خارجي' },
    { value: OrderType.DELIVERY, label: 'توصيل' },
  ];

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">نقطة البيع</h1>
        <div className="flex items-center bg-white rounded-lg shadow-sm">
          <button
            onClick={() => setActiveView('menu')}
            className={`px-6 py-2 rounded-lg text-lg font-semibold transition ${
              activeView === 'menu' ? 'bg-sea-blue-500 text-white' : 'text-gray-600'
            }`}
          >
            القائمة
          </button>
          <button
            onClick={() => setActiveView('tables')}
            className={`px-6 py-2 rounded-lg text-lg font-semibold transition ${
              activeView === 'tables' ? 'bg-sea-blue-500 text-white' : 'text-gray-600'
            }`}
          >
            الطاولات
          </button>
        </div>
      </div>

      {paymentSuccess && (
        <div className="mb-4 bg-sea-green-100 border border-sea-green-300 text-sea-green-800 rounded-lg p-4 text-center font-semibold">
          ✅ تم إنشاء الطلب بنجاح وإرساله إلى المطبخ / شاشة المشروبات.
        </div>
      )}

      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Main Content: Menu or Tables */}
        <div className="flex-[2] bg-white rounded-xl shadow-lg flex flex-col">
          {activeView === 'menu' ? (
            <>
              <div className="p-4 border-b">
                <div className="flex space-x-2 space-x-reverse">
                  {CATEGORIES.map((cat: Category) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategoryId(cat.id)}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        selectedCategoryId === cat.id
                          ? 'bg-sea-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 p-4 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product: Product) => {
                  const outOfStock = product.stock <= 0;
                  return (
                    <div
                      key={product.id}
                      onClick={() => !outOfStock && handleProductClick(product)}
                      className={`relative border rounded-lg p-2 text-center transition group ${
                        outOfStock
                          ? 'opacity-50 cursor-not-allowed bg-gray-100'
                          : 'cursor-pointer hover:shadow-md hover:border-sea-blue-500'
                      }`}
                    >
                      {outOfStock && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                          نفد
                        </span>
                      )}
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-24 object-cover rounded-md mb-2"
                      />
                      <h3 className="font-semibold text-gray-800 group-hover:text-sea-blue-600">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500">{product.price} ر.س</p>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="p-4 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {TABLES.map((table) => (
                <div
                  key={table.id}
                  onClick={() => setSelectedTable(table)}
                  className={`border-2 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition ${getTableColor(
                    table.status
                  )} ${selectedTable?.id === table.id && 'ring-4 ring-sea-blue-400'}`}
                >
                  <p className="text-xl font-bold text-gray-800">{table.name}</p>
                  <p className="text-sm text-gray-600">{table.seats} مقاعد</p>
                  <p
                    className={`mt-2 text-xs font-bold ${
                      table.status === TableStatus.AVAILABLE
                        ? 'text-sea-green-700'
                        : 'text-yellow-700'
                    }`}
                  >
                    {table.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Panel */}
        <div className="flex-1 bg-white rounded-xl shadow-lg flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">
              الطلب الحالي {selectedTable ? `(${selectedTable.name})` : ''}
            </h2>

            {/* Order type selector */}
            <div className="mt-3 flex space-x-2 space-x-reverse">
              {orderTypeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setOrderType(opt.value)}
                  className={`px-3 py-1 text-sm rounded-full transition ${
                    orderType === opt.value
                      ? 'bg-sea-maroon text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {currentOrder.length === 0 ? (
              <p className="text-center text-gray-500 mt-8">لم يتم إضافة أي منتجات</p>
            ) : (
              <div className="space-y-3">
                {currentOrder.map((item) => (
                  <div key={item.id} className="flex items-center">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                    <div className="mr-3 flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.price} ر.س</p>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-7 h-7 bg-gray-200 rounded-md font-bold"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 bg-gray-200 rounded-md font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-gray-50 rounded-b-xl">
            <div className="flex justify-between items-center mb-4 text-lg">
              <span className="text-gray-600">المجموع الفرعي</span>
              <span className="font-semibold">{orderTotal.toFixed(2)} ر.س</span>
            </div>
            <div className="flex justify-between items-center mb-4 text-lg">
              <span className="text-gray-600">الضريبة (15%)</span>
              <span className="font-semibold">{(orderTotal * 0.15).toFixed(2)} ر.س</span>
            </div>
            <div className="flex justify-between items-center mb-6 text-2xl font-bold">
              <span className="text-gray-800">الإجمالي</span>
              <span className="text-sea-blue-600">{(orderTotal * 1.15).toFixed(2)} ر.س</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={currentOrder.length === 0}
              className="w-full bg-sea-green-500 text-white text-xl font-bold py-4 rounded-lg hover:bg-sea-green-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              الدفع وإرسال الطلب
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
