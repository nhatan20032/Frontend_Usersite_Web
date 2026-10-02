import React, { useState, useEffect } from 'react';
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
  const { currentUser, currentRole, isPremium, updateProfile } = useAuth();
  const { activeModal, closeModal, currentTheme, setTheme, showToast, openModal, triggerPremiumFeature, settingsInitialTab } = useApp();
  const { language, setLanguage, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'language' | 'notifications' | 'devices' | 'billing'>('profile');
  const [name, setName] = useState<string>(currentUser?.name || 'Nguyễn Văn An');
  const [email, setEmail] = useState<string>(currentUser?.email || 'an.nguyen@routinepulse.com');
  const [phone, setPhone] = useState<string>(currentUser?.phone || '0987 654 321');

  useEffect(() => {
    if (settingsInitialTab && ['profile', 'appearance', 'language', 'notifications', 'devices', 'billing'].includes(settingsInitialTab)) {
      setActiveTab(settingsInitialTab as any);
    }
  }, [settingsInitialTab, activeModal]);

  if (activeModal !== 'settings') return null;

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(name, email, phone);
    closeModal();
    showToast(t('toasts.profileSavedTitle'), t('toasts.profileSavedDesc'), 'success');
  };

  const themes: { id: ThemeName; name: string; desc: string; previewClass: string }[] = [
    { id: 'default', name: 'Default Dark Studio', desc: 'Google Material 3 Dark Canvas tiêu chuẩn', previewClass: 'from-[#121314] to-[#1F2021] border-[#333538]' },
    { id: 'dark', name: 'Dark Obsidian OLED', desc: 'Đen OLED sâu tuyệt đối & viền khói', previewClass: 'from-[#050505] to-[#121314] border-[#222]' },
    { id: 'tet', name: 'Tết Cổ Truyền 2026', desc: 'Sắc đỏ son ấm áp & May mắn thịnh vượng', previewClass: 'from-[#1E1111] to-[#2E1818] border-[#E53935]/40' },
    { id: 'christmas', name: 'Giáng Sinh Tuyết', desc: 'Xanh thông ngọc bích & Bạc tuyết phủ', previewClass: 'from-[#0F1E16] to-[#172E22] border-[#2E7D32]/40' },
    { id: 'sakura', name: 'Anime Sakura', desc: 'Hồng hoa anh đào rực rỡ & Tươi mới', previewClass: 'from-[#1E1219] to-[#2E1926] border-[#D81B60]/40' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="bg-[#1F2021] border border-[#333538] max-w-2xl w-full rounded-2xl overflow-hidden relative shadow-2xl flex flex-col md:flex-row max-h-[85vh] text-[#E3E2E3]">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-[#9AA0A6] hover:text-[#E3E2E3] p-1.5 rounded-full hover:bg-[#28292A] z-20 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Settings Left Tabs */}
        <div className="w-full md:w-56 bg-[#18191B] border-r border-[#2A2B2D] p-4 space-y-2 flex-shrink-0">
          <div className="flex items-center gap-2 pb-2.5 border-b border-[#2A2B2D]">
            <Settings className="w-4 h-4 text-[#8AB4F8]" />
            <h3 className="font-semibold text-sm text-[#E3E2E3]">{t('modals.settings.title')}</h3>
          </div>

          <nav className="space-y-1 text-xs">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left p-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer font-medium ${
                activeTab === 'profile'
                  ? 'bg-[#28292A] text-[#8AB4F8] border border-[#3A3B3D]'
                  : 'text-[#9AA0A6] hover:text-[#E3E2E3] hover:bg-[#202123]'
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span className="truncate">{t('modals.settings.tabProfile')}</span>
            </button>

            <button
              onClick={() => setActiveTab('appearance')}
              className={`w-full text-left p-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer font-medium ${
                activeTab === 'appearance'
                  ? 'bg-[#28292A] text-[#8AB4F8] border border-[#3A3B3D]'
                  : 'text-[#9AA0A6] hover:text-[#E3E2E3] hover:bg-[#202123]'
              }`}
            >
              <Palette className="w-4 h-4 shrink-0" />
              <span className="truncate">{t('modals.settings.tabAppearance')}</span>
            </button>

            <button
              onClick={() => setActiveTab('language')}
              className={`w-full text-left p-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer font-medium ${
                activeTab === 'language'
                  ? 'bg-[#28292A] text-[#8AB4F8] border border-[#3A3B3D]'
                  : 'text-[#9AA0A6] hover:text-[#E3E2E3] hover:bg-[#202123]'
              }`}
            >
              <Globe className="w-4 h-4 shrink-0" />
              <span className="truncate">{t('modals.settings.tabLanguage')}</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full text-left p-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer font-medium ${
                activeTab === 'notifications'
                  ? 'bg-[#28292A] text-[#8AB4F8] border border-[#3A3B3D]'
                  : 'text-[#9AA0A6] hover:text-[#E3E2E3] hover:bg-[#202123]'
              }`}
            >
              <Bell className="w-4 h-4 shrink-0" />
              <span className="truncate">{t('modals.settings.tabNotifications')}</span>
            </button>

            <button
              onClick={() => setActiveTab('devices')}
              className={`w-full text-left p-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer font-medium ${
                activeTab === 'devices'
                  ? 'bg-[#28292A] text-[#8AB4F8] border border-[#3A3B3D]'
                  : 'text-[#9AA0A6] hover:text-[#E3E2E3] hover:bg-[#202123]'
              }`}
            >
              <Smartphone className="w-4 h-4 shrink-0" />
              <span className="truncate">{t('modals.settings.tabDevices')}</span>
            </button>

            <button
              onClick={() => setActiveTab('billing')}
              className={`w-full text-left p-2 rounded-lg flex items-center gap-2 transition-all cursor-pointer font-medium ${
                activeTab === 'billing'
                  ? 'bg-[#28292A] text-[#8AB4F8] border border-[#3A3B3D]'
                  : 'text-[#9AA0A6] hover:text-[#E3E2E3] hover:bg-[#202123]'
              }`}
            >
              <CreditCard className="w-4 h-4 shrink-0" />
              <span className="truncate">{t('modals.settings.tabBilling')}</span>
            </button>
          </nav>
        </div>

        {/* Settings Right Content Viewport */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto bg-[#1F2021] text-[#E3E2E3] custom-scrollbar">
          {/* Tab 1: Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="text-base font-semibold text-[#E3E2E3]">{t('modals.settings.profileTitle')}</h4>
                <p className="text-xs text-[#9AA0A6]">{t('modals.settings.profileSubtitle')}</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="font-medium text-[#9AA0A6]">{t('modals.settings.nameLabel')}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#18191B] border border-[#333538] text-[#E3E2E3] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#8AB4F8]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-[#9AA0A6]">{t('modals.settings.emailLabel')}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#18191B] border border-[#333538] text-[#E3E2E3] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#8AB4F8]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-[#9AA0A6]">{t('modals.settings.phoneLabel')}</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#18191B] border border-[#333538] text-[#E3E2E3] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#8AB4F8]"
                  />
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="bg-[#1A73E8] hover:bg-[#1B66CA] text-white font-semibold px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer"
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
                <h4 className="text-base font-semibold text-[#E3E2E3]">{t('modals.settings.themeTitle')}</h4>
                <p className="text-xs text-[#9AA0A6]">
                  {t('modals.settings.themeSubtitle')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {themes.map((th) => {
                  const isCurrent = currentTheme === th.id;
                  const isVipTheme = th.id !== 'default' && th.id !== 'dark';
                  const isLocked = isVipTheme && !isPremium;

                  return (
                    <div
                      key={th.id}
                      onClick={() => {
                        if (isLocked) {
                          triggerPremiumFeature(`Giao diện ${th.name}`);
                          return;
                        }
                        setTheme(th.id);
                        showToast(t('toasts.themeChangedTitle'), t('toasts.themeChangedDesc'), 'success');
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 relative ${
                        isCurrent
                          ? 'border-[#8AB4F8] bg-[#1A73E8]/10 shadow-xs'
                          : isLocked
                          ? 'bg-[#18191B] border-[#2A2B2D] opacity-75 hover:opacity-100 hover:border-[#FDD663]/40'
                          : 'bg-[#18191B] border-[#2A2B2D] hover:border-[#3A3B3D]'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-lg bg-gradient-to-br ${th.previewClass} border shadow-xs flex items-center justify-center shrink-0 relative`}
                      >
                        {isCurrent && <Check className="w-4 h-4 text-[#8AB4F8]" />}
                        {isLocked && !isCurrent && <Crown className="w-4 h-4 text-[#FDD663]" />}
                      </div>
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="font-semibold text-[#E3E2E3] flex items-center justify-between">
                          <span className="truncate">{th.name}</span>
                          {isVipTheme && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                              isLocked
                                ? 'bg-[#FDD663]/15 text-[#FDD663]'
                                : 'bg-[#81C995]/15 text-[#81C995]'
                            }`}>
                              {isLocked ? 'PRO' : '✓'}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#9AA0A6] leading-tight line-clamp-2">{th.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Language & Region */}
          {activeTab === 'language' && (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="text-base font-semibold text-[#E3E2E3]">{t('modals.settings.langTitle')}</h4>
                <p className="text-xs text-[#9AA0A6]">{t('modals.settings.langSubtitle')}</p>
              </div>

              <div className="space-y-2">
                <label className="font-medium text-[#9AA0A6]">{t('modals.settings.selectLang')}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => {
                      setLanguage('vi');
                      showToast('Ngôn ngữ', 'Giao diện đã chuyển sang Tiếng Việt.', 'success');
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      language === 'vi'
                        ? 'border-[#8AB4F8] bg-[#1A73E8]/10 shadow-xs'
                        : 'bg-[#18191B] border-[#2A2B2D] hover:border-[#3A3B3D]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇻🇳</span>
                      <div>
                        <div className="font-semibold text-sm text-[#E3E2E3]">Tiếng Việt</div>
                        <div className="text-[11px] text-[#9AA0A6]">Mặc định (Vietnamese)</div>
                      </div>
                    </div>
                    {language === 'vi' && <Check className="w-5 h-5 text-[#8AB4F8]" />}
                  </div>

                  <div
                    onClick={() => {
                      setLanguage('en');
                      showToast('Language', 'Interface language changed to English.', 'success');
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      language === 'en'
                        ? 'border-[#8AB4F8] bg-[#1A73E8]/10 shadow-xs'
                        : 'bg-[#18191B] border-[#2A2B2D] hover:border-[#3A3B3D]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇬🇧</span>
                      <div>
                        <div className="font-semibold text-sm text-[#E3E2E3]">English</div>
                        <div className="text-[11px] text-[#9AA0A6]">International English</div>
                      </div>
                    </div>
                    {language === 'en' && <Check className="w-5 h-5 text-[#8AB4F8]" />}
                  </div>
                </div>
              </div>

              {/* Typography Spec Info */}
              <div className="bg-[#18191B] p-3.5 rounded-xl space-y-2 border border-[#2A2B2D]">
                <div className="flex items-center gap-2 font-medium text-[#8AB4F8]">
                  <Type className="w-4 h-4" />
                  <span>{t('modals.settings.fontSyncTitle')}</span>
                </div>
                <p className="text-[11px] text-[#9AA0A6] leading-relaxed">
                  {t('modals.settings.fontSyncDesc')}
                </p>
                <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-[#28292A] text-[#E3E2E3] border border-[#333538]">Geist Sans</span>
                  <span className="px-2 py-0.5 rounded bg-[#28292A] text-[#E3E2E3] border border-[#333538]">Plus Jakarta Sans</span>
                  <span className="px-2 py-0.5 rounded bg-[#28292A] text-[#E3E2E3] border border-[#333538]">JetBrains Mono</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="text-base font-semibold text-[#E3E2E3]">{language === 'vi' ? 'Kênh thông báo & Nhắc nhở' : 'Notification Channels & Alerts'}</h4>
                <p className="text-xs text-[#9AA0A6]">{language === 'vi' ? 'Quản lý cách nhận thông báo sự kiện và công việc' : 'Manage how you receive alerts'}</p>
              </div>

              <div className="space-y-2.5">
                <label className="flex items-center justify-between p-3 bg-[#18191B] border border-[#2A2B2D] rounded-xl cursor-pointer hover:border-[#3A3B3D]">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-[#E3E2E3]">{language === 'vi' ? 'Push Notification trên App' : 'In-App Push Notifications'}</div>
                    <div className="text-[11px] text-[#9AA0A6]">{language === 'vi' ? 'Nhận thông báo tức thì trên thiết bị' : 'Instant notifications on active devices'}</div>
                  </div>
                  <input type="checkbox" defaultChecked disabled className="w-4 h-4 text-[#1A73E8] rounded bg-[#28292A]" />
                </label>

                <label className="flex items-center justify-between p-3 bg-[#18191B] border border-[#2A2B2D] rounded-xl cursor-pointer hover:border-[#3A3B3D]">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-[#E3E2E3]">{language === 'vi' ? 'Tin nhắn SMS nhắc giờ' : 'SMS Reminder'}</div>
                    <div className="text-[11px] text-[#9AA0A6]">{language === 'vi' ? 'Nhắn tin khi sắp đến giờ sự kiện quan trọng' : 'Receive SMS for urgent meetings'}</div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-[#1A73E8] rounded bg-[#28292A]" />
                </label>

                <label className="flex items-center justify-between p-3 bg-[#18191B] border border-[#2A2B2D] rounded-xl cursor-pointer hover:border-[#3A3B3D]">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-[#E3E2E3]">{language === 'vi' ? 'Thông báo qua Email' : 'Email Alerts'}</div>
                    <div className="text-[11px] text-[#9AA0A6]">{language === 'vi' ? 'Gửi tóm tắt lịch trình buổi sáng vào hộp thư' : 'Daily morning schedule summary'}</div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-[#1A73E8] rounded bg-[#28292A]" />
                </label>
              </div>
            </div>
          )}

          {/* Tab 5: Devices */}
          {activeTab === 'devices' && (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="text-base font-semibold text-[#E3E2E3]">{t('modals.settings.devicesTitle')}</h4>
                <p className="text-xs text-[#9AA0A6]">{t('modals.settings.devicesSubtitle')}</p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3.5 bg-[#18191B] border border-[#2A2B2D] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-[#8AB4F8]" />
                    <div>
                      <div className="font-semibold text-[#E3E2E3]">Thiết bị Web hiện tại</div>
                      <div className="text-[11px] text-[#81C995] font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#81C995]"></span> {language === 'vi' ? 'Đang hoạt động' : 'Active'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#70757A] font-mono">Hà Nội, VN</span>
                </div>

                <div className="p-3.5 bg-[#18191B] border border-[#2A2B2D] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-[#70757A]" />
                    <div>
                      <div className="font-semibold text-[#E3E2E3]">Mobile App Companion</div>
                      <div className="text-[11px] text-[#9AA0A6]">{language === 'vi' ? 'Đồng bộ hóa đám mây' : 'Cloud Synchronized'}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#70757A] font-mono">iOS / Android</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: Billing */}
          {activeTab === 'billing' && (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="text-base font-semibold text-[#E3E2E3]">{t('modals.settings.billingTitle')}</h4>
                <p className="text-xs text-[#9AA0A6]">{t('modals.settings.billingSubtitle')}</p>
              </div>

              <div className="bg-[#18191B] border border-[#2A2B2D] p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-medium text-[#70757A] uppercase tracking-wider">{language === 'vi' ? 'Gói hiện tại' : 'Current Tier'}</span>
                    <h5 className="text-sm font-bold text-[#8AB4F8]">
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
                    className="bg-[#1A73E8] hover:bg-[#1B66CA] text-white font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>{t('sidebar.upgradeBtn')}</span>
                  </button>
                </div>
                <p className="text-[11px] text-[#9AA0A6] leading-relaxed">
                  {currentRole === 'FREE'
                    ? (language === 'vi' ? 'Gói miễn phí: Lưu trữ cơ bản 7 ngày gần nhất.' : 'Free tier: basic 7-day retention.')
                    : (language === 'vi' ? 'Không giới hạn thiết bị, mở khóa toàn bộ kho theme và lưu trữ dữ liệu trọn đời.' : 'Unlimited devices, all themes, and lifetime sync.')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
