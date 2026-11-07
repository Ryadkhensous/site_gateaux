import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, Phone, User, MapPin, Eye, EyeOff, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Wilaya } from '../types';

interface AuthModalProps {
  wilayas: Wilaya[];
}

export const AuthModal: React.FC<AuthModalProps> = ({ wilayas }) => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, openAuthModal, login, register } = useAuth();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>(authModalMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthModalOpen) {
      setMode(authModalMode);
      setError(null);
      setSuccessMsg(null);
    }
  }, [authModalMode, isAuthModalOpen]);

  // Formulaire Connexion
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Formulaire Inscription
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regWilayaCode, setRegWilayaCode] = useState<number>(16);
  const [regAddress, setRegAddress] = useState('');

  if (!isAuthModalOpen) return null;

  const handleTabSwitch = (newMode: 'LOGIN' | 'REGISTER') => {
    setMode(newMode);
    setError(null);
    setSuccessMsg(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!loginIdentifier.trim() || !loginPassword) {
      setError('يرجى إدخال البريد الإلكتروني أو رقم الهاتف وكلمة المرور.');
      return;
    }

    setLoading(true);
    try {
      const res = await login({ login: loginIdentifier.trim(), password: loginPassword });
      if (!res.success) {
        setError(res.message || 'فشل تسجيل الدخول. يرجى التحقق من المعلومات المدخلة.');
      } else {
        setSuccessMsg('تم تسجيل الدخول بنجاح ! مرحباً بك.');
      }
    } catch (err: any) {
      setError(err.message || 'خطأ في الاتصال بالخادم.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = regFullName.trim();
    const cleanEmail = regEmail.trim();
    const cleanPhone = regPhone.replace(/[\s\.-]/g, '');

    if (!cleanName || !cleanEmail || !cleanPhone || !regPassword) {
      setError('يرجى ملء جميع الحقول الإلزامية.');
      return;
    }

    if (regPassword.length < 6) {
      setError('كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل.');
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        fullName: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        password: regPassword,
        wilayaCode: regWilayaCode,
        address: regAddress.trim() || undefined
      });

      if (!res.success) {
        setError(res.message || 'فشل إنشاء الحساب.');
      } else {
        setSuccessMsg('تم إنشاء حسابك بنجاح ! أهلاً بك في منصة القاطو الجزائري.');
      }
    } catch (err: any) {
      setError(err.message || 'خطأ في الاتصال بالخادم.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden transform transition-all text-right"
        dir="rtl"
      >
        {/* En-tête décoratif doré */}
        <div className="bg-gradient-to-r from-[#2D231B] via-[#4A3B32] to-[#2D231B] text-white p-6 relative">
          <button
            onClick={closeAuthModal}
            className="absolute left-4 top-4 text-stone-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-amber-300 flex items-center justify-center text-[#2D231B] font-bold shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif">حساب الزبون</h2>
              <p className="text-xs text-stone-300 font-sans">
                {mode === 'LOGIN' ? 'تسجيل الدخول لمتابعة طلبياتك وإدارتها' : 'أنشئ حسابك واستمتع بطلب وتخصيص أرقى الحلويات'}
              </p>
            </div>
          </div>

          {/* Onglets Connexion / Inscription */}
          <div className="flex items-center bg-stone-900/40 p-1 rounded-xl mt-5 border border-white/10">
            <button
              type="button"
              onClick={() => handleTabSwitch('LOGIN')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'LOGIN'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              تسجيل الدخول
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch('REGISTER')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'REGISTER'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              إنشاء حساب جديد
            </button>
          </div>
        </div>

        {/* Corps de la modale */}
        <div className="p-6">
          {/* Notification d'erreur */}
          {error && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Notification de succès */}
          {successMsg && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* FORMULAIRE CONNEXION */}
          {mode === 'LOGIN' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  البريد الإلكتروني أو رقم الهاتف
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-stone-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="example@email.dz أو 0555..."
                    className="w-full pr-9 pl-3 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  كلمة المرور
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pr-9 pl-10 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#2D231B] to-[#4A3B32] text-white font-bold text-xs rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>تسجيل الدخول</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-stone-500">ليس لديك حساب بعد؟ </span>
                <button
                  type="button"
                  onClick={() => handleTabSwitch('REGISTER')}
                  className="text-xs font-bold text-[#C85A32] hover:underline"
                >
                  أنشئ حساباً جديداً الآن
                </button>
              </div>
            </form>
          ) : (
            /* FORMULAIRE INSCRIPTION */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  الاسم الكامل <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-stone-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="مثال: ياسمين بن علي"
                    className="w-full pr-9 pl-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    رقم الهاتف <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-stone-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="0555123456"
                      className="w-full pr-9 pl-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    البريد الإلكتروني <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-stone-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="client@dz.com"
                      className="w-full pr-9 pl-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  كلمة المرور (6 أحرف على الأقل) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pr-9 pl-10 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    الولاية (69 ولاية)
                  </label>
                  <div className="relative">
                    <select
                      value={regWilayaCode}
                      onChange={(e) => setRegWilayaCode(Number(e.target.value))}
                      className="w-full py-2 px-3 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition font-sans cursor-pointer"
                    >
                      {wilayas.map((w) => (
                        <option key={w.code} value={w.code}>
                          {w.code} - {w.nameAr || w.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    العنوان الافتراضي (اختياري)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      placeholder="الحي، البلدية..."
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#D4AF37] via-amber-500 to-amber-600 text-stone-950 font-bold text-xs rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-stone-900/20 border-t-stone-900 rounded-full animate-spin" />
                ) : (
                  <>
                    <span>تأكيد التسجيل وإنشاء الحساب</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <span className="text-xs text-stone-500">لديك حساب بالفعل؟ </span>
                <button
                  type="button"
                  onClick={() => handleTabSwitch('LOGIN')}
                  className="text-xs font-bold text-[#C85A32] hover:underline"
                >
                  تسجيل الدخول هنا
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
