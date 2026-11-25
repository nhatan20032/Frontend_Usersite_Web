import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import type { Priority } from '../../types';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { DatePicker } from '../ui/DatePicker';
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
  List,
} from 'lucide-react';

const colorPalette = [
  { id: 'blue', color: '#8AB4F8', name: 'Google Blue' },
  { id: 'green', color: '#81C995', name: 'Sage Green' },
  { id: 'orange', color: '#E8710A', name: 'Flamingo' },
  { id: 'yellow', color: '#F6BF26', name: 'Banana' },
  { id: 'purple', color: '#B39DDB', name: 'Amethyst' },
];

const dueTimeOptions = [
  { value: '09:00 AM', label: '09:00 AM' },
  { value: '12:00 PM', label: '12:00 PM' },
  { value: '15:00 PM', label: '15:00 PM' },
  { value: '17:00 PM', label: '17:00 PM' },
  { value: '18:00 PM', label: '18:00 PM' },
  { value: '20:00 PM', label: '20:00 PM' },
  { value: '23:59 PM', label: '23:59 PM' },
];

const timeOptions = [
  { value: '08:00 AM', label: '08:00 AM' },
  { value: '09:00 AM', label: '09:00 AM' },
  { value: '10:00 AM', label: '10:00 AM' },
  { value: '11:00 AM', label: '11:00 AM' },
  { value: '12:00 PM', label: '12:00 PM' },
  { value: '01:00 PM', label: '01:00 PM' },
  { value: '02:00 PM', label: '02:00 PM' },
  { value: '03:00 PM', label: '03:00 PM' },
  { value: '04:00 PM', label: '04:00 PM' },
  { value: '05:00 PM', label: '05:00 PM' },
  { value: '06:00 PM', label: '06:00 PM' },
];



