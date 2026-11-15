import { useEffect, useState } from 'react';
import { apiClient } from '../../api/apiClient';
import { holidayPreferenceKey, holidayRegion } from '../../utils/vietnamHolidays';

export function HolidayRegionSettings() {
  const [region, setRegion] = useState(holidayRegion);
  const [countries, setCountries] = useState<{ countryCode: string; name: string }[]>([]);
  const [status, setStatus] = useState('');
  useEffect(() => { apiClient.get<typeof countries>('/user/holidays/countries').then(setCountries).catch(e => setStatus(e.message)); }, []);
  const save = async () => {
    try {
      await apiClient.get('/user/holidays', { year: new Date().getFullYear(), ...region });
      localStorage.setItem(holidayPreferenceKey, JSON.stringify(region));
      window.dispatchEvent(new Event('holiday-region-changed'));
      setStatus('Đã lưu tùy chọn trên trình duyệt này.');
    } catch (e) { setStatus(e instanceof Error ? e.message : 'Không tải được lịch'); }
  };
  return <fieldset className="space-y-3 border border-[var(--border-subtle)] rounded-lg p-3">
    <legend>Ngày lễ theo khu vực</legend>
    <label className="block">Quốc gia <select aria-label="Quốc gia ngày lễ" className="bg-[var(--surface-container-high)] text-[var(--text-primary)] rounded-md w-full p-2" value={region.country} onChange={e => setRegion({ country: e.target.value, subdivision: '' })}>
      {!countries.length && <option value={region.country}>{region.country}</option>}
      {countries.map(c => <option key={c.countryCode} value={c.countryCode}>{c.name}</option>)}
    </select></label>
    <label className="block">Mã khu vực (tùy chọn, ví dụ US-CA)
      <input aria-label="Mã khu vực ngày lễ" className="block bg-[var(--surface-container-high)] text-[var(--text-primary)] rounded-md w-full p-2" value={region.subdivision} maxLength={12} onChange={e => setRegion({ ...region, subdivision: e.target.value.toUpperCase() })} />
    </label>
    <p>Nếu nguồn không hỗ trợ tỉnh/bang, chọn lịch quốc gia. Cập nhật trực tuyến định kỳ; ngày nghỉ cụ thể phụ thuộc công bố của nguồn.</p>
    <button type="button" className="px-3 py-2 bg-[var(--google-blue-primary)] text-white rounded" onClick={save}>Lưu khu vực ngày lễ</button>
    <p role="status">{status}</p>
  </fieldset>;
}
