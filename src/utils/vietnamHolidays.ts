import type { CalendarEvent } from '../types';
import {
  FIXED_CULTURAL_HOLIDAYS,
  LUNAR_CULTURAL_HOLIDAYS,
  TET_HOLIDAY_CONFIG,
} from '../data/vietnamHolidaysData';

/**
 * THUẬT TOÁN THIÊN VĂN CHUYỂN ĐỔI ÂM - DƯƠNG HỒ NGỌC ĐỨC
 * Tính toán chính xác 100% các ngày sóc, tiết khí múi giờ GMT+7 (Hà Nội, Việt Nam).
 * Áp dụng chuẩn xác cho mọi năm từ 1900 đến 2100+ mà không cần hardcode thủ công theo năm.
 */

function jdFromDate(d: number, m: number, y: number): number {
  const a = Math.floor((14 - m) / 12);
  const y2 = y + 4800 - a;
  const m2 = m + 12 * a - 3;
  let jd = d + Math.floor((153 * m2 + 2) / 5) + 365 * y2 + Math.floor(y2 / 4) - Math.floor(y2 / 100) + Math.floor(y2 / 400) - 32045;
  if (jd < 2299161) {
    jd = d + Math.floor((153 * m2 + 2) / 5) + 365 * y2 + Math.floor(y2 / 4) - 32083;
  }
  return jd;
}

function jdToDate(jd: number): [number, number, number] {
  let a: number;
  if (jd > 2299160) {
    const a1 = Math.floor((jd - 1867216.25) / 36524.25);
    a = jd + 1 + a1 - Math.floor(a1 / 4);
  } else {
    a = jd;
  }
  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);
  const day = b - d - Math.floor(30.6001 * e);
  const month = (e < 14) ? e - 1 : e - 13;
  const year = (month > 2) ? c - 4716 : c - 4715;
  return [day, month, year];
}

function getNewMoonDay(k: number, timeZone: number): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = Math.PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(2 * dr * Mpr);
  C1 = C1 - 0.0004 * Math.sin(3 * dr * Mpr);
  C1 = C1 + 0.0104 * Math.sin(2 * dr * F) - 0.0051 * Math.sin((M + Mpr) * dr);
  C1 = C1 - 0.0074 * Math.sin((M - Mpr) * dr) + 0.0004 * Math.sin((2 * F + M) * dr);
  C1 = C1 - 0.0004 * Math.sin((2 * F - M) * dr) - 0.0006 * Math.sin((2 * F + Mpr) * dr);
  C1 = C1 + 0.0010 * Math.sin((2 * F - Mpr) * dr) + 0.0005 * Math.sin((2 * Mpr + M) * dr);
  const deltat = 0;
  const JdNew = Jd1 + C1 - deltat;
  return Math.floor(JdNew + 0.5 + timeZone / 24);
}

function getSunLongitude(dayNumber: number, timeZone: number): number {
  const T = (dayNumber - 2451545.5 - timeZone / 24) / 36525;
  const T2 = T * T;
  const dr = Math.PI / 180;
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);
  let L = L0 + DL;
  L = L * dr;
  L = L - Math.PI * 2 * Math.floor(L / (Math.PI * 2));
  return Math.floor((L / Math.PI) * 6);
}

function getLunarMonth11(yy: number, timeZone: number): number {
  const x = jdFromDate(31, 12, yy);
  const k = Math.floor((x - 2415021.0769986) / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  const sunLong = getSunLongitude(nm, timeZone);
  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone);
  }
  return nm;
}

function getLeapMonthOffset(a11: number, timeZone: number): number {
  const k = Math.floor((a11 - 2415021.0769986) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);
  return i - 1;
}

/**
 * Chuyển đổi ngày Âm lịch sang ngày Dương lịch (theo thuật toán Hồ Ngọc Đức)
 * @returns [day, month, year] (month là 1-indexed: 1 = tháng 1, 12 = tháng 12)
 */
export function convertLunar2Solar(
  lunarDay: number,
  lunarMonth: number,
  lunarYear: number,
  lunarLeap: number = 0,
  timeZone: number = 7
): [number, number, number] {
  const a11 = getLunarMonth11(lunarYear - 1, timeZone);
  const b11 = getLunarMonth11(lunarYear, timeZone);
  const k = Math.floor((a11 - 2415021.0769986) / 29.530588853 + 0.5);
  const off = Math.floor((b11 - a11) / 29);
  let leapOff = 0;
  if (off > 12) {
    leapOff = getLeapMonthOffset(a11, timeZone);
  }
  let mOff = lunarMonth + 1;
  if (off > 12 && (lunarMonth + 2 > leapOff || (lunarMonth + 2 === leapOff && lunarLeap === 1))) {
    mOff++;
  }
  const nm = getNewMoonDay(k + mOff, timeZone);
  const jd = nm + lunarDay - 1;
  return jdToDate(jd);
}

const holidayCache = new Map<number, CalendarEvent[]>();

/**
 * Tự động tạo danh sách sự kiện ngày lễ theo Âm lịch sử dụng thuật toán Hồ Ngọc Đức
 * kết hợp cấu hình dữ liệu chuẩn từ vietnamHolidaysData.ts
 */
