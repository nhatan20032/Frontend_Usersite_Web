import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  CalendarPlus,
  X,
} from 'lucide-react';

export interface MockContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  group: 'work' | 'client' | 'personal';
  avatarBg: string;
  status: 'online' | 'busy' | 'offline';
}

const DEFAULT_CONTACTS: MockContact[] = [
  {
    id: 'c1',
    name: 'TS. Trần Minh Hoàng',
    email: 'hoang.tran@bachkhoa.edu.vn',
    phone: '0912 345 678',
    role: 'Giảng viên Hướng dẫn Đồ án',
    group: 'work',
    avatarBg: '#1A73E8',
    status: 'online',
  },
  {
    id: 'c2',
    name: 'Lê Thu Trang (Product Lead)',
    email: 'trang.le@routinepulse.com',
    phone: '0988 765 432',
    role: 'Quản lý Sản phẩm RoutinePulse',
    group: 'work',
    avatarBg: '#8430CE',
    status: 'busy',
  },
  {
    id: 'c3',
    name: 'Nguyễn Đăng Khoa',
    email: 'khoa.nd@alphatech.vn',
    phone: '0903 112 233',
    role: 'Đối tác Công nghệ AlphaTech',
    group: 'client',
    avatarBg: '#E37400',
    status: 'online',
  },
  {
    id: 'c4',
    name: 'Phạm Mai Hương',
    email: 'huong.mai@vnu.edu.vn',
    phone: '0977 445 566',
    role: 'Nghiên cứu viên AI Lab',
    group: 'work',
    avatarBg: '#1E8E3E',
    status: 'offline',
  },
  {
    id: 'c5',
    name: 'Đặng Tuấn Anh',
    email: 'tuananh.dang@gmail.com',
    phone: '0934 998 877',
    role: 'Bạn thân & Đồng nghiệp Gym',
    group: 'personal',
    avatarBg: '#D93025',
    status: 'online',
  },
  {
    id: 'c6',
    name: 'Vũ Hải Yến (Design Lead)',
    email: 'yen.vu@creativestudio.com',
    phone: '0945 667 788',
    role: 'Chuyên gia Thiết kế UI/UX',
    group: 'client',
    avatarBg: '#00838F',
    status: 'busy',
  },
];

interface ContactsCompanionPanelProps {
  onClose?: () => void;
}

