import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import type { DailyAvailabilitySlot } from '../../types';
import {
  X,
  Clock,
  Repeat,
  Copy,
  Plus,
  MinusCircle,
  Globe,
  SlidersHorizontal,
  Check,
} from 'lucide-react';

const initialAvailability: DailyAvailabilitySlot[] = [
  { id: 'sun', dayIndex: 0, dayNameVi: 'Chủ Nhật', dayNameEn: 'Sunday', isAvailable: false, startTime: '09:00 AM', endTime: '05:00 PM' },
  { id: 'mon', dayIndex: 1, dayNameVi: 'Thứ 2', dayNameEn: 'Monday', isAvailable: true, startTime: '09:00 AM', endTime: '05:00 PM' },
  { id: 'tue', dayIndex: 2, dayNameVi: 'Thứ 3', dayNameEn: 'Tuesday', isAvailable: true, startTime: '09:00 AM', endTime: '05:00 PM' },
  { id: 'wed', dayIndex: 3, dayNameVi: 'Thứ 4', dayNameEn: 'Wednesday', isAvailable: true, startTime: '09:00 AM', endTime: '05:00 PM' },
  { id: 'thu', dayIndex: 4, dayNameVi: 'Thứ 5', dayNameEn: 'Thursday', isAvailable: true, startTime: '09:00 AM', endTime: '05:00 PM' },
  { id: 'fri', dayIndex: 5, dayNameVi: 'Thứ 6', dayNameEn: 'Friday', isAvailable: true, startTime: '09:00 AM', endTime: '05:00 PM' },
  { id: 'sat', dayIndex: 6, dayNameVi: 'Thứ 7', dayNameEn: 'Saturday', isAvailable: false, startTime: '09:00 AM', endTime: '05:00 PM' },
];

const hoursList = [
  { label: '8 SA', value: 8 },
  { label: '9 SA', value: 9 },
  { label: '10 SA', value: 10 },
  { label: '11 SA', value: 11 },
  { label: '12 CH', value: 12 },
  { label: '1 CH', value: 13 },
  { label: '2 CH', value: 14 },
  { label: '3 CH', value: 15 },
  { label: '4 CH', value: 16 },
  { label: '5 CH', value: 17 },
  { label: '6 CH', value: 18 },
];

