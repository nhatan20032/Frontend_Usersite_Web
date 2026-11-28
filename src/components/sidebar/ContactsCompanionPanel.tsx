import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { contactApi } from '../../api/contactApi';
import type { UserLookupResult } from '../../api/contactApi';
import { syncHubClient } from '../../services/syncHubClient';
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  CalendarPlus,
  X,
  UserPlus,
  UserCheck,
  Clock,
  Trash2,
  Edit2,
  Unlink,
  AlertCircle,
  Loader2,
  Info,
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
  connectionStatus?: 'NONE' | 'PENDING' | 'OUTGOING' | 'INCOMING' | 'CONNECTED';
  friendUserId?: string;
}

interface ContactsCompanionPanelProps {
  onClose?: () => void;
}

export const ContactsCompanionPanel: React.FC<ContactsCompanionPanelProps> = ({ onClose: _onClose }) => {
  const { currentUser } = useAuth();
  const { openModal, showToast, refreshFriends } = useApp();
  const { language } = useLanguage();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const mapContacts = (remoteContacts: any[]) => {
    const colors = ['#1A73E8', '#8430CE', '#E37400', '#1E8E3E', '#D93025', '#00838F'];
    return remoteContacts.map((c, i) => ({
      id: c.id,
      name: c.name,
      email: c.email || '',
      phone: c.phoneNumber || 'Chưa cập nhật',
      role: c.role || 'Người liên hệ',
      group: c.group || 'work',
      avatarBg: c.avatarBg || colors[i % colors.length],
      status: c.status || 'offline',
      connectionStatus: c.connectionStatus || 'NONE',
      friendUserId: c.friendUserId,
    }));
  };

  const loadContacts = () => {
    if (!currentUser) return;
    contactApi
      .getContacts()
      .then((remoteContacts) => {
        if (remoteContacts) {
          setContacts(mapContacts(remoteContacts));
        }
      })
      .catch((e: Error) => showToast('Không tải được danh bạ', e.message, 'error'));
  };

  // Sync contacts with backend & listen to SignalR changes
  useEffect(() => {
    setContacts([]);
    if (!currentUser) return;
    loadContacts();

    const unsub = syncHubClient.onDataChanged((event) => {
      if (event.entityType === 'contact') {
        loadContacts();
      }
    });

    return () => unsub();
  }, [currentUser]);

  const [search, setSearch] = useState('');
  const [filterGroup, setFilterGroup] = useState<'all' | 'work' | 'client' | 'personal'>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form add/edit contact
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [roleInput, setRoleInput] = useState('');
  const [groupInput, setGroupInput] = useState<'work' | 'client' | 'personal'>('work');

  // Search & Connect Friend State
  const [friendEmailSearch, setFriendEmailSearch] = useState('');
  const [isSearchingUser, setIsSearchingUser] = useState(false);
  const [searchUserResult, setSearchUserResult] = useState<UserLookupResult | null>(null);
  const [isSendingFriendRequest, setIsSendingFriendRequest] = useState(false);
  const [addMode, setAddMode] = useState<'find-friend' | 'manual'>('find-friend');

  const handleSearchUser = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const email = friendEmailSearch.trim();
    if (!email) return;
    setIsSearchingUser(true);
    setSearchUserResult(null);
    try {
      const res = await contactApi.lookupUser(email);
      setSearchUserResult(res);
    } catch (err) {
      showToast('Lỗi tìm kiếm', err instanceof Error ? err.message : 'Không thể tra cứu tài khoản', 'error');
    } finally {
      setIsSearchingUser(false);
    }
  };

  const handleSendFriendRequest = async () => {
    if (!searchUserResult?.userId) return;
    setIsSendingFriendRequest(true);
    try {
      const res = await contactApi.sendFriendRequest(searchUserResult.userId);
      setSearchUserResult((prev) => (prev ? { ...prev, connectionStatus: 'OUTGOING', isIncomingRequest: false } : null));
      showToast('Thành công', res.message || 'Đã gửi lời mời kết bạn!', 'success');
      loadContacts();
    } catch (err) {
      showToast('Không thể gửi lời mời', err instanceof Error ? err.message : 'Lỗi hệ thống', 'error');
    } finally {
      setIsSendingFriendRequest(false);
    }
  };

  const handleAcceptFriendDirect = async (targetUserId: string, targetName?: string) => {
    try {
      await contactApi.acceptFriend(targetUserId);
      setSearchUserResult((prev) => (prev ? { ...prev, connectionStatus: 'CONNECTED', isIncomingRequest: false } : null));
      await refreshFriends();
      loadContacts();
      showToast(
        language === 'vi' ? 'Đã kết bạn thành công' : 'Connected',
        language === 'vi' ? `Lịch của ${targetName || 'bạn bè'} đã được đồng bộ vào lịch của bạn.` : 'Calendar shared successfully',
        'success'
      );
    } catch (err) {
      showToast('Không thể chấp nhận kết bạn', err instanceof Error ? err.message : 'Lỗi hệ thống', 'error');
    }
  };

  const startEdit = (c: Contact) => {
    setEditingContact(c);
    setNameInput(c.name);
    setEmailInput(c.email);
    setPhoneInput(c.phone === 'Chưa cập nhật' ? '' : c.phone);
    setRoleInput(c.role);
    setGroupInput(c.group);
    setIsAddOpen(true);
  };

  const cancelForm = () => {
    setEditingContact(null);
    setNameInput('');
    setEmailInput('');
    setPhoneInput('');
    setRoleInput('');
    setGroupInput('work');
    setFriendEmailSearch('');
    setSearchUserResult(null);
    setAddMode('find-friend');
    setIsAddOpen(false);
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !emailInput.trim()) return;

    try {
      if (editingContact) {
        const updated = await contactApi.updateContact(editingContact.id, {
          name: nameInput.trim(),
          email: emailInput.trim(),
          phoneNumber: phoneInput.trim(),
          role: roleInput.trim(),
          group: groupInput,
        });
        setContacts((prev) =>
          prev.map((c) =>
            c.id === editingContact.id
              ? {
                  ...c,
                  name: updated.name,
                  email: updated.email || '',
                  phone: updated.phoneNumber || 'Chưa cập nhật',
                  role: updated.role || '',
                  group: updated.group || groupInput,
                }
              : c
          )
        );
        showToast('Đã cập nhật', updated.name, 'success');
      } else {
        const saved = await contactApi.createContact({
          name: nameInput.trim(),
          email: emailInput.trim(),
          phoneNumber: phoneInput.trim(),
          role: roleInput.trim(),
          group: groupInput,
        });
        setContacts((prev) => [
          {
            id: saved.id,
            name: saved.name,
            email: saved.email || '',
            phone: saved.phoneNumber || 'Chưa cập nhật',
            role: saved.role || '',
            group: groupInput,
            avatarBg: '#1A73E8',
            status: 'offline',
            connectionStatus: saved.connectionStatus || 'NONE',
            friendUserId: saved.friendUserId,
          },
          ...prev.filter((c) => c.id !== saved.id),
        ]);
        showToast('Đã thêm liên hệ', saved.name, 'success');
      }
      cancelForm();
    } catch (e) {
      showToast('Thao tác không thành công', (e as Error).message, 'error');
    }
  };

  const handleDeleteContact = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa liên hệ "${name}"?`)) return;
    try {
      await contactApi.deleteContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      showToast('Đã xóa liên hệ', name, 'info');
    } catch (e) {
      showToast('Không thể xóa liên hệ', (e as Error).message, 'error');
    }
  };

  // Friendship connection handlers
  const handleRequestConnect = async (c: Contact) => {
    try {
      const res = await contactApi.requestConnect(c.id);
      setContacts((prev) =>
        prev.map((item) =>
          item.id === c.id ? { ...item, connectionStatus: res.contact.connectionStatus || 'PENDING' } : item
        )
      );
      showToast('Đã gửi lời mời', res.message || 'Chờ bạn bè đồng ý chia sẻ lịch', 'success');
    } catch (e) {
      showToast('Không thể gửi lời mời', (e as Error).message, 'error');
    }
  };

  const handleAcceptConnect = async (c: Contact) => {
    try {
      await contactApi.acceptConnect(c.id);
      setContacts((prev) =>
        prev.map((item) =>
          item.id === c.id ? { ...item, connectionStatus: 'CONNECTED' } : item
        )
      );
      await refreshFriends();
      loadContacts();
      showToast(
        language === 'vi' ? 'Đã kết bạn thành công' : 'Connected',
        language === 'vi' ? `Lịch của ${c.name} đã được thêm vào mục Lịch khác của bạn.` : `Calendar shared with ${c.name}`,
        'success'
      );
    } catch (e) {
      showToast('Không thể chấp nhận kết nối', (e as Error).message, 'error');
    }
  };

  const handleDisconnect = async (c: Contact) => {
    const isPendingOutgoing = c.connectionStatus === 'OUTGOING' || c.connectionStatus === 'PENDING';
    const isPendingIncoming = c.connectionStatus === 'INCOMING';
    const confirmMsg = isPendingOutgoing
      ? `Thu hồi lời mời kết bạn gửi tới ${c.name}?`
      : isPendingIncoming
      ? `Từ chối lời mời kết bạn từ ${c.name}?`
      : `Hủy kết bạn với ${c.name}? Lịch của đối phương sẽ bị ẩn khỏi lịch của bạn.`;

    if (!window.confirm(confirmMsg)) return;
    try {
      await contactApi.disconnect(c.id);
      setContacts((prev) =>
        prev.map((item) =>
          item.id === c.id ? { ...item, connectionStatus: 'NONE' } : item
        )
      );
      await refreshFriends();
      loadContacts();
      showToast(
        isPendingOutgoing ? 'Đã thu hồi lời mời' : isPendingIncoming ? 'Đã từ chối lời mời' : 'Đã hủy kết bạn',
        c.name,
        'info'
      );
    } catch (e) {
      showToast('Thao tác không thành công', (e as Error).message, 'error');
    }
  };

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
    showToast(language === 'vi' ? 'Đã sao chép email' : 'Email Copied', email, 'info');
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
              {contacts.length} {language === 'vi' ? 'người liên hệ & bạn bè' : 'contacts & friends'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              if (isAddOpen && !editingContact) {
                cancelForm();
              } else {
                setEditingContact(null);
                setNameInput('');
                setEmailInput('');
                setPhoneInput('');
                setRoleInput('');
                setGroupInput('work');
                setIsAddOpen(true);
              }
            }}
            className="p-1.5 hover:bg-[var(--surface-container-high)] rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            title={language === 'vi' ? 'Thêm liên hệ mới' : 'Add new contact'}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Add / Edit Contact Drawer */}
      {isAddOpen && (
        <div className="bg-[var(--surface-container)] border border-[#3A3B3D] p-3 rounded-xl space-y-3 animate-in fade-in zoom-in-95 duration-150 flex-shrink-0 text-xs">
          <div className="flex items-center justify-between font-semibold text-xs text-[var(--google-blue)] border-b border-[var(--border-grid)] pb-2">
            <span className="flex items-center gap-1.5">
              {editingContact ? (
                <>
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{language === 'vi' ? 'Chỉnh sửa liên hệ' : 'Edit Contact'}</span>
                </>
              ) : addMode === 'find-friend' ? (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{language === 'vi' ? 'Thêm bạn bè qua Email' : 'Add Friend by Email'}</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'vi' ? 'Thêm liên hệ ngoài' : 'Add Manual Contact'}</span>
                </>
              )}
            </span>
            <button
              type="button"
              onClick={cancelForm}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* CHẾ ĐỘ 1: TÌM BẠN BÈ THEO EMAIL (MẶC ĐỊNH KHI THÊM MỚI) */}
          {!editingContact && addMode === 'find-friend' && (
            <div className="space-y-3">
              <form onSubmit={handleSearchUser} className="space-y-2">
                <div className="relative flex items-center">
                  <input
                    type="email"
                    required
                    placeholder={language === 'vi' ? 'Nhập email tài khoản bạn bè...' : 'Enter friend email...'}
                    value={friendEmailSearch}
                    onChange={(e) => {
                      setFriendEmailSearch(e.target.value);
                      if (searchUserResult) setSearchUserResult(null);
                    }}
                    className="w-full bg-[#161718] border border-[var(--border-grid)] rounded-lg pl-3 pr-20 py-2 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--google-blue)]"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={isSearchingUser || !friendEmailSearch.trim()}
                    className="absolute right-1 top-1 bottom-1 px-3 bg-[var(--google-blue)] hover:bg-[#A8C7FA] text-black font-semibold rounded-md text-xs flex items-center gap-1 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    {isSearchingUser ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Search className="w-3.5 h-3.5" />
                    )}
                    <span>{language === 'vi' ? 'Tìm' : 'Search'}</span>
                  </button>
                </div>
              </form>

              {/* Trạng thái 1: Chưa tìm kiếm */}
              {!searchUserResult && !isSearchingUser && (
                <div className="p-2.5 bg-[#161718] border border-[var(--border-grid)]/60 rounded-lg text-[11px] text-[var(--text-muted)] flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-[var(--google-blue)] shrink-0 mt-0.5" />
                  <p>
                    {language === 'vi'
                      ? 'Nhập email tài khoản RoutinePulse để hệ thống xác thực sự tồn tại trước khi gửi lời mời kết bạn.'
                      : 'Search user email on RoutinePulse to preview profile and connect.'}
                  </p>
                </div>
              )}

              {/* Trạng thái 2: Không tìm thấy tài khoản */}
              {searchUserResult && !searchUserResult.exists && (
                <div className="p-3 bg-[#E37400]/15 border border-[#E37400]/30 rounded-xl text-xs text-[#FDD663] space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#E37400]" />
                    <span>{language === 'vi' ? 'Không tìm thấy tài khoản' : 'User not found'}</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    {language === 'vi'
                      ? `Không có tài khoản nào đăng ký với email "${friendEmailSearch}". Hãy chắc chắn bạn bè đã tạo tài khoản để có thể chia sẻ lịch.`
                      : 'No user registered with this email.'}
                  </p>
                </div>
              )}

              {/* Trạng thái 3: Tìm thấy chính mình */}
              {searchUserResult?.isSelf && (
                <div className="p-3 bg-[var(--google-blue-primary)]/15 border border-[var(--google-blue-primary)]/30 rounded-xl text-xs text-[var(--google-blue)] flex items-center gap-2 animate-in fade-in zoom-in-95 duration-150">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>{language === 'vi' ? 'Đây là tài khoản của bạn, không thể tự kết bạn.' : 'This is your own account.'}</span>
                </div>
              )}

              {/* Trạng thái 4: Tìm thấy tài khoản bạn bè */}
              {searchUserResult?.exists && !searchUserResult.isSelf && (
                <div className="p-3 bg-[#1B1C1E] border border-[var(--border-grid)] rounded-xl space-y-3 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--google-blue-primary)] flex items-center justify-center font-bold text-sm text-white shadow-xs shrink-0">
                      {getInitials(searchUserResult.fullName || searchUserResult.email || 'RP')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-xs text-[var(--text-primary)] truncate">
                        {searchUserResult.fullName}
                      </h4>
                      <p className="text-[11px] text-[var(--text-muted)] truncate">{searchUserResult.email}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[var(--border-grid)] flex items-center justify-between">
                    {searchUserResult.connectionStatus === 'CONNECTED' ? (
                      <span className="text-[11px] text-[#81C995] font-medium flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{language === 'vi' ? 'Đã là bạn bè (Đang chia sẻ lịch)' : 'Connected'}</span>
                      </span>
                    ) : searchUserResult.connectionStatus === 'OUTGOING' || (searchUserResult.connectionStatus === 'PENDING' && !searchUserResult.isIncomingRequest) ? (
                      <span className="text-[11px] text-[#FDD663] font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{language === 'vi' ? 'Đã gửi lời mời (Chờ bạn bè đồng ý)' : 'Request pending'}</span>
                      </span>
                    ) : (searchUserResult.connectionStatus === 'INCOMING' || searchUserResult.isIncomingRequest) ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (searchUserResult.userId) {
                            handleAcceptFriendDirect(searchUserResult.userId, searchUserResult.fullName);
                          } else if (searchUserResult.contactId) {
                            handleAcceptConnect({ id: searchUserResult.contactId, name: searchUserResult.fullName || '' } as any);
                          }
                        }}
                        className="bg-[#1E8E3E] hover:bg-[#1B7E37] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer ml-auto"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{language === 'vi' ? 'Chấp nhận kết bạn' : 'Accept Friend'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendFriendRequest}
                        disabled={isSendingFriendRequest}
                        className="bg-[var(--google-blue)] hover:bg-[#A8C7FA] text-black px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-50 cursor-pointer ml-auto"
                      >
                        {isSendingFriendRequest ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>{language === 'vi' ? 'Đang gửi...' : 'Sending...'}</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>{language === 'vi' ? 'Gửi lời mời kết bạn' : 'Add Friend'}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Chuyển đổi sang nhập thủ công nếu muốn */}
              <div className="pt-2 border-t border-[var(--border-grid)]/60 text-right">
                <button
                  type="button"
                  onClick={() => setAddMode('manual')}
                  className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:underline cursor-pointer"
                >
                  {language === 'vi' ? '+ Lưu liên hệ ngoài danh bạ' : '+ Add offline contact'}
                </button>
              </div>
            </div>
          )}

          {/* CHẾ ĐỘ 2: FORM THỦ CÔNG HOẶC CHẾ ĐỘ SỬA */}
          {(editingContact || addMode === 'manual') && (
            <form onSubmit={handleSaveContact} className="space-y-2.5">
              <input
                type="text"
                required
                placeholder={language === 'vi' ? 'Họ và tên *' : 'Full Name *'}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-[#161718] border border-[var(--border-grid)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--google-blue)]"
                autoFocus
              />

              <input
                type="email"
                required
                placeholder={language === 'vi' ? 'Địa chỉ Email *' : 'Email address *'}
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-[#161718] border border-[var(--border-grid)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--google-blue)]"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder={language === 'vi' ? 'Số điện thoại' : 'Phone'}
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full bg-[#161718] border border-[var(--border-grid)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--google-blue)]"
                />
                <input
                  type="text"
                  placeholder={language === 'vi' ? 'Chức vụ / Đơn vị' : 'Role'}
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  className="w-full bg-[#161718] border border-[var(--border-grid)] rounded-lg px-2.5 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--google-blue)]"
                />
              </div>

              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[11px] text-[var(--text-muted)]">{language === 'vi' ? 'Nhóm:' : 'Group:'}</span>
                {(['work', 'client', 'personal'] as const).map((grp) => (
                  <button
                    key={grp}
                    type="button"
                    onClick={() => setGroupInput(grp)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium border cursor-pointer ${
                      groupInput === grp
                        ? 'bg-[var(--surface-container-high)] text-[var(--google-blue)] border-[var(--google-blue)]'
                        : 'text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {grp === 'work' ? 'Đồng nghiệp' : grp === 'client' ? 'Khách hàng' : 'Cá nhân'}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1">
                {!editingContact && (
                  <button
                    type="button"
                    onClick={() => setAddMode('find-friend')}
                    className="text-[11px] text-[var(--google-blue)] hover:underline cursor-pointer"
                  >
                    {language === 'vi' ? '← Tìm bạn bè qua Email' : '← Find by email'}
                  </button>
                )}
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={cancelForm}
                    className="px-2.5 py-1 rounded text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                  >
                    {language === 'vi' ? 'Hủy' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded text-xs font-semibold bg-[#1E8E3E] text-white hover:bg-[#1B7E37] cursor-pointer shadow-xs"
                  >
                    {language === 'vi' ? (editingContact ? 'Cập nhật' : 'Lưu liên hệ') : 'Save'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
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
            const isConnected = contact.connectionStatus === 'CONNECTED';
            const isIncoming = contact.connectionStatus === 'INCOMING';
            const isOutgoing = contact.connectionStatus === 'OUTGOING' || contact.connectionStatus === 'PENDING';

            return (
              <div
                key={contact.id}
                className="bg-[var(--surface-container)] hover:bg-[#252628] border border-[var(--border-grid)] hover:border-[#3C4043] p-2.5 rounded-xl transition-all group space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
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
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-semibold text-xs text-[var(--text-primary)] truncate">
                          {contact.name}
                        </h4>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full border ${badge.color} font-medium flex-shrink-0`}
                        >
                          {badge.label}
                        </span>

                        {/* Connection status badge */}
                        {isConnected ? (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#1E8E3E]/20 text-[#81C995] border border-[#1E8E3E]/40 font-medium flex items-center gap-1">
                            <UserCheck className="w-2.5 h-2.5" />
                            <span>{language === 'vi' ? 'Bạn bè' : 'Friend'}</span>
                          </span>
                        ) : isIncoming ? (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#8430CE]/20 text-[#C58AF9] border border-[#8430CE]/40 font-medium flex items-center gap-1">
                            <Mail className="w-2.5 h-2.5" />
                            <span>{language === 'vi' ? 'Lời mời kết bạn' : 'Friend Request'}</span>
                          </span>
                        ) : isOutgoing ? (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#E37400]/20 text-[#FDD663] border border-[#E37400]/40 font-medium flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{language === 'vi' ? 'Đang chờ đồng ý' : 'Pending'}</span>
                          </span>
                        ) : null}
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] truncate">{contact.role}</p>
                    </div>
                  </div>

                  {/* Actions: Edit, Delete, Schedule */}
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <button
                      onClick={() => startEdit(contact)}
                      className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-container-high)] rounded transition-colors cursor-pointer"
                      title={language === 'vi' ? 'Chỉnh sửa' : 'Edit'}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteContact(contact.id, contact.name)}
                      className="p-1 text-[var(--text-muted)] hover:text-[#F28B82] hover:bg-[var(--surface-container-high)] rounded transition-colors cursor-pointer"
                      title={language === 'vi' ? 'Xóa liên hệ' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleScheduleWithContact(contact)}
                      className="p-1 text-[var(--google-blue)] hover:bg-[var(--google-blue-primary)]/20 rounded transition-colors cursor-pointer"
                      title={language === 'vi' ? 'Lên lịch hẹn với người này' : 'Schedule appointment'}
                    >
                      <CalendarPlus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Sub details: Email & Phone */}
                <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] pt-1 border-t border-[var(--border-grid)]/60">
                  <div
                    onClick={() => handleCopyEmail(contact.email)}
                    className="flex items-center gap-1 hover:text-[var(--google-blue)] cursor-pointer truncate max-w-[170px]"
                    title="Nhấp để sao chép email"
                  >
                    <Mail className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{contact.email}</span>
                  </div>

                  <div className="flex items-center gap-1 font-mono text-[10px]">
                    <Phone className="w-3 h-3 flex-shrink-0" />
                    <span>{contact.phone}</span>
                  </div>
                </div>

                {/* Friendship & Calendar Sharing Action Bar */}
                <div className="flex items-center justify-between pt-1 border-t border-[var(--border-grid)]/40 text-[11px]">
                  {isConnected ? (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] text-[#81C995] flex items-center gap-1 font-medium">
                        ✓ {language === 'vi' ? 'Bạn bè (Lịch đang được chia sẻ)' : 'Friends (Calendar shared)'}
                      </span>
                      <button
                        onClick={() => handleDisconnect(contact)}
                        className="text-[10px] text-[var(--text-muted)] hover:text-[#F28B82] flex items-center gap-1 hover:underline cursor-pointer"
                        title={language === 'vi' ? 'Hủy kết bạn' : 'Unfriend'}
                      >
                        <Unlink className="w-3 h-3" />
                        <span>{language === 'vi' ? 'Hủy kết bạn' : 'Unfriend'}</span>
                      </button>
                    </div>
                  ) : isIncoming ? (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] text-[#C58AF9] font-medium">
                        {language === 'vi' ? 'Đã gửi lời mời kết bạn' : 'Sent you a friend request'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleDisconnect(contact)}
                          className="text-[10px] text-[var(--text-muted)] hover:text-[#F28B82] px-2 py-0.5 rounded cursor-pointer"
                        >
                          {language === 'vi' ? 'Từ chối' : 'Decline'}
                        </button>
                        <button
                          onClick={() => handleAcceptConnect(contact)}
                          className="text-[10px] bg-[#1E8E3E] hover:bg-[#1B7E37] text-white px-2.5 py-1 rounded font-semibold cursor-pointer shadow-xs flex items-center gap-1"
                        >
                          <UserCheck className="w-3 h-3" />
                          <span>{language === 'vi' ? 'Chấp nhận kết bạn' : 'Accept'}</span>
                        </button>
                      </div>
                    </div>
                  ) : isOutgoing ? (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] text-[#FDD663] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{language === 'vi' ? 'Đang chờ đối phương chấp nhận' : 'Waiting for response'}</span>
                      </span>
                      <button
                        onClick={() => handleDisconnect(contact)}
                        className="text-[10px] text-[var(--text-muted)] hover:text-[#F28B82] hover:underline cursor-pointer"
                        title={language === 'vi' ? 'Thu hồi lời mời kết bạn' : 'Cancel request'}
                      >
                        <span>{language === 'vi' ? 'Thu hồi' : 'Cancel'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end w-full">
                      <button
                        onClick={() => handleRequestConnect(contact)}
                        className="text-[10px] text-[var(--google-blue)] hover:text-[#A8C7FA] hover:bg-[var(--google-blue-primary)]/15 px-2 py-0.5 rounded transition-colors flex items-center gap-1 cursor-pointer"
                        title={language === 'vi' ? 'Gửi lời mời kết bạn' : 'Add friend'}
                      >
                        <UserPlus className="w-3 h-3" />
                        <span>{language === 'vi' ? 'Kết bạn' : 'Add Friend'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
