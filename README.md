<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# SEA Restaurant Management

نظام متكامل لإدارة المطاعم باللغة العربية (RTL)، يشمل نقطة البيع (POS)، شاشة المطبخ (KDS)، شاشة المشروبات، إدارة المخزون، الموظفين، التقارير، والإعدادات — مع مساعد ذكي مدمج يعتمد على Gemini API.

## ✨ المميزات

- 🛒 **نقطة بيع (POS)**: تصفح المنتجات حسب الفئة، إنشاء طلبات، اختيار الطاولة، حساب الضريبة تلقائيًا.
- 🍳 **شاشة المطبخ (KDS)**: عرض الطلبات الواردة للمطبخ فقط (تُفلتر تلقائيًا حسب `screen`).
- 🍹 **شاشة المشروبات**: مثل KDS لكن لأصناف المشروبات.
- 📦 **إدارة المخزون**: إضافة/تعديل/حذف المنتجات مع بحث وفلاتر وتنبيهات المخزون المنخفض.
- 👥 **إدارة الموظفين**: إدارة الموظفين وأدوارهم وحالاتهم ورموزهم السرية.
- 📊 **التقارير والتحليلات**: رسوم بيانية حية للمبيعات الأسبوعية، المبيعات حسب الفئة، والأكثر مبيعاً.
- ⚙️ **الإعدادات**: معلومات المطعم، الضريبة، الطابعة، والإشعارات.
- 🤖 **مساعد SEA الذكي**: شات مبني على Gemini API مع fallback محلي عند غياب مفتاح API.
- 🔐 **نظام صلاحيات**: 4 أدوار (supervisor / waiter / kitchen / bar) مع `ProtectedRoute`.

## 🛠️ التقنيات المستخدمة

| التقنية | الاستخدام |
|---------|-----------|
| React 19 | إطار العمل |
| TypeScript | الأنواع |
| Vite | Bundler & Dev Server |
| React Router 6 | التنقل |
| Tailwind CSS | التنسيق (CDN + إعداد npm كامل) |
| Recharts | الرسوم البيانية |
| Google Gemini API | المساعد الذكي |

## 🚀 التشغيل محليًا

**المتطلبات:** Node.js 18+

```bash
# 1. تثبيت الاعتماديات
npm install

# 2. (اختياري) إعداد مفتاح Gemini API
cp .env.example .env.local
# ثم عدّل ملف .env.local وضع مفتاحك
# GEMINI_API_KEY=your_key_here

# 3. تشغيل المشروع
npm run dev
```

افتح المتصفح على: http://localhost:3000

## 🔑 بيانات الدخول التجريبية

> 🔒 **ملاحظة أمنية**: هذه البيانات للتجربة فقط وتعتمد على ملف `data/mock.ts`. في بيئة الإنتاج يجب نقل المصادقة إلى backend مع تشفير كلمة المرور.

| الدور | البيانات |
|------|---------|
| مشرف (Supervisor) | اسم المستخدم: `admin` + كلمة المرور: `admin123` |
| نادل (Waiter) | PIN: `101`, `102`, `103` |
| مطبخ (Kitchen) | PIN: `111` |
| مشروبات (Bar) | PIN: `222` |

> ملاحظة: الموظفون غير النشطين (`Inactive`) لا يمكنهم تسجيل الدخول.

## 📁 بنية المشروع

```
restaurant/
├── App.tsx                  # تعريف المسارات الرئيسية
├── index.tsx                # نقطة الدخول
├── index.html               # HTML + Tailwind CDN config
├── constants.tsx            # روابط القائمة الجانبية
├── types.ts                 # تعريفات TypeScript
├── contexts/
│   ├── AuthContext.tsx      # منطق المصادقة
│   └── OrdersContext.tsx    # حالة الطلبات المشاركة بين الشاشات
├── components/
│   ├── MainLayout.tsx
│   ├── Sidebar.tsx
│   ├── ProtectedRoute.tsx
│   ├── AiAssistant.tsx
│   ├── DashboardCard.tsx
│   ├── SalesChart.tsx
│   └── icons/               # أيقونات SVG مخصصة
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── POS.tsx
│   ├── KDS.tsx              # شاشة المطبخ
│   ├── Drinks.tsx           # شاشة المشروبات
│   ├── Inventory.tsx
│   ├── Employees.tsx
│   ├── Reports.tsx
│   └── Settings.tsx
├── services/
│   └── geminiService.ts     # تكامل Gemini AI مع fallback محلي
├── data/
│   └── mock.ts              # بيانات تجريبية
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
└── package.json
```

## 🔄 مزامنة الطلبات بين الشاشات

عند إنشاء طلب جديد من POS، يُضاف تلقائيًا إلى `OrdersContext` ويظهر فورًا في:
- ✅ شاشة المطبخ (KDS) — للأصناف التي `screen: 'kitchen'`
- ✅ شاشة المشروبات (Drinks) — للأصناف التي `screen: 'bar'`
- ✅ لوحة التحكم (Dashboard) — في آخر الطلبات

عند تحديث حالة الطلب في أي شاشة (NEW → PREPARING → READY → COMPLETED)، ينعكس التغيير فورًا في كل الشاشات الأخرى.

## 🤖 المساعد الذكي (Gemini API)

- عند ضبط `GEMINI_API_KEY` في `.env.local`، يستخدم المساعد Gemini API فعليًا.
- عند غياب المفتاح أو فشل الاتصال، يُحسب رد ذكي محليًا بناءً على بيانات المطعم الحالية (مبيعات، مخزون، موظفين).

## 🧪 سكربتات NPM

```bash
npm run dev         # تشغيل خادم التطوير
npm run build       # بناء نسخة الإنتاج
npm run preview     # معاينة نسخة الإنتاج
npm run typecheck   # فحص الأنواع
```

## 📄 الترخيص

هذا المشروع تعليمي/تجاري خاص. جميع الحقوق محفوظة.
