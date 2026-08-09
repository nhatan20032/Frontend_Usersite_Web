import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import type { ThemeName } from '../../types';
import {
  X,
  Settings,
  User,
  Palette,
  Globe,
  Bell,
  Smartphone,
  CreditCard,
  Check,
  Crown,
  Type,
} from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { currentUser, currentRole, updateProfile } = useAuth();
  const { activeModal, closeModal, currentTheme, setTheme, showToast, openModal } = useApp();
  const { language, setLanguage, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'language' | 'notifications' | 'devices' | 'billing'>('profile');
  const [name, setName] = useState<string>(currentUser?.name || 'Nguyễn Văn An');
  const [email, setEmail] = useState<string>(currentUser?.email || 'an.nguyen@routinepulse.com');
  const [phone, setPhone] = useState<string>(currentUser?.phone || '0987 654 321');

  if (activeModal !== 'settings') return null;

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(name, email, phone);
    closeModal();
    showToast(t('toasts.profileSavedTitle'), t('toasts.profileSavedDesc'), 'success');
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
          className="absolute top-5 right-5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-full hover:bg-rose-500/10 z-20 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Settings Left Tabs */}
        <div className="w-full md:w-56 apple-glass-surface border-r app-border p-5 space-y-3 flex-shrink-0">
          <div className="flex items-center gap-2 pb-2 border-b app-border">
            <Settings className="w-4 h-4 text-blue-600 dark:text-sky-400" />
            <h3 className="font-bold text-sm app-text-primary">{t('modals.settings.title')}</h3>
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left p-2.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'app-text-primary bg-blue-500/10 text-blue-600 dark:text-sky-400 font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-sky-400'
              }`}
            >
              <User className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{t('modals.settings.tabProfile')}</span>
            </button>

            <button
              onClick={() => setActiveTab('appearance')}
              className={`w-full text-left p-2.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'appearance'
                  ? 'app-text-primary bg-blue-500/10 text-blue-600 dark:text-sky-400 font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-sky-400'
              }`}
            >
              <Palette className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{t('modals.settings.tabAppearance')}</span>
            </button>

            <button
              onClick={() => setActiveTab('language')}
              className={`w-full text-left p-2.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'language'
                  ? 'app-text-primary bg-blue-500/10 text-blue-600 dark:text-sky-400 font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-sky-400'
              }`}
            >
              <Globe className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{t('modals.settings.tabLanguage')}</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full text-left p-2.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'notifications'
                  ? 'app-text-primary bg-blue-500/10 text-blue-600 dark:text-sky-400 font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-sky-400'
              }`}
            >
              <Bell className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{t('modals.settings.tabNotifications')}</span>
            </button>

            <button
              onClick={() => setActiveTab('devices')}
              className={`w-full text-left p-2.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'devices'
                  ? 'app-text-primary bg-blue-500/10 text-blue-600 dark:text-sky-400 font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-sky-400'
              }`}
            >
              <Smartphone className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{t('modals.settings.tabDevices')}</span>
            </button>

            <button
              onClick={() => setActiveTab('billing')}
              className={`w-full text-left p-2.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'billing'
                  ? 'app-text-primary bg-blue-500/10 text-blue-600 dark:text-sky-400 font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-sky-400'
              }`}
            >
              <CreditCard className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{t('modals.settings.tabBilling')}</span>
            </button>
          </nav>
        </div>

        {/* Settings Right Content Area */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-5">
          {/* Tab 1: Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold app-text-primary">{t('modals.settings.profileTitle')}</h4>
                <p className="text-xs app-text-muted">{t('modals.settings.profileSubtitle')}</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-3.5 text-xs">
                <div className="flex items-center gap-3 pb-2 border-b app-border">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-blue-500/20">
                    {currentUser?.avatarInitial || 'AN'}
                  </div>
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => showToast(t('toasts.profileSavedTitle'), t('toasts.profileSavedDesc'), 'info')}
                      className="apple-glass-pill font-semibold px-3 py-1.5 rounded-xl hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-sky-400 transition-all cursor-pointer"
                    >
                      {t('modals.settings.avatarChange')}
                    </button>
                    <p className="text-[10px] app-text-muted">{t('modals.settings.avatarNote')}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold app-text-primary">{t('modals.settings.fullName')}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full apple-input px-3.5 py-2 text-xs font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold app-text-primary">{t('modals.settings.email')}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full apple-input px-3.5 py-2 text-xs font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold app-text-primary">{t('modals.settings.phone')}</label>
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
                    {t('modals.settings.saveProfile')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 2: Appearance */}
          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold app-text-primary">{t('modals.settings.themeTitle')}</h4>
                <p className="text-xs app-text-muted">
                  {t('modals.settings.themeSubtitle')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {themes.map((th) => {
                  const isCurrent = currentTheme === th.id;
                  return (
                    <div
                      key={th.id}
                      onClick={() => {
                        setTheme(th.id);
                        showToast(t('toasts.themeChangedTitle'), t('toasts.themeChangedDesc'), 'success');
                      }}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 relative ${
                        isCurrent
                          ? 'border-2 border-blue-500 bg-blue-500/10 shadow-sm'
                          : 'apple-glass-pill hover:border-slate-400'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${th.previewClass} border shadow-xs flex items-center justify-center flex-shrink-0`}
                      >
                        {isCurrent && <Check className="w-4 h-4 text-blue-600 dark:text-sky-400" />}
                      </div>
                      <div className="space-y-0.5 flex-1">
                        <div className="font-bold app-text-primary flex items-center justify-between">
                          <span>{th.name}</span>
                          {th.id !== 'default' && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded-full">
                              VIP
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] app-text-muted leading-tight">{th.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Language & Region */}
          {activeTab === 'language' && (
            <div className="space-y-5 text-xs">
              <div>
                <h4 className="text-base font-bold app-text-primary">{t('modals.settings.langTitle')}</h4>
                <p className="text-xs app-text-muted">{t('modals.settings.langSubtitle')}</p>
              </div>

              <div className="space-y-3">
                <label className="font-semibold app-text-primary">{t('modals.settings.selectLang')}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => {
                      setLanguage('vi');
                      showToast('Ngôn ngữ', 'Giao diện đã chuyển sang Tiếng Việt.', 'success');
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      language === 'vi'
                        ? 'border-2 border-blue-500 bg-blue-500/10 shadow-sm'
                        : 'apple-glass-pill hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇻🇳</span>
                      <div>
                        <div className="font-bold text-sm app-text-primary">Tiếng Việt</div>
                        <div className="text-[11px] app-text-muted">Vietnamese (Default)</div>
                      </div>
                    </div>
                    {language === 'vi' && <Check className="w-5 h-5 text-blue-600 dark:text-sky-400" />}
                  </div>

                  <div
                    onClick={() => {
                      setLanguage('en');
                      showToast('Language', 'Interface language changed to English.', 'success');
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      language === 'en'
                        ? 'border-2 border-blue-500 bg-blue-500/10 shadow-sm'
                        : 'apple-glass-pill hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇬🇧</span>
                      <div>
                        <div className="font-bold text-sm app-text-primary">English</div>
                        <div className="text-[11px] app-text-muted">International English</div>
                      </div>
                    </div>
                    {language === 'en' && <Check className="w-5 h-5 text-blue-600 dark:text-sky-400" />}
                  </div>
                </div>
              </div>

              {/* Font Synchronization Card */}
              <div className="apple-glass-pill p-4 rounded-2xl space-y-2 border border-blue-500/20">
                <div className="flex items-center gap-2 font-bold text-blue-600 dark:text-sky-400">
                  <Type className="w-4 h-4" />
                  <span>{t('modals.settings.fontSyncTitle')}</span>
                </div>
                <p className="text-[11px] app-text-secondary leading-relaxed">
                  {t('modals.settings.fontSyncDesc')}
                </p>
                <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px]">
                  <span className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 app-text-primary">Plus Jakarta Sans</span>
                  <span className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 app-text-primary">Be Vietnam Pro</span>
                  <span className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 app-text-primary">JetBrains Mono</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="text-base font-bold app-text-primary">{language === 'vi' ? 'Kênh thông báo & Nhắc nhở' : 'Notification Channels & Alerts'}</h4>
                <p className="text-xs app-text-muted">{language === 'vi' ? 'Đa dạng kênh nhắc việc qua App, SMS, Email và Cuộc gọi AI' : 'Multiple channels via App, SMS, Email, and AI Calls'}</p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 apple-glass-pill rounded-2xl cursor-pointer">
                  <div className="space-y-0.5">
                    <div className="font-bold app-text-primary">{language === 'vi' ? 'Push Notification trên App' : 'In-App Push Notifications'}</div>
                    <div className="text-[11px] app-text-muted">{language === 'vi' ? 'Nhận thông báo tức thì trên thiết bị' : 'Instant notifications on active devices'}</div>
                  </div>
                  <input type="checkbox" defaultChecked disabled className="w-4 h-4 text-blue-600 rounded" />
                </label>

                <label className="flex items-center justify-between p-3 apple-glass-pill rounded-2xl cursor-pointer">
                  <div className="space-y-0.5">
                    <div className="font-bold app-text-primary">{language === 'vi' ? 'Tin nhắn SMS nhắc giờ' : 'SMS Reminder'}</div>
                    <div className="text-[11px] app-text-muted">{language === 'vi' ? 'Nhắn tin khi sắp đến giờ sự kiện' : 'Receive SMS when event is approaching'}</div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                </label>

                <label className="flex items-center justify-between p-3 apple-glass-pill rounded-2xl cursor-pointer">
                  <div className="space-y-0.5">
                    <div className="font-bold app-text-primary">{language === 'vi' ? 'Cuộc gọi tự động AI (Voice Call)' : 'AI Automated Voice Call'}</div>
                    <div className="text-[11px] app-text-muted">{language === 'vi' ? 'Gọi nhắc nhở sự kiện cực kỳ quan trọng' : 'AI phone calls for critical priority events'}</div>
                  </div>
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                </label>
              </div>
            </div>
          )}

          {/* Tab 5: Devices */}
          {activeTab === 'devices' && (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="text-base font-bold app-text-primary">{t('modals.settings.devicesTitle')}</h4>
                <p className="text-xs app-text-muted">{t('modals.settings.devicesSubtitle')}</p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3.5 apple-glass-pill rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-blue-600 dark:text-sky-400" />
                    <div>
                      <div className="font-bold app-text-primary">MacBook Pro 16" (Web Safari)</div>
                      <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {language === 'vi' ? 'Thiết bị hiện tại (Đang hoạt động)' : 'Current Device (Active)'}
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
                      <div className="text-[11px] app-text-muted">{language === 'vi' ? 'Đồng bộ cách đây 12 phút' : 'Synced 12 mins ago'}</div>
                    </div>
                  </div>
                  <span className="text-[10px] app-text-muted font-mono">iOS 18</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: Billing */}
          {activeTab === 'billing' && (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="text-base font-bold app-text-primary">{t('modals.settings.billingTitle')}</h4>
                <p className="text-xs app-text-muted">{t('modals.settings.billingSubtitle')}</p>
              </div>

              <div className="apple-glass-card p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{language === 'vi' ? 'Gói hiện tại' : 'Current Tier'}</span>
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
                    <span>{t('sidebar.upgradeBtn')}</span>
                  </button>
                </div>
                <p className="text-[11px] app-text-secondary">
                  {currentRole === 'FREE'
                    ? (language === 'vi' ? 'Giới hạn 1 thiết bị, tối đa 5 thói quen và lưu trữ báo cáo 7 ngày.' : 'Limited to 1 device, 5 habits, and 7-day reports.')
                    : (language === 'vi' ? 'Không giới hạn thiết bị, mở khóa toàn bộ kho theme, bản đồ AI và lưu trữ dữ liệu báo cáo trọn đời.' : 'Unlimited devices, all VIP themes, AI map navigation, and lifetime report storage.')}
                </p>
              </div>

              <div className="apple-glass-card p-4 rounded-2xl space-y-2 text-xs">
                <h5 className="font-bold app-text-primary">{language === 'vi' ? 'Hóa đơn điện tử PDF & Lịch sử' : 'E-Invoices & Payment History'}</h5>
                <p className="text-[11px] app-text-muted">{language === 'vi' ? 'Tự động kết xuất hóa đơn điện tử cho mỗi lần mua gói Premium.' : 'Automatically generate VAT e-invoices for every subscription.'}</p>
                <button
                  type="button"
                  onClick={() => showToast(language === 'vi' ? 'Hóa đơn điện tử' : 'E-Invoice', language === 'vi' ? 'Đã mô phỏng mở hóa đơn điện tử PDF.' : 'Simulated opening PDF invoice.', 'info')}
                  className="text-blue-600 dark:text-sky-400 font-bold hover:underline cursor-pointer"
                >
                  {language === 'vi' ? 'Xem lịch sử thanh toán & Hóa đơn PDF' : 'View Billing History & PDF Invoices'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
