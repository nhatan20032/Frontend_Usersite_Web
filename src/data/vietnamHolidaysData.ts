/**
 * CẤU HÌNH DỮ LIỆU CÁC NGÀY LỄ VĂN HOÁ & TRUYỀN THỐNG VIỆT NAM
 * Tách biệt hoàn toàn phần dữ liệu khỏi logic thuật toán tính toán thiên văn.
 */

export interface FixedHolidayDef {
  month: number; // 0-indexed: 0 = Tháng 1, 11 = Tháng 12
  day: number;
  title: string;
  desc: string;
  priority?: 'high' | 'medium';
}

export interface LunarHolidayDef {
  lunarMonth: number;
  lunarDay: number;
  title: string;
  desc: string;
  priority?: 'high' | 'medium';
}

/**
 * Danh sách các ngày lễ cố định theo Dương lịch
 */
export const FIXED_CULTURAL_HOLIDAYS: FixedHolidayDef[] = [
  { month: 0, day: 1, title: 'Tết Dương Lịch', desc: 'Nghỉ Tết Dương Lịch toàn quốc', priority: 'high' },
  { month: 1, day: 14, title: 'Lễ tình nhân Valentine', desc: 'Ngày lễ tôn vinh tình yêu trên toàn thế giới', priority: 'medium' },
  { month: 1, day: 27, title: 'Ngày Thầy thuốc Việt Nam', desc: 'Tri ân đội ngũ y bác sĩ và ngành y tế Việt Nam', priority: 'medium' },
  { month: 2, day: 8, title: 'Ngày Quốc tế Phụ nữ (8/3)', desc: 'Tôn vinh và gửi lời chúc tốt đẹp tới một nửa thế giới', priority: 'high' },
  { month: 2, day: 26, title: 'Ngày Thành lập Đoàn TNCS HCM', desc: 'Kỷ niệm ngày truyền thống của tuổi trẻ Việt Nam', priority: 'medium' },
  { month: 3, day: 30, title: 'Ngày Giải phóng miền Nam (30/4)', desc: 'Kỷ niệm Ngày Thống nhất Đất nước', priority: 'high' },
  { month: 4, day: 1, title: 'Ngày Quốc tế Lao động (1/5)', desc: 'Ngày hội của giai cấp công nhân và người lao động', priority: 'high' },
  { month: 4, day: 19, title: 'Ngày sinh Chủ tịch Hồ Chí Minh (19/5)', desc: 'Kỷ niệm ngày sinh của Bác Hồ kính yêu', priority: 'medium' },
  { month: 5, day: 1, title: 'Ngày Quốc tế Thiếu nhi (1/6)', desc: 'Ngày hội vui chơi, tặng quà cho trẻ em', priority: 'medium' },
  { month: 5, day: 28, title: 'Ngày Gia đình Việt Nam (28/6)', desc: 'Tôn vinh mái ấm gia đình hạnh phúc', priority: 'medium' },
  { month: 6, day: 27, title: 'Ngày Thương binh Liệt sĩ (27/7)', desc: 'Tưởng nhớ và tri ân các anh hùng liệt sĩ đã hy sinh vì Tổ quốc', priority: 'medium' },
  { month: 7, day: 19, title: 'Ngày Cách mạng Tháng Tám (19/8)', desc: 'Kỷ niệm thắng lợi vĩ đại của Cách mạng Tháng Tám', priority: 'medium' },
  { month: 8, day: 2, title: 'Ngày Quốc khánh Việt Nam (2/9)', desc: 'Kỷ niệm Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập', priority: 'high' },
  { month: 9, day: 10, title: 'Ngày Giải phóng Thủ đô (10/10)', desc: 'Kỷ niệm ngày đoàn quân giải phóng tiến về Hà Nội 1954', priority: 'medium' },
  { month: 9, day: 20, title: 'Ngày Phụ nữ Việt Nam (20/10)', desc: 'Kỷ niệm ngày thành lập Hội Liên hiệp Phụ nữ Việt Nam', priority: 'high' },
  { month: 9, day: 31, title: 'Lễ hội Halloween', desc: 'Lễ hội hóa trang và không khí vui tươi rộn ràng', priority: 'medium' },
  { month: 10, day: 20, title: 'Ngày Nhà giáo Việt Nam (20/11)', desc: 'Tri ân các thầy cô giáo - Truyền thống tôn sư trọng đạo', priority: 'high' },
  { month: 10, day: 23, title: 'Ngày thành lập Hội Chữ thập đỏ VN', desc: 'Tôn vinh tinh thần nhân đạo và sẻ chia', priority: 'medium' },
  { month: 10, day: 24, title: 'Ngày Di sản Văn hóa Việt Nam (24/11)', desc: 'Bảo tồn và phát huy giá trị di sản văn hóa dân tộc', priority: 'high' },
  { month: 11, day: 22, title: 'Ngày Thành lập QĐND Việt Nam (22/12)', desc: 'Kỷ niệm ngày truyền thống Quân đội Nhân dân Việt Nam', priority: 'medium' },
  { month: 11, day: 24, title: 'Lễ Vọng Giáng Sinh (Đêm Noel)', desc: 'Đêm Giáng Sinh an lành và sum họp bên gia đình', priority: 'high' },
  { month: 11, day: 25, title: 'Đại lễ Giáng Sinh (Chính lễ Noel)', desc: 'Chúc mừng Giáng sinh an lành và năm mới sắp tới', priority: 'high' },
];

