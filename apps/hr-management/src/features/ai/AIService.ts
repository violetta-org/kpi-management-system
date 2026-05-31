// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  AIService.ts – Lớp dịch vụ gọi Google Gemini 2.5 Flash
//  Thiết kế theo nguyên lý RAG (Retrieval-Augmented Generation):
//  Mọi prompt đều được TIÊM ngữ cảnh nghiệp vụ thực tế từ Database
//  trước khi gửi lên Server AI để đảm bảo câu trả lời chính xác.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const HARDCODED_GEMINI_API_KEY: string = "AQ.Ab8RN6LeX5xGlbM8m3ses5e0A_GSqcCq8rj2fclEtRf0_Kmwjw";

function getGeminiApiKey(): string {
  try {
    const savedKey = typeof window !== 'undefined' ? localStorage.getItem('VIBE_GEMINI_API_KEY') : null;
    if (savedKey && savedKey.trim() !== '') {
      return savedKey.trim();
    }
  } catch (e) {
    console.warn('[AIService] Failed to read from localStorage:', e);
  }
  return HARDCODED_GEMINI_API_KEY;
}

// ── Ngữ cảnh hệ thống (System Context) ─────────────────────────
// Đây là "bộ nhớ nền" giúp AI luôn hiểu rằng nó đang phục vụ cho
// một phần mềm Quản trị Công việc & KPI nội bộ doanh nghiệp,
// KHÔNG PHẢI ứng dụng thương mại điện tử hay bất kỳ lĩnh vực nào khác.
const SYSTEM_CONTEXT = `
Bạn là Trợ lý AI của hệ thống "Quản trị Công việc & KPI nội bộ" (VibePower).
Hệ thống này dùng để: Quản lý dự án nội bộ, phân công & theo dõi công việc (Task),
chấm công (Timesheet), đánh giá hiệu suất nhân sự (Performance Appraisal),
và đo lường KPI (Key Performance Indicator) cho nhân viên trong doanh nghiệp.

Các vai trò trong hệ thống:
- Admin/HR: Quản trị danh mục, cấu trúc tổ chức, phân quyền.
- Project Manager (PM): Lập kế hoạch dự án, giao việc, duyệt timesheet, đánh giá nhân sự.
- Employee (Nhân viên): Thực hiện task, log timesheet hàng ngày, tự đánh giá KPI.

Quy tắc trả lời:
- Trả lời bằng tiếng Việt, ngắn gọn, chuyên nghiệp.
- Luôn phân tích dựa trên DỮ LIỆU THỰC TẾ được cung cấp, không bịa số liệu.
- Không thêm lời chào hỏi, không dùng markdown heading (#), chỉ dùng text thuần.
`.trim();

/**
 * Hàm lõi gọi Google Gemini 2.5 Flash API
 * Mọi request đều được gắn SYSTEM_CONTEXT ở đầu prompt.
 */
async function callGeminiAI(userPrompt: string): Promise<string> {
  const apiKey = getGeminiApiKey();
  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
    throw new Error("Vui lòng cấu hình Gemini API Key!");
  }

  // Sanitize: Loại bỏ các ký tự đặc biệt có thể gây prompt injection
  // eslint-disable-next-line no-control-regex
  const sanitized = userPrompt.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
  const fullPrompt = `${SYSTEM_CONTEXT}\n\n---\n${sanitized}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  // Timeout 15 giây để tránh treo vô hạn khi mất mạng
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1500
        }
      }),
      signal: controller.signal
    });
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error("AI phản hồi quá lâu (timeout 15s). Kiểm tra kết nối mạng.");
    }
    throw new Error("Không thể kết nối tới Server AI. Kiểm tra mạng internet.");
  } finally {
    clearTimeout(timeoutId);
  }

  if (response.status === 429) {
    throw new Error("AI đang quá tải (rate limit). Vui lòng đợi 30 giây rồi thử lại.");
  }

  if (!response.ok) {
    const errBody = await response.text().catch(() => 'Unknown error');
    console.error('[AIService] API Error:', response.status, errBody);
    throw new Error(`Lỗi Server AI (HTTP ${response.status}). Vui lòng kiểm tra lại API Key.`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text || typeof text !== 'string') {
    // Xử lý trường hợp AI từ chối trả lời (safety filter)
    const blockReason = data?.candidates?.[0]?.finishReason;
    if (blockReason === 'SAFETY') {
      throw new Error("Nội dung bị chặn bởi bộ lọc an toàn của AI. Vui lòng thử lại với nội dung khác.");
    }
    throw new Error("AI không trả về kết quả hợp lệ.");
  }
  return text.trim();
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Các Interface cho dữ liệu ngữ cảnh (Context Data Types)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Dữ liệu ngữ cảnh cho Đánh giá Hiệu suất */
export interface PerformanceContext {
  employeeName: string;
  kpiScore: number;
  completedTaskCount: number;
  totalTaskCount: number;
  totalHoursLogged: number;
  taskNames: string[];        // Danh sách tên task đã hoàn thành
  projectNames: string[];     // Danh sách dự án tham gia
}

/** Dữ liệu ngữ cảnh cho Chatbot Cố vấn */
export interface SystemSnapshot {
  totalUsers: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  totalProjects: number;
  totalTimesheetHours: number;
  totalAppraisals: number;
  projectDetails: { name: string; taskCount: number; completedCount: number }[];
  topEmployees: { name: string; taskCount: number }[];
  kpiSummary: { avgScore: number; belowThreshold: number };
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  Export: Các hàm AI chính của hệ thống
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const AIService = {

  getSavedApiKey: (): string => {
    try {
      return typeof window !== 'undefined' ? localStorage.getItem('VIBE_GEMINI_API_KEY') || '' : '';
    } catch {
      return '';
    }
  },

  saveApiKey: (key: string): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('VIBE_GEMINI_API_KEY', key.trim());
      }
    } catch (e) {
      console.error('[AIService] Failed to save key:', e);
    }
  },

  // ─── 1. SINH MÔ TẢ TASK (có ngữ cảnh dự án) ───────────────────
  generateTaskDescription: async (
    taskName: string,
    projectName: string,
    phaseName: string
  ): Promise<string> => {
    // Guard: Không cho gọi AI nếu chưa nhập tên task
    const safeName = (taskName || '').trim();
    if (!safeName) {
      throw new Error("Vui lòng nhập Tên Task trước khi nhờ AI viết mô tả.");
    }
    const prompt = `
