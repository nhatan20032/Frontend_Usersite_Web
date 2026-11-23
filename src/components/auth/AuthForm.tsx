import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export const AuthForm: React.FC = () => {
  const { loginWithApi, registerWithApi } = useAuth();
  const [error, setError] = useState('');
  const [register, setRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [referralCode, setReferralCode] = useState(new URLSearchParams(window.location.search).get('ref') || '');
  const [pending, setPending] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); if (pending) return;
    setPending(true); setError('');
    const ok = register ? await registerWithApi(email, password, fullName, undefined, referralCode || undefined) : await loginWithApi(email, password);
    setPending(false);
    if (!ok) setError('Không thể xác thực');
  };
  const inputClass = 'w-full bg-[var(--surface-container)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)]';
  return <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-center gap-6 bg-[#161718] text-[var(--text-primary)]">
    <h1 className="text-2xl font-bold">RoutinePulse</h1>
    <h2>{register ? 'Đăng ký tài khoản' : 'Đăng nhập'}</h2>
    {error && <p role="alert" className="text-red-400">{error}</p>}
    <form onSubmit={submit} className="space-y-4">
      {register && <label className="block">Họ tên<input required autoComplete="name" value={fullName} onChange={e => setFullName(e.target.value)} className={inputClass} /></label>}
      {register && <label className="block">Mã giới thiệu (không bắt buộc)<input value={referralCode} onChange={e => setReferralCode(e.target.value)} className={inputClass} /></label>}
      <label className="block">Email<input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} /></label>
      <label className="block">Mật khẩu<input required type="password" minLength={register ? 8 : undefined} autoComplete={register ? 'new-password' : 'current-password'} value={password} onChange={e => setPassword(e.target.value)} className={inputClass} /></label>
      <button disabled={pending} className="w-full rounded-lg bg-[var(--google-blue-primary)] p-3 disabled:opacity-50">{pending ? 'Đang xử lý…' : register ? 'Đăng ký' : 'Đăng nhập'}</button>
    </form>
    <button type="button" onClick={() => setRegister(!register)} className="text-[var(--google-blue)]">{register ? 'Đã có tài khoản? Đăng nhập' : 'Tạo tài khoản mới'}</button>
  </div>;
};