/**
 * Danh sách các ngày lễ Âm lịch định kỳ hàng năm (được tự động quy đổi bằng thuật toán thiên văn)
 */
export const LUNAR_CULTURAL_HOLIDAYS: LunarHolidayDef[] = [
  {
    lunarMonth: 1,
    lunarDay: 15,
    title: 'Tết Nguyên Tiêu (Rằm tháng Giêng)',
    desc: 'Lễ hội trăng rằm đầu tiên trong năm - Cầu an lành, thịnh vượng',
    priority: 'medium',
  },
  {
    lunarMonth: 3,
    lunarDay: 10,
    title: 'Giỗ Tổ Hùng Vương (10/3 Âm lịch)',
    desc: 'Ngày Quốc lễ tưởng nhớ công lao dựng nước của các Vua Hùng',
    priority: 'high',
  },
  {
    lunarMonth: 4,
    lunarDay: 15,
    title: 'Đại lễ Phật Đản (15/4 Âm lịch)',
    desc: 'Kỷ niệm ngày Đức Phật Thích Ca Mâu Ni đản sinh',
    priority: 'medium',
  },
  {
    lunarMonth: 7,
    lunarDay: 15,
    title: 'Lễ Vu Lan Báo Hiếu (15/7 Âm lịch)',
    desc: 'Tôn vinh và tri ân đấng sinh thành dưỡng dục',
    priority: 'medium',
  },
  {
    lunarMonth: 8,
    lunarDay: 15,
    title: 'Tết Trung Thu (15/8 Âm lịch)',
    desc: 'Đêm hội rằm trăng sáng, rước đèn phá cỗ của thiếu nhi',
    priority: 'high',
  },
  {
    lunarMonth: 12,
    lunarDay: 23,
    title: 'Tết Táo Quân (23 tháng Chạp)',
    desc: 'Lễ cúng tiễn ông Công ông Táo chầu trời',
    priority: 'medium',
  },
];

/**
 * Cấu hình chuỗi ngày Tết Nguyên Đán truyền thống
 */
export const TET_HOLIDAY_CONFIG = [
  { offsetDays: -1, title: 'Đêm Giao thừa (30 Tết)', desc: 'Khoảnh khắc chuyển giao giữa năm cũ và năm mới Âm lịch', priority: 'high' as const },
  { offsetDays: 0, title: 'Mùng 1 Tết Nguyên Đán', desc: 'Ngày đầu tiên của năm mới Âm lịch - Khởi đầu may mắn, bình an', priority: 'high' as const },
  { offsetDays: 1, title: 'Mùng 2 Tết Nguyên Đán', desc: 'Tết truyền thống - Du xuân chúc Tết người thân và bạn bè', priority: 'high' as const },
  { offsetDays: 2, title: 'Mùng 3 Tết Nguyên Đán', desc: 'Tết thầy cô và giao lưu bằng hữu sum vầy', priority: 'high' as const },
];
