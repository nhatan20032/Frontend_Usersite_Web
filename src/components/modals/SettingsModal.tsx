import { ReferralPanel } from './ReferralPanel';
import { usePreferences } from '../../context/PreferencesContext';
import { downloadReceipt } from '../../api/downloads';
import { BrowserPushSettings } from '../notifications/BrowserPushSettings';
import { HolidayRegionSettings } from './HolidayRegionSettings';
import { authApi } from '../../api/authApi';
import { subscriptionApi } from '../../api/subscriptionApi';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Input } from '../ui/Input';
import { DatePicker, type DatePickerValue } from '../ui/DatePicker';
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
} from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { preferences, save: savePreferences } = usePreferences();
  const { currentUser, isPremium, updateProfile } = useAuth();
  const { activeModal, closeModal, currentTheme, setTheme, showToast, openModal, triggerPremiumFeature, settingsInitialTab } = useApp();
  const { language, setLanguage, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'language' | 'notifications' | 'devices' | 'billing'>('profile');
  const [name, setName] = useState<string>(currentUser?.name || '');
  const [email, setEmail] = useState<string>(currentUser?.email || '');
  const [phone, setPhone] = useState<string>(currentUser?.phone || '');
  const [birthday, setBirthday] = useState<string>(currentUser?.birthday || '');

  const parsedBirthday = React.useMemo<DatePickerValue>(() => {
    if (birthday) {
      const parts = birthday.split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
          return { day: d, month: m, year: y };
        }
      }
    }
    const now = new Date();
    return { day: now.getDate(), month: now.getMonth(), year: now.getFullYear() - 20 };
  }, [birthday]);

  const handleBirthdayChange = (val: DatePickerValue) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    setBirthday(`${val.year}-${pad(val.month + 1)}-${pad(val.day)}`);
  };

  const [devices, setDevices] = useState<Array<{ deviceId: string; deviceName: string; platform: string; ipAddress?: string; lastActiveAt: string }>>([]);
  const [transactions, setTransactions] = useState<Array<{ transactionCode: string; planName: string; amount: number; status: string; createdAt: string }>>([]);
  useEffect(() => {
    if (!currentUser || !activeModal) return;
    if (activeTab === 'devices') authApi.getDevices().then(setDevices).catch((e: Error) => showToast('Lỗi thiết bị', e.message, 'error'));
    if (activeTab === 'billing') subscriptionApi.getTransactions().then(setTransactions).catch((e: Error) => showToast('Lỗi giao dịch', e.message, 'error'));
  }, [activeTab, activeModal, currentUser?.id]);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setBirthday(currentUser.birthday || '');
    }
  }, [currentUser, activeModal]);

  useEffect(() => {
    if (settingsInitialTab && ['profile', 'appearance', 'language', 'notifications', 'devices', 'billing'].includes(settingsInitialTab)) {
      setActiveTab(settingsInitialTab as any);
    }
  }, [settingsInitialTab, activeModal]);

  useEffect(() => {
    if (activeModal !== 'settings') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, closeModal]);

  if (activeModal !== 'settings') return null;

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!await updateProfile(name, email, phone, birthday)) { showToast('Không thể lưu hồ sơ', 'Vui lòng thử lại', 'error'); return; }
    closeModal();
    showToast(t('toasts.profileSavedTitle'), t('toasts.profileSavedDesc'), 'success');
  };

  const themes: { id: ThemeName; name: string; desc: string; previewClass: string }[] = [
    { id: 'default', name: 'Default Dark Studio', desc: 'Google Material 3 Dark Canvas tiêu chuẩn', previewClass: 'from-[var(--surface-canvas)] to-[var(--surface-container)] border-[var(--border-subtle)]' },
    { id: 'dark', name: 'Dark Obsidian OLED', desc: 'Đen OLED sâu tuyệt đối & viền khói', previewClass: 'from-[#050505] to-[var(--surface-canvas)] border-[#222]' },
    { id: 'tet', name: 'Tết Cổ Truyền 2026', desc: 'Sắc đỏ son ấm áp & May mắn thịnh vượng', previewClass: 'from-[#1E1111] to-[#2E1818] border-[#E53935]/40' },
    { id: 'christmas', name: 'Giáng Sinh Tuyết', desc: 'Xanh thông ngọc bích & Bạc tuyết phủ', previewClass: 'from-[#0F1E16] to-[#172E22] border-[#2E7D32]/40' },
    { id: 'sakura', name: 'Anime Sakura', desc: 'Hồng hoa anh đào rực rỡ & Tươi mới', previewClass: 'from-[#1E1219] to-[#2E1926] border-[#D81B60]/40' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('modals.settings.title')}
        className="bg-[var(--surface-container)] border border-[var(--border-subtle)] max-w-3xl lg:max-w-4xl w-full rounded-2xl overflow-hidden relative shadow-2xl flex flex-col md:flex-row h-[560px] md:h-[580px] max-h-[90vh] text-[var(--text-primary)]"
      >
        <button
          onClick={closeModal}
          aria-label={language === 'vi' ? 'Đóng cài đặt' : 'Close settings'}
          className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1.5 rounded-full hover:bg-[var(--surface-container-high)] z-20 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Settings Left Tabs */}
        <div className="w-full md:w-56 bg-[#18191B] border-b md:border-b-0 md:border-r border-[var(--border-grid)] p-3.5 sm:p-4 space-y-2 flex-shrink-0 md:h-full">
          <div className="flex items-center gap-2 pb-2 md:pb-2.5 border-b border-[var(--border-grid)]">
            <Settings className="w-4 h-4 text-[var(--google-blue)]" />
            <h3 className="font-semibold text-sm text-[var(--text-primary)]">{t('modals.settings.title')}</h3>
          </div>

          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto no-scrollbar text-xs">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-auto md:w-full text-left px-3 py-2 md:p-2 rounded-lg flex items-center gap-2 border transition-colors cursor-pointer font-medium whitespace-nowrap shrink-0 md:shrink ${
                activeTab === 'profile'
                  ? 'bg-[var(--surface-container-high)] text-[var(--google-blue)] border-[#3A3B3D]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[#202123] border-transparent'
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span className="truncate">{t('modals.settings.tabProfile')}</span>
            </button>

            <button
              onClick={() => setActiveTab('appearance')}
              className={`w-auto md:w-full text-left px-3 py-2 md:p-2 rounded-lg flex items-center gap-2 border transition-colors cursor-pointer font-medium whitespace-nowrap shrink-0 md:shrink ${
                activeTab === 'appearance'
                  ? 'bg-[var(--surface-container-high)] text-[var(--google-blue)] border-[#3A3B3D]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[#202123] border-transparent'
              }`}
            >
              <Palette className="w-4 h-4 shrink-0" />
              <span className="truncate">{t('modals.settings.tabAppearance')}</span>
            </button>

            <button
              onClick={() => setActiveTab('language')}
              className={`w-auto md:w-full text-left px-3 py-2 md:p-2 rounded-lg flex items-center gap-2 border transition-colors cursor-pointer font-medium whitespace-nowrap shrink-0 md:shrink ${
                activeTab === 'language'
                  ? 'bg-[var(--surface-container-high)] text-[var(--google-blue)] border-[#3A3B3D]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[#202123] border-transparent'
              }`}
            >
              <Globe className="w-4 h-4 shrink-0" />
              <span className="truncate">{t('modals.settings.tabLanguage')}</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-auto md:w-full text-left px-3 py-2 md:p-2 rounded-lg flex items-center gap-2 border transition-colors cursor-pointer font-medium whitespace-nowrap shrink-0 md:shrink ${
                activeTab === 'notifications'
                  ? 'bg-[var(--surface-container-high)] text-[var(--google-blue)] border-[#3A3B3D]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[#202123] border-transparent'
              }`}
            >
              <Bell className="w-4 h-4 shrink-0" />
              <span className="truncate">{t('modals.settings.tabNotifications')}</span>
            </button>

            <button
              onClick={() => setActiveTab('devices')}
              className={`w-auto md:w-full text-left px-3 py-2 md:p-2 rounded-lg flex items-center gap-2 border transition-colors cursor-pointer font-medium whitespace-nowrap shrink-0 md:shrink ${
                activeTab === 'devices'
                  ? 'bg-[var(--surface-container-high)] text-[var(--google-blue)] border-[#3A3B3D]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[#202123] border-transparent'
              }`}
            >
              <Smartphone className="w-4 h-4 shrink-0" />
              <span className="truncate">{t('modals.settings.tabDevices')}</span>
            </button>

            <button
              onClick={() => setActiveTab('billing')}
              className={`w-auto md:w-full text-left px-3 py-2 md:p-2 rounded-lg flex items-center gap-2 border transition-colors cursor-pointer font-medium whitespace-nowrap shrink-0 md:shrink ${
                activeTab === 'billing'
                  ? 'bg-[var(--surface-container-high)] text-[var(--google-blue)] border-[#3A3B3D]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[#202123] border-transparent'
              }`}
            >
              <CreditCard className="w-4 h-4 shrink-0" />
              <span className="truncate">{t('modals.settings.tabBilling')}</span>
            </button>
          </nav>
        </div>

        {/* Settings Right Content Viewport */}
        <div className="flex-1 min-h-0 md:h-full p-5 sm:p-6 overflow-y-auto bg-[var(--surface-container)] text-[var(--text-primary)] custom-scrollbar [scrollbar-gutter:stable]">
          {/* Tab 1: Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-4 text-xs">
              <div className="pr-10">
                <h4 className="text-base font-semibold text-[var(--text-primary)]">{t('modals.settings.profileTitle')}</h4>
                <p className="text-xs text-[var(--text-secondary)]">{t('modals.settings.profileSubtitle')}</p>
              </div>

              <HolidayRegionSettings />
              <form onSubmit={handleProfileSubmit} className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="font-medium text-[var(--text-secondary)]">{t('modals.settings.nameLabel')}</label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-[var(--text-secondary)]">{t('modals.settings.emailLabel')}</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    readOnly
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-[var(--text-secondary)]">{t('modals.settings.phoneLabel')}</label>
                  <Input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-medium text-[var(--text-secondary)]">{t('modals.settings.birthdayLabel')}</label>
                    <span className="text-[11px] text-[#FF7597] flex items-center gap-1 font-medium bg-[#FF7597]/10 px-1.5 py-0.5 rounded border border-[#FF7597]/20">
                      <span>🎂</span> Tự động đồng bộ Lịch
                    </span>
                  </div>
                  <DatePicker
                    value={parsedBirthday}
                    onChange={handleBirthdayChange}
                    className="w-full"
                    buttonClassName="w-full justify-between"
                  />
                  <p className="text-[11px] text-[var(--text-secondary)] leading-tight pt-0.5">
                    {t('modals.settings.birthdayHint')}
                  </p>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="bg-[var(--google-blue-primary)] hover:bg-[#1B66CA] text-white font-semibold px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer"
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
              <div className="pr-10">
                <h4 className="text-base font-semibold text-[var(--text-primary)]">{t('modals.settings.themeTitle')}</h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {t('modals.settings.themeSubtitle')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                {[...themes, ...preferences.availableThemes.map(th => ({ id: th.code, name: th.name, desc: 'Giao diện từ kho Admin', previewClass: 'from-slate-600 to-slate-900' }))].map((th) => {
                  const isCurrent = currentTheme === th.id;
                  const isVipTheme = th.id !== 'default' && th.id !== 'dark';
                  const remote = preferences.availableThemes.find(t => t.code === th.id);
                  const isLocked = remote ? remote.isLocked : isVipTheme && !isPremium;

                  return (
                    <div
                      key={th.id}
                      onClick={async () => {
                        if (isLocked) {
                          triggerPremiumFeature(`Giao diện ${th.name}`);
                          return;
                        }
                        if (await setTheme(th.id)) showToast(t('toasts.themeChangedTitle'), t('toasts.themeChangedDesc'), 'success');
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-colors flex items-start gap-3 relative ${
                        isCurrent
                          ? 'border-[var(--google-blue)] bg-[var(--google-blue-primary)]/15 shadow-xs'
                          : isLocked
                          ? 'bg-[#18191B] border-[var(--border-grid)] opacity-75 hover:opacity-100 hover:border-[#FDD663]/40'
                          : 'bg-[#18191B] border-[var(--border-grid)] hover:border-[#3A3B3D]'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${th.previewClass} border shadow-xs flex items-center justify-center shrink-0 relative`}
                      >
                        {isCurrent && <Check className="w-4 h-4 text-[var(--google-blue)]" />}
                        {isLocked && !isCurrent && <Crown className="w-4 h-4 text-[#FDD663]" />}
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1.5 min-w-0">
                          <span className="font-semibold text-[var(--text-primary)] truncate text-xs sm:text-[13px]" title={th.name}>
                            {th.name}
                          </span>
                          {isVipTheme && (
                            <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full shrink-0 flex items-center gap-0.5 ${
                              isLocked
                                ? 'bg-[#FDD663]/15 text-[#FDD663] border border-[#FDD663]/30'
                                : 'bg-[#81C995]/15 text-[#81C995] border border-[#81C995]/30'
                            }`}>
                              {isLocked ? 'PRO' : '✓ VIP'}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed line-clamp-2">{th.desc}</p>
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

              <div className="pr-10 space-y-1">
                <h4 className="text-base font-semibold text-[var(--text-primary)]">{t('modals.settings.langTitle')}</h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t('modals.settings.langSubtitle')}</p>
              </div>

              <div className="space-y-3">
                <label className="font-medium text-[var(--text-secondary)] block">{t('modals.settings.selectLang')}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div
                    onClick={() => {
                      setLanguage('vi');
                      showToast('Ngôn ngữ', 'Giao diện đã chuyển sang Tiếng Việt.', 'success');
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-colors flex items-center justify-between ${
                      language === 'vi'
                        ? 'border-[var(--google-blue)] bg-[var(--google-blue-primary)]/15 shadow-xs'
                        : 'bg-[#18191B] border-[var(--border-grid)] hover:border-[#3A3B3D]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-2xl select-none">🇻🇳</span>
                      <div className="space-y-0.5">
                        <div className="font-semibold text-sm text-[var(--text-primary)]">Tiếng Việt</div>
                        <div className="text-[11px] text-[var(--text-secondary)]">Mặc định (Vietnamese)</div>
                      </div>
                    </div>
                    {language === 'vi' && <Check className="w-5 h-5 text-[var(--google-blue)] shrink-0" />}
                  </div>

                  <div
                    onClick={() => {
                      setLanguage('en');
                      showToast('Language', 'Interface language changed to English.', 'success');
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-colors flex items-center justify-between ${
                      language === 'en'
                        ? 'border-[var(--google-blue)] bg-[var(--google-blue-primary)]/15 shadow-xs'
                        : 'bg-[#18191B] border-[var(--border-grid)] hover:border-[#3A3B3D]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-2xl select-none">🇬🇧</span>
                      <div className="space-y-0.5">
                        <div className="font-semibold text-sm text-[var(--text-primary)]">English</div>
                        <div className="text-[11px] text-[var(--text-secondary)]">International English</div>
                      </div>
                    </div>
                    {language === 'en' && <Check className="w-5 h-5 text-[var(--google-blue)] shrink-0" />}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Notifications */}
          {activeTab === 'notifications' && <div className="space-y-4"><label className="flex items-center gap-2"><input type="checkbox" checked={preferences.enableSound} onChange={e => { void savePreferences({ enableSound: e.target.checked }); }} />Âm thanh thông báo</label><BrowserPushSettings /></div>}

          {/* Tab 5: Devices */}
          {activeTab === 'devices' && (
            <div className="space-y-4 text-xs">
              <div className="pr-10">
                <h4 className="text-base font-semibold text-[var(--text-primary)]">{t('modals.settings.devicesTitle')}</h4>
                <p className="text-xs text-[var(--text-secondary)]">{t('modals.settings.devicesSubtitle')}</p>
              </div>

              <div className="space-y-2.5">
                {devices.length === 0 && <p>Không có phiên đăng nhập.</p>}
                {devices.map(device => <div key={device.deviceId} className="p-3 border border-[var(--border-subtle)] rounded-xl flex justify-between">
                  <div>{device.deviceName || device.platform}<p>{device.ipAddress} · {new Date(device.lastActiveAt).toLocaleString()}</p></div>
                  <button onClick={async () => {
                    try { await authApi.revokeDevice(device.deviceId); setDevices(prev => prev.filter(d => d.deviceId !== device.deviceId)); }
                    catch (e) { showToast('Không thể thu hồi phiên', (e as Error).message, 'error'); }
                  }}>Đăng xuất</button>
                </div>)}
              </div>
            </div>
          )}

          {/* Tab 6: Billing */}
          {activeTab === 'billing' && (
            <div className="space-y-4 text-xs overflow-y-auto pr-1 max-h-[460px] custom-scrollbar">
              <div className="pr-10">
                <h4 className="text-base font-semibold text-[var(--text-primary)]">{t('modals.settings.billingTitle')}</h4>
                <p className="text-xs text-[var(--text-secondary)]">{t('modals.settings.billingSubtitle')}</p>
              </div>

              {/* Current Plan Banner */}
              <div className="bg-[#18191B] border border-[var(--border-grid)] p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider">{language === 'vi' ? 'Gói hiện tại' : 'Current Tier'}</span>
                    <h5 className="text-sm font-bold text-[var(--google-blue)]">
                      {currentUser?.planName || 'Gói Miễn Phí'}
                    </h5>
                  </div>
                  <button
                    onClick={() => {
                      closeModal();
                      openModal('checkout');
                    }}
                    className="bg-[var(--google-blue-primary)] hover:bg-[#1B66CA] text-white font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>{t('sidebar.upgradeBtn')}</span>
                  </button>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">{currentUser?.planExpiresAt ? `Hết hạn: ${new Date(currentUser.planExpiresAt).toLocaleDateString()}` : ''}</p>
              </div>

              <div className="space-y-2">
                <ReferralPanel />
                <h5>Lịch sử giao dịch</h5>
                {transactions.length === 0 && <p>Chưa có giao dịch.</p>}
                {transactions.map(tx => <div key={tx.transactionCode} className="p-3 border border-[var(--border-subtle)] rounded-xl">
                  <p>{tx.transactionCode} · {tx.planName}</p>{tx.status === 'SUCCESS' && <button onClick={() => downloadReceipt(tx.transactionCode).catch((e: Error) => showToast('Không tải được chứng từ', e.message, 'error'))}>Tải chứng từ PDF</button>}<p>{tx.amount.toLocaleString('vi-VN')} đ · {tx.status} · {new Date(tx.createdAt).toLocaleDateString()}</p>
                </div>)}
                <p className="text-[var(--text-secondary)]">Chứng từ thanh toán không thay thế hóa đơn điện tử thuế.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
