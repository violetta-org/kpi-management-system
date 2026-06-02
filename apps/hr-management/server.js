const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Groq } = require('groq-sdk');

const app = express();
const port = 3001;

// Enable CORS for frontend requests
app.use(cors());
app.use(express.json());

const apiKey = process.env.GROQ_API_KEY;

// Initialize Groq SDK only if API Key is available
let groq = null;
if (apiKey) {
  groq = new Groq({ apiKey });
}

app.post('/api/improve-kpi', async (req, res) => {
  try {
    if (!groq) {
      return res.status(500).json({ error: 'GROQ_API_KEY chưa được cấu hình trên server.' });
    }

    const { kpiText } = req.body;
    if (!kpiText) {
      return res.status(400).json({ error: 'kpiText is required' });
    }

    const systemPrompt = "Bạn là chuyên gia nhân sự (HR Expert). Nhiệm vụ của bạn là tối ưu hóa tên mục tiêu KPI sau đây để đạt chuẩn S.M.A.R.T (Cụ thể, Đo lường được, Khả thi, Liên quan, Có thời hạn). Hãy trả về duy nhất một câu KPI tiếng Việt đã được tối ưu, độ dài không quá 25 từ, ngôn ngữ chuyên nghiệp. Tuyệt đối không giải thích hay thêm bất kỳ chữ nào ngoài câu trả lời.";

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Original KPI: ${kpiText}` },
      ],
      model: 'llama3-70b-8192',
      temperature: 0.7,
      max_tokens: 100,
    });

    const optimizedKpi = chatCompletion.choices[0]?.message?.content?.trim() || kpiText;

    res.json({ result: optimizedKpi });

  } catch (error) {
    console.error('Groq API Error:', error);
    res.status(500).json({ error: 'Lỗi khi gọi Groq API' });
  }
});

app.listen(port, () => {
  console.log(`HR Management Backend listening at http://localhost:${port}`);
  if (!apiKey) {
    console.warn('CẢNH BÁO: Chưa tìm thấy GROQ_API_KEY trong file .env');
  } else {
    console.log('Đã kết nối thành công với Groq API.');
  }
});
