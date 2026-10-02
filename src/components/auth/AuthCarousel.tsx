import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Flame,
  CheckCircle2,
  MapPin,
  Clock,
  TrendingUp,
  Sparkles,
  Palette,
  Smartphone,
} from 'lucide-react';

export const AuthCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 4);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div
      className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-[#1F2023] via-[#18191B] to-[#121314] border-l border-[#2A2B2D] p-8 sm:p-10 flex-col justify-between relative overflow-hidden text-[#E3E2E3]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Badge */}
      <div className="flex items-center justify-between z-10">
        <div className="inline-flex items-center gap-1.5 bg-[#28292A] border border-[#3A3B3D] px-3 py-1 rounded-full text-xs font-semibold text-[#E3E2E3]">
          <Sparkles className="w-3.5 h-3.5 text-[#FDD663]" />
          <span>RoutinePulse Workspace</span>
        </div>
        <span className="text-[11px] text-[#9AA0A6] font-medium">Cloud Calendar Platform</span>
      </div>

      {/* Slider Viewport */}
      <div className="relative overflow-hidden w-full h-[360px] my-auto z-10">
        <div
          className="flex w-[400%] h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentSlide * 25}%)` }}
        >
          {/* SLIDE 1: Calendar & Habits */}
          <div className="w-1/4 flex-shrink-0 flex flex-col justify-center px-3 space-y-4">
            <div className="bg-[#1F2021] border border-[#333538] rounded-2xl p-6 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#1A73E8]/15 border border-[#1A73E8]/30 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#8AB4F8]" />
                </div>
                <span className="text-[10px] font-bold bg-[#1E8E3E]/20 text-[#81C995] border border-[#1E8E3E]/35 px-2.5 py-0.5 rounded-full">
                  CALENDAR
                </span>
              </div>
              <h3 className="text-lg font-bold tracking-tight text-[#E3E2E3] leading-snug">
                Lịch trình thông minh & Tự động thích ứng
              </h3>
              <p className="text-xs text-[#9AA0A6] leading-relaxed">
                Tối ưu hóa thời gian biểu theo nhịp sinh học, tự động sắp xếp công việc và thói quen lặp lại.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 text-[#FDD663]">
                  <Flame className="w-4 h-4 text-[#FDD663]" />
                  <span>Chuỗi kỷ luật Streak</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#81C995]">
                  <CheckCircle2 className="w-4 h-4 text-[#81C995]" />
                  <span>Điểm danh 1-chạm</span>
                </div>
              </div>
            </div>
          </div>

          {/* SLIDE 2: AI Maps & Travel */}
          <div className="w-1/4 flex-shrink-0 flex flex-col justify-center px-3 space-y-4">
            <div className="bg-[#1F2021] border border-[#333538] rounded-2xl p-6 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#81C995]/15 border border-[#81C995]/30 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#81C995]" />
                </div>
                <span className="text-[10px] font-bold bg-[#1A73E8]/20 text-[#8AB4F8] border border-[#1A73E8]/35 px-2.5 py-0.5 rounded-full">
                  NAVIGATION
                </span>
              </div>
              <h3 className="text-lg font-bold tracking-tight text-[#E3E2E3] leading-snug">
                Bản đồ vị trí & Tính thời gian di chuyển
              </h3>
              <p className="text-xs text-[#9AA0A6] leading-relaxed">
                Tự động ước lượng khoảng cách, thời gian đi lại thời gian thực và nhắc bạn xuất phát đúng giờ.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 text-[#8AB4F8]">
                  <Clock className="w-4 h-4 text-[#8AB4F8]" />
                  <span>Nhắc giờ xuất phát</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#FDD663]">
                  <Sparkles className="w-4 h-4 text-[#FDD663]" />
                  <span>Lộ trình thông minh</span>
                </div>
              </div>
            </div>
          </div>

          {/* SLIDE 3: Analytics & KPIs */}
          <div className="w-1/4 flex-shrink-0 flex flex-col justify-center px-3 space-y-4">
            <div className="bg-[#1F2021] border border-[#333538] rounded-2xl p-6 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#FDD663]/15 border border-[#FDD663]/30 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#FDD663]" />
                </div>
                <span className="text-[10px] font-bold bg-[#C58AF9]/20 text-[#C58AF9] border border-[#C58AF9]/35 px-2.5 py-0.5 rounded-full">
                  ANALYTICS
                </span>
              </div>
              <h3 className="text-lg font-bold tracking-tight text-[#E3E2E3] leading-snug">
                Phân tích năng suất & Báo cáo chuyên nghiệp
              </h3>
              <p className="text-xs text-[#9AA0A6] leading-relaxed">
                Trực quan hóa tỷ lệ hoàn thành thói quen, chuỗi streak kỷ luật dài nhất và xuất báo cáo PDF.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 text-[#81C995]">
                  <TrendingUp className="w-4 h-4 text-[#81C995]" />
                  <span>Hiệu suất 87.5%</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#FDD663]">
                  <Flame className="w-4 h-4 text-[#FDD663]" />
                  <span>Kỷ luật liên tục</span>
                </div>
              </div>
            </div>
          </div>

          {/* SLIDE 4: Sync & Platform */}
          <div className="w-1/4 flex-shrink-0 flex flex-col justify-center px-3 space-y-4">
            <div className="bg-[#1F2021] border border-[#333538] rounded-2xl p-6 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#C58AF9]/15 border border-[#C58AF9]/30 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-[#C58AF9]" />
                </div>
                <span className="text-[10px] font-bold bg-[#8AB4F8]/20 text-[#8AB4F8] border border-[#8AB4F8]/35 px-2.5 py-0.5 rounded-full">
                  WORKSPACE
                </span>
              </div>
              <h3 className="text-lg font-bold tracking-tight text-[#E3E2E3] leading-snug">
                Giao diện Chuẩn mực Google Dark Mode
              </h3>
              <p className="text-xs text-[#9AA0A6] leading-relaxed">
                Đồng bộ hóa thói quen, việc cần làm và lịch sự kiện trên nền tảng tối ưu hóa công thái học.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 text-[#8AB4F8]">
                  <Smartphone className="w-4 h-4 text-[#8AB4F8]" />
                  <span>Đa thiết bị đồng bộ</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#81C995]">
                  <Sparkles className="w-4 h-4 text-[#81C995]" />
                  <span>Hiệu năng cao</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Indicators */}
      <div className="flex items-center justify-between z-10 pt-4 border-t border-white/10">
        <span className="text-xs text-blue-200/80 font-medium">Khám phá trải nghiệm cá nhân hóa</span>
        <div className="flex items-center gap-2">
          {[0, 1, 2, 3].map((idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === idx ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
