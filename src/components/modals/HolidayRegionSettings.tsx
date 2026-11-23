import { useEffect, useState } from 'react';
import { apiClient } from '../../api/apiClient';
import { holidayPreferenceKey, holidayRegion } from '../../utils/vietnamHolidays';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';

export function HolidayRegionSettings() {
  const [region, setRegion] = useState(holidayRegion);
  const [countries, setCountries] = useState<{ countryCode: string; name: string }[]>([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    apiClient
      .get<typeof countries>('/user/holidays/countries')
      .then(setCountries)
      .catch((e) => setStatus(e.message));
  }, []);

  const save = async () => {
    try {
      await apiClient.get('/user/holidays', { year: new Date().getFullYear(), ...region });
      localStorage.setItem(holidayPreferenceKey, JSON.stringify(region));
      window.dispatchEvent(new Event('holiday-region-changed'));
      setStatus('Đã lưu tùy chọn trên trình duyệt này.');
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Không tải được lịch');
    }
  };

  const countryOptions = countries.length
    ? countries.map((c) => ({ value: c.countryCode, label: c.name }))
    : [{ value: region.country, label: region.country }];

  return (
    <fieldset className="space-y-3 border border-[var(--border-subtle)] rounded-lg p-3 text-xs">
      <legend className="font-medium text-[var(--text-secondary)] px-1">Ngày lễ theo khu vực</legend>
      <div className="space-y-1">
        <label className="block text-[var(--text-secondary)] font-medium">Quốc gia</label>
        <Select
          aria-label="Quốc gia ngày lễ"
          value={region.country}
          onChange={(val) => setRegion({ country: String(val), subdivision: '' })}
          options={countryOptions}
          className="w-full"
          buttonClassName="w-full justify-between"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-[var(--text-secondary)] font-medium">
          Mã khu vực (tùy chọn, ví dụ US-CA)
        </label>
        <Input
          aria-label="Mã khu vực ngày lễ"
          value={region.subdivision}
          maxLength={12}
          onChange={(e) => setRegion({ ...region, subdivision: e.target.value.toUpperCase() })}
        />
      </div>

      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
        Nếu nguồn không hỗ trợ tỉnh/bang, chọn lịch quốc gia. Cập nhật trực tuyến định kỳ; ngày nghỉ cụ thể phụ thuộc công bố của nguồn.
      </p>
      <button
        type="button"
        className="px-3 py-1.5 bg-[var(--google-blue-primary)] hover:bg-[#1B66CA] text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
        onClick={save}
      >
        Lưu khu vực ngày lễ
      </button>
      {status && <p role="status" className="text-xs text-[var(--google-blue)] mt-1">{status}</p>}
    </fieldset>
  );
}
