import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export interface DatePickerValue {
  day: number;
  month: number; // 0-indexed (0 to 11)
  year: number;
}

export interface DatePickerProps {
  value: DatePickerValue;
  onChange: (value: DatePickerValue) => void;
  className?: string;
  buttonClassName?: string;
  disabled?: boolean;
  'aria-label'?: string;
}

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

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  className = '',
  buttonClassName = '',
  disabled = false,
  'aria-label': ariaLabel,
}) => {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // View state for browsing months without changing selected date immediately
  const [viewMonth, setViewMonth] = useState(value.month);
  const [viewYear, setViewYear] = useState(value.year);

  // Keep view in sync when value changes externally
  useEffect(() => {
    setViewMonth(value.month);
    setViewYear(value.year);
  }, [value.month, value.year]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const monthNames = language === 'vi' ? monthNamesVi : monthNamesEn;

  // Calendar calculations for viewMonth / viewYear
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
  const prevMonthDaysCount = new Date(viewYear, viewMonth, 0).getDate();

  const leadingPadding = Array.from(
    { length: firstDayIndex },
    (_, i) => prevMonthDaysCount - firstDayIndex + 1 + i
  );
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalCells = leadingPadding.length + currentMonthDays.length;
  const trailingPaddingCount = (7 - (totalCells % 7)) % 7;
  const trailingPadding = Array.from({ length: trailingPaddingCount }, (_, i) => i + 1);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    onChange({
      day,
      month: viewMonth,
      year: viewYear,
    });
    setIsOpen(false);
  };

  const miniWeekDays = [
    t('calendar.monShort'),
    t('calendar.tueShort'),
    t('calendar.wedShort'),
    t('calendar.thuShort'),
    t('calendar.friShort'),
    t('calendar.satShort'),
    t('calendar.sunShort'),
  ];

  // Friendly date label
  const selectedDateObj = new Date(value.year, value.month, value.day);
  const weekdayName = selectedDateObj.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
    weekday: 'short',
  });
  const dateFormatted =
    language === 'vi'
      ? `${weekdayName}, ${value.day} ${monthNamesVi[value.month]}, ${value.year}`
      : `${weekdayName}, ${monthNamesEn[value.month]} ${value.day}, ${value.year}`;

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        aria-label={ariaLabel || dateFormatted}
        aria-expanded={isOpen}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`h-9 px-3 rounded-lg bg-[var(--surface-container)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs flex items-center gap-2 hover:bg-[var(--surface-container-high)] hover:border-[#4B4D50] focus:outline-none focus:border-[var(--google-blue)] focus:ring-1 focus:ring-[var(--google-blue)] transition-colors cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed ${
          isOpen ? 'bg-[var(--surface-container-high)] border-[var(--google-blue)] ring-1 ring-[var(--google-blue)]' : ''
        } ${buttonClassName}`}
      >
        <CalendarIcon className="w-3.5 h-3.5 text-[var(--google-blue)] shrink-0" />
        <span className="font-medium truncate">{dateFormatted}</span>
      </button>

      {/* Popover Calendar */}
      {isOpen && (
        <div className="absolute z-[100] top-full left-0 mt-1.5 w-64 p-3 bg-[var(--surface-container-high)] border border-[var(--border-subtle)] rounded-xl shadow-2xl shadow-black/80 space-y-2.5 animate-in fade-in zoom-in-95 duration-150 select-none">
          {/* Month/Year Header */}
          <div className="flex items-center justify-between font-medium text-xs text-[var(--text-primary)] px-1">
            <span className="font-semibold text-xs text-[var(--text-primary)]">
              {language === 'vi'
                ? `${monthNames[viewMonth]} ${viewYear}`
                : `${monthNames[viewMonth]} ${viewYear}`}
            </span>

            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1 hover:bg-[#3C4043] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-full transition-colors cursor-pointer"
                title={t('calendar.prevMonth')}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1 hover:bg-[#3C4043] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-full transition-colors cursor-pointer"
                title={t('calendar.nextMonth')}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-[var(--text-muted)]">
            {miniWeekDays.map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>

          {/* Day Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {/* Leading padding from prev month */}
            {leadingPadding.map((pad) => (
              <span
                key={`pad-prev-${pad}`}
                className="w-6 h-6 mx-auto flex items-center justify-center text-[#4A4D51] text-[11px]"
              >
                {pad}
              </span>
            ))}

            {/* Current month days */}
            {currentMonthDays.map((d) => {
              const isSelected =
                d === value.day && viewMonth === value.month && viewYear === value.year;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleSelectDay(d)}
                  className={`w-6 h-6 mx-auto flex items-center justify-center rounded-full cursor-pointer transition-colors text-[11px] ${
                    isSelected
                      ? 'bg-[var(--google-blue-primary)] text-white font-bold'
                      : 'hover:bg-[#3C4043] text-[var(--text-primary)]'
                  }`}
                >
                  {d}
                </button>
              );
            })}

            {/* Trailing padding from next month */}
            {trailingPadding.map((pad) => (
              <span
                key={`pad-next-${pad}`}
                className="w-6 h-6 mx-auto flex items-center justify-center text-[#4A4D51] text-[11px]"
              >
                {pad}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
