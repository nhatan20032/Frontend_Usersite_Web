import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import type { DailyAvailabilitySlot, TimeRange } from '../../types';
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
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ab4f8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#202124]';

const CustomTimePicker: React.FC<{ value: string; onChange: (val: string) => void }> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(() => {
    const m = parse(value);
    return Number.isNaN(m) ? value : to12h(m);
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const m = parse(value);
    setText(Number.isNaN(m) ? value : to12h(m));
  }, [value]);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  const options = Array.from({ length: 24 * 2 }, (_, i) => fmt(i * 30));

  return (
    <div ref={ref} className="relative">
      <input
        type="text"
        value={text}
        onFocus={() => setOpen(true)}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => {
          const m = parse(text);
          if (!Number.isNaN(m)) onChange(fmt(m));
          else setText(to12h(parse(value)));
        }}
        className="h-9 w-[110px] px-3 rounded-lg bg-[#303134] border border-[#5f6368] hover:bg-[#3c4043] text-sm tabular-nums text-[#e8eaed] transition-colors focus:border-[#8ab4f8] focus:outline-none"
      />
      {open && (
        <div className="absolute z-[100] top-full left-0 mt-1 w-full max-h-60 overflow-y-auto custom-scrollbar bg-[#303134] border border-[#5f6368] rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.6)] py-1 origin-top-left animate-in fade-in zoom-in-95 duration-200">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); onChange(opt); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-[#3c4043] ${fmt(parse(value)) === opt ? 'bg-[#3c4043] text-[#8ab4f8]' : 'text-[#e8eaed]'}`}
            >
              {to12h(parse(opt))}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface SelectOption {
  value: string | number;
  label: string;
}

const CustomSelect: React.FC<{
  value: string | number;
  onChange: (val: any) => void;
  options: SelectOption[];
  className?: string;
}> = ({ value, onChange, options, className = "w-full max-w-[200px]" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button 
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between h-10 px-3 rounded-lg bg-[#303134] border hover:bg-[#3c4043] text-sm text-[#e8eaed] transition-colors focus:outline-none ${open ? 'border-[#8ab4f8]' : 'border-[#5f6368] focus:border-[#8ab4f8]'}`}
      >
        <span className="truncate pr-2">{selectedOption?.label}</span>
        <ChevronDown className={`w-4 h-4 text-[#9aa0a6] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-[100] top-full left-0 mt-1 w-full max-h-60 overflow-y-auto custom-scrollbar bg-[#303134] border border-[#5f6368] rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.6)] py-1.5 origin-top-left animate-in fade-in zoom-in-95 duration-200">
          {options.map((opt) => {
            const isSelected = value === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  isSelected 
                    ? 'bg-[#1a73e8] text-white' 
                    : 'text-[#e8eaed] hover:bg-[#3c4043]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const AppointmentScheduleModal: React.FC = () => {
  const { activeModal, closeModal, showToast, addEvent, selectedMonth, selectedYear, selectedDay } = useApp();
  const { t } = useLanguage();

  const [title, setTitle] = useState<string>('Tư vấn Thiết kế UI/UX & Code Review');
  const [duration, setDuration] = useState<number>(60); // minutes
  const [repeatMode, setRepeatMode] = useState<string>('weekly');
  const [availability, setAvailability] = useState<DailyAvailabilitySlot[]>(initialAvailability);
  const [timezone, setTimezone] = useState<string>('GMT+07:00');
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
  const handleSave = () => {
    const active = availability.filter((d) => d.isAvailable && d.ranges.length > 0);
    const err = (msg: string) => showToast(t('appt.errTitle'), msg, 'error');
    if (!title.trim()) return err(t('appt.errNoTitle'));
    if (active.length === 0) return err(t('appt.errNoRange'));
    if (active.some((d) => d.ranges.some((r) => r.end - r.start < duration)))
      return err(t('appt.errShort', { d: duration }));

    const weekday = new Date(selectedYear, selectedMonth, selectedDay || 1).getDay();
    const primary = (active.find((d) => d.dayIndex === weekday) ?? active[0]).ranges[0];
    const daysText = active
      .map((d) => `${dayNames[d.dayIndex]} ${d.ranges.map((r) => `${fmt(r.start)}–${fmt(r.end)}`).join(', ')}`)
      .join('; ');

    addEvent({
      type: 'event',
      title: `${t('appt.eventPrefix')} ${title.trim()}`,
      time: to12h(primary.start),
      endTime: to12h(primary.end),
      priority: 'high',
      year: selectedYear,
      month: selectedMonth,
      day: selectedDay,
      colorTag: '#8AB4F8',
      description: t('appt.descTpl', {
        d: duration,
        repeat: t(repeatMode === 'weekly' ? 'appt.repeatWeekly' : 'appt.repeatThisWeek'),
        tz: timezone,
        days: daysText,
      }),
    });

    showToast(t('appt.savedTitle'), t('appt.savedDesc'), 'success');
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
  const first = weekDays[0].date;
  const last = weekDays[6].date;
  const weekLabel = `${first.getDate()}/${first.getMonth() + 1} – ${last.getDate()}/${last.getMonth() + 1}/${last.getFullYear()}`;

  const tzShort = (() => {
    const m = timezone.match(/GMT([+-])(\d{2})/);
    return m ? `GMT${m[1]}${Number(m[2])}` : timezone;
  })();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const showNow = nowMin >= MIN_START && nowMin <= MAX_END;
  const slotPx = (HOUR_PX * duration) / 60;
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
            className={`w-9 h-9 rounded-full grid place-items-center text-[#9aa0a6] hover:bg-[#303134] hover:text-[#e8eaed] transition-colors ${focusRing}`}
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
              className={`h-9 px-6 rounded-full bg-[#8ab4f8] hover:bg-[#aecbfa] text-[#202124] text-[14px] font-medium transition-colors ${focusRing}`}
            >
              {t('appt.save')}
            </button>
          </div>
        </header>

        <div className="flex-1 flex flex-col md:flex-row min-h-0 border-t border-[#3c4043]">
          {/* ================= LEFT PANEL ================= */}
          <aside className="w-full md:w-[460px] shrink-0 bg-[#28292c] border-r border-[#3c4043] flex flex-col">
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-5 flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium tracking-wider text-[#9aa0a6] uppercase">{t('appt.title')}</span>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('appt.titlePlaceholder')}
                  aria-label={t('appt.titlePlaceholder')}
                  autoFocus
                  className="w-full bg-transparent border-0 border-b border-[#5f6368] focus:border-[#8ab4f8] text-[20px] font-medium pb-2 focus:outline-none placeholder:text-[#9aa0a6] transition-colors"
                />
              </div>

            {/* Duration */}
            <div className="flex flex-col gap-2">
              <span className="text-[13px] font-medium tracking-wide text-[#e8eaed]">{t('appt.duration')}</span>
              <span className="text-[11px] text-[#9aa0a6]">Mỗi cuộc hẹn sẽ kéo dài bao lâu?</span>
              <CustomSelect 
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
                <span className="text-[11px] text-[#9aa0a6]">Thiết lập thời gian bạn thường rảnh để đặt cuộc hẹn.</span>
              </div>
              <div className="mb-4">
                <CustomSelect
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
                  <li key={slot.id} className="group flex items-start gap-3 py-1.5 min-h-[44px]">
                    <span
                      className={`w-14 mt-1.5 text-[13px] font-medium shrink-0 ${hasRanges ? 'text-[#e8eaed]' : 'text-[#9aa0a6]'}`}
                    >
                      {dayNames[slot.dayIndex]}
                    </span>

                    {hasRanges ? (
                      <div className="flex-1 flex flex-col gap-1.5">
                        {slot.ranges.map((r, i) => (
                          <div key={r.id} className="flex items-center gap-1.5">
                            <CustomTimePicker
                              value={fmt(r.start)}
                              onChange={(val) => editRange(slot.dayIndex, r.id, 'start', val)}
                            />
                            <span className="text-[#9aa0a6] text-xs">–</span>
                            <CustomTimePicker
                              value={fmt(r.end)}
                              onChange={(val) => editRange(slot.dayIndex, r.id, 'end', val)}
                            />
                            <button
                              type="button"
                              onClick={() => removeRange(slot.dayIndex, r.id)}
                              aria-label={t('appt.removeRange')}
                              title={t('appt.removeRange')}
                              className={`w-9 h-9 rounded-full grid place-items-center text-[#9aa0a6] hover:text-[#e8eaed] hover:bg-[#303134] ${focusRing}`}
                            >
                              <X className="w-5 h-5" />
                            </button>
                            
                            {i === slot.ranges.length - 1 && (
                              <div className="flex items-center gap-0.5 ml-1">
                                <button
                                  type="button"
                                  onClick={() => addRange(slot.dayIndex)}
                                  aria-label={t('appt.addRange')}
                                  title={t('appt.addRange')}
                                  className={`w-9 h-9 rounded-full grid place-items-center text-[#9aa0a6] hover:text-[#e8eaed] hover:bg-[#303134] ${focusRing}`}
                                >
                                  <Plus className="w-5 h-5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleCopyAll(slot.dayIndex)}
                                  aria-label={t('appt.applyWeekdays')}
                                  title={t('appt.applyWeekdays')}
                                  className={`w-9 h-9 rounded-full grid place-items-center text-[#9aa0a6] hover:text-[#e8eaed] hover:bg-[#303134] ${focusRing}`}
                                >
                                  <Copy className="w-[18px] h-[18px]" />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center h-9">
                        <span className="text-[13px] text-[#9aa0a6] font-medium mr-auto">Bận</span>
                        <button
                          type="button"
                          onClick={() => toggleDayAvailable(slot.dayIndex)}
                          aria-label={t('appt.addRange')}
                          title={t('appt.addRange')}
                          className={`w-9 h-9 rounded-full grid place-items-center text-[#9aa0a6] hover:text-[#e8eaed] hover:bg-[#303134] ${focusRing}`}
                        >
                          <Plus className="w-5 h-5" />
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
                <CustomSelect
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
                className={`flex items-center justify-between text-left text-sm text-[#9aa0a6] hover:text-[#e8eaed] rounded transition-colors focus:outline-none focus:text-[#8ab4f8]`}
              >
                <span>{t('appt.window', { max: maxDays, min: minHours })}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${windowOpen ? 'rotate-180' : ''}`} />
              </button>
              {windowOpen && (
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <label className="flex flex-col gap-1 text-sm text-[#9aa0a6]">
                    {t('appt.maxDays')}
                    <input
                      type="number"
                      min={1}
                      max={365}
                      value={maxDays}
                      onChange={(e) => setMaxDays(clamp(Number(e.target.value) || 1, 1, 365))}
                      className={`h-10 px-3 rounded-lg bg-[#303134] border border-[#5f6368] text-[#e8eaed] tabular-nums focus:border-[#8ab4f8] focus:outline-none`}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm text-[#9aa0a6]">
                    {t('appt.minHours')}
                    <input
                      type="number"
                      min={0}
                      max={168}
                      value={minHours}
                      onChange={(e) => setMinHours(clamp(Number(e.target.value) || 0, 0, 168))}
                      className={`h-10 px-3 rounded-lg bg-[#303134] border border-[#5f6368] text-[#e8eaed] tabular-nums focus:border-[#8ab4f8] focus:outline-none`}
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
                className={`h-9 px-6 rounded-full text-[#8ab4f8] hover:bg-[#303134] text-[14px] font-medium transition-colors ${focusRing}`}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSave}
                className={`h-9 px-6 rounded-full bg-[#8ab4f8] hover:bg-[#aecbfa] text-[#202124] text-[14px] font-medium transition-colors ${focusRing}`}
              >
                Tiếp
              </button>
            </div>
          </aside>

          {/* ================= RIGHT WEEK GRID ================= */}
          <main className="flex-1 min-w-0 flex flex-col bg-[#202124]">
            <div className={`${gridCols} border-b border-[#3c4043] shrink-0 pt-2`}>
              <div className="flex flex-col items-end pr-3 pb-2 gap-2">
                <div className="flex items-center gap-1 mt-1">
                  <button
                    type="button"
                    onClick={() => setWeekOffset((w) => w - 1)}
                    className="w-8 h-8 rounded-full grid place-items-center text-[#9aa0a6] hover:bg-[#303134]"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeekOffset((w) => w + 1)}
                    className="w-8 h-8 rounded-full grid place-items-center text-[#9aa0a6] hover:bg-[#303134]"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-[11px] text-[#9aa0a6]">{tzShort}</div>
              </div>
              {weekDays.map((d) => (
                <div key={d.dayIndex} className="py-2 flex flex-col items-center justify-center gap-1 border-l border-transparent">
                  <span className={`text-[11px] font-medium uppercase tracking-wider ${d.isToday ? 'text-[#8ab4f8]' : 'text-[#9aa0a6]'}`}>{dayNames[d.dayIndex]}</span>
                  <span
                    className={`w-11 h-11 grid place-items-center rounded-full text-[24px] tabular-nums ${
                      d.isToday ? 'bg-[#8ab4f8] text-[#202124]' : 'text-[#e8eaed] hover:bg-[#303134]'
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
                        const slots = Math.floor((en - s) / duration);
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
                            className={`group/block absolute inset-x-1 rounded-sm border-l-4 border-[#8ab4f8] overflow-hidden cursor-grab active:cursor-grabbing transition-colors outline-none ${
                              live ? 'bg-[#8ab4f8]/30' : 'bg-[#8ab4f8]/20 hover:bg-[#8ab4f8]/30'
                            } ${isSel ? 'ring-1 ring-[#8ab4f8]' : ''} focus-visible:ring-2 focus-visible:ring-[#8ab4f8]`}
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
                          className="absolute inset-x-1 rounded-sm border-l-4 border-[#8ab4f8] bg-[#8ab4f8]/30 pointer-events-none"
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