[YÊU CẦU] Viết mô tả công việc (Task Description) cho một task trong hệ thống quản trị nội bộ.

Thông tin task:
- Tên task: "${safeName}"
- Thuộc dự án: "${projectName || 'Chưa gán dự án'}"
- Giai đoạn: "${phaseName || 'Chưa xác định'}"

Viết đúng 3 gạch đầu dòng, mỗi dòng là 1-2 câu ngắn gọn:
• Mục tiêu: (Nêu rõ mục đích hoàn thành task "${safeName}")
• Yêu cầu: (Liệt kê 2-3 yêu cầu kỹ thuật hoặc nghiệp vụ cần tuân thủ)
• Tiêu chí nghiệm thu: (Điều kiện cụ thể để PM xác nhận task này đã hoàn thành)

QUAN TRỌNG: Không giải thích thêm. Không thêm tiêu đề. Chỉ trả về đúng 3 gạch đầu dòng.
`.trim();
    return await callGeminiAI(prompt);
  },

  // ─── 2. CHUẨN HÓA VĂN PHONG TIMESHEET ────────────────────────
  refineTimesheetText: async (
    rawText: string,
    taskName: string
  ): Promise<string> => {
    // Guard: Không cho gọi AI nếu ô mô tả trống
    const safeText = (rawText || '').trim();
    if (!safeText || safeText === 'Đã làm việc') {
      throw new Error("Vui lòng nhập mô tả công việc trước khi nhờ AI chuẩn hóa.");
    }
    const prompt = `
[YÊU CẦU] Viết lại câu báo cáo chấm công (Timesheet) sau đây thành MỘT CÂU VĂN DUY NHẤT,
chuyên nghiệp, súc tích theo chuẩn báo cáo công việc nội bộ doanh nghiệp.

Task đang thực hiện: "${taskName || 'Công việc chung'}"
Nội dung gốc của nhân viên: "${safeText}"

Chỉ trả về đúng 1 câu văn đã được chuẩn hóa, không giải thích thêm.
`.trim();
    return await callGeminiAI(prompt);
  },

  // ─── 3. NHẬN XÉT HIỆU SUẤT (dựa trên dữ liệu thực) ─────────
  generatePerformanceReview: async (ctx: PerformanceContext): Promise<string> => {
    // Guard: Bảo vệ khi data rỗng
    const name = ctx.employeeName || 'Nhân viên';
    const score = typeof ctx.kpiScore === 'number' && !isNaN(ctx.kpiScore) ? ctx.kpiScore : 0;
    const prompt = `
[YÊU CẦU] Viết nhận xét đánh giá hiệu suất cuối kỳ cho nhân viên.

═══ DỮ LIỆU THỰC TẾ TỪ DATABASE ═══
• Họ tên: ${name}
• Điểm KPI: ${score}/100
• Task hoàn thành: ${ctx.completedTaskCount || 0}/${ctx.totalTaskCount || 0}
• Tổng giờ chấm công: ${ctx.totalHoursLogged || 0}h
• Các task đã làm: ${ctx.taskNames?.length > 0 ? ctx.taskNames.join(', ') : 'Chưa có dữ liệu'}
• Dự án tham gia: ${ctx.projectNames?.length > 0 ? ctx.projectNames.join(', ') : 'Chưa có dữ liệu'}
═════════════════════════════════════