export const AppointmentScheduleModal: React.FC = () => {
  const { activeModal, closeModal, showToast, addEvent, selectedMonth, selectedYear } = useApp();
  const { language } = useLanguage();

  const [title, setTitle] = useState<string>('Tư vấn Thiết kế UI/UX & Code Review');
  const [duration, setDuration] = useState<number>(60); // minutes
  const [repeatMode, setRepeatMode] = useState<string>('weekly');
  const [availability, setAvailability] = useState<DailyAvailabilitySlot[]>(initialAvailability);
  const [timezone, setTimezone] = useState<string>('GMT+07:00');

  if (activeModal !== 'appointment-schedule') return null;

  // Toggle active/inactive for a day
  const toggleDayAvailable = (dayIndex: number) => {
    setAvailability((prev) =>
      prev.map((item) =>
        item.dayIndex === dayIndex ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  // Copy Monday's slot to all weekdays
  const handleCopyAll = () => {
    const mondaySlot = availability.find((d) => d.dayIndex === 1);
    if (!mondaySlot) return;

    setAvailability((prev) =>
      prev.map((item) => {
        if (item.dayIndex >= 1 && item.dayIndex <= 5) {
          return {
            ...item,
            isAvailable: true,
            startTime: mondaySlot.startTime,
            endTime: mondaySlot.endTime,
          };
        }
        return item;
      })
    );

    showToast(
      language === 'vi' ? 'Đã sao chép' : 'Copied',
      language === 'vi' ? 'Đã áp dụng khung giờ Thứ 2 cho tất cả các ngày trong tuần' : 'Applied Monday slot to all weekdays',
      'info'
    );
  };

  const handleSave = () => {
    // Add sample appointment schedule anchor
    addEvent({
      type: 'event',
      title: `[Lịch hẹn] ${title}`,
      time: '09:00 AM',
      endTime: '05:00 PM',
      priority: 'high',
      year: selectedYear,
      month: selectedMonth,
      day: 15,
      colorTag: '#8AB4F8',
      description: `Lịch hẹn đặt trước: thời lượng ${duration} phút/slot. Khung giờ khả dụng Thứ 2 - Thứ 6 (09:00 - 17:00).`,
    });

    showToast(
      language === 'vi' ? 'Đã lưu lịch hẹn' : 'Schedule created',
      language === 'vi' ? 'Trang đặt lịch hẹn đã được khởi tạo thành công!' : 'Appointment schedule created successfully!',
      'success'
    );
    closeModal();
  };

  // Weekday dates representation (13 to 19 Sep 2026)
  const weekDays = [
    { nameVi: 'CN', nameEn: 'SUN', dayNum: 13, dayIndex: 0 },
    { nameVi: 'THỨ 2', nameEn: 'MON', dayNum: 14, dayIndex: 1 },
    { nameVi: 'THỨ 3', nameEn: 'TUE', dayNum: 15, dayIndex: 2, isToday: true },
    { nameVi: 'THỨ 4', nameEn: 'WED', dayNum: 16, dayIndex: 3 },
    { nameVi: 'THỨ 5', nameEn: 'THU', dayNum: 17, dayIndex: 4 },
    { nameVi: 'THỨ 6', nameEn: 'FRI', dayNum: 18, dayIndex: 5 },
    { nameVi: 'THỨ 7', nameEn: 'SAT', dayNum: 19, dayIndex: 6 },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-0 select-none animate-in fade-in duration-200">
      {/* Container Fullscreen / Large Window */}
      <div className="w-full h-full max-w-[1600px] max-h-[96vh] bg-[#121314] text-[#E3E2E3] flex flex-col md:rounded-2xl border border-[#3C4043] shadow-2xl overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-14 px-5 border-b border-[#2A2B2D] bg-[#1E1F20] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={closeModal}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#9AA0A6] hover:bg-[#303336] hover:text-[#E3E2E3] transition-colors cursor-pointer"
              title={language === 'vi' ? 'Đóng' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#8AB4F8]/15 border border-[#8AB4F8]/40 text-[#8AB4F8] text-[10px] font-bold tracking-wider uppercase">
                {language === 'vi' ? 'LỊCH HẸN ĐẶT TRƯỚC' : 'APPOINTMENT SCHEDULE'}
              </span>
              <h2 className="text-sm font-semibold text-[#E3E2E3] hidden sm:inline">
                {language === 'vi' ? 'Cấu hình khung giờ rảnh & nhận đặt lịch' : 'Booking Availability Setup'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#9AA0A6] hidden md:inline">
              {language === 'vi' ? 'Tuần: 13 – 19 Tháng 9, 2026' : 'Week: Sep 13 – 19, 2026'}
            </span>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-full bg-[#8AB4F8] hover:bg-[#A8C8FF] text-[#121314] font-semibold text-xs transition-colors cursor-pointer shadow"
            >
              {language === 'vi' ? 'Lưu & Hoàn tất' : 'Save & Publish'}
            </button>
          </div>
        </header>

        {/* Split Screen Layout (Ảnh 5) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* ================= LEFT CONFIGURATION PANEL (~460px) ================= */}
          <aside className="w-full md:w-[460px] bg-[#1E1F20] border-r border-[#2A2B2D] flex flex-col overflow-y-auto custom-scrollbar p-5 sm:p-6 space-y-6 shrink-0">
            {/* 1. Title Input */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-[#9AA0A6] uppercase tracking-wider">
                {language === 'vi' ? 'Tiêu đề trang hẹn' : 'Appointment title'}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={language === 'vi' ? 'Thêm tiêu đề...' : 'Add title...'}
                className="w-full bg-transparent border-0 border-b-2 border-[#8AB4F8] text-lg font-medium text-[#E3E2E3] pb-1 focus:outline-none focus:border-[#A8C8FF] placeholder-[#70757A] transition-colors"
              />
            </div>

            {/* 2. Duration Card */}
            <div className="bg-[#121314] p-4 rounded-xl border border-[#2A2B2D] space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#8AB4F8]" />
                <h3 className="text-xs font-semibold text-[#E3E2E3]">
                  {language === 'vi' ? 'Thời lượng cuộc hẹn' : 'Appointment duration'}
                </h3>
              </div>
              <p className="text-[11px] text-[#9AA0A6]">
                {language === 'vi' ? 'Mỗi cuộc hẹn sẽ kéo dài bao lâu?' : 'How long should each appointment be?'}
              </p>
              <div className="pt-1">
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full bg-[#1E1F20] hover:bg-[#28292A] border border-[#333538] rounded-lg px-3 py-2 text-xs text-[#E3E2E3] focus:outline-none focus:border-[#8AB4F8] cursor-pointer"
                >
                  <option value={15}>15 phút</option>
                  <option value={30}>30 phút</option>
                  <option value={45}>45 phút</option>
                  <option value={60}>1 giờ</option>
                  <option value={90}>1,5 giờ</option>
                  <option value={120}>2 giờ</option>
                </select>
              </div>
            </div>

            {/* 3. Weekly Availability Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Repeat className="w-4 h-4 text-[#8AB4F8]" />
                  <h3 className="text-xs font-semibold text-[#E3E2E3]">
                    {language === 'vi' ? 'Thời gian thường rảnh' : 'General availability'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleCopyAll}
                  className="text-[11px] text-[#8AB4F8] hover:underline flex items-center gap-1 cursor-pointer"
                  title="Sao chép khung giờ cho cả tuần"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{language === 'vi' ? 'Sao chép tất cả' : 'Copy to all'}</span>
                </button>
              </div>

              <select
                value={repeatMode}
                onChange={(e) => setRepeatMode(e.target.value)}
                className="w-full bg-[#121314] border border-[#2A2B2D] rounded-lg px-3 py-2 text-xs text-[#E3E2E3] focus:outline-none focus:border-[#8AB4F8] cursor-pointer"
              >
                <option value="weekly">{language === 'vi' ? 'Lặp lại hàng tuần' : 'Repeats weekly'}</option>
                <option value="this-week">{language === 'vi' ? 'Chỉ áp dụng trong tuần này' : 'Only this week'}</option>
              </select>

              {/* Day Slot Rows (7 days) */}
              <div className="space-y-2 pt-1">
                {availability.map((slot) => (
                  <div
                    key={slot.id}
                    className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                      slot.isAvailable
                        ? 'bg-[#121314] border-[#2A2B2D]'
                        : 'bg-[#121314]/50 border-[#2A2B2D]/50 text-[#70757A]'
                    }`}
                  >
                    <div className="w-16">
                      <span className={`text-xs font-medium ${slot.isAvailable ? 'text-[#E3E2E3]' : 'text-[#70757A]'}`}>
                        {language === 'vi' ? slot.dayNameVi : slot.dayNameEn}
                      </span>
                    </div>

                    {slot.isAvailable ? (
                      <div className="flex items-center gap-1.5 flex-1 px-1">
                        <span className="bg-[#1E1F20] border border-[#333538] px-2 py-1 rounded text-[11px] text-[#E3E2E3]">
                          {slot.startTime}
                        </span>
                        <span className="text-[#9AA0A6] text-xs">–</span>
                        <span className="bg-[#1E1F20] border border-[#333538] px-2 py-1 rounded text-[11px] text-[#E3E2E3]">
                          {slot.endTime}
                        </span>
                      </div>
                    ) : (
                      <div className="flex-1 px-2">
                        <span className="text-[11px] text-[#70757A] italic">
                          {language === 'vi' ? 'Không rảnh (Bận)' : 'Unavailable'}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-1">
                      {slot.isAvailable ? (
                        <button
                          type="button"
                          onClick={() => toggleDayAvailable(slot.dayIndex)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[#9AA0A6] hover:text-rose-400 hover:bg-[#28292A] transition-colors cursor-pointer"
                          title="Tắt khung giờ"
                        >
                          <MinusCircle className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleDayAvailable(slot.dayIndex)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[#8AB4F8] hover:bg-[#28292A] transition-colors cursor-pointer"
                          title="Bật khung giờ"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Timezone & Range */}
            <div className="space-y-3 pt-1 border-t border-[#2A2B2D]">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#8AB4F8]" />
                <span className="text-xs text-[#E3E2E3] font-medium">{language === 'vi' ? 'Múi giờ' : 'Time zone'}</span>
              </div>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#121314] border border-[#2A2B2D] text-xs text-[#E3E2E3] focus:outline-none focus:border-[#8AB4F8] cursor-pointer"
              >
                <option value="GMT+07:00">(GMT+07:00) Giờ Đông Dương - TP. Hồ Chí Minh</option>
                <option value="GMT+00:00">(GMT+00:00) Giờ Quốc tế Phối hợp - London</option>
                <option value="GMT-05:00">(GMT-05:00) Giờ Miền Đông - New York</option>
                <option value="GMT+09:00">(GMT+09:00) Giờ Chuẩn Nhật Bản - Tokyo</option>
              </select>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[#121314] border border-[#2A2B2D]">
                <div>
                  <h4 className="text-xs font-semibold text-[#E3E2E3]">
                    {language === 'vi' ? 'Phạm vi thời gian đặt lịch' : 'Scheduling window'}
                  </h4>
                  <p className="text-[11px] text-[#9AA0A6]">
                    {language === 'vi' ? 'Từ trước 60 ngày đến trước 4 giờ' : '60 days in advance to 4 hours before'}
                  </p>
                </div>
                <SlidersHorizontal className="w-4 h-4 text-[#9AA0A6]" />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 flex items-center justify-end gap-3 mt-auto">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded-full text-xs font-medium text-[#9AA0A6] hover:text-[#E3E2E3] hover:bg-[#28292A] transition-colors cursor-pointer"
              >
                {language === 'vi' ? 'Hủy' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2 rounded-full bg-[#8AB4F8] hover:bg-[#A8C8FF] text-[#121314] font-semibold text-xs shadow transition-all cursor-pointer"
              >
                {language === 'vi' ? 'Tiếp tục / Lưu' : 'Next / Save'}
              </button>
            </div>
          </aside>

          {/* ================= RIGHT 7-DAY TIME-GRID CANVAS ================= */}
          <main className="flex-1 bg-[#121314] flex flex-col overflow-hidden">
            {/* Week Calendar Header (7 Columns) */}
            <div className="grid grid-cols-8 border-b border-[#2A2B2D] bg-[#1E1F20] text-center py-2.5 shrink-0">
              {/* Corner Gutter */}
              <div className="w-14 flex items-center justify-center text-[10px] text-[#70757A] font-mono">
                GMT+7
              </div>
              {/* 7 Days Columns */}
              {weekDays.map((d) => (
                <div key={d.dayIndex} className="flex flex-col items-center justify-center">
                  <span className="text-[10px] uppercase font-semibold text-[#9AA0A6]">
                    {language === 'vi' ? d.nameVi : d.nameEn}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5 ${
                      d.isToday
                        ? 'bg-[#8AB4F8] text-[#121314] shadow'
                        : 'text-[#E3E2E3]'
                    }`}
                  >
                    {d.dayNum}
                  </div>
                </div>
              ))}
            </div>

            {/* Time Grid Canvas with Hours and Availability Blocks */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
              {/* Real-time Indicator Line at ~10:45 AM */}
              <div
                className="absolute left-14 right-0 z-20 flex items-center pointer-events-none"
                style={{ top: '155px' }}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 -ml-1.5 shadow" />
                <div className="flex-1 h-[1.5px] bg-rose-500 shadow-sm" />
              </div>

              <div className="grid grid-cols-8 min-h-[700px] divide-x divide-[#2A2B2D]">
                {/* Left Hourly Axis (56px) */}
                <div className="col-span-1 flex flex-col divide-y divide-[#2A2B2D]/40">
                  {hoursList.map((h) => (
                    <div key={h.value} className="h-16 pr-2 text-right text-[10px] text-[#70757A] pt-1 font-mono">
                      {h.label}
                    </div>
                  ))}
                </div>

                {/* 7 Days Columns with Visual Availability Blocks */}
                {weekDays.map((d) => {
                  const dayAvailability = availability.find((a) => a.dayIndex === d.dayIndex);
                  const isAvailable = dayAvailability?.isAvailable;

                  return (
                    <div
                      key={d.dayIndex}
                      className={`col-span-1 relative divide-y divide-[#2A2B2D]/40 ${
                        d.isToday ? 'bg-[#1E1F20]/30' : ''
                      }`}
                    >
                      {/* Grid background lines */}
                      {hoursList.map((h) => (
                        <div key={h.value} className="h-16 hover:bg-[#1E1F20]/40 transition-colors" />
                      ))}

                      {/* Availability Block Overlay (From 9:00 AM to 5:00 PM = 8 hours) */}
                      {isAvailable && (
                        <div
                          className="absolute inset-x-1.5 z-10 bg-[#8AB4F8]/15 border-2 border-dashed border-[#8AB4F8]/70 rounded-xl p-2 flex flex-col justify-between shadow-lg backdrop-blur-xs transition-all animate-in fade-in duration-300"
                          style={{
                            top: '64px', // 9:00 AM (starts after 8 AM slot)
                            height: '512px', // 8 hours * 64px = 512px
                          }}
                        >
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#8AB4F8] text-[#121314] text-[9px] font-bold uppercase">
                              <Check className="w-2.5 h-2.5" />
                              {duration}m slots
                            </span>
                            <h4 className="text-[11px] font-semibold text-[#8AB4F8] leading-tight line-clamp-2">
                              {title || 'Khung giờ rảnh'}
                            </h4>
                            <p className="text-[10px] text-[#A8C8FF] font-mono">
                              09:00 SA – 17:00 CH
                            </p>
                          </div>

                          {/* Mini visual slot divisions */}
                          <div className="grid grid-rows-8 gap-1 opacity-70">
                            {Array.from({ length: 8 }).map((_, i) => (
                              <div
                                key={i}
                                className="h-4 rounded border border-[#8AB4F8]/30 bg-[#8AB4F8]/10 flex items-center justify-between px-1.5 text-[8px] text-[#A8C8FF]"
                              >
                                <span>{9 + i}:00</span>
                                <span>{duration}p</span>
                              </div>
                            ))}
                          </div>

                          <span className="text-[9px] text-[#9AA0A6] text-right font-medium">
                            {language === 'vi' ? 'Khách có thể đặt lịch' : 'Bookable slots'}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