export const CreateEventModal: React.FC = () => {
  const {
    activeModal,
    closeModal,
    addEvent,
    updateEvent,
    addTask,
    updateTask,
    openModal,
    selectedDay,
    selectedMonth,
    selectedYear,
    selectDate,
    showToast,
    activeEditItem,
    eventsData,
    tasksData,
    categories,
  } = useApp();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'event' | 'task' | 'appointment'>('event');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('09:00 AM');
  const [endTime, setEndTime] = useState<string>('10:00 AM');
  const [dueTime, setDueTime] = useState<string>('17:00 PM');
  const [priority, setPriority] = useState<Priority>('medium');
  const [frequency, setFrequency] = useState<string>('none');
  const [location, setLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guests, setGuests] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('#8AB4F8');
  const [selectedCategory, setSelectedCategory] = useState<string>('event');
  const [status, setStatus] = useState<'busy' | 'free'>('busy');
  const [reminder, setReminder] = useState<string>('30m');

  // Subtasks State for Task Tab
  const [subtaskList, setSubtaskList] = useState<string[]>([]);
  const [newSubtaskInput, setNewSubtaskInput] = useState<string>('');

  useEffect(() => {
    if (activeModal === 'edit' && activeEditItem) {
      setErrorMsg('');
      if (activeEditItem.type === 'task') {
        const task = tasksData.find((t) => String(t.id) === String(activeEditItem.id));
        if (task) {
          setActiveTab('task');
          setTitle(task.title);
          setPriority(task.priority || 'medium');
          setSelectedColor(task.colorTag || '#8AB4F8');
          setSelectedCategory(task.categoryId || 'task');
          setSubtaskList((task.subtasks || []).map((st) => st.title));
          // parse due time
          const match = task.dueDate.match(/\d{2}:\d{2} [AP]M/);
          if (match) setDueTime(match[0]);
          if (task.reminders?.includes('60m') || task.reminders?.includes('Email')) {
            setReminder('60m');
          } else if (task.reminders?.includes('15m')) {
            setReminder('15m');
          } else {
            setReminder('30m');
          }
        } else {
          console.error("Task not found for editing", activeEditItem);
          setErrorMsg(`Không tìm thấy công việc cần sửa (ID: ${activeEditItem.id})`);
        }
      } else {
        const event = eventsData.find((e) => String(e.id) === String(activeEditItem.id));
        if (event) {
          setActiveTab('event');
          setTitle(event.title);
          setStartTime(event.time);
          setEndTime(event.endTime || '10:00 AM');
          setPriority(event.priority || 'medium');
          setLocation(event.location || '');
          setDescription(event.description || '');
          setSelectedColor(event.colorTag || '#8AB4F8');
          setSelectedCategory(event.categoryId || event.type || 'event');
          setStatus(event.status || 'busy');
          if (event.attendees && event.attendees.length > 0) {
            setGuests(event.attendees);
          }
          if (event.alertTime?.includes('15')) {
            setReminder('15m');
          } else if (event.alertTime?.includes('60') || event.alertTime?.includes('1 giờ')) {
            setReminder('60m');
          } else {
            setReminder('30m');
          }
          if (event.frequency?.includes('ngày') || event.frequency?.includes('Daily')) {
            setFrequency('daily');
          } else if (event.frequency?.includes('tuần') || event.frequency?.includes('Weekly')) {
            setFrequency('weekly');
          } else if (event.frequency?.includes('tháng') || event.frequency?.includes('Monthly')) {
            setFrequency('monthly');
          } else {
            setFrequency('none');
          }
          if (event.day !== undefined && event.month !== undefined && event.year !== undefined) {
            selectDate(event.day, event.month, event.year);
          }
        } else {
          setErrorMsg(`Không tìm thấy sự kiện cần sửa (ID: ${activeEditItem.id})`);
          console.error("Event not found for editing", activeEditItem);
        }
      }
    } else if (activeModal === 'create') {
      setErrorMsg('');
      setTitle('');
      setStartTime('09:00 AM');
      setEndTime('10:00 AM');
      setDueTime('17:00 PM');
      setPriority('medium');
      setFrequency('none');
      setLocation('');
      setDescription('');
      setGuestEmail('');
      setGuests([]);
      setSelectedColor('#8AB4F8');
      setSelectedCategory(activeTab === 'task' ? 'task' : 'event');
      setStatus('busy');
      setReminder('30m');
      setSubtaskList([]);
      setNewSubtaskInput('');
    }
  }, [activeModal, activeEditItem, eventsData, tasksData]);

  useEffect(() => {
    if (activeModal !== 'create' && activeModal !== 'edit') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, closeModal]);

  if (activeModal !== 'create' && activeModal !== 'edit') return null;

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

  const handleAddSubtask = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (newSubtaskInput.trim()) {
        setSubtaskList((prev) => [...prev, newSubtaskInput.trim()]);
        setNewSubtaskInput('');
      }
    }
  };

  const handleRemoveSubtask = (indexToRemove: number) => {
    setSubtaskList((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleTabChange = (tab: 'event' | 'task' | 'appointment') => {
    if (tab === 'appointment') {
      openModal('appointment-schedule');
      return;
    }
    setActiveTab(tab);
    if (tab === 'task') {
      setSelectedCategory('task');
      const taskCat = categories.find((c) => c.id === 'task');
      if (taskCat) setSelectedColor(taskCat.color);
    } else if (tab === 'event') {
      setSelectedCategory('event');
      const eventCat = categories.find((c) => c.id === 'event');
      if (eventCat) setSelectedColor(eventCat.color);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (activeTab === 'task') {
      const reminderText = reminder === 'none' ? undefined : reminder;

      const taskData = {
        title: title.trim(),
        dueDate: new Date(selectedYear, selectedMonth, selectedDay, Number(dueTime.split(':')[0]), Number(dueTime.split(':')[1].slice(0, 2))).toISOString(),
        priority,
        reminders: reminderText,
        subtasks: subtaskList.map((st, idx) => ({ id: idx + 1, title: st, completed: false })),
        colorTag: selectedColor,
        categoryId: selectedCategory || 'task',
      };

      if (activeModal === 'edit' && activeEditItem) {
        if (!await updateTask(activeEditItem.id, taskData)) return;
      } else {
        if (!await addTask(taskData)) return;
      }

      showToast(
        language === 'vi' ? (activeModal === 'edit' ? 'Đã cập nhật việc cần làm' : 'Đã tạo việc cần làm') : 'Task saved',
        language === 'vi'
          ? `Đã lưu "${title}"${subtaskList.length > 0 ? ` kèm ${subtaskList.length} việc con` : ''}`
          : `Saved "${title}"`,
        'success'
      );
      closeModal();
      setTitle('');
      setSubtaskList([]);
      setNewSubtaskInput('');
      setDescription('');
      return;
    }

    let freqText = 'Một lần';
    if (frequency === 'daily') {
      freqText = language === 'vi' ? 'Hàng ngày' : 'Daily';
    } else if (frequency === 'weekly') {
      freqText = language === 'vi' ? 'Hàng tuần' : 'Weekly';
    } else if (frequency === 'monthly') {
      freqText = language === 'vi' ? 'Hàng tháng' : 'Monthly';
    }

    const eventData = {
      type: (selectedCategory === 'routine' ? 'routine' : 'event') as 'routine' | 'event',
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

      alertTime: reminder === '30m' ? 'Trước 30 phút' : 'Trước 15 phút',
      frequency: freqText,
      description: description.trim() || undefined,
      attendees: guests,
      reminderMinutesBefore: reminder === 'none' ? undefined : parseInt(reminder),
      colorTag: selectedColor,
      categoryId: selectedCategory || 'event',
      status,
    };

    if (activeModal === 'edit' && activeEditItem) {
      if (!await updateEvent(activeEditItem.id, eventData)) return;
      showToast(
        language === 'vi' ? 'Đã lưu thay đổi' : 'Changes saved',
        language === 'vi' ? `Đã cập nhật "${title}"` : `Updated "${title}"`,
        'success'
      );
      closeModal();
    } else {
      const success = await addEvent(eventData);
      if (success) {
        showToast(
          language === 'vi' ? 'Đã lưu lịch trình' : 'Event saved',
          language === 'vi' ? `Đã thêm "${title}" vào ngày ${selectedDay}/${selectedMonth + 1}` : `Added "${title}" to calendar`,
          'success'
        );
        closeModal();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-150">
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0" onClick={closeModal} />

      {/* Center Stage Floating Popover Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={activeModal === 'edit' ? (language === 'vi' ? 'Chỉnh sửa chi tiết' : 'Edit details') : (language === 'vi' ? 'Tạo sự kiện & công việc mới' : 'Create event or task')}
        className="relative w-full max-w-[540px] bg-[var(--surface-container)] border border-[var(--border-subtle)] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-10"
      >
        {/* Top Drag/Header Bar */}
        <div className="flex items-center justify-between px-5 pt-3 pb-2.5 border-b border-[var(--border-subtle)] bg-[var(--surface-container)]/70">
          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
            <CalendarIcon className="w-4 h-4 text-[var(--google-blue)]" />
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[var(--text-secondary)]">
              {activeModal === 'edit'
                ? (language === 'vi' ? 'Chỉnh sửa chi tiết' : 'Edit details')
                : (language === 'vi' ? 'Tạo sự kiện & công việc mới' : 'Create event or task')}
            </span>
          </div>
          <button
            onClick={closeModal}
            aria-label={language === 'vi' ? 'Đóng' : 'Close'}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--border-subtle)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            title={language === 'vi' ? 'Đóng' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-5 sm:p-6 flex flex-col gap-4.5 max-h-[78vh] overflow-y-auto [scrollbar-gutter:stable] custom-scrollbar">
            {errorMsg && (
              <div className="bg-red-500/20 text-red-200 p-3 rounded-lg border border-red-500/50 text-xs break-all">
                {errorMsg}
              </div>
            )}
            {/* 1. Large Title Input */}
            <div className="relative">
              <Input
                variant="underline"
                type="text"
                required
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={language === 'vi' ? 'Thêm tiêu đề' : 'Add title'}
              />
            </div>

            {/* 2. Segmented Pill Tabs */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleTabChange('event')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'event'
                    ? 'bg-[var(--google-blue-primary)] text-white shadow-sm'
                    : 'text-[var(--text-secondary)] hover:bg-[#303336] hover:text-[var(--text-primary)]'
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
                    ? 'bg-[var(--google-blue-primary)] text-white shadow-sm'
                    : 'text-[var(--text-secondary)] hover:bg-[#303336] hover:text-[var(--text-primary)]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{language === 'vi' ? 'Việc cần làm' : 'Task'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('appointment')}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium text-[var(--text-secondary)] hover:bg-[#303336] hover:text-[var(--text-primary)] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-[#FDD663]" />
                <span>{language === 'vi' ? 'Lên lịch hẹn' : 'Appointment'}</span>
                <span className="px-1.5 py-0.5 rounded bg-[#01552C] text-[#8ED7A1] text-[11px] font-bold">
                  {language === 'vi' ? 'MỚI' : 'NEW'}
                </span>
              </button>
            </div>

            {/* 3. Detailed Fields with Google-Style Icons */}
            <div className="space-y-4 pt-1 text-xs text-[var(--text-primary)]">
              {/* Row 1: Date & Time (Context-aware) */}
              <div className="flex items-start gap-3.5">
                <Clock className="w-5 h-5 text-[var(--text-secondary)] mt-2 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <DatePicker
                      value={{ day: selectedDay, month: selectedMonth, year: selectedYear }}
                      onChange={(newDate) => selectDate(newDate.day, newDate.month, newDate.year)}
                    />

                    {activeTab === 'task' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--text-secondary)]">{language === 'vi' ? 'Hạn chót:' : 'Due:'}</span>
                        <Select
                          value={dueTime}
                          onChange={setDueTime}
                          options={dueTimeOptions}
                          isMono
                        />
                      </div>
                    ) : (
                      <>
                        <span className="text-[var(--text-secondary)]">•</span>
                        <Select
                          value={startTime}
                          onChange={setStartTime}
                          options={timeOptions}
                        />
                        <span className="text-[var(--text-secondary)]">–</span>
                        <Select
                          value={endTime}
                          onChange={setEndTime}
                          options={timeOptions}
                        />
                      </>
                    )}
                  </div>

                  {activeTab === 'event' && (
                    <div className="flex items-center gap-3 text-[11px] text-[var(--text-secondary)]">
                      <span>GMT+7 Giờ Đông Dương</span>
                      <span>•</span>
                      <Select
                        value={frequency}
                        onChange={setFrequency}
                        options={[
                          { value: 'none', label: language === 'vi' ? 'Không lặp lại' : 'Does not repeat' },
                          { value: 'daily', label: language === 'vi' ? 'Hàng ngày' : 'Daily' },
                          { value: 'weekly', label: language === 'vi' ? 'Hàng tuần' : 'Weekly' },
                          { value: 'monthly', label: language === 'vi' ? 'Hàng tháng' : 'Monthly' },
                        ]}
                        buttonClassName="bg-transparent border-transparent hover:border-[var(--border-subtle)] text-[var(--google-blue)] hover:text-[#A8C7FA] py-0.5 px-1.5 h-auto"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Row 2: Add Guests (Chỉ dành cho Sự kiện) */}
              {activeTab === 'event' && (
                <div className="flex items-start gap-3.5">
                  <Users className="w-5 h-5 text-[var(--text-secondary)] mt-2 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Input
                      type="text"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      onKeyDown={handleAddGuest}
                      placeholder={language === 'vi' ? 'Thêm khách (nhập email rồi nhấn Enter)...' : 'Add guests (press Enter)...'}
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {guests.map((guest, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--surface-container)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-primary)]"
                        >
                          <div className="w-4 h-4 rounded-full bg-[var(--google-blue)] text-[var(--surface-canvas)] text-[11px] font-bold flex items-center justify-center">
                            {guest.charAt(0).toUpperCase()}
                          </div>
                          <span className="truncate max-w-[200px]">{guest}</span>
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveGuest(idx)}
                              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Row 3: Location (Chỉ dành cho Sự kiện) */}
              {activeTab === 'event' && (
                <div className="flex items-center gap-3.5">
                  <MapPin className="w-5 h-5 text-[var(--text-secondary)] shrink-0" />
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder={language === 'vi' ? 'Thêm vị trí hoặc phòng họp...' : 'Add location...'}
                    />
                  </div>
                </div>
              )}

              {/* Row 4: Subtasks Checklist (Dành riêng cho Việc cần làm) */}
              {activeTab === 'task' && (
                <div className="flex items-start gap-3.5 pt-1">
                  <List className="w-5 h-5 text-[var(--text-secondary)] mt-1 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[var(--text-secondary)]">
                        {language === 'vi' ? 'Danh sách việc con (Checklist)' : 'Subtasks / Checklist'}
                      </span>
                      {subtaskList.length > 0 && (
                        <span className="text-[var(--google-blue)] font-mono font-medium">
                          {subtaskList.length} {language === 'vi' ? 'việc' : 'items'}
                        </span>
                      )}
                    </div>

                    {/* Danh sách việc con đã thêm */}
                    {subtaskList.length > 0 && (
                      <div className="space-y-1.5 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
                        {subtaskList.map((st, idx) => (
                          <div
                            key={idx}
                            className="group flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-[var(--surface-container)] border border-[var(--border-subtle)] hover:border-[#3C4043] transition-colors"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--google-blue)] shrink-0" />
                              <span className="text-xs text-[var(--text-primary)] truncate">{st}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveSubtask(idx)}
                              className="text-[var(--text-muted)] hover:text-[#F28B82] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-0.5"
                              title={language === 'vi' ? 'Xóa việc con' : 'Delete subtask'}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Input thêm việc con */}
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={newSubtaskInput}
                        onChange={(e) => setNewSubtaskInput(e.target.value)}
                        onKeyDown={handleAddSubtask}
                        placeholder={language === 'vi' ? '+ Thêm việc con rồi nhấn Enter...' : '+ Add subtask item and press Enter...'}
                        className="flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newSubtaskInput.trim()) {
                            setSubtaskList((prev) => [...prev, newSubtaskInput.trim()]);
                            setNewSubtaskInput('');
                          }
                        }}
                        className="h-9 px-3 rounded-lg bg-[var(--surface-container-high)] hover:bg-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-medium border border-[var(--border-subtle)] transition-colors cursor-pointer shrink-0"
                      >
                        {language === 'vi' ? 'Thêm' : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Row 5: Description & Mini Toolbar (Ngữ cảnh hóa) */}
              <div className="flex items-start gap-3.5">
                <AlignLeft className="w-5 h-5 text-[var(--text-secondary)] mt-1 shrink-0" />
                <div className="flex-1 border border-[var(--border-subtle)] rounded-lg bg-[var(--surface-container)] overflow-hidden">
                  {activeTab === 'event' ? (
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={language === 'vi' ? 'Thêm mô tả hoặc ghi chú cho sự kiện...' : 'Add description or notes...'}
                      className="w-full bg-transparent border-0 p-2.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none resize-none"
                    />
                  ) : (
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={language === 'vi' ? 'Thêm ghi chú ngắn cho công việc...' : 'Add quick notes...'}
                      className="w-full bg-transparent border-0 p-2.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none resize-none"
                    />
                  )}
                </div>
              </div>

              {/* Row 6: Category Selector & Color Swatches & Native Color Picker */}
              <div className="flex items-start gap-3.5">
                <Palette className="w-5 h-5 text-[var(--text-secondary)] mt-1.5 shrink-0" />
                <div className="flex-1 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2.5">
                    {/* Category Selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[var(--text-secondary)]">{language === 'vi' ? 'Danh mục / Tag:' : 'Category:'}</span>
                      <Select
                        value={selectedCategory}
                        buttonClassName="h-8 px-2.5 text-[11px]"
                        onChange={(catId) => {
                          setSelectedCategory(catId);
                          const cat = categories.find((c) => c.id === catId);
                          if (cat) setSelectedColor(cat.color);
                        }}
                        options={categories.map((c) => ({
                          value: c.id,
                          label:
                            c.id === 'routine'
                              ? (language === 'vi' ? 'Thói quen hằng ngày' : 'Daily Routine')
                              : c.id === 'event'
                              ? (language === 'vi' ? 'Sự kiện & Hội thảo' : 'Events')
                              : c.id === 'task'
                              ? (language === 'vi' ? 'Nhiệm vụ & Deadline' : 'Tasks')
                              : c.name,
                          colorDot: c.color,
                        }))}
                      />
                    </div>

                    {/* Color Swatches & Native Color Picker */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[var(--text-secondary)]">{language === 'vi' ? 'Màu:' : 'Color:'}</span>
                      <div className="flex items-center gap-1.5">
                        {colorPalette.map((cp) => (
                          <div
                            key={cp.id}
                            onClick={() => setSelectedColor(cp.color)}
                            style={{ backgroundColor: cp.color }}
                            className={`w-4.5 h-4.5 rounded-full cursor-pointer transition-transform flex items-center justify-center ${
                              selectedColor.toLowerCase() === cp.color.toLowerCase() ? 'ring-2 ring-white ring-offset-2 ring-offset-[var(--surface-container)] scale-110' : 'hover:scale-110'
                            }`}
                            title={cp.name}
                          >
                            {selectedColor.toLowerCase() === cp.color.toLowerCase() && <Check className="w-2.5 h-2.5 text-black stroke-[3]" />}
                          </div>
                        ))}
                        {/* Native Color Picker for custom color picking */}
                        <label
                          className="w-4.5 h-4.5 rounded-full border border-dashed border-[var(--border-subtle)] flex items-center justify-center cursor-pointer hover:border-[var(--google-blue)] transition-colors relative overflow-hidden"
                          title={language === 'vi' ? 'Tự chọn màu khác từ Color Picker' : 'Custom color from Color Picker'}
                        >
                          <input
                            type="color"
                            value={selectedColor}
                            onChange={(e) => setSelectedColor(e.target.value)}
                            className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                          />
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedColor }} />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Priority & Status (nếu có) & Reminder Badges */}
                  <div className="flex items-center gap-2 text-[11px] flex-wrap">
                    <Select
                      value={priority}
                      buttonClassName="h-8 px-2.5 text-[11px]"
                      onChange={(val) => setPriority(val as Priority)}
                      options={[
                        { value: 'high', label: language === 'vi' ? 'Ưu tiên cao' : 'High' },
                        { value: 'medium', label: language === 'vi' ? 'Ưu tiên TB' : 'Medium' },
                        { value: 'low', label: language === 'vi' ? 'Ưu tiên thấp' : 'Low' },
                      ]}
                    />

                    {activeTab === 'event' && (
                      <Select
                        value={status}
                        buttonClassName="h-8 px-2.5 text-[11px]"
                        onChange={(val) => setStatus(val as 'busy' | 'free')}
                        options={[
                          { value: 'busy', label: language === 'vi' ? 'Bận' : 'Busy' },
                          { value: 'free', label: language === 'vi' ? 'Rảnh' : 'Free' },
                        ]}
                      />
                    )}

                    <Select
                      value={reminder}
                      buttonClassName="h-8 px-2.5 text-[11px]"
                      onChange={setReminder}
                      options={[
                        { value: '15m', label: language === 'vi' ? '15 phút trước' : '15 min before' },
                        { value: '30m', label: language === 'vi' ? '30 phút trước' : '30 min before' },
                        { value: '60m', label: language === 'vi' ? '1 giờ trước' : '1 hour before' },
                        { value: '1d', label: language === 'vi' ? '1 ngày trước' : '1 day before' },
                      ]}
                      prefixIcon={<Bell className="w-3.5 h-3.5 text-[var(--google-blue)]" />}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-between px-6 py-3.5 bg-[var(--surface-container)]/90 border-t border-[var(--border-subtle)]">
            {/* Left: Context Info Hint */}
            <span className="text-[11px] text-[var(--text-muted)]">
              {activeTab === 'task'
                ? (language === 'vi' ? 'Được đồng bộ vào bảng Tasks bên phải' : 'Syncs to Tasks companion panel')
                : (language === 'vi' ? 'Thời gian GMT+7 Đông Dương' : 'Indochina Time GMT+7')}
            </span>

            {/* Right: Cancel & Save */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded-full text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-colors cursor-pointer"
              >
                {language === 'vi' ? 'Hủy' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-[var(--google-blue-primary)] hover:bg-[#1557B0] text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
              >
                {activeModal === 'edit'
                  ? (language === 'vi' ? 'Lưu thay đổi' : 'Save changes')
                  : (language === 'vi' ? 'Lưu' : 'Save')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
