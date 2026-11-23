import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Sparkles } from 'lucide-react';

export const AuthForm: React.FC = () => {
  const { loginWithApi, registerWithApi } = useAuth();
  const [error, setError] = useState('');
  const [register, setRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [referralCode, setReferralCode] = useState(new URLSearchParams(window.location.search).get('ref') || '');
  const [pending, setPending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    setError('');
    const ok = register
      ? await registerWithApi(email, password, fullName, undefined, referralCode || undefined)
      : await loginWithApi(email, password);
    setPending(false);
    if (!ok) setError('Email hoặc mật khẩu không chính xác.');
  };

  const inputClass =
    'w-full bg-[var(--surface-container-high)] border border-[var(--border-subtle)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--google-blue)] focus:border-transparent transition-all';

  return (
    <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-center gap-6 bg-[var(--surface-container)] text-[var(--text-primary)]">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs text-[var(--google-blue)] font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>RoutinePulse Platform</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          {register ? 'Đăng ký tài khoản' : 'Đăng nhập vào hệ thống'}
        </h1>
        <p className="text-xs text-[var(--text-secondary)]">
          {register
            ? 'Khởi tạo không gian làm việc cá nhân và quản lý kỷ luật.'
            : 'Chào mừng quay trở lại với lịch trình làm việc của bạn.'}
        </p>
      </div>

      {error && (
        <div role="alert" className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-xs text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        {register && (
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[var(--text-secondary)]">Họ và tên</label>
            <div className="relative">
              <input
                required
                autoComplete="name"
                placeholder="Nguyễn Văn A"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        )}

        {register && (
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[var(--text-secondary)]">Mã giới thiệu (không bắt buộc)</label>
            <input
              placeholder="Nhập mã nếu có"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className={inputClass}
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-[var(--text-secondary)]">Địa chỉ Email</label>
          <input
            required
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-[var(--text-secondary)]">Mật khẩu</label>
          <div className="relative">
            <input
              required
              type={showPassword ? 'text' : 'password'}
              minLength={register ? 8 : undefined}
              autoComplete={register ? 'new-password' : 'current-password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          disabled={pending}
          className="w-full rounded-lg bg-[var(--google-blue-primary)] hover:bg-[#1B66CA] text-white font-medium p-3 text-sm transition-all disabled:opacity-50 cursor-pointer shadow-sm active:scale-[0.99] flex items-center justify-center gap-2"
        >
          {pending ? (
            <span>Đang xử lý…</span>
          ) : (
            <span>{register ? 'Đăng ký tài khoản' : 'Đăng nhập'}</span>
          )}
        </button>
      </form>

      <div className="pt-2 text-center text-xs">
        <button
          type="button"
          onClick={() => {
            setRegister(!register);
            setError('');
          }}
          className="text-[var(--google-blue)] hover:underline font-medium cursor-pointer"
        >
          {register ? 'Đã có tài khoản? Đăng nhập ngay' : 'Chưa có tài khoản? Tạo tài khoản mới'}
        </button>
      </div>
    </div>
  );
};
