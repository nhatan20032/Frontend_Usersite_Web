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
      className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-[#1F2023] via-[#18191B] to-[var(--surface-canvas)] border-l border-[var(--border-grid)] p-8 sm:p-10 flex-col justify-between relative overflow-hidden text-[var(--text-primary)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Badge */}
      <div className="flex items-center justify-between z-10">
        <div className="inline-flex items-center gap-1.5 bg-[var(--surface-container-high)] border border-[#3A3B3D] px-3 py-1 rounded-full text-xs font-semibold text-[var(--text-primary)]">
          <Sparkles className="w-3.5 h-3.5 text-[#FDD663]" />
          <span>RoutinePulse Workspace</span>
        </div>
        <span className="text-[11px] text-[var(--text-secondary)] font-medium">Cloud Calendar Platform</span>
      </div>

      {/* Slider Viewport */}
      <div className="relative overflow-hidden w-full h-[360px] my-auto z-10">
        <div
          className="flex w-[400%] h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentSlide * 25}%)` }}
        >
          {/* SLIDE 1: Calendar & Habits */}
          <div className="w-1/4 flex-shrink-0 flex flex-col justify-center px-3 space-y-4">
            <div className="bg-[var(--surface-container)] border border-[var(--border-subtle)] rounded-2xl p-6 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[var(--google-blue-primary)]/15 border border-[var(--google-blue-primary)]/30 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[var(--google-blue)]" />
                </div>
                <span className="text-[11px] font-bold bg-[#1E8E3E]/20 text-[#81C995] border border-[#1E8E3E]/35 px-2.5 py-0.5 rounded-full">
                  CALENDAR
                </span>
              </div>
              <h3 className="text-lg font-bold tracking-tight text-[var(--text-primary)] leading-snug">
                Lịch trình & Thói quen hằng ngày
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Quản lý sự kiện, công việc và điểm danh thói quen trong một ứng dụng.
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
            <div className="bg-[var(--surface-container)] border border-[var(--border-subtle)] rounded-2xl p-6 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#81C995]/15 border border-[#81C995]/30 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#81C995]" />
                </div>
                <span className="text-[11px] font-bold bg-[var(--google-blue-primary)]/20 text-[var(--google-blue)] border border-[var(--google-blue-primary)]/35 px-2.5 py-0.5 rounded-full">
                  NAVIGATION
                </span>
              </div>
              <h3 className="text-lg font-bold tracking-tight text-[var(--text-primary)] leading-snug">
                Địa điểm & Lời nhắc sự kiện
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Lưu địa điểm cho sự kiện và đặt lời nhắc trước khi sự kiện bắt đầu.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 text-[var(--google-blue)]">
                  <Clock className="w-4 h-4 text-[var(--google-blue)]" />
                  <span>Nhắc trước sự kiện</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#FDD663]">
                  <Sparkles className="w-4 h-4 text-[#FDD663]" />
                  <span>Ghi địa điểm</span>
                </div>
              </div>
            </div>
          </div>

          {/* SLIDE 3: Analytics & KPIs */}
          <div className="w-1/4 flex-shrink-0 flex flex-col justify-center px-3 space-y-4">
            <div className="bg-[var(--surface-container)] border border-[var(--border-subtle)] rounded-2xl p-6 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#FDD663]/15 border border-[#FDD663]/30 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#FDD663]" />
                </div>
                <span className="text-[11px] font-bold bg-[#C58AF9]/20 text-[#C58AF9] border border-[#C58AF9]/35 px-2.5 py-0.5 rounded-full">
                  ANALYTICS
                </span>
              </div>
              <h3 className="text-lg font-bold tracking-tight text-[var(--text-primary)] leading-snug">
                Theo dõi công việc & thói quen
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Xem trạng thái công việc và chuỗi kỷ luật từ dữ liệu đã lưu trên máy chủ.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 text-[#81C995]">
                  <TrendingUp className="w-4 h-4 text-[#81C995]" />
                  <span>Theo dõi hoàn thành</span>
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
            <div className="bg-[var(--surface-container)] border border-[var(--border-subtle)] rounded-2xl p-6 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#C58AF9]/15 border border-[#C58AF9]/30 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-[#C58AF9]" />
                </div>
                <span className="text-[11px] font-bold bg-[var(--google-blue)]/20 text-[var(--google-blue)] border border-[var(--google-blue)]/35 px-2.5 py-0.5 rounded-full">
                  WORKSPACE
                </span>
              </div>
              <h3 className="text-lg font-bold tracking-tight text-[var(--text-primary)] leading-snug">
                Giao diện Chuẩn mực Google Dark Mode
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Đồng bộ hóa thói quen, việc cần làm và lịch sự kiện trên nền tảng tối ưu hóa công thái học.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 text-[var(--google-blue)]">
                  <Smartphone className="w-4 h-4 text-[var(--google-blue)]" />
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