export const ContactsCompanionPanel: React.FC<ContactsCompanionPanelProps> = ({ onClose: _onClose }) => {
  const { openModal, showToast } = useApp();
  const { language } = useLanguage();

  const [contacts, setContacts] = useState<MockContact[]>(() => {
    const saved = localStorage.getItem('routinepulse_contacts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_CONTACTS;
      }
    }
    return DEFAULT_CONTACTS;
  });

  useEffect(() => {
    localStorage.setItem('routinepulse_contacts', JSON.stringify(contacts));
  }, [contacts]);

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

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const colors = ['#1A73E8', '#8430CE', '#E37400', '#1E8E3E', '#D93025', '#00838F'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const created: MockContact = {
      id: 'contact_' + Date.now(),
      name: newName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim() || 'Chưa cập nhật',
      role: newRole.trim() || 'Người liên hệ',
      group: newGroup,
      avatarBg: randomColor,
      status: 'online',
    };

    setContacts((prev) => [created, ...prev]);
    setIsAddOpen(false);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewRole('');

    showToast(
      language === 'vi' ? 'Thêm liên hệ thành công' : 'Contact Added',
      language === 'vi' ? `Đã lưu ${created.name} vào danh bạ.` : `Added ${created.name} to contacts.`,
      'success'
    );
  };

  const handleScheduleWithContact = (contact: MockContact) => {
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

  const getGroupBadge = (group: MockContact['group']) => {
    switch (group) {
      case 'work':
        return { label: language === 'vi' ? 'Đồng nghiệp' : 'Work', color: 'bg-[#1A73E8]/15 text-[#8AB4F8] border-[#1A73E8]/30' };
      case 'client':
        return { label: language === 'vi' ? 'Khách hàng' : 'Client', color: 'bg-[#E37400]/15 text-[#FDD663] border-[#E37400]/30' };
      case 'personal':
        return { label: language === 'vi' ? 'Cá nhân' : 'Personal', color: 'bg-[#1E8E3E]/15 text-[#81C995] border-[#1E8E3E]/30' };
    }
  };

  return (
    <div className="w-full h-full flex flex-col space-y-3 select-none text-[#E3E2E3] overflow-hidden">
      {/* 1. Header */}
      <div className="flex items-center justify-between border-b border-[#2A2B2D] pb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#1E8E3E] flex items-center justify-center text-white shadow-xs">
            <Users className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[#E3E2E3]">
              {language === 'vi' ? 'Google Contacts' : 'Google Contacts'}
            </h3>
            <p className="text-[10px] text-[#70757A]">
              {contacts.length} {language === 'vi' ? 'người liên hệ & nhóm' : 'contacts & groups'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsAddOpen(!isAddOpen)}
            className="p-1.5 hover:bg-[#28292A] rounded-full text-[#9AA0A6] hover:text-[#E3E2E3] transition-colors cursor-pointer"
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
          className="bg-[#1F2021] border border-[#3A3B3D] p-3 rounded-xl space-y-2.5 animate-in fade-in zoom-in-95 duration-150 flex-shrink-0 text-xs"
        >
          <div className="flex items-center justify-between font-semibold text-xs text-[#8AB4F8]">
            <span>{language === 'vi' ? 'Thêm người liên hệ mới' : 'New Contact'}</span>
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="text-[#9AA0A6] hover:text-[#E3E2E3] cursor-pointer"
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
            className="w-full bg-[#161718] border border-[#2A2B2D] rounded-lg px-2.5 py-1.5 text-xs text-[#E3E2E3] focus:outline-none focus:border-[#8AB4F8]"
            autoFocus
          />

          <input
            type="email"
            required
            placeholder={language === 'vi' ? 'Địa chỉ Email *' : 'Email address *'}
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full bg-[#161718] border border-[#2A2B2D] rounded-lg px-2.5 py-1.5 text-xs text-[#E3E2E3] focus:outline-none focus:border-[#8AB4F8]"
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder={language === 'vi' ? 'Số điện thoại' : 'Phone'}
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="w-full bg-[#161718] border border-[#2A2B2D] rounded-lg px-2.5 py-1.5 text-xs text-[#E3E2E3] focus:outline-none focus:border-[#8AB4F8]"
            />
            <input
              type="text"
              placeholder={language === 'vi' ? 'Chức vụ / Đơn vị' : 'Role'}
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full bg-[#161718] border border-[#2A2B2D] rounded-lg px-2.5 py-1.5 text-xs text-[#E3E2E3] focus:outline-none focus:border-[#8AB4F8]"
            />
          </div>

          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[10px] text-[#70757A]">{language === 'vi' ? 'Nhóm:' : 'Group:'}</span>
            {(['work', 'client', 'personal'] as const).map((grp) => (
              <button
                key={grp}
                type="button"
                onClick={() => setNewGroup(grp)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium border cursor-pointer ${
                  newGroup === grp
                    ? 'bg-[#28292A] text-[#8AB4F8] border-[#8AB4F8]'
                    : 'text-[#9AA0A6] border-[#333538] hover:text-[#E3E2E3]'
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
              className="px-2.5 py-1 rounded text-xs text-[#9AA0A6] hover:text-[#E3E2E3] cursor-pointer"
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
        <Search className="w-3.5 h-3.5 text-[#70757A] absolute left-2.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={language === 'vi' ? 'Tìm liên hệ theo tên, email...' : 'Search contacts...'}
          className="w-full bg-[#1F2021] border border-[#2A2B2D] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#E3E2E3] placeholder-[#70757A] focus:outline-none focus:border-[#1E8E3E]"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#70757A] hover:text-[#E3E2E3]"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* 4. Group Filter Tabs */}
      <div className="flex items-center gap-1 text-[11px] border-b border-[#2A2B2D] pb-2 flex-shrink-0 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setFilterGroup('all')}
          className={`px-2 py-1 rounded-md transition-colors cursor-pointer font-medium whitespace-nowrap ${
            filterGroup === 'all'
              ? 'bg-[#28292A] text-[#81C995]'
              : 'text-[#9AA0A6] hover:text-[#E3E2E3]'
          }`}
        >
          {language === 'vi' ? 'Tất cả' : 'All'} ({contacts.length})
        </button>
        <button
          onClick={() => setFilterGroup('work')}
          className={`px-2 py-1 rounded-md transition-colors cursor-pointer font-medium whitespace-nowrap ${
            filterGroup === 'work'
              ? 'bg-[#28292A] text-[#8AB4F8]'
              : 'text-[#9AA0A6] hover:text-[#E3E2E3]'
          }`}
        >
          {language === 'vi' ? 'Đồng nghiệp' : 'Work'}
        </button>
        <button
          onClick={() => setFilterGroup('client')}
          className={`px-2 py-1 rounded-md transition-colors cursor-pointer font-medium whitespace-nowrap ${
            filterGroup === 'client'
              ? 'bg-[#28292A] text-[#FDD663]'
              : 'text-[#9AA0A6] hover:text-[#E3E2E3]'
          }`}
        >
          {language === 'vi' ? 'Khách hàng' : 'Client'}
        </button>
        <button
          onClick={() => setFilterGroup('personal')}
          className={`px-2 py-1 rounded-md transition-colors cursor-pointer font-medium whitespace-nowrap ${
            filterGroup === 'personal'
              ? 'bg-[#28292A] text-[#81C995]'
              : 'text-[#9AA0A6] hover:text-[#E3E2E3]'
          }`}
        >
          {language === 'vi' ? 'Cá nhân' : 'Personal'}
        </button>
      </div>

      {/* 5. Contact List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {filteredContacts.length === 0 ? (
          <div className="bg-[#1F2021] border border-[#2A2B2D] p-6 text-center rounded-xl space-y-2 mt-4">
            <Users className="w-8 h-8 text-[#70757A] mx-auto" />
            <p className="text-xs text-[#9AA0A6]">
              {language === 'vi' ? 'Không tìm thấy người liên hệ nào phù hợp.' : 'No contacts found.'}
            </p>
          </div>
        ) : (
          filteredContacts.map((contact) => {
            const badge = getGroupBadge(contact.group);
            return (
              <div
                key={contact.id}
                className="bg-[#1F2021] hover:bg-[#252628] border border-[#2A2B2D] hover:border-[#3C4043] p-2.5 rounded-xl transition-all group space-y-1.5"
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
                        className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#1F2021] ${
                          contact.status === 'online'
                            ? 'bg-[#1E8E3E]'
                            : contact.status === 'busy'
                            ? 'bg-[#E37400]'
                            : 'bg-[#70757A]'
                        }`}
                        title={contact.status}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-semibold text-xs text-[#E3E2E3] truncate">
                          {contact.name}
                        </h4>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded-full border ${badge.color} font-medium flex-shrink-0`}
                        >
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#9AA0A6] truncate">{contact.role}</p>
                    </div>
                  </div>

                  {/* Quick Action Button: Schedule Appointment */}
                  <button
                    onClick={() => handleScheduleWithContact(contact)}
                    className="p-1.5 text-[#8AB4F8] hover:bg-[#1A73E8]/20 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                    title={language === 'vi' ? 'Lên lịch hẹn với người này' : 'Schedule appointment'}
                  >
                    <CalendarPlus className="w-4 h-4" />
                  </button>
                </div>

                {/* Sub details: Email & Phone */}
                <div className="flex items-center justify-between text-[10px] text-[#70757A] pt-1 border-t border-[#2A2B2D]/60">
                  <div
                    onClick={() => handleCopyEmail(contact.email)}
                    className="flex items-center gap-1 hover:text-[#8AB4F8] cursor-pointer truncate max-w-[200px]"
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
