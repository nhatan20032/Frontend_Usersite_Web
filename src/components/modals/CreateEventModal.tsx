import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import type { Priority } from '../../types';
import {
  X,
  Clock,
  Users,
  MapPin,
  AlignLeft,
  Palette,
  Bell,
  Check,
  Calendar as CalendarIcon,
  CheckCircle2,
  CalendarPlus,
  Bold,
  Italic,
  Underline,
  List,
  Link,
  Paperclip,
} from 'lucide-react';

const monthNamesVi = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
  'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
  'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
];

const monthNamesEn = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December',
];

const colorPalette = [
  { id: 'blue', color: '#8AB4F8', name: 'Google Blue' },
  { id: 'green', color: '#81C995', name: 'Sage Green' },
  { id: 'orange', color: '#E8710A', name: 'Flamingo' },
  { id: 'yellow', color: '#F6BF26', name: 'Banana' },
  { id: 'purple', color: '#B39DDB', name: 'Amethyst' },
];

export const CreateEventModal: React.FC = () => {
  const {
    activeModal,
    closeModal,
    addEvent,
    openModal,
    selectedDay,
    selectedMonth,
    selectedYear,
    showToast,
  } = useApp();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'event' | 'task' | 'appointment'>('event');
  const [title, setTitle] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('09:00 AM');
  const [endTime, setEndTime] = useState<string>('10:00 AM');
  const [priority, setPriority] = useState<Priority>('medium');
  const [frequency, setFrequency] = useState<string>('none');
  const [location, setLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guests, setGuests] = useState<string[]>([
    'an.nguyen@routinepulse.com (Tổ chức)',
  ]);
  const [selectedColor, setSelectedColor] = useState<string>('#8AB4F8');
  const [status, setStatus] = useState<'busy' | 'free'>('busy');
  const [reminder, setReminder] = useState<string>('30m');

  if (activeModal !== 'create') return null;

  const targetDate = new Date(selectedYear, selectedMonth, selectedDay);
  const weekdayName = targetDate.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { weekday: 'long' });
  const monthNames = language === 'vi' ? monthNamesVi : monthNamesEn;

  const handleAddGuest = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && guestEmail.trim()) {
      e.preventDefault();
      if (!guests.includes(guestEmail.trim())) {
        setGuests([...guests, guestEmail.trim()]);
      }
      setGuestEmail('');
    }
  };

  const handleRemoveGuest = (indexToRemove: number) => {
    if (indexToRemove === 0) return; // Giữ lại người tổ chức
    setGuests(guests.filter((_, idx) => idx !== indexToRemove));
  };

  const handleTabChange = (tab: 'event' | 'task' | 'appointment') => {
    if (tab === 'appointment') {
      openModal('appointment-schedule');
      return;
    }
    setActiveTab(tab);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let freqText = 'Một lần';
    if (frequency === 'daily') {
      freqText = language === 'vi' ? 'Hàng ngày' : 'Daily';
    } else if (frequency === 'weekly') {
      freqText = language === 'vi' ? 'Hàng tuần' : 'Weekly';
    } else if (frequency === 'monthly') {
      freqText = language === 'vi' ? 'Hàng tháng' : 'Monthly';
    }

    const success = addEvent({
      type: activeTab === 'task' ? 'routine' : 'event',
      title: title.trim(),
      time: startTime,
      endTime,
      priority,
      year: selectedYear,
      month: selectedMonth,
      day: selectedDay,
      streak: 1,
      completed: false,
      location: location.trim() || undefined,
      travelTime: location.trim() ? '20 phút' : undefined,
      alertTime: reminder === '30m' ? 'Trước 30 phút' : 'Trước 15 phút',
      frequency: freqText,
      description: description.trim() || undefined,
      attendees: guests,
      colorTag: selectedColor,
      status,
    });

    if (success) {
      showToast(
        language === 'vi' ? 'Đã lưu lịch trình' : 'Event saved',
        language === 'vi' ? `Đã thêm "${title}" vào ngày ${selectedDay}/${selectedMonth + 1}` : `Added "${title}" to calendar`,
        'success'
      );
      closeModal();
      setTitle('');
      setLocation('');
      setDescription('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-150">
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0" onClick={closeModal} />

      {/* Center Stage Floating Popover Modal (Ảnh 2 & Ảnh 4) */}
      <div className="relative w-full max-w-[540px] bg-[#242628] border border-[#3C4043] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-10">
        {/* Top Drag/Header Bar */}
        <div className="flex items-center justify-between px-5 pt-3 pb-2.5 border-b border-[#333538] bg-[#1E1F20]/70">
          <div className="flex items-center gap-2 text-[#9AA0A6]">
            <CalendarIcon className="w-4 h-4 text-[#8AB4F8]" />
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#9AA0A6]">
              {language === 'vi' ? 'Tạo sự kiện & công việc mới' : 'Create event or task'}
            </span>
          </div>
          <button
            onClick={closeModal}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#9AA0A6] hover:bg-[#333538] hover:text-[#E3E2E3] transition-colors cursor-pointer"
            title={language === 'vi' ? 'Đóng' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-5 sm:p-6 flex flex-col gap-4.5 max-h-[78vh] overflow-y-auto custom-scrollbar">
            {/* 1. Large Title Input */}
            <div className="relative">
              <input
                type="text"
                required
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={language === 'vi' ? 'Thêm tiêu đề' : 'Add title'}
                className="w-full bg-transparent border-0 border-b-2 border-[#8AB4F8]/80 pb-2 text-xl font-medium text-[#E3E2E3] placeholder-[#70757A] focus:outline-none focus:border-[#8AB4F8] transition-colors"
              />
            </div>

            {/* 2. Segmented Pill Tabs */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleTabChange('event')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'event'
                    ? 'bg-[#1A73E8] text-white shadow-sm'
                    : 'text-[#9AA0A6] hover:bg-[#303336] hover:text-[#E3E2E3]'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>{language === 'vi' ? 'Sự kiện' : 'Event'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('task')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'task'
                    ? 'bg-[#1A73E8] text-white shadow-sm'
                    : 'text-[#9AA0A6] hover:bg-[#303336] hover:text-[#E3E2E3]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{language === 'vi' ? 'Việc cần làm' : 'Task'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('appointment')}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[#9AA0A6] hover:bg-[#303336] hover:text-[#E3E2E3] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-[#FDD663]" />
                <span>{language === 'vi' ? 'Lên lịch hẹn' : 'Appointment'}</span>
                <span className="px-1.5 py-0.2 rounded bg-[#01552C] text-[#8ED7A1] text-[9px] font-bold">
                  {language === 'vi' ? 'MỚI' : 'NEW'}
                </span>
              </button>
            </div>

            {/* 3. Detailed Fields with Google-Style Icons */}
            <div className="space-y-4 pt-1 text-xs text-[#E3E2E3]">
              {/* Row 1: Date & Time */}
              <div className="flex items-start gap-3.5">
                <Clock className="w-5 h-5 text-[#9AA0A6] mt-1 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1.5 rounded-lg bg-[#1E1F20] border border-[#333538] font-medium text-[#E3E2E3]">
                      {weekdayName}, {selectedDay} {monthNames[selectedMonth]}
                    </span>
                    <span className="text-[#9AA0A6]">•</span>
                    <select
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#1E1F20] border border-[#333538] text-[#E3E2E3] focus:outline-none focus:border-[#8AB4F8] cursor-pointer"
                    >
                      <option value="08:00 AM">08:00 AM</option>
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="01:00 PM">01:00 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                    </select>
                    <span className="text-[#9AA0A6]">–</span>
                    <select
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#1E1F20] border border-[#333538] text-[#E3E2E3] focus:outline-none focus:border-[#8AB4F8] cursor-pointer"
                    >
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                      <option value="06:00 PM">06:00 PM</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-[#9AA0A6]">
                    <span>GMT+7 Giờ Đông Dương</span>
                    <span>•</span>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="bg-transparent border-0 text-[#8AB4F8] hover:underline focus:outline-none cursor-pointer p-0"
                    >
                      <option value="none" className="bg-[#242628] text-[#E3E2E3]">
                        {language === 'vi' ? 'Không lặp lại' : 'Does not repeat'}
                      </option>
                      <option value="daily" className="bg-[#242628] text-[#E3E2E3]">
                        {language === 'vi' ? 'Hàng ngày' : 'Daily'}
                      </option>
                      <option value="weekly" className="bg-[#242628] text-[#E3E2E3]">
                        {language === 'vi' ? 'Hàng tuần' : 'Weekly'}
                      </option>
                      <option value="monthly" className="bg-[#242628] text-[#E3E2E3]">
                        {language === 'vi' ? 'Hàng tháng' : 'Monthly'}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 2: Add Guests */}
              <div className="flex items-start gap-3.5">
                <Users className="w-5 h-5 text-[#9AA0A6] mt-1 shrink-0" />
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    onKeyDown={handleAddGuest}
                    placeholder={language === 'vi' ? 'Thêm khách (nhập email rồi nhấn Enter)...' : 'Add guests (press Enter)...'}
                    className="w-full bg-[#1E1F20] border border-[#333538] rounded-lg px-3 py-1.5 text-xs text-[#E3E2E3] placeholder-[#70757A] focus:outline-none focus:border-[#8AB4F8]"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {guests.map((guest, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1E1F20] border border-[#333538] text-[11px] text-[#E3E2E3]"
                      >
                        <div className="w-4 h-4 rounded-full bg-[#8AB4F8] text-[#121314] text-[9px] font-bold flex items-center justify-center">
                          {guest.charAt(0).toUpperCase()}
                        </div>
                        <span className="truncate max-w-[200px]">{guest}</span>
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveGuest(idx)}
                            className="text-[#9AA0A6] hover:text-[#E3E2E3] cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 3: Location */}
              <div className="flex items-center gap-3.5">
                <MapPin className="w-5 h-5 text-[#9AA0A6] shrink-0" />
                <div className="flex-1">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={language === 'vi' ? 'Thêm vị trí hoặc phòng họp...' : 'Add location...'}
                    className="w-full bg-[#1E1F20] border border-[#333538] rounded-lg px-3 py-1.5 text-xs text-[#E3E2E3] placeholder-[#70757A] focus:outline-none focus:border-[#8AB4F8]"
                  />
                </div>
              </div>

              {/* Row 5: Description & Mini Toolbar */}
              <div className="flex items-start gap-3.5">
                <AlignLeft className="w-5 h-5 text-[#9AA0A6] mt-1 shrink-0" />
                <div className="flex-1 border border-[#333538] rounded-lg bg-[#1E1F20] overflow-hidden">
                  {/* Mini Toolbar */}
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-[#28292A] border-b border-[#333538] text-[#9AA0A6]">
                    <button type="button" className="p-1 rounded hover:bg-[#333538] hover:text-[#E3E2E3] cursor-pointer" title="Đậm">
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1 rounded hover:bg-[#333538] hover:text-[#E3E2E3] cursor-pointer" title="Nghiêng">
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1 rounded hover:bg-[#333538] hover:text-[#E3E2E3] cursor-pointer" title="Gạch chân">
                      <Underline className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-[1px] h-3.5 bg-[#3C4043] mx-1" />
                    <button type="button" className="p-1 rounded hover:bg-[#333538] hover:text-[#E3E2E3] cursor-pointer" title="Danh sách">
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1 rounded hover:bg-[#333538] hover:text-[#E3E2E3] cursor-pointer" title="Liên kết">
                      <Link className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" className="p-1 rounded hover:bg-[#333538] hover:text-[#E3E2E3] cursor-pointer" title="Đính kèm">
                      <Paperclip className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={language === 'vi' ? 'Thêm mô tả hoặc tài liệu đính kèm cho cuộc họp...' : 'Add description or attachments...'}
                    className="w-full bg-transparent border-0 p-2.5 text-xs text-[#E3E2E3] placeholder-[#70757A] focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Row 6: Color Palette & Calendar Category & Reminders */}
              <div className="flex items-center gap-3.5">
                <Palette className="w-5 h-5 text-[#9AA0A6] shrink-0" />
                <div className="flex-1 flex flex-wrap items-center justify-between gap-3">
                  {/* Swatches */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#9AA0A6]">Màu sắc:</span>
                    <div className="flex items-center gap-1.5">
                      {colorPalette.map((cp) => (
                        <div
                          key={cp.id}
                          onClick={() => setSelectedColor(cp.color)}
                          style={{ backgroundColor: cp.color }}
                          className={`w-4.5 h-4.5 rounded-full cursor-pointer transition-transform flex items-center justify-center ${
                            selectedColor === cp.color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#242628] scale-110' : 'hover:scale-110'
                          }`}
                          title={cp.name}
                        >
                          {selectedColor === cp.color && <Check className="w-2.5 h-2.5 text-black stroke-[3]" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status & Priority & Reminder Badges */}
                  <div className="flex items-center gap-2 text-[11px]">
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as Priority)}
                      className="px-2 py-1 rounded bg-[#1E1F20] border border-[#333538] text-[#9AA0A6] focus:outline-none cursor-pointer"
                    >
                      <option value="high">{language === 'vi' ? 'Ưu tiên cao' : 'High'}</option>
                      <option value="medium">{language === 'vi' ? 'Ưu tiên TB' : 'Medium'}</option>
                      <option value="low">{language === 'vi' ? 'Ưu tiên thấp' : 'Low'}</option>
                    </select>

                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as 'busy' | 'free')}
                      className="px-2 py-1 rounded bg-[#1E1F20] border border-[#333538] text-[#9AA0A6] focus:outline-none cursor-pointer"
                    >
                      <option value="busy">{language === 'vi' ? 'Bận' : 'Busy'}</option>
                      <option value="free">{language === 'vi' ? 'Rảnh' : 'Free'}</option>
                    </select>

                    <div className="flex items-center gap-1 px-2 py-1 rounded bg-[#1E1F20] border border-[#333538] text-[#9AA0A6]">
                      <Bell className="w-3 h-3 text-[#8AB4F8]" />
                      <select
                        value={reminder}
                        onChange={(e) => setReminder(e.target.value)}
                        className="bg-transparent border-0 text-[#9AA0A6] focus:outline-none cursor-pointer p-0"
                      >
                        <option value="15m" className="bg-[#242628]">15 phút trước</option>
                        <option value="30m" className="bg-[#242628]">30 phút trước</option>
                        <option value="60m" className="bg-[#242628]">1 giờ trước</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-between px-6 py-3.5 bg-[#1E1F20]/90 border-t border-[#333538]">
            {/* Left: Ghost More Options */}
            <button
              type="button"
              onClick={() => openModal('appointment-schedule')}
              className="text-xs font-medium text-[#9AA0A6] hover:text-[#E3E2E3] hover:underline cursor-pointer"
            >
              {language === 'vi' ? 'Tùy chọn khác' : 'More options'}
            </button>

            {/* Right: Cancel & Save */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded-full text-xs font-medium text-[#E3E2E3] hover:bg-[#333538] transition-colors cursor-pointer"
              >
                {language === 'vi' ? 'Hủy' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
              >
                {language === 'vi' ? 'Lưu' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
