import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { assetUrl, settingsApi, type Preferences } from '../api/settingsApi';
import { syncHubClient } from '../services/syncHubClient';
const initial: Preferences = { currentTheme: 'default', language: 'vi', enableSound: true, availableThemes: [] };
const Context = createContext<{ preferences: Preferences; save: (data: Parameters<typeof settingsApi.save>[0]) => Promise<boolean> } | null>(null);
export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [preferences, setPreferences] = useState(initial);
  const [error, setError] = useState('');
  const account = useRef(currentUser?.id); account.current = currentUser?.id;
  useEffect(() => {
    let active = true; setPreferences(initial); setError('');
    if (!currentUser) return;
    const load = () => settingsApi.get().then(p => { if (active) setPreferences(p); }).catch(() => { if (active) setError('Không tải được tùy chọn tài khoản.'); });
    void load(); const unsubscribe = syncHubClient.onDataChanged(e => { if (e.entityType === 'settings' || e.entityType === 'subscription') void load(); });
    return () => { active = false; unsubscribe(); };
  }, [currentUser?.id]);
  const save = async (data: Parameters<typeof settingsApi.save>[0]) => {
    const id = account.current;
    try {
      if (!id) { setPreferences(p => ({ ...p, language: data.language ?? p.language })); return true; }
      const updated = await settingsApi.save(data);
      if (id === account.current) { setPreferences(updated); setError(''); return true; }
      return false;
    } catch (e) { if (id === account.current) setError(e instanceof Error ? e.message : 'Không lưu được tùy chọn.'); return false; }
  };
  useEffect(() => {
    const root = document.documentElement;
    const builtin = ['default', 'dark', 'tet', 'christmas', 'sakura'];
    const theme = preferences.availableThemes.find(t => t.code === preferences.currentTheme && !t.isLocked);
    root.dataset.theme = builtin.includes(preferences.currentTheme) ? preferences.currentTheme : 'default';
    document.body.className = document.body.className.replace(/theme-[\w-]+/g, '').trim();
    if (builtin.includes(preferences.currentTheme) && preferences.currentTheme !== 'default') document.body.classList.add(`theme-${preferences.currentTheme}`);
    const palette = theme?.palette;
    const colors: Record<string, string | undefined> = { '--google-blue': palette?.primaryColor ?? theme?.primaryColor, '--google-blue-primary': palette?.primaryColor ?? theme?.primaryColor, '--bg-base': palette?.backgroundColor ?? theme?.backgroundColor, '--surface-canvas': palette?.backgroundColor ?? theme?.backgroundColor, '--text-primary': palette?.textColor, '--surface-container': palette?.surfaceColor };
    for (const [key, value] of Object.entries(colors)) { root.style.removeProperty(key); if (value && /^#[0-9a-f]{6}$/i.test(value)) root.style.setProperty(key, value); }
    root.style.removeProperty('--theme-background-image');
    if (palette?.backgroundAssetId && /^[0-9a-f-]{36}$/i.test(palette.backgroundAssetId)) root.style.setProperty('--theme-background-image', `url("${assetUrl(`/api/v1/assets/${palette.backgroundAssetId}`)}")`);
    root.lang = preferences.language;
  }, [preferences]);
  return <Context.Provider value={{ preferences, save }}>{error && <p role="alert" className="bg-red-900 text-white p-2">{error}</p>}{children}</Context.Provider>;
}
export function usePreferences() { const value = useContext(Context); if (!value) throw new Error('PreferencesProvider required'); return value; }
