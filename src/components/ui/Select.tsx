import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption<T = string | number> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  colorDot?: string;
  disabled?: boolean;
}

export interface SelectProps<T = string | number> {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  disabled?: boolean;
  prefixIcon?: React.ReactNode;
  isMono?: boolean;
  align?: 'left' | 'right';
  openDirection?: 'auto' | 'down' | 'up';
  'aria-label'?: string;
}

export function Select<T extends string | number = string>({
  value,
  options,
  onChange,
  placeholder = 'Chọn...',
  className = '',
  buttonClassName = '',
  menuClassName = '',
  disabled = false,
  prefixIcon,
  isMono = false,
  align = 'left',
  openDirection = 'auto',
  'aria-label': ariaLabel,
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - 12;
    const spaceAbove = rect.top - 12;

    let shouldDropUp = false;
    if (openDirection === 'up') {
      shouldDropUp = true;
    } else if (openDirection === 'down') {
      shouldDropUp = false;
    } else {
      shouldDropUp = spaceBelow < 220 && spaceAbove > spaceBelow;
    }

    setDropUp(shouldDropUp);

    const style: React.CSSProperties = {
      position: 'fixed',
      minWidth: rect.width,
      maxHeight: Math.max(120, Math.min(240, shouldDropUp ? spaceAbove : spaceBelow)),
      zIndex: 120,
    };

    if (shouldDropUp) {
      style.bottom = window.innerHeight - rect.top + 4;
    } else {
      style.top = rect.bottom + 4;
    }

    if (align === 'right') {
      style.right = Math.max(12, window.innerWidth - rect.right);
    } else {
      style.left = Math.max(12, Math.min(rect.left, window.innerWidth - Math.max(rect.width, 160) - 12));
    }

    setMenuStyle(style);
  }, [align, openDirection]);

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

  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen) {
      updatePosition();
    }
    setIsOpen((prev) => !prev);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={handleToggle}
        className={`h-9 px-3 rounded-lg bg-[var(--surface-container)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs flex items-center justify-between gap-2 hover:bg-[var(--surface-container-high)] hover:border-[#4B4D50] focus:outline-none focus-visible:border-[var(--google-blue)] focus-visible:ring-1 focus-visible:ring-[var(--google-blue)] transition-colors cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed ${
          isOpen ? 'bg-[var(--surface-container-high)] border-[var(--google-blue)]' : ''
        } ${isMono ? 'font-mono' : ''} ${buttonClassName}`}
      >
        <span className="flex items-center gap-2 truncate">
          {prefixIcon && <span className="shrink-0">{prefixIcon}</span>}
          {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
          {selectedOption?.colorDot && (
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-black/20"
              style={{ backgroundColor: selectedOption.colorDot }}
            />
          )}
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[var(--text-secondary)] shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[var(--google-blue)]' : ''
          }`}
        />
      </button>

      {isOpen && createPortal(
        <div
          ref={menuRef}
          role="listbox"
          style={menuStyle}
          className={`${dropUp ? 'origin-bottom-left' : 'origin-top-left'} w-max overflow-y-auto custom-scrollbar bg-[var(--surface-container-high)] border border-[var(--border-subtle)] rounded-xl shadow-2xl shadow-black/80 p-1 space-y-0.5 animate-in fade-in zoom-in-95 duration-150 ${menuClassName}`}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={String(opt.value)}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={opt.disabled}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs rounded-lg flex items-center justify-between gap-2 cursor-pointer select-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  isSelected
                    ? 'bg-[var(--google-blue-primary)] text-white font-medium'
                    : 'text-[var(--text-primary)] hover:bg-[var(--surface-container-highest)]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                  {opt.colorDot && (
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-black/20"
                      style={{ backgroundColor: opt.colorDot }}
                    />
                  )}
                  <span className="truncate">{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-white ml-2" />}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
}
