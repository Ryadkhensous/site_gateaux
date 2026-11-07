import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Phone,
  MapPin,
  Lock,
  Package,
  Clock,
  CheckCircle,
  Truck,
  LogOut,
  Save,
  AlertCircle,
  Eye,
  EyeOff,
  ShoppingBag,
  ExternalLink,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Wilaya, Order } from '../types';
import { formatDZD } from '../utils/format';

interface ProfileModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  wilayas: Wilaya[];
  onTrackOrder: (orderNumber: string) => void;
  onGoToShop?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  wilayas,
  onTrackOrder,
  onGoToShop
}) => {
  const { user, orders, updateProfile, logout, refreshProfile, isProfileModalOpen, closeProfileModal } = useAuth();
  const isOpen = propIsOpen !== undefined ? propIsOpen : isProfileModalOpen;
  const onClose = propOnClose !== undefined ? propOnClose : closeProfileModal;
  const [activeTab, setActiveTab] = useState<'INFO' | 'ORDERS'>('INFO');

  // Form states for profile update
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [wilayaCode, setWilayaCode] = useState<number>(16);
  const [address, setAddress] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync state when user profile opens
  useEffect(() => {
    if (user && isOpen) {
      setFullName(user.fullName || '');
      setPhone(user.phone || '');
      setWilayaCode(user.wilayaCode || 16);
      setAddress(user.address || '');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMsg(null);
      setErrorMsg(null);
      refreshProfile();
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanPhone = phone.replace(/[\s\.-]/g, '');
    const dzPhoneRegex = /^(0|\+213)[5-7][0-9]{8}$/;
    if (!dzPhoneRegex.test(cleanPhone) && cleanPhone.length < 9) {
      setErrorMsg('يرجى إدخال رقم هاتف جزائري صحيح (مثال: 0555123456 أو 0661123456 أو 0770123456)');
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        setErrorMsg('كلمة المرور الجديدة يجب ألا تقل عن 6 أحرف');
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg('كلمتا المرور غير متطابقتين');
        return;
      }
    }

    setSaving(true);
    const res = await updateProfile({
      fullName: fullName.trim(),
      phone: cleanPhone,
      wilayaCode,
      address: address.trim(),
      newPassword: newPassword || undefined
    });
    setSaving(false);

    if (res.success) {
      setSuccessMsg('تم حفظ وتحديث معلوماتك بنجاح!');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setErrorMsg(res.message || 'حدث خطأ أثناء حفظ التعديلات');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            تم التسليم بنجاح
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
            <Truck className="w-3 h-3 text-blue-600" />
            في طريق التوصيل
          </span>
        );
      case 'IN_PREPARATION':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3 text-amber-600 animate-spin-slow" />
            قيد الإعداد والتزيين
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">
            <CheckCircle className="w-3 h-3 text-purple-600" />
            تم تأكيد الحجز
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
            ملغاة
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-100 text-stone-800">
            <Clock className="w-3 h-3 text-stone-600" />
            في انتظار المعالجة
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/60 backdrop-blur-xs animate-fadeIn" dir="rtl">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* رأس النافذة (Modal Header) */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-stone-900 via-[#3D1A24] to-[#E84375] text-white flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-xl font-bold shadow-inner border border-white/20">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-white flex items-center gap-2">
                <span>{user.fullName}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-pink-500/30 text-pink-200 border border-pink-400/30">
                  عميل مميز DZ
                </span>
              </h3>
              <p className="text-xs text-stone-300 font-mono mt-0.5">
                {user.email || user.phone}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* أزرار التبويب (Tab Selector) */}
        <div className="flex border-b border-stone-200 bg-stone-50/70 px-4 pt-2">
          <button
            onClick={() => setActiveTab('INFO')}
            className={`flex-1 py-3 px-4 font-bold text-sm flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'INFO'
                ? 'border-[#E84375] text-[#E84375] bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>بيانات الحساب والعنوان</span>
          </button>

          <button
            onClick={() => setActiveTab('ORDERS')}
            className={`flex-1 py-3 px-4 font-bold text-sm flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'ORDERS'
                ? 'border-[#E84375] text-[#E84375] bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>طلباتي ({orders.length})</span>
          </button>
        </div>

        {/* المحتوى الداخلي مع شريط تمرير أنيق */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'INFO' ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              {errorMsg && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center gap-2 font-bold">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* الاسم الكامل */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    الاسم الكامل
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full pr-9 pl-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-[#E84375] text-right font-medium"
                    />
                  </div>
                </div>

                {/* رقم الهاتف */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    رقم الهاتف (الجزائر)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      dir="ltr"
                      placeholder="0555123456"
                      className="w-full pr-9 pl-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-[#E84375] text-right font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* الولاية */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  الولاية الافتراضية للتوصيل (من بين 69 ولاية)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#E84375] absolute right-3 top-3 pointer-events-none" />
                  <select
                    value={wilayaCode}
                    onChange={(e) => setWilayaCode(Number(e.target.value))}
                    className="w-full pr-9 pl-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-[#E84375] text-right font-medium cursor-pointer"
                  >
                    {wilayas.map((w) => (
                      <option key={w.code} value={w.code}>
                        {w.code.toString().padStart(2, '0')} - {w.nameAr} ({w.name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* العنوان بالتفصيل */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  عنوان السكن أو التوصيل الافتراضي
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="مثال: حي النور، عمارة ب، الطابق الثاني، باب الزوار، الجزائر"
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-[#E84375] text-right font-medium resize-none"
                />
              </div>

              {/* تغيير كلمة المرور (اختياري) */}
              <div className="pt-3 border-t border-stone-200">
                <h4 className="text-xs font-bold text-stone-900 mb-2 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-stone-500" />
                  <span>تغيير كلمة المرور (اتركه فارغاً إذا كنت لا ترغب بالتغيير)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="كلمة مرور جديدة (6 خانات على الأقل)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pr-3 pl-9 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-[#E84375] text-right font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-3 text-stone-400 hover:text-stone-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="تأكيد كلمة المرور الجديدة"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-[#E84375] text-right font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* زر الحفظ */}
              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#E84375] hover:bg-[#D83264] text-white text-xs font-bold rounded-xl shadow-md shadow-pink-200 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* تبويب سجل الطلبات (Orders Tab) */
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-10 px-4 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-pink-50 flex items-center justify-center text-[#E84375] border border-pink-100 shadow-xs">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-stone-800">لا توجد لديك طلبات سابقة حتى الآن</h4>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                      اكتشف تشكيلة الحلويات الفاخرة المخبوزة طازجة خصيصاً لمناسباتكم، أو صمم كعكتك الفريدة الآن!
                    </p>
                  </div>
                  {onGoToShop && (
                    <button
                      onClick={() => {
                        onClose();
                        onGoToShop();
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E84375] hover:bg-[#D83264] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>تصفح متجر الحلويات</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.id || ord.orderNumber}
                      className="p-4 bg-stone-50/80 hover:bg-pink-50/30 border border-stone-200 hover:border-pink-200 rounded-2xl transition-all space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/60 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-stone-900 bg-white px-2.5 py-1 rounded-lg border border-stone-200 shadow-2xs">
                            {ord.orderNumber}
                          </span>
                          <span className="text-[11px] text-stone-400 flex items-center gap-1 font-mono">
                            <Calendar className="w-3 h-3" />
                            {new Date(ord.createdAt).toLocaleDateString('ar-DZ', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div>
                          {getStatusBadge(ord.status)}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-xs font-bold text-stone-800">
                            {ord.customization?.flavorName ? `كعكة مخصصة (${ord.customization.flavorName})` : 'طلب حلويات فاخرة'}
                          </p>
                          <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#E84375]" />
                            <span>توصيل إلى {ord.deliveryWilayaName || `ولاية رقم ${ord.deliveryWilayaCode}`}</span>
                          </p>
                        </div>

                        <div className="text-left flex items-center gap-3">
                          <div className="text-right sm:text-left">
                            <span className="text-xs text-stone-400 block">المجموع:</span>
                            <span className="text-sm font-bold text-[#E84375] font-mono">
                              {formatDZD(ord.totalPriceDZD)}
                            </span>
                          </div>

                          <button
                            onClick={() => {
                              onClose();
                              onTrackOrder(ord.orderNumber);
                            }}
                            className="px-3.5 py-1.5 bg-white hover:bg-[#E84375] text-[#E84375] hover:text-white border border-[#E84375]/40 hover:border-[#E84375] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>تتبع مسار الطلب</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* تذييل النافذة مع زر تسجيل الخروج (Modal Footer) */}
        <div className="p-4 bg-stone-100/80 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="px-4 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج من الحساب</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
