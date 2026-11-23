import React, { useEffect, useState } from 'react';
import { apiClient } from '../../api/apiClient';
import {
  Calendar,
  Clock,
  Globe,
  CheckCircle2,
  AlertCircle,
  CalendarCheck,
} from 'lucide-react';

type Availability = {
  hostName: string;
  timezone: string;
  durationMinutes: number;
  availableSlots: Array<{ dayName: string; startTime: string; endTime: string }>;
};

export const PublicBookingPage: React.FC<{ slug: string }> = ({ slug }) => {
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [time, setTime] = useState('');
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let active = true;
    apiClient
      .get<Availability>(`/user/appointments/public/${encodeURIComponent(slug)}`)
      .then((data) => {
        if (active) setAvailability(data);
      })
      .catch((e: Error) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!availability || pending) return;
    setPending(true);
    setError('');
    try {
      const result = await apiClient.post<{ bookingId: string }>(
        `/user/appointments/public/${encodeURIComponent(slug)}/book`,
        {
          clientName: name,
          clientEmail: email,
          meetingTime: new Date(time).toISOString(),
          durationMinutes: availability.durationMinutes,
          topic,
        }
      );
      setBookingId(result.bookingId);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setPending(false);
    }
  };

  const inputClass =
    'w-full bg-[var(--surface-container-high)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--google-blue)] focus:border-transparent transition-all';

  return (
    <main className="min-h-screen bg-[var(--surface-canvas)] text-[var(--text-primary)] p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-xl bg-[var(--surface-container)] border border-[var(--border-grid)] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in duration-200">
        {/* Host Header Card */}
        <div className="border-b border-[var(--border-grid)] pb-5 space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--google-blue-primary)]/15 border border-[var(--google-blue-primary)]/30 flex items-center justify-center text-[var(--google-blue)] shrink-0">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[var(--google-blue)] uppercase tracking-wider">
                Lịch Hẹn Trực Tuyến
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                {availability ? `Đặt lịch hẹn với ${availability.hostName}` : 'Đang tải lịch hẹn…'}
              </h1>
            </div>
          </div>

          {availability && (
            <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-secondary)] pt-1">
              <span className="flex items-center gap-1.5 bg-[var(--surface-container-high)] px-2.5 py-1 rounded-full border border-[var(--border-subtle)]">
                <Clock className="w-3.5 h-3.5 text-[var(--google-blue)]" />
                <span>{availability.durationMinutes} phút</span>
              </span>
              <span className="flex items-center gap-1.5 bg-[var(--surface-container-high)] px-2.5 py-1 rounded-full border border-[var(--border-subtle)]">
                <Globe className="w-3.5 h-3.5 text-[#81C995]" />
                <span>Múi giờ: {availability.timezone}</span>
              </span>
            </div>
          )}
        </div>

        {error && (
          <div role="alert" className="flex items-start gap-2.5 p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {bookingId ? (
          <div role="status" className="p-6 bg-[#1E8E3E]/10 border border-[#1E8E3E]/30 rounded-xl space-y-3 text-center">
            <CheckCircle2 className="w-12 h-12 text-[#81C995] mx-auto" />
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Đặt lịch thành công!</h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Mã xác nhận lịch hẹn của bạn:
            </p>
            <div className="font-mono text-base font-bold bg-[var(--surface-container-high)] border border-[var(--border-subtle)] py-2 px-4 rounded-lg inline-block text-[var(--google-blue)]">
              {bookingId}
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Thông tin chi tiết đã được gửi đến email <b className="text-[var(--text-primary)]">{email}</b>.
            </p>
          </div>
        ) : (
          availability && (
            <div className="space-y-5">
              {/* Available Slots Overview */}
              {availability.availableSlots.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[var(--text-secondary)] block">
                    Khung giờ làm việc tiếp nhận:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {availability.availableSlots.map((slot, i) => (
                      <span
                        key={i}
                        className="text-xs font-mono bg-[var(--surface-container-high)] border border-[var(--border-subtle)] text-[var(--text-primary)] px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#81C995]" />
                        <span>{slot.dayName}: {slot.startTime} – {slot.endTime}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking Form */}
              <form onSubmit={submit} className="space-y-4 pt-1">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[var(--text-secondary)]">
                    Họ và tên của bạn
                  </label>
                  <input
                    required
                    maxLength={150}
                    placeholder="Nguyễn Văn A"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[var(--text-secondary)]">
                    Địa chỉ Email liên hệ
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[var(--text-secondary)]">
                    Thời gian cuộc hẹn (theo giờ trên thiết bị của bạn)
                  </label>
                  <input
                    required
                    type="datetime-local"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[var(--text-secondary)]">
                    Chủ đề hoặc nội dung trao đổi
                  </label>
                  <input
                    maxLength={250}
                    placeholder="VD: Trao đổi về lộ trình công việc..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <button
                  disabled={pending}
                  className="w-full bg-[var(--google-blue-primary)] hover:bg-[#1B66CA] text-white font-semibold py-3 px-4 rounded-lg shadow-sm text-sm transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{pending ? 'Đang xác nhận lịch hẹn…' : 'Xác nhận đặt lịch hẹn'}</span>
                </button>
              </form>
            </div>
          )
        )}
      </div>
    </main>
  );
};
