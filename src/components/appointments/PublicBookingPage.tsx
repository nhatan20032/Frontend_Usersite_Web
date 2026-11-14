import React, { useEffect, useState } from 'react';
import { apiClient } from '../../api/apiClient';

type Availability = { hostName: string; timezone: string; durationMinutes: number; availableSlots: Array<{ dayName: string; startTime: string; endTime: string }> };
export const PublicBookingPage: React.FC<{ slug: string }> = ({ slug }) => {
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [name, setName] = useState(''); const [email, setEmail] = useState('');
  const [time, setTime] = useState(''); const [topic, setTopic] = useState('');
  const [error, setError] = useState(''); const [bookingId, setBookingId] = useState('');
  const [pending, setPending] = useState(false);
  useEffect(() => {
    let active = true;
    apiClient.get<Availability>(`/user/appointments/public/${encodeURIComponent(slug)}`).then(data => { if (active) setAvailability(data); }).catch((e: Error) => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [slug]);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!availability || pending) return;
    setPending(true); setError('');
    try {
      const result = await apiClient.post<{ bookingId: string }>(`/user/appointments/public/${encodeURIComponent(slug)}/book`, {
        clientName: name, clientEmail: email, meetingTime: new Date(time).toISOString(), durationMinutes: availability.durationMinutes, topic,
      });
      setBookingId(result.bookingId);
    } catch (e) { setError((e as Error).message); }
    finally { setPending(false); }
  };
  return <main className="min-h-screen bg-[var(--surface-canvas)] text-[var(--text-primary)] p-8 flex justify-center">
    <div className="w-full max-w-lg space-y-5">
      <h1 className="text-2xl font-bold">Đặt lịch với {availability?.hostName || 'RoutinePulse'}</h1>
      {error && <p role="alert" className="text-red-400">{error}</p>}
      {bookingId ? <p role="status">Đã đặt lịch thành công. Mã lịch hẹn: {bookingId}</p> : availability && <>
        <p>Múi giờ của chủ lịch: {availability.timezone}. Thời lượng: {availability.durationMinutes} phút.</p>
        <ul>{availability.availableSlots.map((slot, i) => <li key={i}>{slot.dayName}: {slot.startTime} – {slot.endTime}</li>)}</ul>
        <form onSubmit={submit} className="space-y-4">
          <label className="block">Họ tên<input required maxLength={150} value={name} onChange={e => setName(e.target.value)} className="block w-full p-2 rounded bg-[var(--surface-container-high)]" /></label>
          <label className="block">Email<input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="block w-full p-2 rounded bg-[var(--surface-container-high)]" /></label>
          <label className="block">Thời gian (múi giờ thiết bị của bạn)<input required type="datetime-local" value={time} onChange={e => setTime(e.target.value)} className="block w-full p-2 rounded bg-[var(--surface-container-high)]" /></label>
          <label className="block">Chủ đề<input maxLength={250} value={topic} onChange={e => setTopic(e.target.value)} className="block w-full p-2 rounded bg-[var(--surface-container-high)]" /></label>
          <button disabled={pending} className="bg-[var(--google-blue-primary)] rounded p-3 w-full">{pending ? 'Đang đặt lịch…' : 'Đặt lịch hẹn'}</button>
        </form>
      </>}
    </div>
  </main>;
};
