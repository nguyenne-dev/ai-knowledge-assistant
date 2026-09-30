import { LLMFactory } from '../providers/llm/llm.factory.js';
import { ragService } from './rag.service.js';
import { conversationService } from './conversation.service.js';

export interface ChatSourceItem {
  source: string;
  section: string;
}

export interface ChatResult {
  answer: string;
  sources: ChatSourceItem[];
  conversationId: string;
}

export class ChatService {
  async handleUserMessage(message: string, conversationId?: string): Promise<ChatResult> {
    if (!message || message.trim().length === 0) {
      throw new Error('Message cannot be empty');
    }

    const trimmedMessage = message.trim();
    const activeConvId = conversationId || `conv-${Date.now()}`;
    const llmProvider = LLMFactory.getProvider();

    // 1. Contextual Query Enrichment for follow-up questions
    const searchMessage = conversationService.enrichQueryWithContext(trimmedMessage, activeConvId);

    // 2. RAG Retrieval Step: Fetch matching knowledge chunks from Qdrant
    const retrieval = await ragService.retrieveContext(searchMessage, 3, 0.45);

    // 3. Retrieve prior dialogue turns
    const historyText = conversationService.formatHistoryForPrompt(activeConvId);
    const historyPromptBlock = historyText
      ? `\n\n---\nLỊCH SỬ TRAO ĐỔI TRƯỚC ĐÓ GIỮA KHÁCH HÀNG VÀ BẠN:\n${historyText}\nLƯU Ý: Nếu câu hỏi mới sử dụng đại từ hoặc câu hỏi rút gọn (ví dụ: "nó có màu gì", "còn hàng không", "size nào"), hãy đối chiếu lịch sử trao đổi trên để hiểu chính xác sản phẩm khách hàng đang quan tâm.\n---`
      : '';

    let systemInstruction: string;

    if (retrieval.contextText && retrieval.contextText.length > 0) {
      // Prompt with Grounded Context and strict anti-hallucination constraint
      systemInstruction = `Bạn là trợ lý chăm sóc khách hàng thông minh và chuyên nghiệp của shop thời trang công nghệ Tech-Fashion.

QUY TẮC BẮT BUỘC:
1. Bạn CHỈ ĐƯỢC PHÉP sử dụng thông tin trong phần "THÔNG TIN NGỮ CẢNH (Context)" dưới đây để trả lời câu hỏi của khách hàng.
2. Trả lời đúng trọng tâm câu hỏi của khách. Không tự ý liệt kê chào bán sản phẩm nếu khách không chủ động hỏi về danh mục/mẫu mã sản phẩm.
3. Khi tư vấn chọn size (chiều cao, cân nặng):
   - Luôn đối chiếu kỹ cả 2 thông số chiều cao và cân nặng trong bảng size chuẩn.
   - Nếu số đo nằm ở ranh giới (ví dụ: 1m60 nằm giữa S và M): hãy giải thích rõ nếu muốn mặc vừa vặn (fit) thì chọn Size S (cho 1m50-1m62), còn nếu muốn thoải mái theo cân nặng 55kg thì chọn Size M (55-64kg). Không tùy tiện khuyên nhảy vọt lên Size L vì người cao 1m60 mặc Size L sẽ bị quá dài.
4. Nếu ngữ cảnh không có thông tin hoặc không đủ để trả lời, bạn PHẢI thông báo rõ ràng rằng hiện tại cửa hàng chưa có thông tin về nội dung này, tuyệt đối KHÔNG ĐƯỢC TỰ BỊA ĐẶT.
5. KHÔNG tự chế ra giá cả, kích cỡ, màu sắc, chính sách bảo hành hay tồn kho ngoài những gì đã nêu trong ngữ cảnh.
6. Trả lời bằng tiếng Việt thân thiện, lịch thiệp, súc tích, tự nhiên.${historyPromptBlock}

---
THÔNG TIN NGỮ CẢNH ĐƯỢC TRÍCH XUẤT TỪ HỆ THỐNG:
${retrieval.contextText}
---`;
    } else {
      // No relevant context found in Knowledge Base -> Strict fallback prompt
      systemInstruction = `Bạn là trợ lý chăm sóc khách hàng của shop Tech-Fashion.${historyPromptBlock}
Câu hỏi của khách hàng không tìm thấy thông tin nào phù hợp trong kho kiến thức nội bộ của cửa hàng.
Bạn hãy lịch sự thông báo rằng hiện tại Tech-Fashion chưa có thông tin hoặc không kinh doanh sản phẩm này, và gợi ý khách hàng có thể hỏi về các sản phẩm như Áo khoác Tech A01, Tech Hoodie T02, chính sách giao hàng hoặc đổi trả của shop.`;
    }

    // 4. Generation Step: Low temperature for high factual adherence
    const answer = await llmProvider.generateResponse(trimmedMessage, {
      systemInstruction,
      temperature: 0.3,
    });

    // 5. Save turn into session memory
    conversationService.addMessage(activeConvId, 'user', trimmedMessage);
    conversationService.addMessage(activeConvId, 'assistant', answer);

    return {
      answer,
      sources: retrieval.sources,
      conversationId: activeConvId,
    };
  }
}

export const chatService = new ChatService();
