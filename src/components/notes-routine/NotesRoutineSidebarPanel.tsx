import { routineApi } from '../../api/routineApi';
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Lightbulb,
  Plus,
  X,
  Pin,
  Trash2,
  Pencil,
  Flame,
  Check,
  Clock,
  ChevronDown,
  ChevronUp,
  Repeat,
  Sparkles,
} from 'lucide-react';
import type { RoutineTemplate } from '../../data/routineTemplates';

interface NotesRoutineSidebarPanelProps {
  onClose?: () => void;
  onOpenCreateModal?: () => void;
}

export const NotesRoutineSidebarPanel: React.FC<NotesRoutineSidebarPanelProps> = ({
  onOpenCreateModal: _onOpenCreateModal,
}) => {
  const {
    selectedYear,
    selectedMonth,
    selectedDay,
    eventsData,
    toggleCheckInRoutine,
    addRoutine,
    addSubroutine,
    toggleSubroutine,
    deleteSubroutine,
    updateEvent,
    deleteEvent,
    notesData,
    addNote,
    updateNote,
    toggleNotePin,
    deleteNote,
    toggleNoteChecklistItem,
    searchQuery,
    addEvent,
    showToast,
  } = useApp();

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);

  // State for Quick Composer
  const [isComposerExpanded, setIsComposerExpanded] = useState<boolean>(false);
  const [composerTab, setComposerTab] = useState<'note' | 'routine'>('note');
  const [quickTitle, setQuickTitle] = useState<string>('');
  const [quickContent, setQuickContent] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<'amber' | 'blue' | 'green' | 'purple'>('amber');
  const [filterTab, setFilterTab] = useState<'all' | 'pinned' | 'notes'>('all');

  const [templates, setTemplates] = useState<RoutineTemplate[]>([]);
  useEffect(() => {
    routineApi.getTemplates().then(data => setTemplates(data.map(t => ({
      id: t.id, title: t.title, description: t.description || '', time: '07:00 AM', frequency: 'Hàng ngày',
      category: 'productivity', badge: '', badgeColor: '#1A73E8', subroutines: (t.items || []).map((i: { title: string }) => i.title),
    })))).catch((e: Error) => showToast('Không tải được mẫu', e.message, 'error'));
  }, []);

  // State for Editing Note
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editNoteTitle, setEditNoteTitle] = useState<string>('');
  const [editNoteContent, setEditNoteContent] = useState<string>('');
  const [editNoteColor, setEditNoteColor] = useState<'amber' | 'blue' | 'green' | 'purple'>('amber');

  // State for Editing Routine
  const [editingRoutineId, setEditingRoutineId] = useState<number | null>(null);
  const [editRoutineTitle, setEditRoutineTitle] = useState<string>('');
  const [editRoutineTime, setEditRoutineTime] = useState<string>('07:00 AM');
  const [editRoutineFreq, setEditRoutineFreq] = useState<string>('Hàng ngày');

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

  const handleApplyTemplate = async (tpl: RoutineTemplate) => {
    const saved = await addEvent({
      type: 'routine',
      title: tpl.title,
      time: tpl.time,
      priority: 'high',
      streak: 1,
      completed: false,
      year: selectedYear,
      month: selectedMonth,
      day: selectedDay,
      frequency: tpl.frequency,
      subroutines: tpl.subroutines.map((title, idx) => ({
        id: idx + 1,
        title,
        completed: false,
      })),
    });
    if (!saved) return;
    setIsTemplateModalOpen(false);
    showToast('Áp dụng mẫu thói quen', `Đã thêm "${tpl.title}" vào lịch trình kỷ luật!`, 'success');
  };

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

  const handleSaveQuickNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim() && !quickContent.trim()) return;

    if (!await addNote({
      title: quickTitle.trim() || 'Ghi chú nhanh',
      content: quickContent.trim(),
      color: selectedColor,
      isPinned: false,
      tags: selectedColor === 'amber' ? ['KỷLuật'] : ['ÝTưởng'],
    })) return;

    setQuickTitle('');
    setQuickContent('');
    setIsComposerExpanded(false);
  };

  const handleStartEditNote = (note: any) => {
    setEditingNoteId(note.id);
    setEditNoteTitle(note.title || '');
    setEditNoteContent(note.content || '');
    setEditNoteColor(note.color || 'blue');
  };

  const handleSaveEditNote = async (id: string) => {
    if (!editNoteTitle.trim() && !editNoteContent.trim()) return;
    if (!await updateNote(id, {
      title: editNoteTitle.trim() || 'Ghi chú',
      content: editNoteContent.trim(),
      color: editNoteColor,
    })) return;
    setEditingNoteId(null);
  };

  const handleCancelEditNote = () => {
    setEditingNoteId(null);
  };

  const handleStartEditRoutine = (routine: any) => {
    setEditingRoutineId(routine.id);
    setEditRoutineTitle(routine.title || '');
    setEditRoutineTime(routine.time || '07:00 AM');
    setEditRoutineFreq(routine.frequency || 'Hàng ngày');
  };

  const handleSaveEditRoutine = async (id: number) => {
    if (!editRoutineTitle.trim()) return;
    if (!await updateEvent(id, {
      title: editRoutineTitle.trim(),
      time: editRoutineTime,
      frequency: editRoutineFreq,
    })) return;
    setEditingRoutineId(null);
  };

  const handleCancelEditRoutine = () => {
    setEditingRoutineId(null);
  };

  const handleSaveQuickRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!routineTitle.trim()) return;

    if (!await addRoutine({
      title: routineTitle.trim(),
      time: routineTime,
      frequency: routineFreq,
      subroutines: routineSubtasks,
    })) return;

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
      return 'border-[#E37400]/40 bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)]/90';
    }
    switch (color) {
      case 'amber':
        return 'border-[#E37400]/25 bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)]/90';
      case 'green':
        return 'border-[#1E8E3E]/25 bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)]/90';
      case 'purple':
        return 'border-[#8430CE]/25 bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)]/90';
      case 'blue':
      default:
        return 'border-[var(--border-grid)] bg-[var(--surface-container)] hover:bg-[var(--surface-container-high)]/90';
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-hidden text-[var(--text-primary)] select-none">
      {/* 1. PANEL HEADER */}
      <div className="flex items-center justify-between border-b border-[var(--border-grid)] pb-3 pt-1 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#242527] flex items-center justify-center text-[#FDD663] border border-[var(--border-subtle)] shadow-xs">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[var(--text-primary)] tracking-tight">Ghi chú & Routine</h3>
            <p className="text-[11px] text-[var(--text-muted)]">Kỷ luật & Ghi chép nhanh</p>
          </div>
        </div>
      </div>

      {/* SCROLLABLE MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto space-y-4 py-3 pr-1">
        {/* 2. DUAL QUICK COMPOSER BAR (360px) */}
        <div className="bg-[var(--surface-container)] border border-[var(--border-grid)] rounded-lg p-2.5 transition-all duration-200">
          {!isComposerExpanded ? (
            <div
              onClick={() => setIsComposerExpanded(true)}
              className="flex items-center justify-between text-xs text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-primary)] py-0.5"
            >
              <span>+ Thêm ghi chú hoặc thói quen...</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FDD663]" />
                <Plus className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              {/* Segmented Tab Switcher */}
              <div className="flex items-center p-0.5 rounded-md bg-[#161718] border border-[var(--border-grid)] text-[11px]">
                <button
                  type="button"
                  onClick={() => setComposerTab('note')}
                  className={`flex-1 py-1 rounded text-center transition cursor-pointer ${composerTab === 'note'
                    ? 'bg-[var(--surface-container-high)] text-[var(--text-primary)] font-medium shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                >
                  Ghi chú nhanh
                </button>
                <button
                  type="button"
                  onClick={() => setComposerTab('routine')}
                  className={`flex-1 py-1 rounded text-center transition cursor-pointer ${composerTab === 'routine'
                    ? 'bg-[#E37400] text-white font-medium shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
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
                    className="w-full bg-transparent font-medium text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none text-xs"
                    autoFocus
                  />
                  <textarea
                    value={quickContent}
                    onChange={(e) => setQuickContent(e.target.value)}
                    placeholder="Nội dung ghi chú hoặc ý tưởng..."
                    rows={2}
                    className="w-full bg-transparent text-[#C3C6D1] placeholder-[var(--text-muted)] focus:outline-none text-xs resize-none"
                  />
                  <div className="flex items-center justify-between pt-1 border-t border-[var(--border-grid)]">
                    {/* Color choices */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedColor('amber')}
                        className={`w-3.5 h-3.5 rounded-full bg-[#FDD663] ${selectedColor === 'amber' ? 'ring-2 ring-white ring-offset-1 ring-offset-[var(--surface-container)]' : ''
                          }`}
                        title="Vàng Hổ Phách (Kỷ luật)"
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedColor('blue')}
                        className={`w-3.5 h-3.5 rounded-full bg-[var(--google-blue)] ${selectedColor === 'blue' ? 'ring-2 ring-white ring-offset-1 ring-offset-[var(--surface-container)]' : ''
                          }`}
                        title="Xanh Dương (Dự án)"
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedColor('green')}
                        className={`w-3.5 h-3.5 rounded-full bg-[#81C995] ${selectedColor === 'green' ? 'ring-2 ring-white ring-offset-1 ring-offset-[var(--surface-container)]' : ''
                          }`}
                        title="Xanh Lá (Sức khỏe)"
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedColor('purple')}
                        className={`w-3.5 h-3.5 rounded-full bg-[#D7AEFB] ${selectedColor === 'purple' ? 'ring-2 ring-white ring-offset-1 ring-offset-[var(--surface-container)]' : ''
                          }`}
                        title="Tím (Sáng tạo)"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIsComposerExpanded(false)}
                        className="px-2 py-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
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
                    className="w-full bg-[#161718] border border-[var(--border-grid)] rounded px-2.5 py-1.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#E37400]"
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 flex-1 bg-[#161718] border border-[var(--border-grid)] rounded px-2 py-1 text-[11px] text-[var(--text-secondary)]">
                      <Clock className="w-3 h-3 text-[#FDD663] shrink-0" />
                      <select
                        value={routineTime}
                        onChange={(e) => setRoutineTime(e.target.value)}
                        className="bg-transparent border-0 text-[var(--text-primary)] focus:outline-none cursor-pointer w-full p-0 font-mono"
                      >
                        <option value="06:00 AM" className="bg-[var(--surface-container)]">06:00 AM</option>
                        <option value="06:30 AM" className="bg-[var(--surface-container)]">06:30 AM</option>
                        <option value="07:00 AM" className="bg-[var(--surface-container)]">07:00 AM</option>
                        <option value="07:30 AM" className="bg-[var(--surface-container)]">07:30 AM</option>
                        <option value="21:00 PM" className="bg-[var(--surface-container)]">21:00 PM</option>
                        <option value="22:00 PM" className="bg-[var(--surface-container)]">22:00 PM</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-1 flex-1 bg-[#161718] border border-[var(--border-grid)] rounded px-2 py-1 text-[11px] text-[var(--text-secondary)]">
                      <Repeat className="w-3 h-3 text-[var(--google-blue)] shrink-0" />
                      <select
                        value={routineFreq}
                        onChange={(e) => setRoutineFreq(e.target.value)}
                        className="bg-transparent border-0 text-[var(--text-primary)] focus:outline-none cursor-pointer w-full p-0"
                      >
                        <option value="Hàng ngày" className="bg-[var(--surface-container)]">Hàng ngày</option>
                        <option value="Cứ 2 ngày" className="bg-[var(--surface-container)]">Cứ 2 ngày</option>
                        <option value="Cứ 3 ngày 1 lần" className="bg-[var(--surface-container)]">Cứ 3 ngày</option>
                        <option value="Ngày trong tuần" className="bg-[var(--surface-container)]">Trong tuần</option>
                      </select>
                    </div>
                  </div>

                  {/* Subroutines Checklist Builder */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] text-[var(--text-secondary)] font-semibold uppercase tracking-wider">
                      Các bước hành động con (Sub-routines):
                    </span>
                    {routineSubtasks.length > 0 && (
                      <div className="space-y-1 max-h-[100px] overflow-y-auto custom-scrollbar">
                        {routineSubtasks.map((st, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between px-2 py-0.5 rounded bg-[#161718] border border-[var(--border-grid)] text-[11px]"
                          >
                            <span className="text-[#D0D2D5] truncate">{idx + 1}. {st}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveRoutineSubtask(idx)}
                              className="text-[var(--text-muted)] hover:text-[#F28B82] p-0.5"
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
                      className="w-full bg-[#161718] border border-dashed border-[var(--border-subtle)] focus:border-[#E37400] rounded px-2 py-1 text-[11px] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-[var(--border-grid)]">
                    <button
                      type="button"
                      onClick={() => setIsComposerExpanded(false)}
                      className="px-2 py-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-[11px]"
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
          <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] px-0.5">
            <span className="font-semibold tracking-wider text-[11px] text-[var(--text-secondary)] uppercase flex items-center gap-1.5">
              <span>Kỷ luật hôm nay ({routines.length})</span>
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(true)}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold bg-[#E37400]/20 text-[#FDD663] border border-[#E37400]/40 hover:bg-[#E37400]/30 transition-colors cursor-pointer"
                title="Khám phá các mẫu thói quen thành công"
              >
                <Sparkles className="w-2.5 h-2.5" />
                <span>Mẫu</span>
              </button>
            </span>
            <div className="flex items-center gap-2">
              <span className="bg-[#1E8E3E] text-white font-medium px-2 py-0.5 rounded text-[11px] shadow-xs">
                {completedRoutinesCount}/{routines.length} Hoàn tất
              </span>
              {maxStreak > 0 && (
                <span className="bg-[#242527] text-[#FDD663] border border-[var(--border-subtle)] font-medium px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                  <Flame className="w-3 h-3 text-[#FDD663]" />
                  <span>{maxStreak} ngày</span>
                </span>
              )}
            </div>
          </div>

          {/* Routine items list */}
          <div className="space-y-2">
            {routines.length === 0 ? (
              <div className="bg-[var(--surface-container)] border border-[var(--border-grid)] p-3 text-center rounded-lg">
                <p className="text-xs text-[var(--text-muted)]">Chưa có thói quen kỷ luật nào cho hôm nay</p>
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
                    className={`rounded-lg border transition-all duration-150 p-2.5 space-y-2 group relative ${routine.completed
                      ? 'bg-[var(--surface-container)]/60 border-[var(--border-grid)] opacity-90'
                      : isExpanded
                        ? 'bg-[var(--surface-container)] border-[#E37400]/40 shadow-xs'
                        : 'bg-[var(--surface-container)] border-[var(--border-grid)] hover:border-[#3C4043]'
                      }`}
                  >
                    {/* Routine Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        {/* Checkbox hoàn thành nhanh */}
                        <button
                          type="button"
                          onClick={() => toggleCheckInRoutine(routine.id)}
                          className={`w-4 h-4 rounded flex items-center justify-center transition-all flex-shrink-0 mt-0.5 cursor-pointer ${routine.completed
                            ? 'bg-[#1E8E3E] text-white'
                            : 'border border-[var(--text-muted)] hover:border-[#FDD663]'
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
                            className={`text-xs font-semibold truncate ${routine.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'
                              }`}
                            title={routine.title}
                          >
                            {routine.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] mt-0.5">
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

                      {/* Streak badge, Edit, Delete & Accordion toggle */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEditRoutine(routine);
                            }}
                            className="p-1 text-[var(--text-secondary)] hover:text-[var(--google-blue)] hover:bg-[var(--surface-container-high)] rounded transition cursor-pointer"
                            title="Chỉnh sửa thói quen"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteEvent(routine.id);
                            }}
                            className="p-1 text-[var(--text-muted)] hover:text-[#EA4335] hover:bg-[var(--surface-container-high)] rounded transition cursor-pointer"
                            title="Xóa thói quen"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {routine.streak !== undefined && (
                          <span
                            className={`text-[11px] font-mono font-medium px-1.5 py-0.5 rounded ${routine.completed
                              ? 'bg-[#1E8E3E]/15 text-[#81C995]'
                              : 'bg-[var(--surface-container-high)] text-[#FDD663]'
                              }`}
                          >
                            {routine.completed ? '✓ ' : ''}{routine.streak} ngày
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => setExpandedRoutineId(isExpanded ? null : routine.id)}
                          className="p-0.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition cursor-pointer"
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

                    {/* Inline Edit Form for Routine */}
                    {editingRoutineId === routine.id && (
                      <div className="pt-2 border-t border-[var(--border-grid)] space-y-2 text-xs">
                        <div className="space-y-1">
                          <label className="text-[11px] text-[var(--text-secondary)]">Tên thói quen</label>
                          <input
                            type="text"
                            value={editRoutineTitle}
                            onChange={(e) => setEditRoutineTitle(e.target.value)}
                            placeholder="Tên thói quen kỷ luật..."
                            className="w-full bg-[#161718] border border-[#3C4043] focus:border-[#E37400] rounded px-2.5 py-1 text-xs font-medium text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none"
                            autoFocus
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[11px] text-[var(--text-secondary)]">Thời gian</label>
                            <div className="flex items-center gap-1 bg-[#161718] border border-[#3C4043] rounded px-2 py-1">
                              <Clock className="w-3 h-3 text-[var(--text-muted)]" />
                              <input
                                type="text"
                                value={editRoutineTime}
                                onChange={(e) => setEditRoutineTime(e.target.value)}
                                placeholder="07:00 AM"
                                className="w-full bg-transparent text-xs text-[var(--text-primary)] font-mono focus:outline-none"
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] text-[var(--text-secondary)]">Tần suất</label>
                            <select
                              value={editRoutineFreq}
                              onChange={(e) => setEditRoutineFreq(e.target.value)}
                              className="w-full bg-[#161718] border border-[#3C4043] rounded px-2 py-1 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#E37400]"
                            >
                              <option value="Hàng ngày">Hàng ngày</option>
                              <option value="Cứ 3 ngày 1 lần">Cứ 3 ngày 1 lần</option>
                              <option value="Thứ 2, 4, 6">Thứ 2, 4, 6</option>
                              <option value="Thứ 3, 5, 7">Thứ 3, 5, 7</option>
                              <option value="Cuối tuần">Cuối tuần</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={handleCancelEditRoutine}
                            className="px-2.5 py-1 rounded hover:bg-[var(--surface-container-high)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-[11px] transition cursor-pointer"
                          >
                            Hủy
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEditRoutine(routine.id)}
                            className="px-3 py-1 rounded bg-[#E37400] hover:bg-[#C26200] text-white font-medium text-[11px] transition shadow-xs cursor-pointer"
                          >
                            Lưu thay đổi
                          </button>
                        </div>
                      </div>
                    )}

                    {/* EXPANDED CONTENT: Progress bar & Sub-routines Checklist */}
                    {isExpanded && (
                      <div className="pt-1.5 border-t border-[var(--border-grid)] space-y-2">
                        {/* Progress Bar */}
                        {subCount > 0 && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-[var(--text-secondary)] font-medium">Tiến độ hành động con:</span>
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
                              className="group flex items-center justify-between gap-1.5 py-0.5 px-1 rounded hover:bg-[var(--surface-container-high)]/50 transition"
                            >
                              <label className="flex items-center gap-2 cursor-pointer text-[11px] flex-1 min-w-0">
                                <input
                                  type="checkbox"
                                  checked={st.completed}
                                  onChange={() => toggleSubroutine(routine.id, st.id)}
                                  className="w-3.5 h-3.5 rounded bg-[var(--surface-container-high)] border-[#3A3B3D] text-[#E37400] focus:ring-0 accent-[#E37400] cursor-pointer shrink-0"
                                />
                                <span
                                  className={`truncate ${st.completed ? 'line-through text-[var(--text-muted)]' : 'text-[#D0D2D5]'
                                    }`}
                                  title={st.title}
                                >
                                  {st.title}
                                </span>
                              </label>

                              <button
                                type="button"
                                onClick={() => deleteSubroutine(routine.id, st.id)}
                                className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-[#F28B82] p-0.5 transition cursor-pointer shrink-0"
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
                                  className="flex-1 bg-[#161718] border border-[#3C4043] focus:border-[#E37400] rounded px-2 py-0.5 text-[11px] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none"
                                />
                                <button
                                  type="submit"
                                  className="px-2 py-0.5 rounded bg-[#E37400] hover:bg-[#C26200] text-white text-[11px] font-semibold transition cursor-pointer"
                                >
                                  Lưu
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAddingSubroutineForId(null);
                                    setInlineSubroutineText('');
                                  }}
                                  className="px-1 py-0.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-[11px]"
                                >
                                  ✕
                                </button>
                              </form>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setAddingSubroutineForId(routine.id)}
                                className="text-[11px] text-[#FDD663]/80 hover:text-[#FDD663] hover:underline flex items-center gap-1 transition cursor-pointer pt-0.5"
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
        <div className="flex items-center justify-between border-b border-[var(--border-grid)] pb-1.5 pt-1 text-xs">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setFilterTab('all')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${filterTab === 'all'
                ? 'bg-[var(--surface-container-high)] text-[#FDD663]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
            >
              Tất cả ({notesData.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('pinned')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${filterTab === 'pinned'
                ? 'bg-[var(--surface-container-high)] text-[#FDD663]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
            >
              Đã ghim ({pinnedNotes.length})
            </button>
          </div>
          <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">
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
                    editingNoteId === note.id ? editNoteColor : note.color,
                    true
                  )}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-semibold text-[var(--text-primary)] flex-1 leading-snug">
                      {note.title}
                    </h4>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleStartEditNote(note)}
                        className="text-[var(--text-secondary)] hover:text-[var(--google-blue)] p-0.5 rounded cursor-pointer transition-colors"
                        title="Chỉnh sửa ghi chú"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleNotePin(note.id)}
                        className="text-[#FDD663] hover:text-white p-0.5 rounded cursor-pointer transition-colors"
                        title="Bỏ ghim"
                      >
                        <Pin className="w-3.5 h-3.5 fill-[#FDD663]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteNote(note.id)}
                        className="text-[var(--text-muted)] hover:text-[#EA4335] p-0.5 rounded cursor-pointer transition-colors"
                        title="Xóa ghi chú"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {editingNoteId === note.id ? (
                    <div className="space-y-2 text-xs pt-1.5">
                      <input
                        type="text"
                        value={editNoteTitle}
                        onChange={(e) => setEditNoteTitle(e.target.value)}
                        placeholder="Tiêu đề ghi chú..."
                        className="w-full bg-[#161718] border border-[#3C4043] focus:border-[var(--google-blue)] rounded px-2 py-1 text-xs font-medium text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none"
                        autoFocus
                      />
                      <textarea
                        value={editNoteContent}
                        onChange={(e) => setEditNoteContent(e.target.value)}
                        placeholder="Nội dung ghi chú..."
                        rows={3}
                        className="w-full bg-[#161718] border border-[#3C4043] focus:border-[var(--google-blue)] rounded px-2 py-1 text-[11px] text-[#C3C6D1] placeholder-[var(--text-muted)] focus:outline-none resize-none"
                      />
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5">
                          {(['amber', 'blue', 'green', 'purple'] as const).map((color) => {
                            const bg =
                              color === 'amber'
                                ? 'bg-[#FDD663]'
                                : color === 'blue'
                                  ? 'bg-[var(--google-blue)]'
                                  : color === 'green'
                                    ? 'bg-[#81C995]'
                                    : 'bg-[#C58AF9]';
                            return (
                              <button
                                key={color}
                                type="button"
                                onClick={() => setEditNoteColor(color)}
                                className={`w-3.5 h-3.5 rounded-full cursor-pointer transition ${bg} ${editNoteColor === color
                                  ? 'ring-2 ring-white ring-offset-1 ring-offset-[var(--surface-container)]'
                                  : 'opacity-70 hover:opacity-100'
                                  }`}
                                title={`Màu ${color}`}
                              />
                            );
                          })}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={handleCancelEditNote}
                            className="px-2 py-0.5 rounded hover:bg-[var(--surface-container-high)] text-[var(--text-secondary)] text-[11px] transition cursor-pointer"
                          >
                            Hủy
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEditNote(note.id)}
                            className="px-2.5 py-0.5 rounded bg-[var(--google-blue-primary)] hover:bg-[#1B66CA] text-white font-medium text-[11px] transition cursor-pointer"
                          >
                            Lưu
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
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
                                className={`w-3 h-3 rounded flex items-center justify-center text-[8px] ${item.completed
                                  ? 'bg-[#1E8E3E] text-white'
                                  : 'border border-[var(--text-muted)]'
                                  }`}
                              >
                                {item.completed && '✓'}
                              </span>
                              <span className={item.completed ? 'line-through text-[var(--text-muted)]' : ''}>
                                {item.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tags and timestamp */}
                      <div className="flex items-center justify-between mt-2.5 pt-1.5 border-t border-[var(--border-grid)]/60 text-[11px] text-[var(--text-muted)]">
                        <div className="flex items-center gap-1">
                          {note.tags?.map((tag) => (
                            <span key={tag} className="text-[var(--google-blue)] hover:underline cursor-pointer">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{note.updatedAt}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* General Notes Section */}
          {otherNotes.map((note) => (
            <div
              key={note.id}
              className={`p-3 rounded-lg border transition-all duration-150 relative group ${getColorClasses(
                editingNoteId === note.id ? editNoteColor : note.color,
                false
              )}`}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-semibold text-[var(--text-primary)] flex-1 leading-snug">
                  {note.title}
                </h4>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleStartEditNote(note)}
                    className="text-[var(--text-secondary)] hover:text-[var(--google-blue)] p-0.5 rounded cursor-pointer transition-colors"
                    title="Chỉnh sửa ghi chú"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleNotePin(note.id)}
                    className="text-[var(--text-secondary)] hover:text-[#FDD663] p-0.5 rounded cursor-pointer transition-colors"
                    title="Ghim lên đầu"
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteNote(note.id)}
                    className="text-[var(--text-secondary)] hover:text-[#EA4335] p-0.5 rounded cursor-pointer transition-colors"
                    title="Xóa ghi chú"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {editingNoteId === note.id ? (
                <div className="space-y-2 text-xs pt-1.5">
                  <input
                    type="text"
                    value={editNoteTitle}
                    onChange={(e) => setEditNoteTitle(e.target.value)}
                    placeholder="Tiêu đề ghi chú..."
                    className="w-full bg-[#161718] border border-[#3C4043] focus:border-[var(--google-blue)] rounded px-2 py-1 text-xs font-medium text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none"
                    autoFocus
                  />
                  <textarea
                    value={editNoteContent}
                    onChange={(e) => setEditNoteContent(e.target.value)}
                    placeholder="Nội dung ghi chú..."
                    rows={3}
                    className="w-full bg-[#161718] border border-[#3C4043] focus:border-[var(--google-blue)] rounded px-2 py-1 text-[11px] text-[#C3C6D1] placeholder-[var(--text-muted)] focus:outline-none resize-none"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5">
                      {(['amber', 'blue', 'green', 'purple'] as const).map((color) => {
                        const bg =
                          color === 'amber'
                            ? 'bg-[#FDD663]'
                            : color === 'blue'
                              ? 'bg-[var(--google-blue)]'
                              : color === 'green'
                                ? 'bg-[#81C995]'
                                : 'bg-[#C58AF9]';
                        return (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setEditNoteColor(color)}
                            className={`w-3.5 h-3.5 rounded-full cursor-pointer transition ${bg} ${editNoteColor === color
                              ? 'ring-2 ring-white ring-offset-1 ring-offset-[var(--surface-container)]'
                              : 'opacity-70 hover:opacity-100'
                              }`}
                            title={`Màu ${color}`}
                          />
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleCancelEditNote}
                        className="px-2 py-0.5 rounded hover:bg-[var(--surface-container-high)] text-[var(--text-secondary)] text-[11px] transition cursor-pointer"
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEditNote(note.id)}
                        className="px-2.5 py-0.5 rounded bg-[var(--google-blue-primary)] hover:bg-[#1B66CA] text-white font-medium text-[11px] transition cursor-pointer"
                      >
                        Lưu
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {note.content && (
                    <p className="text-[11px] text-[#C3C6D1] mt-1.5 whitespace-pre-line leading-relaxed">
                      {note.content}
                    </p>
                  )}

                  {/* Tags & footer */}
                  <div className="flex items-center justify-between mt-2.5 pt-1.5 border-t border-[var(--border-grid)]/60 text-[11px] text-[var(--text-muted)]">
                    <div className="flex items-center gap-1">
                      {note.tags?.map((tag) => (
                        <span key={tag} className="text-[var(--google-blue)] hover:underline cursor-pointer">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span>{note.updatedAt}</span>
                  </div>
                </>
              )}
            </div>
          ))}

          {filteredNotes.length === 0 && (
            <div className="bg-[var(--surface-container)] border border-[var(--border-grid)] p-5 text-center rounded-lg space-y-1">
              <p className="text-xs text-[var(--text-muted)]">Không có ghi chú nào phù hợp</p>
            </div>
          )}
        </div>
      </div>

      {/* 6. PANEL FOOTER */}
      <div className="h-7 border-t border-[var(--border-grid)] bg-[#171819] px-2 flex items-center justify-between text-[11px] text-[var(--text-muted)] flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#81C995] animate-pulse" />
          <span>Đã lưu tự động</span>
        </div>
        <span>
          {routines.length} thói quen, {notesData.length} ghi chú
        </span>
      </div>

      {/* 7. ROUTINE TEMPLATES LIBRARY MODAL */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[var(--surface-container)] border border-[var(--border-subtle)] max-w-lg w-full rounded-2xl p-5 space-y-4 shadow-2xl text-[var(--text-primary)] max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[var(--border-grid)] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E37400]/20 text-[#FDD663] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">Thư Viện Mẫu Thói Quen (Routine Templates)</h3>
                  <p className="text-[11px] text-[var(--text-secondary)]">Chọn mẫu chuẩn hóa để áp dụng ngay vào lịch trình cá nhân</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(false)}
                className="p-1 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-container-high)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="bg-[#161718] border border-[var(--border-grid)] hover:border-[#E37400]/50 p-3.5 rounded-xl space-y-2.5 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-xs text-[var(--text-primary)]">{tpl.title}</h4>
                        <span
                          className="text-[11px] font-bold px-1.5 py-0.5 rounded shadow-xs text-white"
                          style={{ backgroundColor: tpl.badgeColor }}
                        >
                          {tpl.badge}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] mt-1">
                        <span className="flex items-center gap-1 font-mono text-[#FDD663]">
                          <Clock className="w-3 h-3" />
                          {tpl.time}
                        </span>
                        <span>• Tần suất: {tpl.frequency}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleApplyTemplate(tpl)}
                      className="px-3 py-1.5 bg-[#E37400] hover:bg-[#FF8C00] text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Áp dụng</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">{tpl.description}</p>

                  <div className="bg-[var(--surface-container)] border border-[var(--border-grid)] p-2.5 rounded-lg space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                      Các bước hành động ({tpl.subroutines.length}):
                    </span>
                    <ul className="space-y-1">
                      {tpl.subroutines.map((sub, sIdx) => (
                        <li key={sIdx} className="flex items-center gap-2 text-[11px] text-[var(--text-primary)]">
                          <Check className="w-3 h-3 text-[#1E8E3E] flex-shrink-0" />
                          <span>{sub}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
