import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

export interface DatePickerValue {
  day: number;
  month: number; // 0-indexed (0 to 11)
  year: number;
}

export interface DatePickerProps {
  value: DatePickerValue;
  onChange: (value: DatePickerValue) => void;
  mode?: 'date' | 'month-year';
  minYear?: number;
  maxYear?: number;
  triggerLabel?: React.ReactNode;
  hideIcon?: boolean;
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

const monthShortVi = [
  'Thg 1', 'Thg 2', 'Thg 3', 'Thg 4',
  'Thg 5', 'Thg 6', 'Thg 7', 'Thg 8',
  'Thg 9', 'Thg 10', 'Thg 11', 'Thg 12',
];

const monthShortEn = [
  'Jan', 'Feb', 'Mar', 'Apr',
  'May', 'Jun', 'Jul', 'Aug',
  'Sep', 'Oct', 'Nov', 'Dec',
];

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  mode = 'date',
  minYear = 1920,
  maxYear = 2035,
  triggerLabel,
  hideIcon = false,
  className = '',
  buttonClassName = '',
  disabled = false,
  'aria-label': ariaLabel,
}) => {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const initialMode = mode === 'month-year' ? 'months' : 'days';
  const [pickerMode, setPickerMode] = useState<'days' | 'months' | 'years'>(initialMode);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const activeYearRef = useRef<HTMLButtonElement>(null);

  const yearOptions = React.useMemo(
    () => Array.from({ length: Math.max(1, maxYear - minYear + 1) }, (_, i) => minYear + i),
    [minYear, maxYear]
  );

  // View state for browsing months without changing selected date immediately
  const [viewMonth, setViewMonth] = useState(value.month);
  const [viewYear, setViewYear] = useState(value.year);

  // Keep view in sync when value changes externally
  useEffect(() => {
    setViewMonth(value.month);
    setViewYear(value.year);
  }, [value.month, value.year]);

  useEffect(() => {
    if (!isOpen) {
      setPickerMode(mode === 'month-year' ? 'months' : 'days');
    }
  }, [isOpen, mode]);

  useEffect(() => {
    if (isOpen && pickerMode === 'years' && activeYearRef.current) {
      activeYearRef.current.scrollIntoView({ block: 'center', behavior: 'instant' as ScrollBehavior });
    }
  }, [isOpen, pickerMode]);

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - 12;
    const spaceAbove = rect.top - 12;
    const dropUp = spaceBelow < 280 && spaceAbove > spaceBelow;

    const style: React.CSSProperties = {
      position: 'fixed',
      left: Math.max(12, Math.min(rect.left, window.innerWidth - 268)),
      zIndex: 120,
    };

    if (dropUp) {
      style.bottom = window.innerHeight - rect.top + 6;
    } else {
      style.top = rect.bottom + 6;
    }

    setMenuStyle(style);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current && !containerRef.current.contains(target) &&
        (!menuRef.current || !menuRef.current.contains(target))
      ) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition]);

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
        ref={buttonRef}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel || dateFormatted}
        aria-expanded={isOpen}
        onClick={() => {
          if (disabled) return;
          if (!isOpen) updatePosition();
          setIsOpen((prev) => !prev);
        }}
        className={`h-9 px-3 rounded-lg bg-[var(--surface-container)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs flex items-center gap-2 hover:bg-[var(--surface-container-high)] hover:border-[#4B4D50] focus:outline-none focus-visible:border-[var(--google-blue)] focus-visible:ring-2 focus-visible:ring-[var(--google-blue)] transition-colors cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed ${isOpen ? 'bg-[var(--surface-container-high)] border-[var(--google-blue)]' : ''
          } ${buttonClassName}`}
      >
        {!hideIcon && <CalendarIcon className="w-3.5 h-3.5 text-[var(--google-blue)] shrink-0" />}
        {triggerLabel !== undefined ? triggerLabel : <span className="font-medium truncate">{dateFormatted}</span>}
      </button>

      {/* Popover Calendar */}
      {isOpen && createPortal(
        <div
          ref={menuRef}
          style={menuStyle}
          className="w-64 p-3 bg-[var(--surface-container-high)] border border-[var(--border-subtle)] rounded-xl shadow-2xl shadow-black/80 space-y-2.5 animate-in fade-in zoom-in-95 duration-150 select-none"
        >
          {/* Month/Year Interactive Header */}
          <div className="flex items-center justify-between font-medium text-xs text-[var(--text-primary)] px-0.5">
            <button
              type="button"
              onClick={() => {
                if (mode === 'month-year') {
                  setPickerMode((m) => (m === 'months' ? 'years' : 'months'));
                } else {
                  setPickerMode((m) => (m === 'days' ? 'years' : 'days'));
                }
              }}
              className="flex items-center gap-1 px-2 py-1 -ml-1 rounded-lg hover:bg-[var(--surface-container-highest)] text-xs font-semibold text-[var(--text-primary)] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--google-blue)]"
              title={language === 'vi' ? 'Chọn nhanh năm / tháng' : 'Quick select year / month'}
            >
              <span>
                {pickerMode === 'years'
                  ? (language === 'vi' ? 'Chọn năm' : 'Select year')
                  : pickerMode === 'months'
                    ? `${viewYear}`
                    : `${monthNames[viewMonth]} ${viewYear}`}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[var(--text-secondary)] transition-transform duration-150 ${(mode === 'month-year' ? pickerMode === 'years' : pickerMode !== 'days') ? 'rotate-180 text-[var(--google-blue)]' : ''
                  }`}
              />
            </button>

            {pickerMode !== 'years' && (
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => {
                    if (pickerMode === 'months') setViewYear((y) => Math.max(minYear, y - 1));
                    else prevMonth();
                  }}
                  aria-label={pickerMode === 'months' ? (language === 'vi' ? 'Năm trước' : 'Previous year') : t('calendar.prevMonth')}
                  className="p-1 hover:bg-[var(--surface-container-highest)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--google-blue)]"
                  title={pickerMode === 'months' ? (language === 'vi' ? 'Năm trước' : 'Previous year') : t('calendar.prevMonth')}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (pickerMode === 'months') setViewYear((y) => Math.min(maxYear, y + 1));
                    else nextMonth();
                  }}
                  aria-label={pickerMode === 'months' ? (language === 'vi' ? 'Năm sau' : 'Next year') : t('calendar.nextMonth')}
                  className="p-1 hover:bg-[var(--surface-container-highest)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--google-blue)]"
                  title={pickerMode === 'months' ? (language === 'vi' ? 'Năm sau' : 'Next year') : t('calendar.nextMonth')}
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {pickerMode === 'years' ? (
            /* Year Grid (3 columns, auto-scrolled to viewYear) */
            <div className="grid grid-cols-3 gap-1.5 max-h-[212px] overflow-y-auto custom-scrollbar pr-0.5 py-0.5">
              {yearOptions.map((yr) => {
                const isSelectedYear = yr === viewYear;
                return (
                  <button
                    key={yr}
                    ref={isSelectedYear ? activeYearRef : undefined}
                    type="button"
                    onClick={() => {
                      setViewYear(yr);
                      setPickerMode('months');
                    }}
                    className={`h-8 rounded-full text-xs tabular-nums transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--google-blue)] ${isSelectedYear
                        ? 'bg-[var(--google-blue-primary)] text-white font-semibold'
                        : 'text-[var(--text-primary)] hover:bg-[var(--surface-container-highest)]'
                      }`}
                  >
                    {yr}
                  </button>
                );
              })}
            </div>
          ) : pickerMode === 'months' ? (
            /* Month Grid (3 columns x 4 rows) */
            <div className="grid grid-cols-3 gap-1.5 py-1">
              {(language === 'vi' ? monthShortVi : monthShortEn).map((mLabel, idx) => {
                const isSelectedMonth = idx === viewMonth && (mode !== 'month-year' || viewYear === value.year);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setViewMonth(idx);
                      if (mode === 'month-year') {
                        onChange({ day: 1, month: idx, year: viewYear });
                        setIsOpen(false);
                      } else {
                        setPickerMode('days');
                      }
                    }}
                    className={`h-9 rounded-full text-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--google-blue)] ${isSelectedMonth
                        ? 'bg-[var(--google-blue-primary)] text-white font-semibold'
                        : 'text-[var(--text-primary)] hover:bg-[var(--surface-container-highest)]'
                      }`}
                  >
                    {mLabel}
                  </button>
                );
              })}
            </div>
          ) : (
            <>
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
                      className={`w-6 h-6 mx-auto flex items-center justify-center rounded-full cursor-pointer transition-colors text-[11px] ${isSelected
                          ? 'bg-[var(--google-blue-primary)] text-white font-bold'
                          : 'hover:bg-[var(--surface-container-highest)] text-[var(--text-primary)]'
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
            </>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};
