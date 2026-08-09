import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import type { ThemeName } from '../../types';
import {
  X,
  Settings,
  User,
  Palette,
  Bell,
  Smartphone,
  CreditCard,
  Check,
  Crown,
} from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { currentUser, currentRole, updateProfile } = useAuth();
  const { activeModal, closeModal, currentTheme, setTheme, showToast, openModal } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'notifications' | 'devices' | 'billing'>('profile');
  const [name, setName] = useState<string>(currentUser?.name || 'Nguyễn Văn An');
  const [email, setEmail] = useState<string>(currentUser?.email || 'an.nguyen@routinepulse.com');
  const [phone, setPhone] = useState<string>(currentUser?.phone || '0987 654 321');

  if (activeModal !== 'settings') return null;

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(name, email, phone);
    closeModal();
    showToast('Cập nhật thành công', 'Thông tin hồ sơ cá nhân đã được lưu.', 'success');
  };

  const themes: { id: ThemeName; name: string; desc: string; previewClass: string }[] = [
    { id: 'default', name: 'Default Light', desc: 'Apple Studio Canvas + Frosted Crystal', previewClass: 'from-slate-100 to-slate-200 border-slate-300' },
    { id: 'dark', name: 'Dark Obsidian', desc: 'Deep OLED + Frosted Smoky Glass (VIP)', previewClass: 'from-slate-900 to-black border-slate-700' },
    { id: 'tet', name: 'Tết Cổ Truyền 2026', desc: 'Đỏ son ấm áp & May mắn thịnh vượng (VIP)', previewClass: 'from-red-50 to-red-100 border-red-300' },
    { id: 'christmas', name: 'Giáng Sinh Tuyết', desc: 'Xanh thông tuyết phủ & Bình an (VIP)', previewClass: 'from-emerald-50 to-emerald-100 border-emerald-300' },
    { id: 'sakura', name: 'Anime Sakura', desc: 'Hồng hoa anh đào rực rỡ & Tươi mới (VIP)', previewClass: 'from-pink-50 to-pink-100 border-pink-300' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="apple-glass-modal max-w-2xl w-full rounded-[28px] overflow-hidden relative shadow-2xl flex flex-col md:flex-row max-h-[85vh]">
        <button
          onClick={closeModal}
          className="absolute top-5 right-5 app-text-muted hover:app-text-primary p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 z-20 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Settings Left Tabs */}
        <div className="w-full md:w-56 apple-glass-surface border-r app-border p-5 space-y-3 flex-shrink-0">
          <div className="flex items-center gap-2 pb-2 border-b app-border">
            <Settings className="w-4 h-4 text-blue-600 dark:text-sky-400" />
            <h3 className="font-bold text-sm app-text-primary">Cài đặt hệ thống</h3>
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left p-2.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'app-text-primary bg-blue-500/10 text-blue-600 dark:text-sky-400 font-bold'
                  : 'app-text-secondary hover:bg-black/5 dark:hover:bg-white/10'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Hồ sơ & Tài khoản</span>
            </button>

            <button
              onClick={() => setActiveTab('appearance')}
              className={`w-full text-left p-2.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'appearance'
                  ? 'app-text-primary bg-blue-500/10 text-blue-600 dark:text-sky-400 font-bold'
                  : 'app-text-secondary hover:bg-black/5 dark:hover:bg-white/10'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Kho giao diện</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full text-left p-2.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'notifications'
                  ? 'app-text-primary bg-blue-500/10 text-blue-600 dark:text-sky-400 font-bold'
                  : 'app-text-secondary hover:bg-black/5 dark:hover:bg-white/10'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Thông báo & Nhắc</span>
            </button>

            <button
              onClick={() => setActiveTab('devices')}
              className={`w-full text-left p-2.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'devices'
                  ? 'app-text-primary bg-blue-500/10 text-blue-600 dark:text-sky-400 font-bold'
                  : 'app-text-secondary hover:bg-black/5 dark:hover:bg-white/10'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Thiết bị đồng bộ</span>
            </button>

            <button
              onClick={() => setActiveTab('billing')}
              className={`w-full text-left p-2.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'billing'
                  ? 'app-text-primary bg-blue-500/10 text-blue-600 dark:text-sky-400 font-bold'
                  : 'app-text-secondary hover:bg-black/5 dark:hover:bg-white/10'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Gói dịch vụ</span>
            </button>
          </nav>
        </div>

        {/* Settings Right Content Area */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-5">
          {/* Tab 1: Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold app-text-primary">Hồ sơ cá nhân</h4>
                <p className="text-xs app-text-muted">Quản lý thông tin định danh và bảo mật tài khoản</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-3.5 text-xs">
                <div className="flex items-center gap-3 pb-2 border-b app-border">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-blue-500/20">
                    {currentUser?.avatarInitial || 'AN'}
                  </div>
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => showToast('Đổi ảnh đại diện', 'Đã mô phỏng cập nhật ảnh đại diện mới.', 'info')}
                      className="apple-glass-pill font-semibold px-3 py-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer"
                    >
                      Thay đổi avatar
                    </button>
                    <p className="text-[10px] app-text-muted">Hỗ trợ định dạng JPG, PNG tối đa 5MB</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold app-text-primary">Họ và tên:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full apple-input px-3.5 py-2 text-xs font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold app-text-primary">Địa chỉ Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full apple-input px-3.5 py-2 text-xs font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold app-text-primary">Số điện thoại:</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full apple-input px-3.5 py-2 text-xs font-sans"
                  />
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="apple-btn-primary font-bold px-5 py-2.5 rounded-2xl shadow-md shadow-blue-500/20 text-xs cursor-pointer"
                  >
                    Lưu thông tin hồ sơ
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 2: Appearance */}
          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold app-text-primary">Kho giao diện (Theme Store)</h4>
                <p className="text-xs app-text-muted">
                  Tùy biến không gian làm việc thích ứng hiệu ứng kính mờ Liquid Glass
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {themes.map((t) => {
                  const isCurrent = currentTheme === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 relative ${
                        isCurrent
                          ? 'border-2 border-blue-500 bg-blue-500/10 shadow-sm'
                          : 'apple-glass-pill hover:border-slate-400'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.previewClass} border shadow-xs flex items-center justify-center flex-shrink-0`}
                      >
                        {isCurrent && <Check className="w-4 h-4 text-blue-600 dark:text-sky-400" />}
                      </div>
                      <div className="space-y-0.5 flex-1">
                        <div className="font-bold app-text-primary flex items-center justify-between">
                          <span>{t.name}</span>
                          {t.id !== 'default' && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded-full">
                              VIP
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] app-text-muted leading-tight">{t.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="text-base font-bold app-text-primary">Kênh thông báo & Nhắc nhở</h4>
                <p className="text-xs app-text-muted">Đa dạng kênh nhắc việc qua App, SMS, Email và Cuộc gọi AI</p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 apple-glass-pill rounded-2xl cursor-pointer">
                  <div className="space-y-0.5">
                    <div className="font-bold app-text-primary">Push Notification trên App</div>
                    <div className="text-[11px] app-text-muted">Nhận thông báo tức thì trên thiết bị</div>
                  </div>
                  <input type="checkbox" defaultChecked disabled className="w-4 h-4 text-blue-600 rounded" />
                </label>

                <label className="flex items-center justify-between p-3 apple-glass-pill rounded-2xl cursor-pointer">
                  <div className="space-y-0.5">
                    <div className="font-bold app-text-primary">Tin nhắn SMS nhắc giờ</div>
                    <div className="text-[11px] app-text-muted">Nhắn tin khi sắp đến giờ sự kiện</div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                </label>

                <label className="flex items-center justify-between p-3 apple-glass-pill rounded-2xl cursor-pointer">
                  <div className="space-y-0.5">
                    <div className="font-bold app-text-primary">Cuộc gọi tự động AI (Voice Call)</div>
                    <div className="text-[11px] app-text-muted">Gọi nhắc nhở sự kiện cực kỳ quan trọng</div>
                  </div>
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                </label>
              </div>
            </div>
          )}

          {/* Tab 4: Devices */}
          {activeTab === 'devices' && (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="text-base font-bold app-text-primary">Thiết bị đang đồng bộ</h4>
                <p className="text-xs app-text-muted">Danh sách các phiên đăng nhập RoutinePulse theo thời gian thực</p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3.5 apple-glass-pill rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-blue-600 dark:text-sky-400" />
                    <div>
                      <div className="font-bold app-text-primary">MacBook Pro 16" (Web Safari)</div>
                      <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Thiết bị hiện tại (Đang hoạt động)
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] app-text-muted font-mono">Hà Nội, VN</span>
                </div>

                <div className="p-3.5 apple-glass-pill rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-slate-400" />
                    <div>
                      <div className="font-bold app-text-primary">iPhone 15 Pro (RoutinePulse iOS)</div>
                      <div className="text-[11px] app-text-muted">Đồng bộ cách đây 12 phút</div>
                    </div>
                  </div>
                  <span className="text-[10px] app-text-muted font-mono">iOS 18</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Billing */}
          {activeTab === 'billing' && (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="text-base font-bold app-text-primary">Quản lý gói dịch vụ & Hóa đơn</h4>
                <p className="text-xs app-text-muted">Theo dõi hạn sử dụng gói và lịch sử hóa đơn điện tử</p>
              </div>

              <div className="apple-glass-card p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gói hiện tại</span>
                    <h5 className="text-sm font-bold text-blue-600 dark:text-sky-400">
                      {currentRole === 'FREE'
                        ? 'Gói Miễn Phí (FREE PLAN)'
                        : currentRole === 'TRIAL'
                        ? 'Gói Dùng Thử 7 Ngày (FREE TRIAL)'
                        : 'Tài Khoản RoutinePulse VIP (1 Năm)'}
                    </h5>
                  </div>
                  <button
                    onClick={() => {
                      closeModal();
                      openModal('checkout');
                    }}
                    className="apple-btn-primary font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>Nâng cấp VIP 179k</span>
                  </button>
                </div>
                <p className="text-[11px] app-text-secondary">
                  {currentRole === 'FREE'
                    ? 'Giới hạn 1 thiết bị, tối đa 5 thói quen và lưu trữ báo cáo 7 ngày.'
                    : 'Không giới hạn thiết bị, mở khóa toàn bộ kho theme, bản đồ AI và lưu trữ dữ liệu báo cáo trọn đời.'}
                </p>
              </div>

              <div className="apple-glass-card p-4 rounded-2xl space-y-2 text-xs">
                <h5 className="font-bold app-text-primary">Hóa đơn điện tử PDF & Lịch sử</h5>
                <p className="text-[11px] app-text-muted">Tự động kết xuất hóa đơn điện tử cho mỗi lần mua gói Premium.</p>
                <button
                  type="button"
                  onClick={() => showToast('Hóa đơn điện tử', 'Đã mô phỏng mở hóa đơn điện tử PDF.', 'info')}
                  className="text-blue-600 dark:text-sky-400 font-bold hover:underline cursor-pointer"
                >
                  Xem lịch sử thanh toán & Hóa đơn PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
