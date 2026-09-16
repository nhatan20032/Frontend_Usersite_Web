import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Lightbulb,
  Plus,
  X,
  Pin,
  Trash2,
  Flame,
  Check,
  Clock,
  ChevronDown,
  ChevronUp,
  Repeat,
} from 'lucide-react';

interface NotesRoutineSidebarPanelProps {
  onClose: () => void;
  onOpenCreateModal?: () => void;
}

export const NotesRoutineSidebarPanel: React.FC<NotesRoutineSidebarPanelProps> = ({
  onClose,
  onOpenCreateModal,
}) => {
  const {
    eventsData,
    toggleCheckInRoutine,
    addRoutine,
    addSubroutine,
    toggleSubroutine,
    deleteSubroutine,
    notesData,
    addNote,
    toggleNotePin,
    deleteNote,
    toggleNoteChecklistItem,
    searchQuery,
  } = useApp();

  // State for Quick Composer
  const [isComposerExpanded, setIsComposerExpanded] = useState<boolean>(false);
  const [composerTab, setComposerTab] = useState<'note' | 'routine'>('note');
  const [quickTitle, setQuickTitle] = useState<string>('');
  const [quickContent, setQuickContent] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<'amber' | 'blue' | 'green' | 'purple'>('amber');
  const [filterTab, setFilterTab] = useState<'all' | 'pinned' | 'notes'>('all');

  // Quick Routine Creation State
  const [routineTitle, setRoutineTitle] = useState<string>('');
  const [routineTime, setRoutineTime] = useState<string>('07:00 AM');
  const [routineFreq, setRoutineFreq] = useState<string>('Hàng ngày');
  const [routineSubtasks, setRoutineSubtasks] = useState<string[]>([]);
  const [routineSubtaskInput, setRoutineSubtaskInput] = useState<string>('');

  // Accordion State & Inline Subroutine State
  const [expandedRoutineId, setExpandedRoutineId] = useState<number | null>(1);
  const [addingSubroutineForId, setAddingSubroutineForId] = useState<number | null>(null);
  const [inlineSubroutineText, setInlineSubroutineText] = useState<string>('');

  // Routines data from eventsData
  const routines = eventsData.filter((e) => e.type === 'routine');
  const completedRoutinesCount = routines.filter((r) => r.completed).length;
  const maxStreak = routines.reduce((max, r) => Math.max(max, r.streak || 0), 0);

  // Filtered Notes
  const filteredNotes = notesData.filter((note) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = note.title.toLowerCase().includes(q);
      const matchContent = note.content?.toLowerCase().includes(q);
      const matchTags = note.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchContent && !matchTags) return false;
    }
    if (filterTab === 'pinned' && !note.isPinned) return false;
    return true;
  });

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const otherNotes = filteredNotes.filter((n) => !n.isPinned);

  const handleSaveQuickNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim() && !quickContent.trim()) return;

    addNote({
      title: quickTitle.trim() || 'Ghi chú nhanh',
      content: quickContent.trim(),
      color: selectedColor,
      isPinned: false,
      tags: selectedColor === 'amber' ? ['KỷLuật'] : ['ÝTưởng'],
    });

    setQuickTitle('');
    setQuickContent('');
    setIsComposerExpanded(false);
  };

  const handleSaveQuickRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routineTitle.trim()) return;

    addRoutine({
      title: routineTitle.trim(),
      time: routineTime,
      frequency: routineFreq,
      subroutines: routineSubtasks,
    });

    setRoutineTitle('');
    setRoutineSubtasks([]);
    setRoutineSubtaskInput('');
    setIsComposerExpanded(false);
  };

  const handleAddRoutineSubtask = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (routineSubtaskInput.trim()) {
        setRoutineSubtasks((prev) => [...prev, routineSubtaskInput.trim()]);
        setRoutineSubtaskInput('');
      }
    }
  };

  const handleRemoveRoutineSubtask = (idxToRemove: number) => {
    setRoutineSubtasks((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const getColorClasses = (color?: string, isPinned?: boolean) => {
    if (isPinned) {
      return 'border-[#E37400]/40 bg-[#1F2021] hover:bg-[#28292A]/90';
    }
    switch (color) {
      case 'amber':
        return 'border-[#E37400]/25 bg-[#1F2021] hover:bg-[#28292A]/90';
      case 'green':
        return 'border-[#1E8E3E]/25 bg-[#1F2021] hover:bg-[#28292A]/90';
      case 'purple':
        return 'border-[#8430CE]/25 bg-[#1F2021] hover:bg-[#28292A]/90';
      case 'blue':
      default:
        return 'border-[#2A2B2D] bg-[#1F2021] hover:bg-[#28292A]/90';
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-hidden bg-[#121314] text-[#E3E2E3] select-none">
      {/* 1. PANEL HEADER */}
      <div className="flex items-center justify-between border-b border-[#2A2B2D] pb-3 pt-1 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#E37400]/15 flex items-center justify-center text-[#FDD663] border border-[#E37400]/30 shadow-xs">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[#E3E2E3] tracking-tight">Ghi chú & Routine</h3>
            <p className="text-[11px] text-[#70757A]">Kỷ luật & Ghi chép nhanh</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {onOpenCreateModal && (
            <button
              onClick={onOpenCreateModal}
              className="p-1.5 hover:bg-[#28292A] rounded-full text-[#9AA0A6] hover:text-[#FDD663] transition-colors cursor-pointer"
              title="Tạo routine hoặc sự kiện mới"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#28292A] rounded-full text-[#9AA0A6] hover:text-[#E3E2E3] transition-colors cursor-pointer"
            title="Đóng bảng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SCROLLABLE MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto space-y-4 py-3 pr-1">
        {/* 2. DUAL QUICK COMPOSER BAR (360px) */}
        <div className="bg-[#1F2021] border border-[#2A2B2D] rounded-lg p-2.5 transition-all duration-200">
          {!isComposerExpanded ? (
            <div
              onClick={() => setIsComposerExpanded(true)}
              className="flex items-center justify-between text-xs text-[#70757A] cursor-pointer hover:text-[#E3E2E3] py-0.5"
            >
              <span>+ Thêm ghi chú hoặc thói quen...</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FDD663]" />
                <Plus className="w-3.5 h-3.5 text-[#9AA0A6]" />
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              {/* Segmented Tab Switcher */}
              <div className="flex items-center p-0.5 rounded-md bg-[#161718] border border-[#2A2B2D] text-[11px]">
                <button
                  type="button"
                  onClick={() => setComposerTab('note')}
                  className={`flex-1 py-1 rounded text-center transition cursor-pointer ${
                    composerTab === 'note'
                      ? 'bg-[#28292A] text-[#E3E2E3] font-medium shadow-xs'
                      : 'text-[#9AA0A6] hover:text-[#E3E2E3]'
                  }`}
                >
                  Ghi chú nhanh
                </button>
                <button
                  type="button"
                  onClick={() => setComposerTab('routine')}
                  className={`flex-1 py-1 rounded text-center transition cursor-pointer ${
                    composerTab === 'routine'
                      ? 'bg-[#E37400]/20 text-[#FDD663] font-semibold border border-[#E37400]/40 shadow-xs'
                      : 'text-[#9AA0A6] hover:text-[#E3E2E3]'
                  }`}
                >
                  + Thói quen mới
                </button>
              </div>

              {composerTab === 'note' ? (
                /* FORM GHI CHÚ */
                <form onSubmit={handleSaveQuickNote} className="space-y-2">
                  <input
                    type="text"
                    value={quickTitle}
                    onChange={(e) => setQuickTitle(e.target.value)}
                    placeholder="Tiêu đề ghi chú..."
                    className="w-full bg-transparent font-medium text-[#E3E2E3] placeholder-[#70757A] focus:outline-none text-xs"
                    autoFocus
                  />
                  <textarea
                    value={quickContent}
                    onChange={(e) => setQuickContent(e.target.value)}
                    placeholder="Nội dung ghi chú hoặc ý tưởng..."
                    rows={2}
                    className="w-full bg-transparent text-[#C3C6D1] placeholder-[#70757A] focus:outline-none text-xs resize-none"
                  />
                  <div className="flex items-center justify-between pt-1 border-t border-[#2A2B2D]">
                    {/* Color choices */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedColor('amber')}
                        className={`w-3.5 h-3.5 rounded-full bg-[#FDD663] ${
                          selectedColor === 'amber' ? 'ring-2 ring-white ring-offset-1 ring-offset-[#1F2021]' : ''
                        }`}
                        title="Vàng Hổ Phách (Kỷ luật)"
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedColor('blue')}
                        className={`w-3.5 h-3.5 rounded-full bg-[#8AB4F8] ${
                          selectedColor === 'blue' ? 'ring-2 ring-white ring-offset-1 ring-offset-[#1F2021]' : ''
                        }`}
                        title="Xanh Dương (Dự án)"
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedColor('green')}
                        className={`w-3.5 h-3.5 rounded-full bg-[#81C995] ${
                          selectedColor === 'green' ? 'ring-2 ring-white ring-offset-1 ring-offset-[#1F2021]' : ''
                        }`}
                        title="Xanh Lá (Sức khỏe)"
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedColor('purple')}
                        className={`w-3.5 h-3.5 rounded-full bg-[#D7AEFB] ${
                          selectedColor === 'purple' ? 'ring-2 ring-white ring-offset-1 ring-offset-[#1F2021]' : ''
                        }`}
                        title="Tím (Sáng tạo)"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIsComposerExpanded(false)}
                        className="px-2 py-1 rounded text-[#9AA0A6] hover:text-[#E3E2E3] transition-colors"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 rounded bg-[#E37400] hover:bg-[#E37400]/80 text-white font-medium transition-colors cursor-pointer"
                      >
                        Lưu
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                /* FORM THÓI QUEN MỚI KÈM BƯỚC CON */
                <form onSubmit={handleSaveQuickRoutine} className="space-y-2">
                  <input
                    type="text"
                    value={routineTitle}
                    onChange={(e) => setRoutineTitle(e.target.value)}
                    placeholder="Tên thói quen kỷ luật..."
                    className="w-full bg-[#161718] border border-[#2A2B2D] rounded px-2.5 py-1.5 text-xs text-[#E3E2E3] placeholder-[#70757A] focus:outline-none focus:border-[#E37400]"
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 flex-1 bg-[#161718] border border-[#2A2B2D] rounded px-2 py-1 text-[11px] text-[#9AA0A6]">
                      <Clock className="w-3 h-3 text-[#FDD663] shrink-0" />
                      <select
                        value={routineTime}
                        onChange={(e) => setRoutineTime(e.target.value)}
                        className="bg-transparent border-0 text-[#E3E2E3] focus:outline-none cursor-pointer w-full p-0 font-mono"
                      >
                        <option value="06:00 AM" className="bg-[#1F2021]">06:00 AM</option>
                        <option value="06:30 AM" className="bg-[#1F2021]">06:30 AM</option>
                        <option value="07:00 AM" className="bg-[#1F2021]">07:00 AM</option>
                        <option value="07:30 AM" className="bg-[#1F2021]">07:30 AM</option>
                        <option value="21:00 PM" className="bg-[#1F2021]">21:00 PM</option>
                        <option value="22:00 PM" className="bg-[#1F2021]">22:00 PM</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-1 flex-1 bg-[#161718] border border-[#2A2B2D] rounded px-2 py-1 text-[11px] text-[#9AA0A6]">
                      <Repeat className="w-3 h-3 text-[#8AB4F8] shrink-0" />
                      <select
                        value={routineFreq}
                        onChange={(e) => setRoutineFreq(e.target.value)}
                        className="bg-transparent border-0 text-[#E3E2E3] focus:outline-none cursor-pointer w-full p-0"
                      >
                        <option value="Hàng ngày" className="bg-[#1F2021]">Hàng ngày</option>
                        <option value="Cứ 2 ngày" className="bg-[#1F2021]">Cứ 2 ngày</option>
                        <option value="Cứ 3 ngày 1 lần" className="bg-[#1F2021]">Cứ 3 ngày</option>
                        <option value="Ngày trong tuần" className="bg-[#1F2021]">Trong tuần</option>
                      </select>
                    </div>
                  </div>

                  {/* Subroutines Checklist Builder */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] text-[#9AA0A6] font-semibold uppercase tracking-wider">
                      Các bước hành động con (Sub-routines):
                    </span>
                    {routineSubtasks.length > 0 && (
                      <div className="space-y-1 max-h-[100px] overflow-y-auto custom-scrollbar">
                        {routineSubtasks.map((st, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between px-2 py-0.5 rounded bg-[#161718] border border-[#2A2B2D] text-[11px]"
                          >
                            <span className="text-[#D0D2D5] truncate">{idx + 1}. {st}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveRoutineSubtask(idx)}
                              className="text-[#70757A] hover:text-[#F28B82] p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <input
                      type="text"
                      value={routineSubtaskInput}
                      onChange={(e) => setRoutineSubtaskInput(e.target.value)}
                      onKeyDown={handleAddRoutineSubtask}
                      placeholder="+ Thêm bước con rồi ấn Enter..."
                      className="w-full bg-[#161718] border border-dashed border-[#333538] focus:border-[#E37400] rounded px-2 py-1 text-[11px] text-[#E3E2E3] placeholder-[#70757A] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#2A2B2D]">
                    <button
                      type="button"
                      onClick={() => setIsComposerExpanded(false)}
                      className="px-2 py-1 rounded text-[#9AA0A6] hover:text-[#E3E2E3] text-[11px]"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1 rounded bg-[#E37400] hover:bg-[#C26200] text-white font-semibold text-[11px] transition shadow-xs cursor-pointer"
                    >
                      Lưu thói quen
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* 3. SECTION A: KỶ LUẬT HÔM NAY (ROUTINES) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-[#9AA0A6] px-0.5">
            <span className="font-semibold tracking-wider text-[10px] text-[#9AA0A6] uppercase">
              Kỷ luật hôm nay ({routines.length})
            </span>
            <div className="flex items-center gap-2">
              <span className="bg-[#1E8E3E]/15 text-[#81C995] border border-[#1E8E3E]/30 font-medium px-2 py-0.5 rounded text-[10px]">
                {completedRoutinesCount}/{routines.length} Hoàn tất
              </span>
              {maxStreak > 0 && (
                <span className="bg-[#E37400]/15 text-[#FDD663] border border-[#E37400]/30 font-medium px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                  <Flame className="w-3 h-3 text-[#FDD663]" />
                  <span>{maxStreak} ngày</span>
                </span>
              )}
            </div>
          </div>

          {/* Routine items list */}
          <div className="space-y-2">
            {routines.length === 0 ? (
              <div className="bg-[#1F2021] border border-[#2A2B2D] p-3 text-center rounded-lg">
                <p className="text-xs text-[#70757A]">Chưa có thói quen kỷ luật nào cho hôm nay</p>
              </div>
            ) : (
              routines.map((routine) => {
                const isExpanded = expandedRoutineId === routine.id;
                const subCount = routine.subroutines?.length || 0;
                const subDone = routine.subroutines?.filter((s) => s.completed).length || 0;
                const percent = subCount > 0 ? Math.round((subDone / subCount) * 100) : (routine.completed ? 100 : 0);

                return (
                  <div
                    key={routine.id}
                    className={`rounded-lg border transition-all duration-150 p-2.5 space-y-2 ${
                      routine.completed
                        ? 'bg-[#1F2021]/60 border-[#2A2B2D] opacity-90'
                        : isExpanded
                        ? 'bg-[#1F2021] border-[#E37400]/40 shadow-xs'
                        : 'bg-[#1F2021] border-[#2A2B2D] hover:border-[#3C4043]'
                    }`}
                  >
                    {/* Routine Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        {/* Checkbox hoàn thành nhanh */}
                        <button
                          type="button"
                          onClick={() => toggleCheckInRoutine(routine.id)}
                          className={`w-4 h-4 rounded flex items-center justify-center transition-all flex-shrink-0 mt-0.5 cursor-pointer ${
                            routine.completed
                              ? 'bg-[#1E8E3E] text-white'
                              : 'border border-[#70757A] hover:border-[#FDD663]'
                          }`}
                          title={routine.completed ? 'Đã hoàn tất thói quen' : 'Điểm danh hoàn thành thói quen'}
                        >
                          {routine.completed && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>

                        <div
                          className="min-w-0 flex-1 cursor-pointer"
                          onClick={() => setExpandedRoutineId(isExpanded ? null : routine.id)}
                        >
                          <h4
                            className={`text-xs font-semibold truncate ${
                              routine.completed ? 'line-through text-[#70757A]' : 'text-[#E3E2E3]'
                            }`}
                            title={routine.title}
                          >
                            {routine.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] text-[#70757A] mt-0.5">
                            <span className="flex items-center gap-0.5 font-mono">
                              <Clock className="w-2.5 h-2.5" />
                              {routine.time}
                            </span>
                            {routine.frequency && <span>• {routine.frequency}</span>}
                            {subCount > 0 && (
                              <span className="text-[#FDD663] font-mono">
                                • {subDone}/{subCount} bước
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Streak badge & Accordion toggle */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {routine.streak !== undefined && (
                          <span
                            className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded ${
                              routine.completed
                                ? 'bg-[#1E8E3E]/15 text-[#81C995]'
                                : 'bg-[#28292A] text-[#FDD663]'
                            }`}
                          >
                            {routine.completed ? '✓ ' : ''}{routine.streak} ngày
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => setExpandedRoutineId(isExpanded ? null : routine.id)}
                          className="p-0.5 text-[#70757A] hover:text-[#E3E2E3] transition cursor-pointer"
                          title={isExpanded ? 'Thu gọn' : 'Mở rộng'}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 text-[#FDD663]" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* EXPANDED CONTENT: Progress bar & Sub-routines Checklist */}
                    {isExpanded && (
                      <div className="pt-1.5 border-t border-[#2A2B2D] space-y-2">
                        {/* Progress Bar */}
                        {subCount > 0 && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px]">
                              <span className="text-[#9AA0A6] font-medium">Tiến độ hành động con:</span>
                              <span className="font-mono font-semibold text-[#FDD663]">
                                {subDone}/{subCount} bước ({percent}%)
                              </span>
                            </div>
                            <div className="w-full bg-[#161718] h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-[#E37400] h-full rounded-full transition-all"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Checklist items */}
                        <div className="space-y-1 pt-0.5 pl-0.5">
                          {routine.subroutines?.map((st) => (
                            <div
                              key={st.id}
                              className="group flex items-center justify-between gap-1.5 py-0.5 px-1 rounded hover:bg-[#28292A]/50 transition"
                            >
                              <label className="flex items-center gap-2 cursor-pointer text-[11px] flex-1 min-w-0">
                                <input
                                  type="checkbox"
                                  checked={st.completed}
                                  onChange={() => toggleSubroutine(routine.id, st.id)}
                                  className="w-3.5 h-3.5 rounded bg-[#28292A] border-[#3A3B3D] text-[#E37400] focus:ring-0 accent-[#E37400] cursor-pointer shrink-0"
                                />
                                <span
                                  className={`truncate ${
                                    st.completed ? 'line-through text-[#70757A]' : 'text-[#D0D2D5]'
                                  }`}
                                  title={st.title}
                                >
                                  {st.title}
                                </span>
                              </label>

                              <button
                                type="button"
                                onClick={() => deleteSubroutine(routine.id, st.id)}
                                className="opacity-0 group-hover:opacity-100 text-[#70757A] hover:text-[#F28B82] p-0.5 transition cursor-pointer shrink-0"
                                title="Xóa bước này"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}

                          {/* Quick Inline Add Subroutine */}
                          <div className="pt-1">
                            {addingSubroutineForId === routine.id ? (
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  if (inlineSubroutineText.trim()) {
                                    addSubroutine(routine.id, inlineSubroutineText.trim());
                                    setInlineSubroutineText('');
                                    setAddingSubroutineForId(null);
                                  }
                                }}
                                className="flex items-center gap-1"
                              >
                                <input
                                  type="text"
                                  autoFocus
                                  value={inlineSubroutineText}
                                  onChange={(e) => setInlineSubroutineText(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Escape') {
                                      setAddingSubroutineForId(null);
                                      setInlineSubroutineText('');
                                    }
                                  }}
                                  placeholder="+ Bước con... (Enter)"
                                  className="flex-1 bg-[#161718] border border-[#3C4043] focus:border-[#E37400] rounded px-2 py-0.5 text-[11px] text-[#E3E2E3] placeholder-[#70757A] focus:outline-none"
                                />
                                <button
                                  type="submit"
                                  className="px-2 py-0.5 rounded bg-[#E37400] hover:bg-[#C26200] text-white text-[10px] font-semibold transition cursor-pointer"
                                >
                                  Lưu
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAddingSubroutineForId(null);
                                    setInlineSubroutineText('');
                                  }}
                                  className="px-1 py-0.5 text-[#9AA0A6] hover:text-[#E3E2E3] text-[10px]"
                                >
                                  ✕
                                </button>
                              </form>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setAddingSubroutineForId(routine.id)}
                                className="text-[10px] text-[#FDD663]/80 hover:text-[#FDD663] hover:underline flex items-center gap-1 transition cursor-pointer pt-0.5"
                              >
                                <Plus className="w-3 h-3" />
                                <span>+ Thêm bước con</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 4. SUB-TABS FILTER */}
        <div className="flex items-center justify-between border-b border-[#2A2B2D] pb-1.5 pt-1 text-xs">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setFilterTab('all')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                filterTab === 'all'
                  ? 'bg-[#28292A] text-[#FDD663]'
                  : 'text-[#9AA0A6] hover:text-[#E3E2E3]'
              }`}
            >
              Tất cả ({notesData.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('pinned')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                filterTab === 'pinned'
                  ? 'bg-[#28292A] text-[#FDD663]'
                  : 'text-[#9AA0A6] hover:text-[#E3E2E3]'
              }`}
            >
              Đã ghim ({pinnedNotes.length})
            </button>
          </div>
          <span className="text-[10px] text-[#70757A] uppercase tracking-wider font-semibold">
            Keep Notes
          </span>
        </div>

        {/* 5. KEEP NOTES LIST */}
        <div className="space-y-2">
          {/* Pinned Notes Section */}
          {filterTab !== 'notes' && pinnedNotes.length > 0 && (
            <div className="space-y-1.5">
              {pinnedNotes.map((note) => (
                <div
                  key={note.id}
                  className={`p-3 rounded-lg border transition-all duration-150 relative group ${getColorClasses(
                    note.color,
                    true
                  )}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-semibold text-[#E3E2E3] flex-1 leading-snug">
                      {note.title}
                    </h4>
                    <button
                      type="button"
                      onClick={() => toggleNotePin(note.id)}
                      className="text-[#FDD663] hover:text-white p-0.5 rounded cursor-pointer transition-colors"
                      title="Bỏ ghim"
                    >
                      <Pin className="w-3.5 h-3.5 fill-[#FDD663]" />
                    </button>
                  </div>

                  {note.content && (
                    <p className="text-[11px] text-[#C3C6D1] mt-1.5 whitespace-pre-line leading-relaxed">
                      {note.content}
                    </p>
                  )}

                  {/* Checklist if present */}
                  {note.checklist && note.checklist.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {note.checklist.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => toggleNoteChecklistItem(note.id, item.id)}
                          className="flex items-center gap-1.5 text-[11px] text-[#C3C6D1] cursor-pointer hover:text-white"
                        >
                          <span
                            className={`w-3 h-3 rounded flex items-center justify-center text-[8px] ${
                              item.completed
                                ? 'bg-[#1E8E3E] text-white'
                                : 'border border-[#70757A]'
                            }`}
                          >
                            {item.completed && '✓'}
                          </span>
                          <span className={item.completed ? 'line-through text-[#70757A]' : ''}>
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags and timestamp */}
                  <div className="flex items-center justify-between mt-2.5 pt-1.5 border-t border-[#2A2B2D]/60 text-[10px] text-[#70757A]">
                    <div className="flex items-center gap-1">
                      {note.tags?.map((tag) => (
                        <span key={tag} className="text-[#8AB4F8] hover:underline cursor-pointer">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{note.updatedAt}</span>
                      <button
                        type="button"
                        onClick={() => deleteNote(note.id)}
                        className="opacity-0 group-hover:opacity-100 text-[#70757A] hover:text-[#EA4335] transition-opacity cursor-pointer"
                        title="Xóa ghi chú"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* General Notes Section */}
          {otherNotes.map((note) => (
            <div
              key={note.id}
              className={`p-3 rounded-lg border transition-all duration-150 relative group ${getColorClasses(
                note.color,
                false
              )}`}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-semibold text-[#E3E2E3] flex-1 leading-snug">
                  {note.title}
                </h4>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => toggleNotePin(note.id)}
                    className="text-[#9AA0A6] hover:text-[#FDD663] p-0.5 rounded cursor-pointer transition-colors"
                    title="Ghim lên đầu"
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteNote(note.id)}
                    className="text-[#9AA0A6] hover:text-[#EA4335] p-0.5 rounded cursor-pointer transition-colors"
                    title="Xóa ghi chú"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {note.content && (
                <p className="text-[11px] text-[#C3C6D1] mt-1.5 whitespace-pre-line leading-relaxed">
                  {note.content}
                </p>
              )}

              {/* Tags & footer */}
              <div className="flex items-center justify-between mt-2.5 pt-1.5 border-t border-[#2A2B2D]/60 text-[10px] text-[#70757A]">
                <div className="flex items-center gap-1">
                  {note.tags?.map((tag) => (
                    <span key={tag} className="text-[#8AB4F8] hover:underline cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>
                <span>{note.updatedAt}</span>
              </div>
            </div>
          ))}

          {filteredNotes.length === 0 && (
            <div className="bg-[#1F2021] border border-[#2A2B2D] p-5 text-center rounded-lg space-y-1">
              <p className="text-xs text-[#70757A]">Không có ghi chú nào phù hợp</p>
            </div>
          )}
        </div>
      </div>

      {/* 6. PANEL FOOTER */}
      <div className="h-7 border-t border-[#2A2B2D] bg-[#171819] px-2 flex items-center justify-between text-[10px] text-[#70757A] flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#81C995] animate-pulse" />
          <span>Đã lưu tự động</span>
        </div>
        <span>
          {routines.length} thói quen, {notesData.length} ghi chú
        </span>
      </div>
    </div>
  );
};
