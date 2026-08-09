import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Priority } from '../../types';
import { X, MapPin } from 'lucide-react';

export const CreateEventModal: React.FC = () => {
  const { activeModal, closeModal, addEvent, selectedDay, selectedMonth, selectedYear } = useApp();

  const [title, setTitle] = useState<string>('');
  const [type, setType] = useState<'routine' | 'event' | 'task'>('routine');
  const [priority, setPriority] = useState<Priority>('medium');
  const [frequency, setFrequency] = useState<string>('daily');
  const [location, setLocation] = useState<string>('');

  if (activeModal !== 'create') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const freqText =
      frequency === 'daily'
        ? 'Hàng ngày'
        : frequency === 'weekly'
        ? 'Hàng tuần'
        : 'Cứ 3 ngày 1 lần';

    const success = addEvent({
      type: type === 'task' ? 'routine' : type,
      title: title.trim(),
      time: '08:00 AM',
      priority,
      year: selectedYear,
      month: selectedMonth,
      day: selectedDay,
      streak: 1,
      completed: false,
      location: location.trim() || 'Hà Nội',
      travelTime: '20 phút',
      alertTime: 'Trước 25p',
      frequency: freqText,
    });

    if (success) {
      closeModal();
      setTitle('');
      setLocation('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="apple-glass-modal max-w-lg w-full rounded-[28px] p-6 sm:p-8 space-y-5 relative shadow-2xl">
        <button
          onClick={closeModal}
          className="absolute top-5 right-5 app-text-muted hover:app-text-primary p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <span className="apple-glass-pill text-blue-600 dark:text-sky-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
            Khởi tạo mới
          </span>
          <h3 className="text-lg font-bold app-text-primary pt-1">Thêm lịch trình / Thói quen</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold app-text-primary">Tiêu đề:</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Chạy bộ 30 phút hoặc Họp đồ án tốt nghiệp"
              className="w-full apple-input px-3.5 py-2.5 text-xs focus:bg-white dark:focus:bg-slate-900 font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold app-text-primary">Phân loại:</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'routine' | 'event' | 'task')}
                className="w-full apple-input px-3.5 py-2.5 text-xs font-sans"
              >
                <option value="routine">Thói quen lặp lại (Routine)</option>
                <option value="event">Sự kiện & Bản đồ AI (Event)</option>
                <option value="task">Công việc có Deadline (Task)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold app-text-primary">Mức độ ưu tiên:</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full apple-input px-3.5 py-2.5 text-xs font-sans"
              >
                <option value="high">Rất cao (Khẩn cấp)</option>
                <option value="medium">Trung bình</option>
                <option value="low">Thấp (Linh hoạt)</option>
              </select>
            </div>
          </div>

          {/* Routine Frequency */}
          {type === 'routine' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold app-text-primary">Tần suất lặp lại:</label>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                  Gói Free: Hàng ngày/tuần
                </span>
              </div>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full apple-input px-3.5 py-2.5 text-xs font-sans"
              >
                <option value="daily">Hàng ngày (Mỗi sáng / tối)</option>
                <option value="weekly">Hàng tuần vào ngày cố định</option>
                <option value="interval">Cứ 3 ngày 1 lần (VIP)</option>
                <option value="monthly">Ngày cố định trong tháng (VIP)</option>
              </select>
            </div>
          )}

          {/* Event Location */}
          {type === 'event' && (
            <div className="space-y-1.5">
              <label className="font-semibold app-text-primary">
                Địa điểm (Tự động tính thời gian di chuyển AI):
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ví dụ: Trung tâm Hội nghị Quốc gia, Hà Nội"
                  className="w-full apple-input pl-10 pr-3.5 py-2.5 text-xs font-sans"
                />
              </div>
            </div>
          )}

          {/* Notifications */}
          <div className="space-y-2 border-t app-border pt-3">
            <label className="font-semibold app-text-primary">Kênh thông báo nhắc nhở:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <label className="flex items-center gap-1.5 apple-glass-pill p-2 rounded-xl cursor-pointer">
                <input type="checkbox" defaultChecked disabled className="rounded text-blue-600" />
                <span>Push App</span>
              </label>
              <label className="flex items-center gap-1.5 apple-glass-pill p-2 rounded-xl cursor-pointer">
                <input type="checkbox" className="rounded text-blue-600" />
                <span>SMS</span>
              </label>
              <label className="flex items-center gap-1.5 apple-glass-pill p-2 rounded-xl cursor-pointer">
                <input type="checkbox" className="rounded text-blue-600" />
                <span>Email</span>
              </label>
              <label className="flex items-center gap-1.5 apple-glass-pill p-2 rounded-xl cursor-pointer">
                <input type="checkbox" className="rounded text-blue-600" />
                <span>Voice Call</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 apple-glass-pill hover:bg-black/5 dark:hover:bg-white/10 app-text-primary py-2.5 rounded-2xl font-bold transition-all cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex-1 apple-btn-primary font-bold py-2.5 rounded-2xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              Lưu lịch trình
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
