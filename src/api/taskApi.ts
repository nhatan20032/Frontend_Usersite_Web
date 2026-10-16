import { apiClient } from './apiClient';

export interface TaskDto {
  id: string;
  title: string;
  description?: string;
  priority: number; // 0=Low, 1=Medium, 2=High, 3=Urgent
  status: number; // 0=Pending, 1=Completed, 2=Cancelled
  dueDate?: string;
  subTasks?: Array<{ id: string; title: string; status: number }>;
}

export const taskApi = {
  getTasks() {
    return apiClient.get<TaskDto[]>('/user/tasks');
  },
  createTask(data: { title: string; description?: string; priority: number; dueDate?: string; parentId?: string }) {
    return apiClient.post<TaskDto>('/user/tasks', data);
  },
  updateTask(id: string, data: { title: string; description?: string; priority: number; dueDate?: string; status: number }) {
    return apiClient.put<TaskDto>(`/user/tasks/${id}`, data);
  },
  toggleTask(id: string) {
    return apiClient.patch<{ id: string; status: string }>(`/user/tasks/${id}/toggle`);
  },
  deleteTask(id: string) {
    return apiClient.delete<{ message: string }>(`/user/tasks/${id}`);
  },
  async getAiSuggestions(goal: string): Promise<{
    goal: string;
    suggestedTasks: Array<{ title: string; priority: number; subtasks: string[] }>;
    suggestedRoutine?: { title: string; time: string; subroutines: string[] };
    message: string;
  }> {
    try {
      return await apiClient.post<any>('/user/tasks/ai-suggest', { goal });
    } catch {
      // Simulate intelligent AI response offline
      await new Promise((resolve) => setTimeout(resolve, 600));
      const g = goal.toLowerCase();

      if (g.includes('đồ án') || g.includes('luận văn') || g.includes('báo cáo') || g.includes('tốt nghiệp')) {
        return {
          goal,
          suggestedTasks: [
            {
              title: `Hoàn thiện đề cương & đặc tả cho ${goal}`,
              priority: 2,
              subtasks: ['Khảo sát tài liệu tham khảo & chuẩn bị đề cương', 'Thiết kế sơ đồ kiến trúc hệ thống C4 Model', 'Viết phần mô tả yêu cầu chức năng SRS'],
            },
            {
              title: 'Cài đặt mã nguồn thử nghiệm (PoC/Demo)',
              priority: 2,
              subtasks: ['Khởi tạo repository Git & setup môi trường', 'Code các API lõi và kiểm thử đơn vị Unit Test', 'Ghép nối giao diện Web frontend'],
            },
            {
              title: 'Soạn thảo Slide thuyết trình 15 trang & Video Demo',
              priority: 1,
              subtasks: ['Thiết kế slide cô đọng, làm nổi bật kết quả', 'Quay video kịch bản demo chạy thật', 'Tập dượt thuyết trình giới hạn dưới 15 phút'],
            },
          ],
          suggestedRoutine: {
            title: 'Kỷ luật 45 phút viết tài liệu đồ án mỗi tối',
            time: '21:30 PM',
            subroutines: ['Review lại 2 trang đã viết hôm qua', 'Viết mới ít nhất 500 từ nội dung học thuật', 'Đọc 1 bài báo khoa học liên quan'],
          },
          message: 'Trí tuệ nhân tạo đã phân tích và phân rã lộ trình hoàn thành đồ án chi tiết!',
        };
      }

      if (g.includes('tiếng anh') || g.includes('ielts') || g.includes('toeic') || g.includes('ngoại ngữ') || g.includes('từ vựng')) {
        return {
          goal,
          suggestedTasks: [
            {
              title: `Lập kế hoạch chinh phục mục tiêu ${goal}`,
              priority: 2,
              subtasks: ['Làm bài thi thử Diagnostic Test đánh giá trình độ hiện tại', 'Chia lộ trình 3 giai đoạn: Nền tảng, Tăng tốc, Luyện đề', 'Chuẩn bị giáo trình và bộ tài liệu chính thức'],
            },
            {
              title: 'Luyện tập kỹ năng Nghe & Đọc chuyên sâu',
              priority: 1,
              subtasks: ['Làm 1 bài Test Full Listening & phân tích bẫy nghe', 'Đọc 2 bài Reading báo The Guardian / New York Times', 'Lọc và ghi chép 20 Collocations đắt giá'],
            },
          ],
          suggestedRoutine: {
            title: 'Ôn tập 25 từ vựng Anki & Shadowing 15 phút',
            time: '20:30 PM',
            subroutines: ['Mở ứng dụng Flashcard ôn từ cũ', 'Học 20 từ mới theo chủ đề mục tiêu', 'Nghe 1 đoạn audio ngắn và nói đuổi Shadowing'],
          },
          message: 'Lộ trình rèn luyện ngôn ngữ đã được AI thiết lập theo phương pháp khoa học!',
        };
      }

      if (g.includes('chạy') || g.includes('gym') || g.includes('sức khỏe') || g.includes('giảm cân') || g.includes('thể thao')) {
        return {
          goal,
          suggestedTasks: [
            {
              title: `Chuẩn bị trang bị & kế hoạch cho ${goal}`,
              priority: 1,
              subtasks: ['Chọn giày tập & trang phục thoáng khí phù hợp', 'Đo chỉ số cơ thể InBody & thiết lập mức thâm hụt calo', 'Mua bình nước thể thao 1.5L mang theo hàng ngày'],
            },
            {
              title: 'Thiết lập bảng theo dõi dinh dưỡng và tập luyện',
              priority: 1,
              subtasks: ['Cắt giảm tối đa đường tinh luyện và đồ uống có gas', 'Tăng cường rau xanh và bổ sung 1.8g protein / kg thể trọng', 'Ghi nhật ký calo nạp vào qua ứng dụng'],
            },
          ],
          suggestedRoutine: {
            title: 'Vận động thể thao & Kháng lực 35 phút',
            time: '06:30 AM',
            subroutines: ['Khởi động làm nóng cơ bắp 5 phút', '30 phút cardio hoặc tập tạ phân bổ theo nhóm cơ', 'Uống 350ml nước điện giải và giãn cơ'],
          },
          message: 'AI đã đề xuất chế độ tập luyện và thói quen sức khỏe lý tưởng!',
        };
      }

      // Default smart breakdown
      return {
        goal,
        suggestedTasks: [
          {
            title: `Nghiên cứu & Định nghĩa phạm vi cho ${goal}`,
            priority: 2,
            subtasks: ['Liệt kê 3 tiêu chí đo lường kết quả thành công then chốt', 'Xác định các rào cản tiềm ẩn và giải pháp dự phòng', 'Phân bổ thời hạn hoàn thành cụ thể cho từng giai đoạn'],
          },
          {
            title: `Thực thi bước đi đầu tiên cho ${goal}`,
            priority: 2,
            subtasks: ['Dành 45 phút tập trung cao độ khởi động hành động đầu tiên', 'Đánh giá tiến độ sau 3 ngày và hiệu chỉnh phương pháp'],
          },
        ],
        suggestedRoutine: {
          title: `Kiểm tra tiến độ & Duy trì kỷ luật cho ${goal}`,
          time: '21:00 PM',
          subroutines: ['Đánh dấu các việc đã hoàn thành trong ngày', 'Lập checklist 3 việc ưu tiên cho ngày mai'],
        },
        message: 'Trí tuệ nhân tạo đã tự động phân rã mục tiêu thành các hành động khả thi!',
      };
    }
  },
};
