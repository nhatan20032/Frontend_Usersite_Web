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
      className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 p-8 sm:p-10 flex-col justify-between relative overflow-hidden text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Meshes */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Badge */}
      <div className="flex items-center justify-between z-10">
        <div className="inline-flex items-center gap-1.5 liquid-glass-pill px-3 py-1 rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>RoutinePulse Edition 2026</span>
        </div>
        <span className="text-[11px] text-blue-200/80 font-medium">Apple Liquid Glass UI</span>
      </div>

      {/* Slider Viewport */}
      <div className="relative overflow-hidden w-full h-[360px] my-auto z-10">
        <div
          className="flex w-[400%] h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentSlide * 25}%)` }}
        >
          {/* SLIDE 1: Calendar & Habits */}
          <div className="w-1/4 flex-shrink-0 flex flex-col justify-center px-3 space-y-4">
            <div className="liquid-glass-card rounded-3xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/30 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-200" />
                </div>
                <span className="text-[10px] font-extrabold bg-emerald-500/30 text-emerald-200 px-2.5 py-0.5 rounded-full">
                  AI SCHEDULE
                </span>
              </div>
              <h3 className="text-xl font-extrabold tracking-tight leading-snug">
                Lịch trình thông minh & Tự động thích ứng
              </h3>
              <p className="text-xs text-blue-100/80 leading-relaxed">
                Tối ưu hóa thời gian biểu theo nhịp sinh học, tự động xếp lịch công việc và thói quen lặp lại.
              </p>
              <div className="pt-2 flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-blue-200">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Chuỗi kỷ luật Streak</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Điểm danh 1-chạm</span>
                </div>
              </div>
            </div>
          </div>

          {/* SLIDE 2: AI Maps & Travel */}
          <div className="w-1/4 flex-shrink-0 flex flex-col justify-center px-3 space-y-4">
            <div className="liquid-glass-card rounded-3xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/30 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-emerald-200" />
                </div>
                <span className="text-[10px] font-extrabold bg-blue-500/30 text-blue-200 px-2.5 py-0.5 rounded-full">
                  AI MAPS
                </span>
              </div>
              <h3 className="text-xl font-extrabold tracking-tight leading-snug">
                Bản đồ AI & Tính thời gian di chuyển
              </h3>
              <p className="text-xs text-blue-100/80 leading-relaxed">
                Tự động quét khoảng cách, tính toán thời gian đi lại thời gian thực và nhắc bạn xuất phát đúng giờ.
              </p>
              <div className="pt-2 flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-blue-200">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <span>Nhắc giờ xuất phát</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-200">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Lộ trình thông minh</span>
                </div>
              </div>
            </div>
          </div>

          {/* SLIDE 3: Analytics & KPIs */}
          <div className="w-1/4 flex-shrink-0 flex flex-col justify-center px-3 space-y-4">
            <div className="liquid-glass-card rounded-3xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/30 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-amber-200" />
                </div>
                <span className="text-[10px] font-extrabold bg-purple-500/30 text-purple-200 px-2.5 py-0.5 rounded-full">
                  ANALYTICS
                </span>
              </div>
              <h3 className="text-xl font-extrabold tracking-tight leading-snug">
                Phân tích năng suất & Báo cáo PDF
              </h3>
              <p className="text-xs text-blue-100/80 leading-relaxed">
                Trực quan hóa tỷ lệ hoàn thành thói quen, chuỗi streak kỷ luật dài nhất và xuất báo cáo chất lượng cao.
              </p>
              <div className="pt-2 flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-blue-200">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>KPI 87.5% Hoàn thành</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-200">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>21 Ngày liên tục</span>
                </div>
              </div>
            </div>
          </div>

          {/* SLIDE 4: Apple Design & Themes */}
          <div className="w-1/4 flex-shrink-0 flex flex-col justify-center px-3 space-y-4">
            <div className="liquid-glass-card rounded-3xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/30 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-purple-200" />
                </div>
                <span className="text-[10px] font-extrabold bg-rose-500/30 text-rose-200 px-2.5 py-0.5 rounded-full">
                  THEME ENGINE
                </span>
              </div>
              <h3 className="text-xl font-extrabold tracking-tight leading-snug">
                Đỉnh cao Thẩm mỹ Apple Liquid Glass
              </h3>
              <p className="text-xs text-blue-100/80 leading-relaxed">
                Kho 5 giao diện thích ứng: Default Studio, Dark Obsidian OLED, Tết 2026, Giáng Sinh Tuyết & Anime Sakura.
              </p>
              <div className="pt-2 flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-blue-200">
                  <Smartphone className="w-4 h-4 text-blue-300" />
                  <span>Đa thiết bị đồng bộ</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-200">
                  <Sparkles className="w-4 h-4 text-pink-300" />
                  <span>Hiệu ứng kính mờ</span>
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
