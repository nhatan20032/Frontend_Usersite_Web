export interface RoutineTemplate {
  id: string;
  title: string;
  time: string;
  frequency: string;
  category: 'productivity' | 'health' | 'learning' | 'mindset';
  badge: string;
  badgeColor: string;
  description: string;
  subroutines: string[];
}

export const ROUTINE_TEMPLATES: RoutineTemplate[] = [
  {
    id: 'tpl-1',
    title: 'CLB 5 Giờ Sáng (The 5 AM Club)',
    time: '05:00 AM',
    frequency: 'Hàng ngày',
    category: 'mindset',
    badge: 'Kỷ Luật Đỉnh Cao',
    badgeColor: '#E37400',
    description: 'Quy tắc 20/20/20 của Robin Sharma giúp bạn làm chủ buổi sáng và bứt phá cả ngày.',
    subroutines: [
      'Uống 500ml nước ấm & vận động toát mồ hôi 20 phút',
      'Đọc 10 trang sách phát triển bản thân & viết nhật ký biết ơn 20 phút',
      'Lên danh sách 3 mục tiêu tối thượng cần hoàn thành trong ngày',
    ],
  },
  {
    id: 'tpl-2',
    title: 'Pomodoro Deep Work (Làm việc sâu)',
    time: '08:30 AM',
    frequency: 'Hàng ngày',
    category: 'productivity',
    badge: 'Tập Trung Cao Độ',
    badgeColor: '#1A73E8',
    description: 'Phương pháp tập trung tuyệt đối vào những tác vụ cốt lõi không để thông báo làm phiền.',
    subroutines: [
      'Dọn sạch bàn làm việc & bật chế độ Không làm phiền trên điện thoại',
      'Chu kỳ 1: 50 phút viết mã / soạn thảo tài liệu không gián đoạn',
      'Nghỉ giải lao 10 phút: vận động mắt, uống nước và hít thở sâu',
      'Chu kỳ 2: 50 phút giải quyết dứt điểm các đầu việc trọng yếu',
    ],
  },
  {
    id: 'tpl-3',
    title: 'Luyện thi Tiếng Anh & Từ vựng (Daily English)',
    time: '20:30 PM',
    frequency: 'Hàng ngày',
    category: 'learning',
    badge: 'Ngoại Ngữ & Tri Thức',
    badgeColor: '#8430CE',
    description: 'Duy trì phản xạ ngôn ngữ đều đặn 30 phút mỗi tối để tích lũy vốn từ và ngữ điệu tự nhiên.',
    subroutines: [
      'Ôn tập 25 từ vựng mới theo chủ đề trên Flashcard Anki',
      'Nghe 1 tập Podcast tiếng Anh (BBC 6-Minute hoặc TED Talks) kèm Shadowing',
      'Đặt 5 câu ví dụ thực tế và tự ghi âm phát âm kiểm tra',
    ],
  },
  {
    id: 'tpl-4',
    title: 'Rèn luyện Thể lực & Kháng lực Gym',
    time: '17:30 PM',
    frequency: 'Cứ 2 ngày',
    category: 'health',
    badge: 'Sức Khỏe & Vóc Dáng',
    badgeColor: '#1E8E3E',
    description: 'Tăng cường sức bền, cơ bắp và giải tỏa căng thẳng sau giờ làm việc.',
    subroutines: [
      'Khởi động khớp toàn thân & làm nóng cơ bắp 7 phút',
      '4 hiệp bài tập phức hợp chính (Squat / Deadlift / Bench Press)',
      '3 hiệp bài tập phụ trợ cô lập nhóm cơ mục tiêu',
      'Căng cơ hạ nhiệt 5 phút & bổ sung dinh dưỡng protein',
    ],
  },
  {
    id: 'tpl-5',
    title: 'Giấc ngủ sâu & Digital Detox buổi tối',
    time: '22:30 PM',
    frequency: 'Hàng ngày',
    category: 'health',
    badge: 'Phục Hồi Năng Lượng',
    badgeColor: '#1A73E8',
    description: 'Loại bỏ ánh sáng xanh và thư giãn hệ thần kinh để thức dậy tràn đầy năng lượng.',
    subroutines: [
      'Tắt màn hình điện thoại & máy tính trước giờ ngủ 30 phút',
      'Uống 1 cốc nước ấm hoặc trà thảo mộc hoa cúc',
      'Đọc 15 trang sách giấy dưới ánh đèn vàng dịu nhẹ',
      'Thực hành kỹ thuật hít thở 4-7-8 để đi vào giấc ngủ dễ dàng',
    ],
  },
];
