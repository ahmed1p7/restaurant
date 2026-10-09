import { PRODUCTS, ORDERS, EMPLOYEES } from '../data/mock';
import { OrderStatus } from '../types';

/**
 * Real Gemini AI service.
 *
 * If `process.env.GEMINI_API_KEY` is set (provided by Vite via .env.local),
 * real requests are made through the @google/genai SDK loaded dynamically.
 *
 * If the key is missing or the request fails, we gracefully fall back to
 * locally-computed mock responses so the assistant still works offline / in
 * demo environments. This keeps the UI functional regardless of the
 * environment.
 */

type GeminiModel = {
  generateContent: (params: { contents: Array<{ role: string; parts: Array<{ text: string }> }> }) => Promise<{ response: { text: () => string } }>;
};

let cachedClient: { model: GeminiModel } | null = null;

const buildSystemContext = (): string => {
  const totalSales = ORDERS.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.price * i.quantity, 0),
    0
  );
  const activeOrders = ORDERS.filter(
    (o) => o.status === OrderStatus.NEW || o.status === OrderStatus.PREPARING
  ).length;
  const lowStockProducts = PRODUCTS.filter(
    (p) => p.lowStockThreshold !== undefined && p.stock <= (p.lowStockThreshold as number)
  );
  const topProducts = [...PRODUCTS]
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 5)
    .map((p) => `- ${p.name}: ${p.price} ر.س (مخزون: ${p.stock})`)
    .join('\n');

  return [
    'أنت مساعد ذكي لنظام إدارة مطعم باسم SEA.',
    'العملة المستخدمة هي الريال السعودي (ر.س).',
    `إجمالي المبيعات الحالية في النظام: ${totalSales} ر.س.`,
    `عدد الطلبات النشطة: ${activeOrders}.`,
    `عدد الموظفين النشطين: ${EMPLOYEES.filter((e) => e.status === 'Active').length} من أصل ${EMPLOYEES.length}.`,
    `المنتجات الأكثر توفراً:\n${topProducts}`,
    `منتجات تحتاج إعادة طلب (مخزون منخفض): ${lowStockProducts.map((p) => p.name).join('، ') || 'لا يوجد'}.`,
    'أجب بإيجاز وبالعربية الفصحى المبسطة. استخدم الأرقام العربية إذا أمكن.',
  ].join('\n');
};

const getGeminiClient = async (): Promise<{ model: GeminiModel } | null> => {
  if (cachedClient) return cachedClient;

  // Use the API key injected by Vite (define in vite.config.ts).
  const apiKey =
    (typeof process !== 'undefined' && (process as any).env && (process as any).env.GEMINI_API_KEY) ||
    (typeof process !== 'undefined' && (process as any).env && (process as any).env.API_KEY);

  if (!apiKey) {
    return null;
  }

  try {
    // Dynamic import so the SDK is only loaded when actually needed.
    // The @ts-ignore is intentional — the module is loaded at runtime from a CDN,
    // and TypeScript cannot statically resolve its types.
    const mod: any = await import(
      /* @vite-ignore */ /* @ts-ignore */
      'https://esm.sh/@google/genai'
    );
    const GoogleGenAI = mod.GoogleGenAI || (mod.default && mod.default.GoogleGenAI) || mod.default;
    const client = new GoogleGenAI({ apiKey });
    const model = client.models.get('gemini-2.0-flash-exp');
    cachedClient = { model };
    return cachedClient;
  } catch (err) {
    console.warn('Failed to initialize Gemini client, falling back to mock responses.', err);
    return null;
  }
};

/** Compute a simple local response when no API key / request fails. */
const computeLocalResponse = (prompt: string): string => {
  if (prompt.includes('أكثر المنتجات مبيعاً') || prompt.includes('أفضل المنتجات')) {
    const topProducts = [...PRODUCTS].sort((a, b) => b.stock - a.stock).slice(0, 5);
    const productList = topProducts
      .map((p, i) => `${i + 1}. ${p.name} (السعر: ${p.price} ر.س)`)
      .join('\n');
    return `بناءً على التحليل، هذه هي المنتجات الأكثر طلباً:\n\n${productList}`;
  }

  if (prompt.includes('مبيعات اليوم')) {
    const total = ORDERS.reduce(
      (s, o) => s + o.items.reduce((acc, i) => acc + i.price * i.quantity, 0),
      0
    );
    return `بلغ إجمالي المبيعات الحالية ${total.toLocaleString('ar-EG')} ر.س. ${
      total > 1000 ? 'يعتبر هذا أداءً جيداً.' : 'الأداء يحتاج إلى تحسين.'
    }`;
  }

  if (prompt.includes('اقتراح لتحسين')) {
    return 'لتحسين الكفاءة، أقترح الترويج لـ "وجبة البرجر" التي تتضمن برجر وبطاطا ومشروب بسعر مخفض. هذا قد يزيد من متوسط قيمة الطلب.';
  }

  if (prompt.includes('مخزون') || prompt.includes('مخزون')) {
    const lowStock = PRODUCTS.filter(
      (p) => p.lowStockThreshold !== undefined && p.stock <= (p.lowStockThreshold as number)
    );
    if (lowStock.length === 0) return 'كل المنتجات ضمن مستويات المخزون الآمنة.';
    return `المنتجات التالية تحتاج إعادة طلب قريباً:\n${lowStock
      .map((p) => `- ${p.name} (المتبقي: ${p.stock})`)
      .join('\n')}`;
  }

  if (prompt.includes('موظف') || prompt.includes('طاقم')) {
    const active = EMPLOYEES.filter((e) => e.status === 'Active').length;
    return `لديك حالياً ${active} موظف نشط من أصل ${EMPLOYEES.length}.`;
  }

  return 'أنا هنا للمساعدة في تحليل بيانات مطعمك. يمكنك أن تسألني عن المبيعات، أفضل المنتجات، المخزون، أو تطلب اقتراحات.';
};

export const getAiInsight = async (prompt: string): Promise<string> => {
  const client = await getGeminiClient();

  if (client) {
    try {
      const result = await client.model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              { text: buildSystemContext() },
              { text: `سؤال المستخدم: ${prompt}` },
            ],
          },
        ],
      });
      const text = result.response.text();
      if (text && text.trim().length > 0) return text.trim();
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local response.', err);
    }
  } else {
    // Simulate delay so the loading indicator feels natural in demo mode.
    await new Promise((resolve) => setTimeout(resolve, 600));
  }

  return computeLocalResponse(prompt);
};
