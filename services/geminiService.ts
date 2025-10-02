
import { PRODUCTS } from '../data/mock';

// This is a mock service to simulate Gemini API responses.
// In a real application, this would import { GoogleGenAI } and make actual API calls.

export const getAiInsight = async (prompt: string): Promise<string> => {
  console.log(`Simulating Gemini call for prompt: "${prompt}"`);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  if (prompt.includes("أكثر المنتجات مبيعاً") || prompt.includes("أفضل المنتجات")) {
    const topProducts = [...PRODUCTS].sort((a, b) => b.stock - a.stock).slice(0, 5);
    const productList = topProducts.map((p, i) => `${i + 1}. ${p.name} (السعر: ${p.price} ر.س)`).join('\n');
    return `بناءً على التحليل، هذه هي المنتجات الأكثر طلباً:\n\n${productList}`;
  }

  if (prompt.includes("مبيعات اليوم")) {
    return "بلغ إجمالي المبيعات لليوم 1,250 ر.س. يعتبر هذا أداءً جيداً مقارنة بالأمس.";
  }
  
  if (prompt.includes("اقتراح لتحسين")) {
    return "لتحسين الكفاءة، أقترح الترويج لـ 'وجبة البرجر' التي تتضمن برجر وبطاطا ومشروب بسعر مخفض. هذا قد يزيد من متوسط قيمة الطلب.";
  }

  return "أنا هنا للمساعدة في تحليل بيانات مطعمك. يمكنك أن تسألني عن المبيعات، أفضل المنتجات، أو تطلب اقتراحات.";
};
