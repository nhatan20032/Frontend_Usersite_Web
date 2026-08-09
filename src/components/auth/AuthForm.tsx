import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Calendar, Mail, Lock, Smartphone, ArrowRight, Sparkles, Crown } from 'lucide-react';

export const AuthForm: React.FC = () => {
  const { login, setRole } = useAuth();
  const { showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'otp' | 'register'>('login');
  const [email, setEmail] = useState<string>('an.nguyen@routinepulse.com');
  const [password, setPassword] = useState<string>('123456');
  const [otp, setOtp] = useState<string>('');
  const [fullName, setFullName] = useState<string>('Nguyễn Văn An');
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'login') {
      login({ email, name: 'Nguyễn Văn An' });
      showToast('Đăng nhập thành công', 'Chào mừng bạn quay trở lại RoutinePulse!', 'success');
    } else if (activeTab === 'otp') {
      login({ email, name: 'Người dùng OTP' });
      showToast('Xác thực OTP thành công', 'Đã đăng nhập thành công vào hệ thống.', 'success');
    } else {
      login({ email, name: fullName });
      showToast('Đăng ký thành công', 'Tài khoản của bạn đã được khởi tạo!', 'success');
    }
  };

  const handleQuickDemo = (role: 'FREE' | 'TRIAL' | 'PREMIUM', name: string) => {
    login({ name, role });
    setRole(role);
    showToast('Đăng nhập nhanh Demo', `Đã truy cập với tư cách tài khoản [${role}].`, 'success');
  };

  return (
    <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6">
      {/* Top Branding */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-md shadow-blue-500/20">
            <Calendar className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-900">RoutinePulse</span>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200/80">
          User Portal
        </span>
      </div>

      {/* Center Auth Content */}
      <div className="space-y-5 max-w-sm w-full mx-auto">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {activeTab === 'login' && 'Đăng nhập tài khoản'}
            {activeTab === 'otp' && 'Đăng nhập bằng mã OTP'}
            {activeTab === 'register' && 'Đăng ký tài khoản mới'}
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            {activeTab === 'login' && 'Quản lý lịch trình, thói quen và sự kiện đa thiết bị.'}
            {activeTab === 'otp' && 'Nhập mã xác thực gửi về điện thoại hoặc email.'}
            {activeTab === 'register' && 'Tạo không gian lịch trình cá nhân hóa miễn phí ngay.'}
          </p>
        </div>

        {/* Auth Method Tabs (iOS Segmented Style) */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/60 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'login'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Mật khẩu
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('otp')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'otp'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Mã OTP
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'register'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Tạo tài khoản
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {activeTab === 'register' && (
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Họ và tên:</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-sans"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">
              {activeTab === 'otp' ? 'Số điện thoại hoặc Email:' : 'Địa chỉ Email:'}
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                {activeTab === 'otp' ? <Smartphone className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
              </div>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={activeTab === 'otp' ? '0987 654 321 hoặc an.nguyen@email.com' : 'name@example.com'}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-sans"
              />
            </div>
          </div>

          {activeTab === 'otp' ? (
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-700">Mã xác thực OTP (6 chữ số):</label>
                <button
                  type="button"
                  onClick={() => showToast('Gửi lại OTP', 'Mã OTP mới: 888999', 'info')}
                  className="text-[11px] text-blue-600 font-semibold hover:underline"
                >
                  Gửi lại mã (60s)
                </button>
              </div>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Ví dụ: 888999"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-center font-mono tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-700">Mật khẩu:</label>
                {activeTab === 'login' && (
                  <button
                    type="button"
                    onClick={() => showToast('Quên mật khẩu', 'Đã gửi liên kết đặt lại mật khẩu về email của bạn.', 'info')}
                    className="text-[11px] text-blue-600 font-semibold hover:underline"
                  >
                    Quên mật khẩu?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-sans"
                />
              </div>
            </div>
          )}

          {activeTab === 'login' && (
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs">Ghi nhớ đăng nhập trên thiết bị này</span>
            </label>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 text-xs"
          >
            <span>
              {activeTab === 'login' && 'Đăng nhập RoutinePulse'}
              {activeTab === 'otp' && 'Xác nhận & Đăng nhập'}
              {activeTab === 'register' && 'Khởi tạo tài khoản ngay'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Bypass Switcher */}
        <div className="border-t border-slate-200/80 pt-4 space-y-2">
          <div className="text-center text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
            Hoặc truy cập nhanh chế độ Demo
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('FREE', 'Nguyễn Văn An (Free)')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-xs transition-colors"
            >
              Free User
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('TRIAL', 'Trần Bảo Ngọc (Trial)')}
              className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 font-bold text-xs transition-colors flex items-center justify-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>7D Trial</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('PREMIUM', 'Lê Hoàng Long (VIP)')}
              className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 font-bold text-xs transition-colors flex items-center justify-center gap-1"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>VIP 1 Năm</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Security Note */}
      <div className="text-center text-[11px] text-slate-400">
        Bảo mật 2 lớp SSL 256-bit • Mã hóa dữ liệu End-to-End RoutinePulse
      </div>
    </div>
  );
};
