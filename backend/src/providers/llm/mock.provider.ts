import { ILLMProvider, LLMGenerateOptions } from './llm.provider.interface.js';

export class MockProvider implements ILLMProvider {
  async generateResponse(prompt: string, _options?: LLMGenerateOptions): Promise<string> {
    const lower = prompt.toLowerCase();

    if (lower.includes('a01') || lower.includes('áo khoác')) {
      return 'Sản phẩm Áo khoác Tech A01 hiện có giá 499.000 VNĐ, đủ size S, M, L, XL với chất liệu polyester chống nước nhẹ và bảo hành 30 ngày.';
    }

    if (lower.includes('vận chuyển') || lower.includes('ship') || lower.includes('giao hàng')) {
      return 'Thời gian giao hàng dự kiến: Nội thành từ 1-2 ngày, ngoại tỉnh từ 2-5 ngày. Cửa hàng freeship cho đơn hàng từ 500.000 VNĐ.';
    }

    if (lower.includes('đổi trả') || lower.includes('bảo hành')) {
      return 'Chính sách đổi trả trong vòng 07 ngày kể từ khi nhận hàng đối với sản phẩm còn nguyên tem mác. Đổi mới 100% nếu có lỗi từ nhà sản xuất.';
    }

    return `Cảm ơn bạn đã nhắn tin cho Tech-Fashion! Tôi đã nhận được câu hỏi: "${prompt}". Hiện tại hệ thống đang kết nối trực tiếp với backend AI của shop.`;
  }
}