function generateLunarHolidays(year: number): Array<{ month: number; day: number; title: string; desc: string; priority: 'high' | 'medium' }> {
  const result: Array<{ month: number; day: number; title: string; desc: string; priority: 'high' | 'medium' }> = [];

  try {
    // 1. CHUỖI NGÀY TẾT NGUYÊN ĐÁN
    const [dTet, mTet, yTet] = convertLunar2Solar(1, 1, year, 0, 7);
    const tet1Date = new Date(yTet, mTet - 1, dTet);

    TET_HOLIDAY_CONFIG.forEach((cfg) => {
      const targetDate = new Date(tet1Date);
      targetDate.setDate(targetDate.getDate() + cfg.offsetDays);
      result.push({
        month: targetDate.getMonth(),
        day: targetDate.getDate(),
        title: cfg.title,
        desc: cfg.desc,
        priority: cfg.priority,
      });
    });

    // 2. CÁC NGÀY LỄ ÂM LỊCH VĂN HOÁ QUAN TRỌNG (Rằm tháng Giêng, Giỗ Tổ, Phật Đản, Vu Lan, Trung Thu, Táo Quân)
    LUNAR_CULTURAL_HOLIDAYS.forEach((item) => {
      const [d, m] = convertLunar2Solar(item.lunarDay, item.lunarMonth, year, 0, 7);
      result.push({
        month: m - 1,
        day: d,
        title: item.title,
        desc: item.desc,
        priority: item.priority || 'medium',
      });
    });
  } catch (err) {
    console.warn('Lỗi khi tính toán thuật toán âm dương Hồ Ngọc Đức:', err);
  }

  return result;
}

/**
 * Lấy toàn bộ ngày lễ Việt Nam (Dương lịch + Âm lịch tự động + Dynamic Backend)
 * @param year Năm cần lấy (mặc định năm hiện tại)
 */
export async function getVietnamHolidays(year: number = new Date().getFullYear()): Promise<CalendarEvent[]> {
  if (holidayCache.has(year)) {
    return holidayCache.get(year)!;
  }

  const holidays: CalendarEvent[] = [];
  const addedDates = new Set<string>();

  // 1. Kiểm tra xem có cấu hình Dynamic Holidays từ Backend API hoặc LocalStorage hay không
  // Phục vụ ghép Backend sau này mà không cần build lại code
  let customHolidays: Array<{ month: number; day: number; title: string; desc?: string; priority?: 'high' | 'medium' }> = [];
  try {
    const localSaved = localStorage.getItem('routinepulse_custom_holidays');
    if (localSaved) {
      const parsed = JSON.parse(localSaved);
      if (Array.isArray(parsed)) {
        customHolidays = parsed;
      }
    }
  } catch {
    // Bỏ qua lỗi parsing nếu có
  }

  // 2. Tự động sinh toàn bộ ngày lễ Âm lịch bằng thuật toán Hồ Ngọc Đức
  const lunarHolidays = generateLunarHolidays(year);
  lunarHolidays.forEach((lunar, idx) => {
    const dateKey = `${year}-${lunar.month}-${lunar.day}`;
    holidays.push({
      id: 920000 + year * 100 + idx,
      type: 'event',
      title: lunar.title,
      time: 'Cả ngày',
      priority: lunar.priority,
      year,
      month: lunar.month,
      day: lunar.day,
      colorTag: '#C58AF9',
      categoryId: 'holiday',
      status: 'free',
      description: lunar.desc,
    });
    addedDates.add(dateKey);
  });

  // 3. Thêm các ngày lễ Dương lịch cố định & văn hoá (từ vietnamHolidaysData)
  FIXED_CULTURAL_HOLIDAYS.forEach((fixed, idx) => {
    const dateKey = `${year}-${fixed.month}-${fixed.day}`;
    if (!addedDates.has(dateKey)) {
      holidays.push({
        id: 910000 + year * 100 + idx,
        type: 'event',
        title: fixed.title,
        time: 'Cả ngày',
        priority: fixed.priority || 'medium',
        year,
        month: fixed.month,
        day: fixed.day,
        colorTag: '#C58AF9',
        categoryId: 'holiday',
        status: 'free',
        description: fixed.desc,
      });
      addedDates.add(dateKey);
    }
  });

  // 4. Ghép các ngày lễ tùy biến từ Backend / Admin (Dynamic Holidays) nếu có
  customHolidays.forEach((custom, idx) => {
    holidays.push({
      id: 930000 + year * 100 + idx,
      type: 'event',
      title: custom.title,
      time: 'Cả ngày',
      priority: custom.priority || 'high',
      year,
      month: custom.month,
      day: custom.day,
      colorTag: '#C58AF9',
      categoryId: 'holiday',
      status: 'free',
      description: custom.desc || 'Ngày lễ cập nhật từ hệ thống quản trị',
    });
  });

  // Lưu vào cache của phiên làm việc
  holidayCache.set(year, holidays);
  return holidays;
}


