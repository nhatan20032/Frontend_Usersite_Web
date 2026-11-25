import { appointmentApi } from '../../api/appointmentApi';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import type { DailyAvailabilitySlot, TimeRange } from '../../types';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { DatePicker } from '../ui/DatePicker';
import { X, Plus, Copy, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

// ---- Grid geometry ----
const START_H = 8;
const END_H = 20;
const HOUR_PX = 48;
const SNAP = 15;
const MIN_START = START_H * 60;
const MAX_END = END_H * 60;
const HOURS = Array.from({ length: END_H - START_H }, (_, i) => START_H + i);
const DURATIONS = [15, 30, 45, 60, 90, 120];

const uid = () => Math.random().toString(36).slice(2, 9);
const pad = (n: number) => String(n).padStart(2, '0');
const fmt = (m: number) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
const parse = (v: string) => {
  const match = v.match(/(\d+):(\d+)\s*(AM|PM|am|pm)?/i);
  if (!match) return NaN;
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const ampm = match[3]?.toUpperCase();
  if (ampm === 'PM' && h < 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : NaN;
};
const to12h = (m: number) => {
  const h = Math.floor(m / 60);
  return `${pad(h % 12 || 12)}:${pad(m % 60)} ${h < 12 ? 'AM' : 'PM'}`;
};
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const minToPx = (m: number) => ((m - MIN_START) / 60) * HOUR_PX;

/** Sort and merge overlapping/touching ranges */
const normalize = (ranges: TimeRange[]): TimeRange[] => {
  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  const out: TimeRange[] = [];
  for (const r of sorted) {
    const last = out[out.length - 1];
    if (last && r.start <= last.end) last.end = Math.max(last.end, r.end);
    else out.push({ ...r });
  }
  return out;
};

const range = (start: number, end: number): TimeRange => ({ id: uid(), start, end });

const initialAvailability: DailyAvailabilitySlot[] = [
  { id: 'sun', dayIndex: 0, dayNameVi: 'Chủ Nhật', dayNameEn: 'Sunday', isAvailable: false, ranges: [] },
  { id: 'mon', dayIndex: 1, dayNameVi: 'Thứ 2', dayNameEn: 'Monday', isAvailable: true, ranges: [range(540, 1020)] },
  { id: 'tue', dayIndex: 2, dayNameVi: 'Thứ 3', dayNameEn: 'Tuesday', isAvailable: true, ranges: [range(540, 1020)] },
  { id: 'wed', dayIndex: 3, dayNameVi: 'Thứ 4', dayNameEn: 'Wednesday', isAvailable: true, ranges: [range(540, 1020)] },
  { id: 'thu', dayIndex: 4, dayNameVi: 'Thứ 5', dayNameEn: 'Thursday', isAvailable: true, ranges: [range(540, 1020)] },
  { id: 'fri', dayIndex: 5, dayNameVi: 'Thứ 6', dayNameEn: 'Friday', isAvailable: true, ranges: [range(540, 1020)] },
  { id: 'sat', dayIndex: 6, dayNameVi: 'Thứ 7', dayNameEn: 'Saturday', isAvailable: false, ranges: [] },
];

const TIMEZONES = [
  { value: 'GMT+07:00', label: '(GMT+07:00) Hồ Chí Minh' },
  { value: 'GMT+00:00', label: '(GMT+00:00) London' },
  { value: 'GMT-05:00', label: '(GMT-05:00) New York' },
  { value: 'GMT+09:00', label: '(GMT+09:00) Tokyo' },
];

type DragMode = 'create' | 'move' | 'resize-start' | 'resize-end';
interface DragState {
  day: number;
  mode: DragMode;
  id?: string;
  origin: number;
  origStart: number;
  origEnd: number;
  start: number;
  end: number;
  moved: boolean;
}

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--google-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#202124]';

const CustomTimePicker: React.FC<{ value: string; onChange: (val: string) => void }> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(() => {
    const m = parse(value);
    return Number.isNaN(m) ? value : to12h(m);
  });
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const m = parse(value);
    setText(Number.isNaN(m) ? value : to12h(m));
  }, [value]);

  const updatePosition = useCallback(() => {
    if (!inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - 12;
    const spaceAbove = rect.top - 12;
    const dropUp = spaceBelow < 220 && spaceAbove > spaceBelow;

    const style: React.CSSProperties = {
      position: 'fixed',
      left: Math.max(12, Math.min(rect.left, window.innerWidth - 120)),
      minWidth: Math.max(rect.width, 108),
      maxHeight: Math.max(120, Math.min(240, dropUp ? spaceAbove : spaceBelow)),
      zIndex: 120,
    };

    if (dropUp) {
      style.bottom = window.innerHeight - rect.top + 4;
    } else {
      style.top = rect.bottom + 4;
    }

    setMenuStyle(style);
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePosition();

    const handle = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        ref.current && !ref.current.contains(target) &&
        (!menuRef.current || !menuRef.current.contains(target))
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      document.removeEventListener('mousedown', handle);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open, updatePosition]);

  const options = Array.from({ length: 24 * 2 }, (_, i) => fmt(i * 30));

  return (
    <div ref={ref} className="relative shrink-0">
      <input
        ref={inputRef}
        type="text"
        value={text}
        onFocus={() => {
          updatePosition();
          setOpen(true);
        }}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => {
          const m = parse(text);
          if (!Number.isNaN(m)) onChange(fmt(m));
          else setText(to12h(parse(value)));
        }}
        className="h-8 w-[84px] sm:w-[88px] px-2 text-center rounded-lg bg-[var(--surface-container)] border border-[var(--border-subtle)] hover:bg-[var(--surface-container-high)] text-xs tabular-nums text-[var(--text-primary)] transition-colors focus:border-[var(--google-blue)] focus-visible:ring-1 focus-visible:ring-[var(--google-blue)] focus:outline-none"
      />
      {open && createPortal(
        <div
          ref={menuRef}
          style={menuStyle}
          className="overflow-y-auto custom-scrollbar bg-[var(--surface-container-high)] border border-[var(--border-subtle)] rounded-xl shadow-2xl p-1 animate-in fade-in zoom-in-95 duration-150"
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); onChange(opt); setOpen(false); }}
              className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${fmt(parse(value)) === opt ? 'bg-[var(--google-blue-primary)] text-white font-medium' : 'text-[var(--text-primary)] hover:bg-[var(--surface-container-highest)]'}`}
            >
              {to12h(parse(opt))}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

export const AppointmentScheduleModal: React.FC = () => {
  const { activeModal, closeModal, showToast, selectedMonth, selectedYear, selectedDay } = useApp();
  const { t, language } = useLanguage();

  const [title, setTitle] = useState<string>('');
  const [duration, setDuration] = useState<number>(60); // minutes
  const [repeatMode, setRepeatMode] = useState<string>('weekly');
  const [availability, setAvailability] = useState<DailyAvailabilitySlot[]>(initialAvailability);
  const [availabilityLoaded, setAvailabilityLoaded] = useState(false);
  const [timezone, setTimezone] = useState<string>('GMT+07:00');
  useEffect(() => {
    if (activeModal !== 'appointment-schedule') return;
    let active = true;
    setAvailabilityLoaded(false);
    appointmentApi.getAvailability().then(data => {
      if (!active) return;
      setAvailabilityLoaded(true);
      setTimezone(data.timezone); setDuration(data.defaultDurationMinutes);
      setAvailability(initialAvailability.map(day => ({ ...day,
        isAvailable: data.slots.some(s => s.dayIndex === day.dayIndex && s.isAvailable),
        ranges: data.slots.filter(s => s.dayIndex === day.dayIndex && s.isAvailable).map(s => range(parse(s.startTime), parse(s.endTime))),
      })));
    }).catch((e: Error) => showToast('Không tải được lịch hẹn', e.message, 'error'));
    return () => { active = false; };
  }, [activeModal]);

  const [maxDays, setMaxDays] = useState<number>(60);
  const [minHours, setMinHours] = useState<number>(4);
  const [windowOpen, setWindowOpen] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selected, setSelected] = useState<{ day: number; id: string } | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [now, setNow] = useState(() => new Date());
  const scrollRef = useRef<HTMLDivElement>(null);

  const isOpen = activeModal === 'appointment-schedule';

  // Clock for the current-time line
  useEffect(() => {
    if (!isOpen) return;
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, [isOpen]);

  // Esc: cancel drag first, otherwise close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (drag) setDrag(null);
      else closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, drag, closeModal]);

  // Start scrolled near 08:00 (top) — nothing to do, but reset on open
  useEffect(() => {
    if (isOpen && scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [isOpen]);

  if (!isOpen) return null;

  const dayNames = t('appt.days').split(',');

  // ---- availability mutations ----
  const updateDay = (dayIndex: number, fn: (d: DailyAvailabilitySlot) => DailyAvailabilitySlot) =>
    setAvailability((prev) => prev.map((d) => (d.dayIndex === dayIndex ? fn(d) : d)));

  const setRanges = (dayIndex: number, ranges: TimeRange[]) =>
    updateDay(dayIndex, (d) => {
      const next = normalize(ranges);
      return { ...d, ranges: next, isAvailable: next.length > 0 };
    });

  const toggleDayAvailable = (dayIndex: number) =>
    updateDay(dayIndex, (d) => {
      if (d.isAvailable) return { ...d, isAvailable: false };
      return { ...d, isAvailable: true, ranges: d.ranges.length ? d.ranges : [range(540, 1020)] };
    });

  const addRange = (dayIndex: number) => {
    const d = availability.find((x) => x.dayIndex === dayIndex);
    if (!d) return;
    const last = d.ranges[d.ranges.length - 1];
    let start = last ? last.end + 60 : 540;
    if (start + 60 > MAX_END) start = MAX_END - 60;
    setRanges(dayIndex, [...d.ranges, range(start, start + 60)]);
  };

  const removeRange = (dayIndex: number, id: string) => {
    const d = availability.find((x) => x.dayIndex === dayIndex);
    if (!d) return;
    setRanges(dayIndex, d.ranges.filter((r) => r.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const editRange = (dayIndex: number, id: string, key: 'start' | 'end', value: string) => {
    const m = parse(value);
    if (Number.isNaN(m)) return;
    const d = availability.find((x) => x.dayIndex === dayIndex);
    if (!d) return;
    const next = d.ranges.map((r) => {
      if (r.id !== id) return r;
      // Allow exact minutes, minimum 1 minute gap
      const start = key === 'start' ? clamp(m, MIN_START, r.end - 1) : r.start;
      const end = key === 'end' ? clamp(m, r.start + 1, MAX_END) : r.end;
      return { ...r, start, end };
    });
    setRanges(dayIndex, next);
  };

  // Copy a day's ranges to Mon–Fri
  const handleCopyAll = (fromDay: number) => {
    const src = availability.find((d) => d.dayIndex === fromDay);
    if (!src || src.ranges.length === 0) return;
    setAvailability((prev) =>
      prev.map((item) =>
        item.dayIndex >= 1 && item.dayIndex <= 5
          ? { ...item, isAvailable: true, ranges: src.ranges.map((r) => range(r.start, r.end)) }
          : item
      )
    );
    showToast(t('appt.appliedTitle'), t('appt.appliedDesc'), 'info');
  };

  // ---- canvas pointer interaction ----
  const yToMin = (el: HTMLElement, clientY: number) => {
    const y = clientY - el.getBoundingClientRect().top;
    const raw = MIN_START + (y / HOUR_PX) * 60;
    return clamp(Math.round(raw / SNAP) * SNAP, MIN_START, MAX_END);
  };

  const beginDrag = (e: React.PointerEvent, day: number, mode: DragMode, r?: TimeRange) => {
    if (e.button !== 0) return;
    const col = (e.currentTarget as HTMLElement).closest<HTMLElement>('[data-col]');
    if (!col) return;
    e.stopPropagation();
    e.preventDefault();
    col.setPointerCapture(e.pointerId);
    const m = yToMin(col, e.clientY);
    setDrag({
      day,
      mode,
      id: r?.id,
      origin: m,
      origStart: r ? r.start : m,
      origEnd: r ? r.end : m,
      start: r ? r.start : m,
      end: r ? r.end : m,
      moved: false,
    });
    if (r) setSelected({ day, id: r.id });
    else setSelected(null);
  };

  const onColMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!drag) return;
    const m = yToMin(e.currentTarget, e.clientY);
    const len = drag.origEnd - drag.origStart;
    let { start, end } = drag;
    if (drag.mode === 'create') {
      start = Math.min(drag.origin, m);
      end = Math.max(drag.origin, m);
    } else if (drag.mode === 'move') {
      start = clamp(drag.origStart + (m - drag.origin), MIN_START, MAX_END - len);
      end = start + len;
    } else if (drag.mode === 'resize-start') {
      start = clamp(m, MIN_START, drag.origEnd - 1);
    } else {
      end = clamp(m, drag.origStart + 1, MAX_END);
    }
    if (start !== drag.start || end !== drag.end) setDrag({ ...drag, start, end, moved: true });
  };

  const onColUp = () => {
    if (!drag) return;
    const d = availability.find((x) => x.dayIndex === drag.day);
    if (d) {
      if (drag.mode === 'create') {
        // Click without dragging → one slot of the current duration
        let { start, end } = drag;
        if (end - start < SNAP) {
          start = clamp(Math.floor(drag.origin / SNAP) * SNAP, MIN_START, MAX_END - duration);
          end = start + duration;
        }
        const base = d.isAvailable ? d.ranges : [];
        setRanges(drag.day, [...base, range(start, end)]);
      } else if (drag.moved && drag.id) {
        setRanges(
          drag.day,
          d.ranges.map((r) => (r.id === drag.id ? { ...r, start: drag.start, end: drag.end } : r))
        );
      }
    }
    setDrag(null);
  };

  const onBlockKey = (e: React.KeyboardEvent, day: number, r: TimeRange) => {
    const d = availability.find((x) => x.dayIndex === day);
    if (!d) return;
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      removeRange(day, r.id);
      return;
    }
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    e.preventDefault();
    const step = e.key === 'ArrowUp' ? -SNAP : SNAP;
    const next = e.shiftKey
      ? { ...r, end: clamp(r.end + step, r.start + SNAP, MAX_END) }
      : (() => {
          const s = clamp(r.start + step, MIN_START, MAX_END - (r.end - r.start));
          return { ...r, start: s, end: s + (r.end - r.start) };
        })();
    setRanges(day, d.ranges.map((x) => (x.id === r.id ? next : x)));
  };

  // ---- save ----
  const handleSave = async () => {
    if (!availabilityLoaded) return showToast('Chưa tải được cấu hình', 'Mở lại cửa sổ để tải lịch trước khi lưu.', 'error');
    const active = availability.filter((d) => d.isAvailable && d.ranges.length > 0);
    const err = (msg: string) => showToast(t('appt.errTitle'), msg, 'error');
    if (active.length === 0) return err(t('appt.errNoRange'));
    if (active.some((d) => d.ranges.some((r) => r.end - r.start < duration)))
      return err(t('appt.errShort', { d: duration }));

    try {
      await appointmentApi.saveAvailability({ timezone, defaultDurationMinutes: duration,
        slots: availability.flatMap(d => d.ranges.length ? d.ranges.map(r => ({ dayIndex: d.dayIndex, dayName: d.dayNameVi, isAvailable: d.isAvailable, startTime: to12h(r.start), endTime: to12h(r.end) })) : [{ dayIndex: d.dayIndex, dayName: d.dayNameVi, isAvailable: false, startTime: '09:00 AM', endTime: '05:00 PM' }]),
      });
    } catch (e) { return showToast('Không thể lưu lịch hẹn', (e as Error).message, 'error'); }

    showToast('Đã lưu khung giờ', 'Đã lưu múi giờ, thời lượng và khung giờ vào máy chủ. Các tùy chọn xem trước không được lưu.', 'success');
    closeModal();
  };

  // ---- week model ----
  const base = new Date(selectedYear, selectedMonth, (selectedDay || 1) + weekOffset * 7);
  const weekStart = new Date(base);
  weekStart.setDate(base.getDate() - base.getDay());
  const weekDays = Array.from({ length: 7 }, (_, idx) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + idx);
    return {
      date: d,
      dayIndex: idx,
      isToday: d.toDateString() === now.toDateString(),
    };
  });
  const tzShort = (() => {
    const m = timezone.match(/GMT([+-])(\d{2})/);
    return m ? `GMT${m[1]}${Number(m[2])}` : timezone;
  })();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const showNow = nowMin >= MIN_START && nowMin <= MAX_END;
  const gridCols = 'grid grid-cols-[56px_repeat(7,minmax(0,1fr))]';

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center md:p-4 font-['Roboto',sans-serif]">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="appt-title"
        className="w-full h-full max-w-[1600px] md:max-h-[96vh] bg-[#202124] text-[#e8eaed] flex flex-col md:rounded-2xl border border-[#3c4043] overflow-hidden shadow-[0_20px_48px_-4px_rgba(0,0,0,0.7)]"
      >
        {/* Header */}
        <header className="h-14 px-4 flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={closeModal}
            aria-label={t('appt.close')}
            className={`w-9 h-9 rounded-full grid place-items-center text-[var(--text-secondary)] hover:bg-[#303134] hover:text-[#e8eaed] transition-colors ${focusRing}`}
          >
            <X className="w-5 h-5" />
          </button>
          <h2 id="appt-title" className="text-[18px] font-medium">
            {t('appt.title')}
          </h2>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className={`h-9 px-6 rounded-full bg-[var(--google-blue)] hover:bg-[#aecbfa] text-[#202124] text-[14px] font-medium transition-colors ${focusRing}`}
            >
              {t('appt.save')}
            </button>
          </div>
        </header>

        <div className="flex-1 flex flex-col md:flex-row min-h-0 border-t border-[#3c4043]">
          {/* ================= LEFT PANEL ================= */}
          <aside className="w-full md:w-[460px] shrink-0 bg-[#28292c] border-r border-[#3c4043] flex flex-col">
            <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar px-5 py-5 flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium tracking-wider text-[var(--text-secondary)] uppercase">Tiêu đề xem trước (không lưu máy chủ)</span>
                <Input
                  variant="underline"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('appt.titlePlaceholder')}
                  aria-label={t('appt.titlePlaceholder')}
                  autoFocus
                />
              </div>

            {/* Duration */}
            <div className="flex flex-col gap-2">
              <span className="text-[13px] font-medium tracking-wide text-[#e8eaed]">{t('appt.duration')}</span>
              <span className="text-[11px] text-[var(--text-secondary)]">Mỗi cuộc hẹn sẽ kéo dài bao lâu?</span>
              <Select
                value={duration}
                onChange={setDuration}
                options={DURATIONS.map(m => ({
                  value: m,
                  label: m < 60 ? `${m} phút` : `${m / 60} giờ`
                }))}
                className="w-full max-w-[150px]"
              />
            </div>

            {/* Weekly hours */}
            <section className="flex flex-col">
              <div className="flex flex-col gap-1 mb-4">
                <h3 className="text-[13px] font-medium text-[#e8eaed]">{t('appt.weekly')}</h3>
                <span className="text-[11px] text-[var(--text-secondary)]">Thiết lập thời gian bạn thường rảnh để đặt cuộc hẹn.</span>
              </div>
              <div className="mb-4">
                <Select
                  value={repeatMode}
                  onChange={setRepeatMode}
                  options={[
                    { value: 'weekly', label: t('appt.repeatWeekly') },
                    { value: 'this-week', label: t('appt.repeatThisWeek') }
                  ]}
                  className="w-full"
                />
              </div>

              <ul className="flex flex-col gap-1">
                {availability.map((slot) => {
                  const hasRanges = slot.isAvailable && slot.ranges.length > 0;
                  return (
                  <li key={slot.id} className="group flex items-start gap-2 py-1.5 min-h-[40px]">
                    <span
                      className={`w-10 mt-1.5 text-[13px] font-medium shrink-0 ${hasRanges ? 'text-[#e8eaed]' : 'text-[var(--text-secondary)]'}`}
                    >
                      {dayNames[slot.dayIndex]}
                    </span>

                    {hasRanges ? (
                      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                        {slot.ranges.map((r, i) => (
                          <div key={r.id} className="flex items-center gap-1">
                            <CustomTimePicker
                              value={fmt(r.start)}
                              onChange={(val) => editRange(slot.dayIndex, r.id, 'start', val)}
                            />
                            <span className="text-[var(--text-secondary)] text-xs shrink-0">–</span>
                            <CustomTimePicker
                              value={fmt(r.end)}
                              onChange={(val) => editRange(slot.dayIndex, r.id, 'end', val)}
                            />
                            <button
                              type="button"
                              onClick={() => removeRange(slot.dayIndex, r.id)}
                              aria-label={t('appt.removeRange')}
                              title={t('appt.removeRange')}
                              className={`w-7 h-7 rounded-full grid place-items-center shrink-0 text-[var(--text-secondary)] hover:text-[#e8eaed] hover:bg-[#303134] cursor-pointer ${focusRing}`}
                            >
                              <X className="w-4 h-4" />
                            </button>

                            {i === slot.ranges.length - 1 && (
                              <div className="flex items-center gap-0.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => addRange(slot.dayIndex)}
                                  aria-label={t('appt.addRange')}
                                  title={t('appt.addRange')}
                                  className={`w-7 h-7 rounded-full grid place-items-center text-[var(--text-secondary)] hover:text-[#e8eaed] hover:bg-[#303134] cursor-pointer ${focusRing}`}
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleCopyAll(slot.dayIndex)}
                                  aria-label={t('appt.applyWeekdays')}
                                  title={t('appt.applyWeekdays')}
                                  className={`w-7 h-7 rounded-full grid place-items-center text-[var(--text-secondary)] hover:text-[#e8eaed] hover:bg-[#303134] cursor-pointer ${focusRing}`}
                                >
                                  <Copy className="w-[15px] h-[15px]" />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex-1 min-w-0 flex items-center h-8">
                        <span className="text-[13px] text-[var(--text-secondary)] font-medium mr-auto">Bận</span>
                        <button
                          type="button"
                          onClick={() => toggleDayAvailable(slot.dayIndex)}
                          aria-label={t('appt.addRange')}
                          title={t('appt.addRange')}
                          className={`w-7 h-7 rounded-full grid place-items-center text-[var(--text-secondary)] hover:text-[#e8eaed] hover:bg-[#303134] cursor-pointer ${focusRing}`}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </li>
                )})}
              </ul>
            </section>

            {/* Time zone & booking window */}
            <section className="flex flex-col gap-4 pt-4 border-t border-[#3c4043]">
              <div className="flex flex-col gap-2">
                <span className="text-[13px] font-medium text-[#e8eaed]">{t('appt.timezone')}</span>
                <Select
                  value={timezone}
                  onChange={setTimezone}
                  options={TIMEZONES.map(tz => ({ value: tz.value, label: tz.label }))}
                  className="w-full"
                />
              </div>

              <button
                type="button"
                onClick={() => setWindowOpen((o) => !o)}
                aria-expanded={windowOpen}
                className={`flex items-center justify-between text-left text-sm text-[var(--text-secondary)] hover:text-[#e8eaed] rounded transition-colors focus:outline-none focus:text-[var(--google-blue)]`}
              >
                <span>{t('appt.window', { max: maxDays, min: minHours })}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${windowOpen ? 'rotate-180' : ''}`} />
              </button>
              {windowOpen && (
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <label className="flex flex-col gap-1 text-sm text-[var(--text-secondary)]">
                    {t('appt.maxDays')}
                    <Input
                      type="number"
                      min={1}
                      max={365}
                      value={maxDays}
                      onChange={(e) => setMaxDays(clamp(Number(e.target.value) || 1, 1, 365))}
                      className="tabular-nums"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm text-[var(--text-secondary)]">
                    {t('appt.minHours')}
                    <Input
                      type="number"
                      min={0}
                      max={168}
                      value={minHours}
                      onChange={(e) => setMinHours(clamp(Number(e.target.value) || 0, 0, 168))}
                      className="tabular-nums"
                    />
                  </label>
                </div>
              )}
            </section>
            </div>

            {/* Sticky Action Footer */}
            <div className="p-4 border-t border-[#3c4043] flex items-center justify-end gap-3 bg-[#28292c]">
              <button
                type="button"
                onClick={closeModal}
                className={`h-9 px-6 rounded-full text-[var(--google-blue)] hover:bg-[#303134] text-[14px] font-medium transition-colors ${focusRing}`}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSave}
                className={`h-9 px-6 rounded-full bg-[var(--google-blue)] hover:bg-[#aecbfa] text-[#202124] text-[14px] font-medium transition-colors ${focusRing}`}
              >
                Tiếp
              </button>
            </div>
          </aside>

          {/* ================= RIGHT WEEK GRID ================= */}
          <main className="flex-1 min-w-0 flex flex-col bg-[#202124]">
            {/* Calendar Week Navigation Sub-Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#3c4043] shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => setWeekOffset((w) => w - 1)}
                    aria-label={language === 'vi' ? 'Tuần trước' : 'Previous week'}
                    title={language === 'vi' ? 'Tuần trước' : 'Previous week'}
                    className={`w-8 h-8 rounded-full grid place-items-center text-[var(--text-secondary)] hover:bg-[#303134] hover:text-[#e8eaed] transition-colors cursor-pointer ${focusRing}`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeekOffset((w) => w + 1)}
                    aria-label={language === 'vi' ? 'Tuần sau' : 'Next week'}
                    title={language === 'vi' ? 'Tuần sau' : 'Next week'}
                    className={`w-8 h-8 rounded-full grid place-items-center text-[var(--text-secondary)] hover:bg-[#303134] hover:text-[#e8eaed] transition-colors cursor-pointer ${focusRing}`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                {weekOffset !== 0 && (
                  <button
                    type="button"
                    onClick={() => setWeekOffset(0)}
                    className={`h-7 px-2.5 rounded-md border border-[#3c4043] text-xs font-medium text-[#e8eaed] hover:bg-[#303134] transition-colors cursor-pointer ${focusRing}`}
                  >
                    {language === 'vi' ? 'Hôm nay' : 'Today'}
                  </button>
                )}
                <DatePicker
                  mode="date"
                  minYear={2020}
                  maxYear={Math.max(2035, now.getFullYear() + 2)}
                  hideIcon
                  value={{
                    day: weekDays[0].date.getDate(),
                    month: weekDays[0].date.getMonth(),
                    year: weekDays[0].date.getFullYear(),
                  }}
                  onChange={(picked) => {
                    const anchorBase = new Date(selectedYear, selectedMonth, selectedDay || 1);
                    const anchorSunday = new Date(anchorBase.getFullYear(), anchorBase.getMonth(), anchorBase.getDate() - anchorBase.getDay());
                    const pickedDate = new Date(picked.year, picked.month, picked.day);
                    const pickedSunday = new Date(pickedDate.getFullYear(), pickedDate.getMonth(), pickedDate.getDate() - pickedDate.getDay());
                    setWeekOffset(Math.round((pickedSunday.getTime() - anchorSunday.getTime()) / (7 * 86400000)));
                  }}
                  aria-label={language === 'vi' ? 'Chọn nhanh ngày' : 'Quick select date'}
                  buttonClassName="h-8 px-2.5 ml-1 bg-transparent border-transparent hover:bg-[#303134] hover:border-transparent text-sm font-medium text-[#e8eaed]"
                  triggerLabel={
                    <span className="inline-flex items-center gap-1.5">
                      <span>
                        {weekDays[0].date.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                    </span>
                  }
                />
              </div>
            </div>

            <div className={`${gridCols} border-b border-[#3c4043] shrink-0 pt-2`}>
              <div className="flex items-end justify-center pb-2">
                <span className="text-[11px] text-[var(--text-secondary)] font-mono">{tzShort}</span>
              </div>
              {weekDays.map((d) => (
                <div key={d.dayIndex} className="py-2 flex flex-col items-center justify-center gap-1 border-l border-transparent">
                  <span className={`text-[11px] font-medium uppercase tracking-wider ${d.isToday ? 'text-[var(--google-blue)]' : 'text-[var(--text-secondary)]'}`}>{dayNames[d.dayIndex]}</span>
                  <span
                    className={`w-11 h-11 grid place-items-center rounded-full text-[24px] tabular-nums ${
                      d.isToday ? 'bg-[var(--google-blue)] text-[#202124]' : 'text-[#e8eaed] hover:bg-[#303134]'
                    }`}
                  >
                    {d.date.getDate()}
                  </span>
                </div>
              ))}
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar">
              <div className={`${gridCols} relative`} style={{ height: (END_H - START_H) * HOUR_PX }}>
                {/* Hour gutter */}
                <div className="relative">
                  {HOURS.map((h) => (
                    <span
                      key={h}
                      className="absolute right-2 -translate-y-1/2 text-xs text-fg-3 font-mono tabular-nums first:translate-y-0"
                      style={{ top: minToPx(h * 60) }}
                    >
                      {fmt(h * 60)}
                    </span>
                  ))}
                </div>

                {weekDays.map((wd) => {
                  const day = availability.find((a) => a.dayIndex === wd.dayIndex);
                  const ranges = day?.isAvailable ? day.ranges : [];
                  const isDragDay = drag?.day === wd.dayIndex;

                  return (
                    <div
                      key={wd.dayIndex}
                      data-col
                      onPointerDown={(e) => beginDrag(e, wd.dayIndex, 'create')}
                      onPointerMove={onColMove}
                      onPointerUp={onColUp}
                      onPointerCancel={() => setDrag(null)}
                      className="relative border-l border-[#3c4043] cursor-crosshair touch-none select-none"
                      style={{
                        backgroundImage: `repeating-linear-gradient(to bottom, #3c4043 0 1px, transparent 1px ${HOUR_PX}px)`,
                      }}
                    >
                      {ranges.map((r) => {
                        const live = isDragDay && drag?.id === r.id ? drag : null;
                        const s = live ? live.start : r.start;
                        const en = live ? live.end : r.end;
                        const h = minToPx(en) - minToPx(s);
                        const isSel = selected?.day === wd.dayIndex && selected.id === r.id;
                        return (
                          <div
                            key={r.id}
                            role="button"
                            tabIndex={0}
                            aria-label={`${dayNames[wd.dayIndex]} ${fmt(s)}–${fmt(en)}`}
                            aria-pressed={isSel}
                            onPointerDown={(e) => beginDrag(e, wd.dayIndex, 'move', r)}
                            onKeyDown={(e) => onBlockKey(e, wd.dayIndex, r)}
                            onFocus={() => setSelected({ day: wd.dayIndex, id: r.id })}
                            className={`group/block absolute inset-x-1 rounded-sm border-l-4 border-[var(--google-blue)] overflow-hidden cursor-grab active:cursor-grabbing transition-colors outline-none ${
                              live ? 'bg-[var(--google-blue)]/30' : 'bg-[var(--google-blue)]/20 hover:bg-[var(--google-blue)]/30'
                            } ${isSel ? 'ring-1 ring-[var(--google-blue)]' : ''} focus-visible:ring-2 focus-visible:ring-[var(--google-blue)]`}
                            style={{
                              top: minToPx(s),
                              height: h,
                            }}
                          >
                            <span
                              onPointerDown={(e) => beginDrag(e, wd.dayIndex, 'resize-start', r)}
                              className="absolute inset-x-0 top-0 h-1.5 cursor-ns-resize"
                            />
                            {h >= 22 && (
                              <span className="block px-1.5 pt-1 text-[12px] text-[#e8eaed] font-medium tabular-nums truncate pointer-events-none">
                                {fmt(s)}–{fmt(en)}
                              </span>
                            )}
                            <button
                              type="button"
                              tabIndex={-1}
                              onPointerDown={(e) => e.stopPropagation()}
                              onClick={() => removeRange(wd.dayIndex, r.id)}
                              aria-label={t('appt.removeRange')}
                              className="absolute top-1 right-1 w-6 h-6 rounded grid place-items-center text-[#e8eaed] hover:bg-black/20 opacity-0 group-hover/block:opacity-100"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <span
                              onPointerDown={(e) => beginDrag(e, wd.dayIndex, 'resize-end', r)}
                              className="absolute inset-x-0 bottom-0 h-1.5 cursor-ns-resize"
                            />
                          </div>
                        );
                      })}

                      {/* Draft range while creating */}
                      {isDragDay && drag?.mode === 'create' && drag.end - drag.start >= SNAP && (
                        <div
                          className="absolute inset-x-1 rounded-sm border-l-4 border-[var(--google-blue)] bg-[var(--google-blue)]/30 pointer-events-none"
                          style={{ top: minToPx(drag.start), height: minToPx(drag.end) - minToPx(drag.start) }}
                        />
                      )}

                      {/* Live time tooltip */}
                      {isDragDay && drag && drag.moved && (
                        <span
                          className="absolute left-1/2 -translate-x-1/2 -translate-y-full -mt-1 z-20 px-2 py-0.5 rounded bg-raised border border-line-strong text-xs tabular-nums whitespace-nowrap pointer-events-none"
                          style={{ top: minToPx(drag.start) - 4 }}
                        >
                          {fmt(drag.start)}–{fmt(drag.end)}
                        </span>
                      )}

                      {/* Current time — only in the real today column */}
                      {wd.isToday && showNow && (
                        <div
                          className="absolute inset-x-0 z-10 h-px bg-[#f28b82] pointer-events-none"
                          style={{ top: minToPx(nowMin) }}
                        >
                          <span className="absolute -left-[5px] -top-[5px] w-[11px] h-[11px] rounded-full bg-[#f28b82]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="px-4 py-2 border-t border-line text-xs text-fg-3 shrink-0">{t('appt.hint')}</p>
          </main>
        </div>
      </div>
    </div>
  );
};
