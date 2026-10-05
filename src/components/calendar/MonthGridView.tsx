import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { X } from 'lucide-react';

const monthNamesShortEn = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const MonthGridView: React.FC = () => {
  const { eventsData, tasksData, selectedDay, selectedMonth, selectedYear, selectDate, openModal, openDayInspector, closeDayInspector } = useApp();
  const { language, t } = useLanguage();

  const [popoverState, setPopoverState] = useState<{ day: number, x: number, y: number, items: any[] } | null>(null);

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayIndex = new Date(selectedYear, selectedMonth, 1).getDay(); // 0 = Sunday
  const prevMonthDaysCount = new Date(selectedYear, selectedMonth, 0).getDate();

  const leadingPadding = Array.from(
    { length: firstDayIndex },
    (_, i) => prevMonthDaysCount - firstDayIndex + 1 + i
  );
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalCells = leadingPadding.length + currentMonthDays.length;
  const trailingPaddingCount = (7 - (totalCells % 7)) % 7;
  const trailingPadding = Array.from({ length: trailingPaddingCount }, (_, i) => i + 1);

  const prevMonthIndex = selectedMonth === 0 ? 11 : selectedMonth - 1;
  const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
  const nextMonthIndex = selectedMonth === 11 ? 0 : selectedMonth + 1;
  const nextYear = selectedMonth === 11 ? selectedYear + 1 : selectedYear;

  const weekdayHeaders = [
    t('calendar.sun'),
    t('calendar.mon'),
    t('calendar.tue'),
    t('calendar.wed'),
    t('calendar.thu'),
    t('calendar.fri'),
    t('calendar.sat'),
  ];

  const handleCellClick = (day: number, month: number, year: number) => {
    selectDate(day, month, year);
    closeDayInspector();
    openModal('create');
  };

  const handleCellDoubleClick = (day: number, month: number, year: number) => {
    selectDate(day, month, year);
    openDayInspector(day);
  };

  const getRealToday = () => {
    const d = new Date();
    return { d: d.getDate(), m: d.getMonth(), y: d.getFullYear() };
  };
  const realToday = getRealToday();

  return (
    <div className="w-full h-full flex flex-col select-none overflow-hidden bg-[#121314]">
      {/* Day of Week Headers */}
      <div className="grid grid-cols-7 border-b border-[#2A2B2D] text-center text-[11px] font-medium text-[#9AA0A6] uppercase tracking-wider bg-[#121314] shrink-0">
        {weekdayHeaders.map((name, i) => (
          <div key={i} className="py-2 px-1 truncate border-r border-[#2A2B2D] last:border-r-0">
            {name}
          </div>
        ))}
      </div>

      {/* Dynamic Month Grid (Full Height Liquid Layout) */}
      <div
        className="grid grid-cols-7 flex-1 w-full h-full divide-x divide-y divide-[#2A2B2D] overflow-hidden relative"
        style={{ gridAutoRows: '1fr' }}
      >
        {/* Leading padding days from previous month */}
        {leadingPadding.map((pad) => (
          <div
            key={`grid-pad-prev-${pad}`}
            onClick={() => handleCellClick(pad, prevMonthIndex, prevYear)}
            title={language === 'vi' ? 'Nhấp để tạo lịch trình mới' : 'Click to create new event'}
            className="p-1 sm:p-1.5 h-full border-r border-[#2A2B2D] last:border-r-0 bg-[#151618]/40 hover:bg-[#1C1D1F] transition-colors cursor-pointer flex flex-col justify-start overflow-hidden"
          >
            <div className="flex flex-col items-center mb-1 mt-1">
              <span className="text-[11px] font-medium text-[#4A4D51] px-1">{pad}</span>
            </div>
          </div>
        ))}

        {/* Current month dynamic days */}
        {currentMonthDays.map((d) => {
          const dayEvents = eventsData.filter(
            (e) => e.year === selectedYear && e.month === selectedMonth && e.day === d
          );
          
          const dayTasks = tasksData.filter(t => {
             const isRealToday = d === realToday.d && selectedMonth === realToday.m && selectedYear === realToday.y;
             if (t.dueDate === 'Hôm nay' && isRealToday) return true;
             const taskDate = new Date(t.dueDate);
             if (!isNaN(taskDate.getTime())) {
                return taskDate.getDate() === d && taskDate.getMonth() === selectedMonth && taskDate.getFullYear() === selectedYear;
             }
             if (t.dueDate?.includes(':') && isRealToday) return true;
             return false;
          });
          
          const allItems = [
            ...dayEvents.map(e => ({ id: e.id, title: e.title, itemType: e.type, time: e.time, colorTag: e.colorTag })),
            ...dayTasks.map(t => ({ id: t.id + 10000, title: t.title, itemType: 'task', time: t.dueDate, colorTag: t.colorTag }))
          ];

          const isToday = d === selectedDay; // Or use realToday to highlight actual today, keeping selectedDay for now

          return (
            <div
              key={d}
              onClick={() => handleCellClick(d, selectedMonth, selectedYear)}
              onDoubleClick={() => handleCellDoubleClick(d, selectedMonth, selectedYear)}
              title={language === 'vi' ? 'Nhấp để tạo sự kiện, nhấp đúp để xem chi tiết ngày' : 'Click to create event, double-click for day details'}
              className={`p-1 sm:p-[6px] h-full border-r border-[#2A2B2D] last:border-r-0 transition-colors cursor-pointer flex flex-col justify-start overflow-hidden ${
                isToday ? 'bg-[#1C1D1F]' : 'hover:bg-[#1C1D1F]'
              }`}
            >
              {/* Day Header: Date Number */}
              <div className="flex flex-col items-center mb-1 mt-0.5">
                {isToday ? (
                  <span className="w-[22px] h-[22px] rounded-full bg-[#8AB4F8] text-[#202124] font-bold text-xs flex items-center justify-center">
                    {d}
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-[#e8eaed]">
                    {d === 1 ? (language === 'vi' ? `1 thg ${selectedMonth + 1}` : `1 ${monthNamesShortEn[selectedMonth]}`) : d}
                  </span>
                )}
              </div>

              {/* Event & Task Chips List */}
              <div className="flex-1 flex flex-col justify-start overflow-hidden gap-[2px]">
                {allItems.slice(0, 5).map((item) => {
                  if (item.itemType === 'event' || item.itemType === 'routine') {
                    return (
                      <div
                        key={item.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item.itemType !== 'task') openModal('detail', item.id);
                        }}
                        className="text-[11px] text-[#202124] truncate px-1.5 py-0.5 rounded-[3px] font-medium transition-opacity hover:opacity-90 shadow-none"
                        style={{ backgroundColor: item.colorTag || '#8AB4F8' }}
                        title={item.title}
                      >
                        {item.title}
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={item.id}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="text-[11px] hover:bg-[#3c4043] truncate px-1.5 py-0.5 rounded-[3px] font-medium transition-colors flex items-center gap-[5px]"
                        style={{ color: item.colorTag || '#8AB4F8' }}
                        title={item.title}
                      >
                        <span 
                          className="w-2 h-2 rounded-full border-[1.5px] shrink-0" 
                          style={{ borderColor: item.colorTag || '#8AB4F8' }}
                        />
                        <span className="truncate leading-none">{item.title}</span>
                      </div>
                    );
                  }
                })}

                {allItems.length > 5 && (
                  <div 
                    onClick={(e) => {
                       e.stopPropagation();
                       const rect = e.currentTarget.getBoundingClientRect();
                       setPopoverState({ day: d, x: rect.left, y: rect.top, items: allItems });
                    }}
                    className="text-[11px] text-[#9AA0A6] hover:bg-[#3c4043] hover:text-[#e8eaed] rounded-[3px] px-1.5 py-0.5 font-medium transition-colors"
                  >
                    {allItems.length - 5} {language === 'vi' ? 'mục khác' : 'more'}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Trailing padding days from next month */}
        {trailingPadding.map((pad) => (
          <div
            key={`grid-pad-next-${pad}`}
            onClick={() => handleCellClick(pad, nextMonthIndex, nextYear)}
            title={language === 'vi' ? 'Nhấp để tạo lịch trình mới' : 'Click to create new event'}
            className="p-1 sm:p-1.5 h-full border-r border-[#2A2B2D] last:border-r-0 bg-[#151618]/40 hover:bg-[#1C1D1F] transition-colors cursor-pointer flex flex-col justify-start overflow-hidden"
          >
            <div className="flex flex-col items-center mb-1 mt-1">
              <span className="text-[11px] font-normal text-[#4A4D51] px-1">{pad}</span>
            </div>
          </div>
        ))}
        
        {/* Popover for "X mục khác" */}
        {popoverState && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setPopoverState(null)} />
            <div 
              className="fixed z-50 bg-[#28292c] border border-[#3c4043] rounded-lg shadow-xl w-52 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
              style={{ 
                top: Math.min(popoverState.y - 40, window.innerHeight - 350), 
                left: Math.min(popoverState.x - 20, window.innerWidth - 220) 
              }}
            >
              <div className="flex flex-col items-center pt-3 pb-2 relative">
                <span className="text-[10px] text-[#9aa0a6] uppercase tracking-wider mb-1">
                  {weekdayHeaders[(firstDayIndex + popoverState.day - 1) % 7]}
                </span>
                <span className="text-xl text-[#202124] font-medium leading-tight h-8 w-8 flex items-center justify-center rounded-full bg-[#aecbfa]">
                  {popoverState.day}
                </span>
                <button 
                  className="absolute top-2 right-2 text-[#9aa0a6] hover:text-[#e8eaed] hover:bg-[#3c4043] rounded-full p-1 transition-colors"
                  onClick={() => setPopoverState(null)}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex flex-col gap-[2px] p-2 max-h-60 overflow-y-auto custom-scrollbar">
                {popoverState.items.map(item => {
                  if (item.itemType === 'event' || item.itemType === 'routine') {
                    return (
                      <div
                        key={item.id}
                        className="text-[11px] text-[#202124] truncate px-2 py-1 rounded-[3px] font-medium transition-opacity hover:opacity-90 cursor-pointer"
                        style={{ backgroundColor: item.colorTag || '#8AB4F8' }}
                        title={item.title}
                        onClick={() => { setPopoverState(null); if(item.itemType !== 'task') openModal('detail', item.id); }}
                      >
                        {item.title}
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={item.id}
                        className="text-[11px] hover:bg-[#3c4043] truncate px-2 py-1 rounded-[3px] font-medium transition-colors cursor-pointer flex items-center gap-[5px]"
                        style={{ color: item.colorTag || '#8AB4F8' }}
                        title={item.title}
                      >
                        <span 
                          className="w-2.5 h-2.5 rounded-full border-[1.5px] shrink-0" 
                          style={{ borderColor: item.colorTag || '#8AB4F8' }}
                        />
                        <span className="truncate leading-none pt-[1px]">{item.title}</span>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
