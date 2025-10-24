// utils/fallbackFAQ.ts
export async function loadFAQ() {
    try {
        const res = await fetch('/api/faq');
        return await res.json();
    }
    catch {
        console.warn('FAQ fetch failed, using fallback');
        return [
            { question: 'เควสไม่สำเร็จต้องทำอย่างไร?', answer: 'ตรวจสอบเงื่อนไขและลองใหม่อีกครั้ง' },
            { question: 'MeeBot ไม่ตอบสนอง?', answer: 'ลองรีเฟรชหน้า หรือเปิดโหมด sprite ใหม่ใน Settings' }
        ];
    }
}
//# sourceMappingURL=fallbackFAQ.js.map