import { apiClient } from './apiClient';

export interface NoteChecklistItemDto {
  id: string;
  text: string;
  completed: boolean;
}

export interface KeepNoteDto {
  id: string;
  title: string;
  content?: string;
  color: string;
  isPinned: boolean;
  tags?: string[];
  checklist?: NoteChecklistItemDto[];
  updatedAt?: string;
}

export const noteApi = {
  getNotes(search?: string) {
    return apiClient.get<KeepNoteDto[]>('/user/notes', search ? { search } : undefined);
  },
  createNote(data: {
    title: string;
    content?: string;
    color?: string;
    tags?: string[];
    checklist?: NoteChecklistItemDto[];
  }) {
    return apiClient.post<KeepNoteDto>('/user/notes', data);
  },
  updateNote(
    id: string,
    data: {
      title: string;
      content?: string;
      color?: string;
      tags?: string[];
      checklist?: NoteChecklistItemDto[];
    }
  ) {
    return apiClient.put<KeepNoteDto>(`/user/notes/${id}`, data);
  },
  togglePin(id: string) {
    return apiClient.patch<{ id: string; isPinned: boolean }>(`/user/notes/${id}/pin`);
  },
  deleteNote(id: string) {
    return apiClient.delete<{ message: string }>(`/user/notes/${id}`);
  },
};

