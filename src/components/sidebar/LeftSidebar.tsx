import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { MiniCalendarPicker } from '../ui/MiniCalendarPicker';
import { PanelLeftClose, Plus, ChevronDown, Trash2, Palette, Check, X } from 'lucide-react';

const PRESET_COLORS = [
  '#8AB4F8', // Blue
  '#FDD663', // Amber / Yellow
  '#81C995', // Sage Green
  '#F28B82', // Flamingo / Red
  '#FF8BCB', // Pink
  '#C58AF9', // Grape / Purple
  '#78D9EC', // Peacock / Cyan
  '#FCAD70', // Tangerine / Orange
  '#A8DAB5', // Mint
  '#CE93D8', // Lilac
];

export const LeftSidebar: React.FC = () => {
  const { currentRole } = useAuth();
  const {
    isLeftSidebarOpen,
    toggleLeftSidebar,
    categories,
    categoryFilters,
    setCategoryFilters,
    addCategory,
    deleteCategory,
    openModal,
  } = useApp();
  const { t, language } = useLanguage();

  const [isCreateMenuOpen, setIsCreateMenuOpen] = React.useState(false);
  const [isMyCalendarsOpen, setIsMyCalendarsOpen] = React.useState(true);
  const [isOtherCalendarsOpen, setIsOtherCalendarsOpen] = React.useState(true);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = React.useState(false);
  const [newCategoryName, setNewCategoryName] = React.useState('');
  const [newCategoryColor, setNewCategoryColor] = React.useState('#8AB4F8');
  const createMenuRef = React.useRef<HTMLDivElement>(null);

  const handleSaveCategory = () => {
    if (!newCategoryName.trim()) return;
    addCategory(newCategoryName.trim(), newCategoryColor);
    setNewCategoryName('');
    setIsAddCategoryOpen(false);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (createMenuRef.current && !createMenuRef.current.contains(event.target as Node)) {
        setIsCreateMenuOpen(false);
      }
    };
    if (isCreateMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCreateMenuOpen]);

  const handleSelectCreateType = (type: 'event' | 'task' | 'appointment') => {
    setIsCreateMenuOpen(false);
    if (type === 'appointment') {
      openModal('appointment-schedule');
    } else {
      openModal('create');
    }
  };

  return (
    <aside
      id="leftSidebar"
      className={`w-64 border-r border-[var(--border-grid)] bg-[var(--surface-container)] p-3 space-y-4 flex-shrink-0 flex flex-col overflow-y-auto sidebar-transition select-none transition-colors duration-200 ${
        !isLeftSidebarOpen ? 'sidebar-collapsed' : ''
      }`}
    >
      {/* 1. Google Style Create Pill Button & Dropdown Menu */}
      <div className="pt-1 flex items-center justify-between gap-2 relative" ref={createMenuRef}>
        <button
          onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
          className="bg-[#28292A] hover:bg-[#333538] border border-[#3A3B3D] text-[#E3E2E3] font-medium py-2.5 px-4 rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-2.5 text-sm cursor-pointer active:scale-98 flex-1"
        >
          <Plus className="w-4 h-4 text-[#8AB4F8]" />
          <span>{language === 'vi' ? 'Tạo' : 'Create'}</span>
          <ChevronDown
            className="w-3.5 h-3.5 text-[#9AA0A6] ml-auto transition-transform duration-200"
            style={{ transform: isCreateMenuOpen ? 'rotate(180deg)' : 'none' }}
          />
        </button>

        <button
          onClick={toggleLeftSidebar}
          className="p-2 text-[#9AA0A6] hover:text-[#E3E2E3] hover:bg-[#28292A] rounded-full transition-colors cursor-pointer"
          title={language === 'vi' ? 'Thu gọn bảng' : 'Collapse panel'}
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>

        {/* Dropdown Menu */}
        {isCreateMenuOpen && (
          <div className="absolute left-0 top-14 w-56 bg-[#242527] border border-[#333538] rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => handleSelectCreateType('event')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-[#28292A] transition-colors text-left text-[#E3E2E3] group cursor-pointer"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#8AB4F8]" />
              <div className="flex flex-col">
                <span className="text-xs font-medium">{language === 'vi' ? 'Sự kiện' : 'Event'}</span>
              </div>
            </button>

            <button
              onClick={() => handleSelectCreateType('task')}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-[#28292A] transition-colors text-left text-[#9AA0A6] hover:text-[#E3E2E3] cursor-pointer"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#81C995]" />
              <span className="text-xs font-medium">{language === 'vi' ? 'Việc cần làm' : 'Task'}</span>
            </button>

            <button
              onClick={() => handleSelectCreateType('appointment')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-[#28292A] transition-colors text-left text-[#9AA0A6] hover:text-[#E3E2E3] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C58AF9]" />
                <span className="text-xs font-medium">{language === 'vi' ? 'Lên lịch hẹn' : 'Appointment schedule'}</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-[#8430CE] text-white text-[9px] font-bold shadow-xs">
                {language === 'vi' ? 'MỚI' : 'NEW'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Mini Calendar Picker Component */}
      <MiniCalendarPicker />

      {/* 3. My Calendars Checklist (Dynamic Tags & Color Picker) */}
      <div className="space-y-2 text-xs flex-1">
        <div className="flex items-center justify-between text-[#9AA0A6] font-semibold text-[11px] uppercase tracking-wider px-1 select-none">
          <div
            onClick={() => setIsMyCalendarsOpen((prev) => !prev)}
            className="flex items-center gap-1.5 cursor-pointer hover:text-[#E3E2E3] transition-colors"
          >
            <span>{language === 'vi' ? 'Lịch của tôi' : 'My Calendars'}</span>
            <ChevronDown
              className={`w-3 h-3 transition-transform duration-200 ${
                isMyCalendarsOpen ? '' : '-rotate-90'
              }`}
            />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsAddCategoryOpen((prev) => !prev);
            }}
            className="p-1 text-[#9AA0A6] hover:text-[#E3E2E3] hover:bg-[#28292A] rounded transition-colors cursor-pointer"
            title={language === 'vi' ? 'Thêm danh mục / tag mới' : 'Add new calendar / tag'}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Inline Add Category Popover with Color Picker */}
        {isAddCategoryOpen && (
          <div className="p-2.5 bg-[#242527] border border-[#3A3B3D] rounded-xl shadow-xl space-y-2.5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#E3E2E3]">
              <span>{language === 'vi' ? 'Tạo danh mục mới' : 'New Category / Tag'}</span>
              <button
                onClick={() => setIsAddCategoryOpen(false)}
                className="text-[#9AA0A6] hover:text-[#E3E2E3] p-0.5 rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder={language === 'vi' ? 'Nhập tên danh mục...' : 'Category name...'}
              className="w-full bg-[#18191A] border border-[#3A3B3D] rounded-lg px-2.5 py-1.5 text-xs text-[#E3E2E3] placeholder-[#70757A] focus:outline-none focus:border-[#8AB4F8]"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveCategory();
                if (e.key === 'Escape') setIsAddCategoryOpen(false);
              }}
            />
            <div>
              <div className="text-[10px] text-[#9AA0A6] mb-1.5 flex items-center justify-between">
                <span>{language === 'vi' ? 'Màu sắc đại diện' : 'Color tag'}</span>
                <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#18191A] text-[#E3E2E3] border border-[#3A3B3D]">
                  {newCategoryColor}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewCategoryColor(c)}
                    className="w-5 h-5 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                    style={{ backgroundColor: c }}
                  >
                    {newCategoryColor.toLowerCase() === c.toLowerCase() && (
                      <Check className="w-3 h-3 text-[#121314] stroke-[3]" />
                    )}
                  </button>
                ))}
                {/* Native Color Picker for custom color picking */}
                <label
                  className="w-5 h-5 rounded-full border border-dashed border-[#5F6368] flex items-center justify-center cursor-pointer hover:border-[#8AB4F8] transition-colors relative overflow-hidden"
                  title={language === 'vi' ? 'Tự chọn màu khác từ Color Picker' : 'Custom color from Color Picker'}
                >
                  <input
                    type="color"
                    value={newCategoryColor}
                    onChange={(e) => setNewCategoryColor(e.target.value)}
                    className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                  />
                  <Palette className="w-3 h-3 text-[#9AA0A6]" />
                </label>
              </div>
            </div>
            <div className="flex items-center justify-end gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setIsAddCategoryOpen(false)}
                className="px-2.5 py-1 rounded text-[11px] text-[#9AA0A6] hover:text-[#E3E2E3] hover:bg-[#333538] transition-colors cursor-pointer"
              >
                {language === 'vi' ? 'Hủy' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSaveCategory}
                disabled={!newCategoryName.trim()}
                className="px-3 py-1 rounded text-[11px] font-medium bg-[#8AB4F8] text-[#121314] hover:bg-[#A8C7FA] transition-colors disabled:opacity-50 cursor-pointer"
              >
                {language === 'vi' ? 'Thêm' : 'Add'}
              </button>
            </div>
          </div>
        )}

        {isMyCalendarsOpen && (
          <div className="space-y-1.5 px-1">
            {categories.map((cat) => {
              const isChecked = categoryFilters[cat.id] !== false;
              let displayName = cat.name;
              if (cat.id === 'routine') displayName = t('sidebar.routineCategory');
              else if (cat.id === 'event') displayName = t('sidebar.eventCategory');
              else if (cat.id === 'task') displayName = t('sidebar.taskCategory');

              return (
                <div
                  key={cat.id}
                  className="group flex items-center justify-between text-[#E3E2E3] py-1 px-1.5 rounded hover:bg-[#28292A] transition-colors"
                >
                  <label className="flex items-center gap-3 cursor-pointer min-w-0 flex-1">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) =>
                        setCategoryFilters((prev) => ({ ...prev, [cat.id]: e.target.checked }))
                      }
                      className="w-4 h-4 rounded bg-[#28292A] border-[#3A3B3D] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                      style={{ accentColor: cat.color }}
                    />
                    <span className="flex items-center gap-2 min-w-0 flex-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="truncate text-xs">{displayName}</span>
                    </span>
                  </label>
                  {!cat.isBuiltIn && (
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#9AA0A6] hover:text-[#F28B82] rounded transition-opacity cursor-pointer"
                      title={language === 'vi' ? 'Xóa danh mục này' : 'Delete category'}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Other Calendars Checklist */}
        <div className="pt-2">
          <div
            onClick={() => setIsOtherCalendarsOpen((prev) => !prev)}
            className="flex items-center justify-between text-[#9AA0A6] font-semibold text-[11px] uppercase tracking-wider px-1 pb-1 cursor-pointer hover:text-[#E3E2E3] transition-colors select-none"
          >
            <span>{language === 'vi' ? 'Lịch khác' : 'Other Calendars'}</span>
            <ChevronDown
              className={`w-3 h-3 transition-transform duration-200 ${
                isOtherCalendarsOpen ? '' : '-rotate-90'
              }`}
            />
          </div>
          {isOtherCalendarsOpen && (
            <div className="space-y-1.5 px-1">
              <label className="flex items-center gap-3 text-[#E3E2E3] cursor-pointer py-1 px-1.5 rounded hover:bg-[#28292A] transition-colors">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded text-[#8430CE] bg-[#28292A] border-[#3A3B3D] cursor-pointer accent-[#8430CE]"
                />
                <span className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C58AF9] flex-shrink-0" />
                  <span className="truncate text-xs">{language === 'vi' ? 'Ngày lễ tại Việt Nam' : 'Holidays in Vietnam'}</span>
                </span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* 4. Sync / Plan Status Footer */}
      <div className="pt-2 border-t border-[#2A2B2D] text-[11px] text-[#70757A] flex items-center justify-between shrink-0 px-1">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#81C995]"></span>
          <span>{language === 'vi' ? 'Đã đồng bộ' : 'Synced'}</span>
        </span>
        <span className="font-medium text-[#9AA0A6]">
          {currentRole === 'FREE' ? 'FREE' : 'PRO'}
        </span>
      </div>
    </aside>
  );
};