Viết đoạn nhận xét 3-4 câu, bao gồm:
1. Đánh giá tổng quan dựa trên số liệu thực tế ở trên
2. Điểm mạnh hoặc điểm cần cải thiện (dựa trên tỷ lệ hoàn thành task và giờ làm)
3. Khuyến nghị cụ thể cho kỳ tiếp theo

Văn phong: Khách quan, chuyên nghiệp, có số liệu dẫn chứng.
`.trim();
    return await callGeminiAI(prompt);
  },

  // ─── 4. CHATBOT CỐ VẤN DỰ ÁN (RAG đầy đủ) ───────────────────
  askAdvisor: async (
    userQuestion: string,
    snapshot: SystemSnapshot
  ): Promise<string> => {
    // Guard: Câu hỏi trống
    const safeQuestion = (userQuestion || '').trim();
    if (!safeQuestion) return "Bạn cần tôi giúp gì về dữ liệu dự án?";

    // Guard: Fallback cho snapshot nếu bị thiếu (undefined/null)
    const safeSnapshot = snapshot || {
      totalUsers: 0, totalTasks: 0, completedTasks: 0, overdueTasks: 0,
      totalProjects: 0, totalTimesheetHours: 0, totalAppraisals: 0,
      projectDetails: [], topEmployees: [], kpiSummary: { avgScore: 0, belowThreshold: 0 }
    };

    // Xây dựng bản tóm tắt dữ liệu chi tiết từ Database
    const projectLines = Array.isArray(safeSnapshot.projectDetails) && safeSnapshot.projectDetails.length > 0
      ? safeSnapshot.projectDetails.map(p =>
          `  - ${p?.name || 'Dự án'}: ${p?.completedCount || 0}/${p?.taskCount || 0} task hoàn thành (${p?.taskCount > 0 ? Math.round((p.completedCount / p.taskCount) * 100) : 0}%)`
        ).join('\n')
      : '  (Chưa có dự án nào)';

    const topEmpLines = Array.isArray(safeSnapshot.topEmployees) && safeSnapshot.topEmployees.length > 0
      ? safeSnapshot.topEmployees.map(e => `  - ${e?.name || 'Nhân viên'}: ${e?.taskCount || 0} tasks`).join('\n')
      : '  (Chưa có dữ liệu)';

    const dataContext = `
═══ DỮ LIỆU THỰC TẾ TỪ DATABASE (Real-time) ═══
Tổng nhân sự: ${safeSnapshot.totalUsers || 0}
Tổng task: ${safeSnapshot.totalTasks || 0} (Hoàn thành: ${safeSnapshot.completedTasks || 0}, Trễ hạn: ${safeSnapshot.overdueTasks || 0})
Tổng dự án: ${safeSnapshot.totalProjects || 0}
Tổng giờ chấm công: ${safeSnapshot.totalTimesheetHours || 0}h
Số đợt đánh giá: ${safeSnapshot.totalAppraisals || 0}
KPI trung bình: ${safeSnapshot.kpiSummary?.avgScore || 0}/100 (Dưới ngưỡng: ${safeSnapshot.kpiSummary?.belowThreshold || 0} người)

Chi tiết từng dự án:
${projectLines}

Top nhân viên (theo số task):
${topEmpLines}
═════════════════════════════════════════════════
`.trim();

    const prompt = `
${dataContext}

[CÂU HỎI CỦA NGƯỜI DÙNG]: "${safeQuestion}"

Hãy trả lời dựa trên dữ liệu thực tế ở trên. Nếu câu hỏi yêu cầu phân tích rủi ro,
hãy so sánh tỷ lệ hoàn thành task và giờ chấm công để đưa ra cảnh báo.
Nếu câu hỏi không liên quan đến dữ liệu, hãy trả lời dựa trên vai trò cố vấn quản lý dự án.
`.trim();
    return await callGeminiAI(prompt);
  },

  // ─── 5. XÉ NHỎ CÔNG VIỆC DỰ ÁN ───────────────────────────────
  breakdownProjectTasks: async (
    projectName: string,
    existingTaskNames: string[]
  ): Promise<string> => {
    const safeName = (projectName || '').trim();
    if (!safeName) {
      throw new Error("Vui lòng nhập Tên Dự Án trước khi xé nhỏ task.");
    }
    const safeTasks = Array.isArray(existingTaskNames) ? existingTaskNames : [];
    const existingInfo = safeTasks.length > 0
      ? `Các task đã có trong dự án: ${safeTasks.join(', ')}.`
      : 'Dự án hiện chưa có task nào.';

    const prompt = `
[YÊU CẦU] Đề xuất 3 task mới cho dự án NỘI BỘ doanh nghiệp.

Tên dự án: "${safeName}"
${existingInfo}

Hãy đề xuất đúng 3 task MỚI (không trùng với task đã có), phù hợp với dự án quản lý nội bộ.
Mỗi task gồm: Tên task và mô tả 1 dòng.
Trình bày dạng danh sách gạch đầu dòng.
`.trim();
    return await callGeminiAI(prompt);
  }
};
