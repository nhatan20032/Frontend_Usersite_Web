import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { contactApi } from '../../api/contactApi';
import { syncHubClient } from '../../services/syncHubClient';
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  CalendarPlus,
  X,
} from 'lucide-react';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  group: 'work' | 'client' | 'personal';
  avatarBg: string;
  status: 'online' | 'busy' | 'offline';
}

interface ContactsCompanionPanelProps {
  onClose?: () => void;
}

export const ContactsCompanionPanel: React.FC<ContactsCompanionPanelProps> = ({ onClose: _onClose }) => {
  const { currentUser } = useAuth();
  const { openModal, showToast } = useApp();
  const { language } = useLanguage();

  const [contacts, setContacts] = useState<Contact[]>([]);

  // Sync contacts with backend & listen to SignalR changes (Only when authenticated)
  useEffect(() => {
    setContacts([]);
    if (!currentUser) return;

    contactApi.getContacts().then((remoteContacts) => {
      if (remoteContacts) {
        const colors = ['#1A73E8', '#8430CE', '#E37400', '#1E8E3E', '#D93025', '#00838F'];
        setContacts(
          remoteContacts.map((c, i) => ({
            id: c.id,
            name: c.name,
            email: c.email || '',
            phone: c.phoneNumber || 'Chưa cập nhật',
            role: c.role || 'Người liên hệ',
            group: c.group || 'work',
            avatarBg: c.avatarBg || colors[i % colors.length],
            status: c.status || 'offline',
          }))
        );
      }
    }).catch((e: Error) => showToast('Không tải được danh bạ', e.message, 'error'));

    const unsub = syncHubClient.onDataChanged((event) => {
      if (event.entityType === 'contact') {
        contactApi.getContacts().then((remoteContacts) => {
          if (remoteContacts) {
            const colors = ['#1A73E8', '#8430CE', '#E37400', '#1E8E3E', '#D93025', '#00838F'];
            setContacts(
              remoteContacts.map((c, i) => ({
                id: c.id,
                name: c.name,
                email: c.email || '',
                phone: c.phoneNumber || 'Chưa cập nhật',
                role: c.role || 'Người liên hệ',
                group: c.group || 'work',
                avatarBg: c.avatarBg || colors[i % colors.length],
                status: c.status || 'offline',
              }))
            );
          }
        }).catch((e: Error) => showToast('Không tải được danh bạ', e.message, 'error'));
      }
    });

    return () => unsub();
  }, [currentUser]);

  const [search, setSearch] = useState('');
  const [filterGroup, setFilterGroup] = useState<'all' | 'work' | 'client' | 'personal'>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form add contact
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newGroup, setNewGroup] = useState<'work' | 'client' | 'personal'>('work');

  const filteredContacts = contacts.filter((c) => {
    if (filterGroup !== 'all' && c.group !== filterGroup) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault(); if (!newName.trim() || !newEmail.trim()) return;
    try {
      const saved = await contactApi.createContact({ name: newName.trim(), email: newEmail.trim(), phoneNumber: newPhone.trim(), role: newRole.trim(), group: newGroup });
      setContacts(prev => [{ id: saved.id, name: saved.name, email: saved.email || '', phone: saved.phoneNumber || '', role: saved.role || '', group: newGroup, avatarBg: '#1A73E8', status: 'offline' }, ...prev.filter(c => c.id !== saved.id)]);
      setIsAddOpen(false); setNewName(''); setNewEmail(''); setNewPhone(''); setNewRole('');
      showToast('Đã thêm liên hệ', saved.name, 'success');
    } catch (e) { showToast('Không thể thêm liên hệ', (e as Error).message, 'error'); }
  };

  const handleScheduleWithContact = (contact: Contact) => {
    openModal('appointment-schedule');
    showToast(
      language === 'vi' ? 'Lên lịch hẹn' : 'Schedule Appointment',
      language === 'vi'
        ? `Đang mở thiết lập lịch hẹn cho liên hệ ${contact.name}`
        : `Opening appointment scheduler for ${contact.name}`,
      'info'
    );
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    showToast(
      language === 'vi' ? 'Đã sao chép email' : 'Email Copied',
      email,
      'info'
    );
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getGroupBadge = (group: Contact['group']) => {
    switch (group) {
      case 'work':
        return { label: language === 'vi' ? 'Đồng nghiệp' : 'Work', color: 'bg-[var(--google-blue-primary)]/15 text-[var(--google-blue)] border-[var(--google-blue-primary)]/30' };
      case 'client':
        return { label: language === 'vi' ? 'Khách hàng' : 'Client', color: 'bg-[#E37400]/15 text-[#FDD663] border-[#E37400]/30' };
      case 'personal':
        return { label: language === 'vi' ? 'Cá nhân' : 'Personal', color: 'bg-[#1E8E3E]/15 text-[#81C995] border-[#1E8E3E]/30' };
    }
  };

  return (
    <div className="w-full h-full flex flex-col space-y-3 select-none text-[var(--text-primary)] overflow-hidden">
      {/* 1. Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-grid)] pb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#1E8E3E] flex items-center justify-center text-white shadow-xs">
            <Users className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[var(--text-primary)]">
              {language === 'vi' ? 'Google Contacts' : 'Google Contacts'}
            </h3>
            <p className="text-[11px] text-[var(--text-muted)]">
              {contacts.length} {language === 'vi' ? 'người liên hệ & nhóm' : 'contacts & groups'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsAddOpen(!isAddOpen)}
            className="p-1.5 hover:bg-[var(--surface-container-high)] rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            title={language === 'vi' ? 'Thêm liên hệ mới' : 'Add new contact'}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Add Contact Drawer */}
      {isAddOpen && (
        <form
          onSubmit={handleAddContact}
          className="bg-[var(--surface-container)] border border-[#3A3B3D] p-3 rounded-xl space-y-2.5 animate-in fade-in zoom-in-95 duration-150 flex-shrink-0 text-xs"
        >
          <div className="flex items-center justify-between font-semibold text-xs text-[var(--google-blue)]">
            <span>{language === 'vi' ? 'Thêm người liên hệ mới' : 'New Contact'}</span>
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <input
            type="text"
            required
            placeholder={language === 'vi' ? 'Họ và tên *' : 'Full Name *'}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full bg-[#161718] border border-[var(--border-grid)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--google-blue)]"
            autoFocus
          />

          <input
            type="email"
            required
            placeholder={language === 'vi' ? 'Địa chỉ Email *' : 'Email address *'}
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full bg-[#161718] border border-[var(--border-grid)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--google-blue)]"
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder={language === 'vi' ? 'Số điện thoại' : 'Phone'}
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="w-full bg-[#161718] border border-[var(--border-grid)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--google-blue)]"
            />
            <input
              type="text"
              placeholder={language === 'vi' ? 'Chức vụ / Đơn vị' : 'Role'}
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full bg-[#161718] border border-[var(--border-grid)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--google-blue)]"
            />
          </div>

          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[11px] text-[var(--text-muted)]">{language === 'vi' ? 'Nhóm:' : 'Group:'}</span>
            {(['work', 'client', 'personal'] as const).map((grp) => (
              <button
                key={grp}
                type="button"
                onClick={() => setNewGroup(grp)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium border cursor-pointer ${
                  newGroup === grp
                    ? 'bg-[var(--surface-container-high)] text-[var(--google-blue)] border-[var(--google-blue)]'
                    : 'text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
                }`}
              >
                {grp === 'work' ? 'Đồng nghiệp' : grp === 'client' ? 'Khách hàng' : 'Cá nhân'}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-2.5 py-1 rounded text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              {language === 'vi' ? 'Hủy' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded text-xs font-semibold bg-[#1E8E3E] text-white hover:bg-[#1B7E37] cursor-pointer shadow-xs"
            >
              {language === 'vi' ? 'Lưu liên hệ' : 'Save'}
            </button>
          </div>
        </form>
      )}

      {/* 3. Search Bar */}
      <div className="relative flex-shrink-0">
        <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-2.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={language === 'vi' ? 'Tìm liên hệ theo tên, email...' : 'Search contacts...'}
          className="w-full bg-[var(--surface-container)] border border-[var(--border-grid)] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[#1E8E3E]"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* 4. Group Filter Tabs */}
      <div className="flex items-center gap-1 text-[11px] border-b border-[var(--border-grid)] pb-2 flex-shrink-0 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setFilterGroup('all')}
          className={`px-2 py-1 rounded-md transition-colors cursor-pointer font-medium whitespace-nowrap ${
            filterGroup === 'all'
              ? 'bg-[var(--surface-container-high)] text-[#81C995]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          {language === 'vi' ? 'Tất cả' : 'All'} ({contacts.length})
        </button>
        <button
          onClick={() => setFilterGroup('work')}
          className={`px-2 py-1 rounded-md transition-colors cursor-pointer font-medium whitespace-nowrap ${
            filterGroup === 'work'
              ? 'bg-[var(--surface-container-high)] text-[var(--google-blue)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          {language === 'vi' ? 'Đồng nghiệp' : 'Work'}
        </button>
        <button
          onClick={() => setFilterGroup('client')}
          className={`px-2 py-1 rounded-md transition-colors cursor-pointer font-medium whitespace-nowrap ${
            filterGroup === 'client'
              ? 'bg-[var(--surface-container-high)] text-[#FDD663]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          {language === 'vi' ? 'Khách hàng' : 'Client'}
        </button>
        <button
          onClick={() => setFilterGroup('personal')}
          className={`px-2 py-1 rounded-md transition-colors cursor-pointer font-medium whitespace-nowrap ${
            filterGroup === 'personal'
              ? 'bg-[var(--surface-container-high)] text-[#81C995]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          {language === 'vi' ? 'Cá nhân' : 'Personal'}
        </button>
      </div>

      {/* 5. Contact List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {filteredContacts.length === 0 ? (
          <div className="bg-[var(--surface-container)] border border-[var(--border-grid)] p-6 text-center rounded-xl space-y-2 mt-4">
            <Users className="w-8 h-8 text-[var(--text-muted)] mx-auto" />
            <p className="text-xs text-[var(--text-secondary)]">
              {language === 'vi' ? 'Không tìm thấy người liên hệ nào phù hợp.' : 'No contacts found.'}
            </p>
          </div>
        ) : (
          filteredContacts.map((contact) => {
            const badge = getGroupBadge(contact.group);
            return (
              <div
                key={contact.id}
                className="bg-[var(--surface-container)] hover:bg-[#252628] border border-[var(--border-grid)] hover:border-[#3C4043] p-2.5 rounded-xl transition-all group space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Avatar with Status Dot */}
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-xs"
                        style={{ backgroundColor: contact.avatarBg }}
                      >
                        {getInitials(contact.name)}
                      </div>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[var(--surface-container)] ${
                          contact.status === 'online'
                            ? 'bg-[#1E8E3E]'
                            : contact.status === 'busy'
                            ? 'bg-[#E37400]'
                            : 'bg-[var(--text-muted)]'
                        }`}
                        title={contact.status}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-semibold text-xs text-[var(--text-primary)] truncate">
                          {contact.name}
                        </h4>
                        <span
                          className={`text-[11px] px-1.5 py-0.2 rounded-full border ${badge.color} font-medium flex-shrink-0`}
                        >
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] truncate">{contact.role}</p>
                    </div>
                  </div>

                  {/* Quick Action Button: Schedule Appointment */}
                  <button
                    onClick={() => handleScheduleWithContact(contact)}
                    className="p-1.5 text-[var(--google-blue)] hover:bg-[var(--google-blue-primary)]/20 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                    title={language === 'vi' ? 'Lên lịch hẹn với người này' : 'Schedule appointment'}
                  >
                    <CalendarPlus className="w-4 h-4" />
                  </button>
                </div>

                {/* Sub details: Email & Phone */}
                <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-1 border-t border-[var(--border-grid)]/60">
                  <div
                    onClick={() => handleCopyEmail(contact.email)}
                    className="flex items-center gap-1 hover:text-[var(--google-blue)] cursor-pointer truncate max-w-[200px]"
                    title="Nhấp để sao chép email"
                  >
                    <Mail className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{contact.email}</span>
                  </div>

                  <div className="flex items-center gap-1 font-mono">
                    <Phone className="w-3 h-3 flex-shrink-0" />
                    <span>{contact.phone}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
