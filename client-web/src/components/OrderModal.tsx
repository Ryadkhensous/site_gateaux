import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Banknote, 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  CheckCircle2, 
  ArrowLeft, 
  FileText, 
  Sparkles,
  Smartphone,
  ChevronDown,
  ChevronUp,
  Receipt,
  BadgeCheck,
  Coins
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Wilaya } from '../types';
import { api } from '../services/api';
import { formatDZD } from '../utils/format';
import { useAuth } from '../context/AuthContext';
import { ReceiptModal } from './ReceiptModal';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: any;
  wilayas: Wilaya[];
  onOrderSuccess: (order: any) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  config,
  wilayas,
  onOrderSuccess
}) => {
  if (!isOpen) return null;

  const { user, isAuthenticated } = useAuth();

  // حالة استمارة الحجز
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [idDocType, setIdDocType] = useState<'CNI' | 'PASSEPORT' | 'PERMIS'>('CNI');
  const [idDocNumber, setIdDocNumber] = useState('');
  const [showOptionalDoc, setShowOptionalDoc] = useState(false);
  const [deliveryWilayaCode, setDeliveryWilayaCode] = useState<number>(16); // الجزائر العاصمة افتراضياً
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // Pré-remplissage automatique des coordonnées du client connecté
  useEffect(() => {
    if (user && isOpen) {
      if (user.fullName) setCustomerName(user.fullName);
      if (user.phone) setCustomerPhone(user.phone);
      if (user.wilayaCode) setDeliveryWilayaCode(user.wilayaCode);
      if (user.address) setDeliveryAddress(user.address);
    }
  }, [user, isOpen]);

  const [eventDate, setEventDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [isB2B, setIsB2B] = useState(Boolean(config.isB2B));
  const [companyName, setCompanyName] = useState('');
  const [companyNIF, setCompanyNIF] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH_ON_DELIVERY' | 'BARIDIMOB' | 'CIB_EDAHABIA'>('CASH_ON_DELIVERY');

  // خيارات الدفع: عربون 30% أو 50% أو دفع كامل 100%
  const [paymentType, setPaymentType] = useState<'DEPOSIT_30' | 'DEPOSIT_50' | 'FULL'>('DEPOSIT_30');
  const [notes, setNotes] = useState(config.notes || config.messageOnCake ? `العبارة المكتوبة: ${config.messageOnCake || ''}` : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<any | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const calculatedTotal = config.totalPriceDZD || config.priceDZD || 8500;
  
  // حساب العربون والمتبقي تلقائياً
  const calculatedDeposit = paymentType === 'DEPOSIT_30'
    ? Math.round(calculatedTotal * 0.3)
    : paymentType === 'DEPOSIT_50'
    ? Math.round(calculatedTotal * 0.5)
    : calculatedTotal;

  const calculatedRemaining = Math.max(0, calculatedTotal - calculatedDeposit);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);

    const cleanPhone = customerPhone.replace(/[\s\.-]/g, '');
    const cleanName = customerName.trim();
    const cleanAddress = deliveryAddress.trim();

    if (!cleanName || !cleanPhone || !cleanAddress || !eventDate) {
      setError('يرجى ملء جميع الحقول المطلوبة (الاسم الكامل، رقم الهاتف، ولاية الاستلام، العنوان وتاريخ التسليم).');
      return;
    }

    // Validation du numéro de téléphone algérien (Mobilis, Djezzy, Ooredoo)
    const dzPhoneRegex = /^(0|\+213)[5-7][0-9]{8}$/;
    if (!dzPhoneRegex.test(cleanPhone) && cleanPhone.length < 9) {
      setError('يرجى إدخال رقم هاتف جزائري صحيح (مثال: 0555123456 أو 0661123456 أو 0770123456).');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        artisanId: config.artisanId || 'art-1',
        productId: config.productId,
        customerName: cleanName,
        customerPhone: cleanPhone,
        customerIdDocType: idDocType,
        customerIdDocNumber: idDocNumber.trim() || 'DZ-CLIENT-WEB',
        deliveryWilayaCode,
        deliveryAddress: cleanAddress,
        eventDate: new Date(eventDate).toISOString(),
        isB2B,
        companyName: isB2B ? companyName.trim() : undefined,
        companyNIF: isB2B ? companyNIF.trim() : undefined,
        paymentMethod,
        paymentType,
        depositAmountDZD: calculatedDeposit,
        remainingAmountDZD: calculatedRemaining,
        isDepositPaid: true,
        totalPriceDZD: calculatedTotal,
        notes: notes.trim() || undefined,
        customization: {
          sizeName: config.sizeName,
          servingsCount: config.servingsCount,
          flavorName: config.flavorName,
          fillingName: config.fillingName,
          colorName: config.colorName,
          colorHex: config.colorHex,
          toppingsList: config.toppingsList,
          extra3dType: config.extra3dType,
          photoUrl: config.photoUrl,
          messageOnCake: config.messageOnCake
        }
      };

      const result = await api.createOrder(payload);

      if (result.success && result.data) {
        setCreatedOrder(result.data);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } else {
        setError(result.message || 'حدث خطأ أثناء حفظ الطلبية.');
      }
    } catch (err: any) {
      setError(err.message || 'خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  const handleFinishAndTrack = () => {
    if (createdOrder) {
      onOrderSuccess(createdOrder);
      onClose();
    }
  };

  const minDateString = new Date().toISOString().split('T')[0];

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 text-right">
        <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-pink-100 relative animate-fadeIn overflow-hidden">
          
          {/* شريط الرأس الثابت - Header */}
          <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-pink-50 text-[#E84375] flex items-center justify-center font-bold text-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E84375] block">
                  تأكيد وحجز الطلبية
                </span>
                <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-tight">
                  استمارة التوصيل وتأكيد الحجز
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="إغلاق"
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors shadow-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* شاشة النجاح بعد التسجيل */}
          {createdOrder ? (
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200 shadow-sm animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h4 className="text-2xl font-bold text-stone-900">
                  تم تسجيل وتأكيد طلبيتك بنجاح!
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 font-normal">
                  تم إرسال تفاصيل طلبك مباشرة إلى ورشة الحرفي لبدء جدولة مراحل التصنيع والتزيين.
                </p>
              </div>

              {/* تفاصيل الحساب المالي والعربون */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-right space-y-3 max-w-md mx-auto">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <span className="text-xs text-stone-500 font-bold">رقم تتبع الطلبية :</span>
                  <span className="text-base font-mono font-extrabold text-[#E84375]">
                    {createdOrder.orderNumber}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="p-2 bg-white rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-400 font-bold block mb-0.5">الإجمالي</span>
                    <span className="text-xs font-mono font-extrabold text-stone-900 block" dir="ltr">
                      {formatDZD(createdOrder.totalPriceDZD || calculatedTotal)}
                    </span>
                    <span className="text-[9px] text-stone-500">دج</span>
                  </div>

                  <div className="p-2 bg-pink-50 rounded-xl border border-pink-200">
                    <span className="text-[10px] text-[#E84375] font-bold block mb-0.5">العربون المدفوع</span>
                    <span className="text-xs font-mono font-extrabold text-[#E84375] block" dir="ltr">
                      {formatDZD(createdOrder.depositAmountDZD || calculatedDeposit)}
                    </span>
                    <span className="text-[9px] text-pink-600">دج</span>
                  </div>

                  <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-emerald-700 font-bold block mb-0.5">المتبقي عند التسليم</span>
                    <span className="text-xs font-mono font-extrabold text-emerald-800 block" dir="ltr">
                      {formatDZD(createdOrder.remainingAmountDZD !== undefined ? createdOrder.remainingAmountDZD : calculatedRemaining)}
                    </span>
                    <span className="text-[9px] text-emerald-700">دج</span>
                  </div>
                </div>

                {createdOrder.receiptNumber && (
                  <div className="flex items-center justify-between pt-1 text-[11px] text-stone-500">
                    <span>رقم وصل التسديد :</span>
                    <span className="font-mono font-bold text-stone-700">{createdOrder.receiptNumber}</span>
                  </div>
                )}
              </div>

              {/* زر استعراض وتحميل الوصل الرسمي */}
              <div className="pt-2 flex flex-col gap-2.5 max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => setShowReceiptModal(true)}
                  className="w-full py-3.5 px-4 bg-gradient-to-l from-pink-600 to-[#E84375] hover:from-pink-700 hover:to-[#d83768] text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md shadow-pink-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Receipt className="w-4 h-4" />
                  <span>عرض وتحميل وصل تسديد العربون (طباعة / PDF)</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={handleFinishAndTrack}
                    className="flex-1 py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>متابعة خطوات التصنيع بالورشة</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={onClose}
                    className="px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* استمارة إدخال بيانات الزبون والطلب */
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
              
              {/* المحتوى القابل للتمرير بسلاسة - Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-5 space-y-5 overscroll-contain">
                
                {/* ملخص المنتج والسعر */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-l from-pink-50/90 to-stone-50/80 border border-pink-100 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E84375] block">
                      الطلب المحدد
                    </span>
                    <h4 className="font-bold text-stone-900 text-sm truncate">
                      {config.name || config.sizeName || 'كعكة مخصصة فاخرة'}
                    </h4>
                    {config.flavorName && (
                      <span className="text-[11px] text-stone-500 block truncate">
                        نكهة: {config.flavorName} {config.servingsCount ? `• ${config.servingsCount} قطعة` : ''}
                      </span>
                    )}
                  </div>
                  <div className="text-left flex-shrink-0">
                    <span className="text-[10px] font-bold text-stone-400 block mb-0.5">المبلغ الإجمالي</span>
                    <div className="inline-flex items-baseline gap-1" dir="rtl">
                      <span dir="ltr" className="text-lg font-mono font-extrabold text-[#E84375] tracking-tight">
                        {formatDZD(calculatedTotal)}
                      </span>
                      <span className="text-xs text-stone-700 font-bold">دج</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs text-center font-medium">
                    {error}
                  </div>
                )}

                {/* إشعار ملء البيانات تلقائياً للعميل المسجل */}
                {isAuthenticated && user && (
                  <div className="p-3 bg-pink-50/70 border border-pink-200/80 rounded-xl flex items-center justify-between text-xs text-stone-800">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#E84375] text-white flex items-center justify-center shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      </span>
                      <span>
                        مرحباً <strong className="text-[#E84375]">{user.fullName}</strong>، تم ملء بياناتك وعنوانك تلقائياً!
                      </span>
                    </div>
                  </div>
                )}

                {/* القسم 1 : هوية الزبون والاتصال */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-stone-800 text-xs font-bold border-b border-stone-100 pb-1.5">
                    <User className="w-3.5 h-3.5 text-[#E84375]" />
                    <span>1. معلومات الاتصال بالزبون</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">
                        الاسم واللقب الكامل <span className="text-[#E84375]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="مثال: أمينة بلقاسم"
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#E84375]/30 focus:border-[#E84375]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">
                        رقم الهاتف المحمول <span className="text-[#E84375]">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="05 / 06 / 07 XX XX XX"
                          className="w-full p-2.5 pl-8 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#E84375]/30 focus:border-[#E84375] font-mono text-left"
                        />
                        <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* خيار وثيقة الهوية (اختياري / قابل للتوسيع) */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setShowOptionalDoc(!showOptionalDoc)}
                      className="text-[11px] font-semibold text-stone-500 hover:text-[#E84375] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>معلومات وثيقة الهوية الرسمية (اختياري)</span>
                      {showOptionalDoc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {showOptionalDoc && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 p-3 bg-stone-50 rounded-xl border border-stone-200 animate-fadeIn">
                        <div>
                          <label className="text-[10px] font-bold text-stone-600 block mb-1">
                            نوع الوثيقة
                          </label>
                          <select
                            value={idDocType}
                            onChange={(e) => setIdDocType(e.target.value as any)}
                            className="w-full p-2 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#E84375]/30"
                          >
                            <option value="CNI">بطاقة التعريف الوطنية (CNI)</option>
                            <option value="PASSEPORT">جواز السفر (Passeport)</option>
                            <option value="PERMIS">رخصة السياقة (Permis)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-stone-600 block mb-1">
                            رقم الوثيقة
                          </label>
                          <input
                            type="text"
                            value={idDocNumber}
                            onChange={(e) => setIdDocNumber(e.target.value)}
                            placeholder="رقم الوثيقة (اختياري)"
                            className="w-full p-2 bg-white border border-stone-200 rounded-lg text-xs font-mono text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#E84375]/30"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* القسم 2 : اللوجستيك ومكان وتاريخ التسليم */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-stone-800 text-xs font-bold border-b border-stone-100 pb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#E84375]" />
                    <span>2. مكان وموعد التسليم (مغطاة عبر 69 ولاية)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">
                        ولاية التوصيل والاستلام <span className="text-[#E84375]">*</span>
                      </label>
                      <select
                        value={deliveryWilayaCode}
                        onChange={(e) => setDeliveryWilayaCode(Number(e.target.value))}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#E84375]/30 focus:border-[#E84375]"
                      >
                        {wilayas.map((w) => (
                          <option key={w.code} value={w.code}>
                            {w.code.toString().padStart(2, '0')} - {w.nameAr} ({w.name})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">
                        تاريخ المناسبة / التسليم المرغوب <span className="text-[#E84375]">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          required
                          min={minDateString}
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                          className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#E84375]/30 focus:border-[#E84375] font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      العنوان الدقيق للتسليم <span className="text-[#E84375]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="الحي، اسم الشارع، رقم البناية، البلدية"
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#E84375]/30 focus:border-[#E84375]"
                    />
                  </div>

                  {/* خيار المؤسسات والشركات B2B */}
                  <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2.5">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isB2B}
                        onChange={(e) => setIsB2B(e.target.checked)}
                        className="w-4 h-4 rounded text-[#E84375] focus:ring-[#E84375] border-stone-300 accent-[#E84375] cursor-pointer"
                      />
                      <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#E84375]" />
                        <span>هل هذه الطلبية لحساب شركة أو مؤسسة (B2B) ؟</span>
                      </span>
                    </label>

                    {isB2B && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-200 animate-fadeIn">
                        <div>
                          <label className="text-[10px] font-bold text-stone-600 block mb-1">اسم المؤسسة / الشركة</label>
                          <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="SARL / EURL / Spa..."
                            className="w-full p-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-stone-600 block mb-1">الرقم الجبائي (NIF)</label>
                          <input
                            type="text"
                            value={companyNIF}
                            onChange={(e) => setCompanyNIF(e.target.value)}
                            placeholder="001..."
                            className="w-full p-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* القسم 3 : خطة التسديد (عربون حجز أو دفع كلي) والحساب المباشر */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-1.5">
                    <div className="flex items-center gap-1.5 text-stone-800 text-xs font-bold">
                      <Coins className="w-3.5 h-3.5 text-[#E84375]" />
                      <span>3. نظام التسديد (عربون حجز مسبق أو المبلغ كاملاً)</span>
                    </div>
                    <span className="text-[10px] text-stone-500">حساب فوري للرصيد</span>
                  </div>

                  {/* أزرار اختيار نظام الدفع */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentType('DEPOSIT_30')}
                      className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer relative ${
                        paymentType === 'DEPOSIT_30'
                          ? 'border-[#E84375] bg-pink-50/70 shadow-xs'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <span className="text-[9px] font-extrabold uppercase bg-[#E84375] text-white px-1.5 py-0.5 rounded-full absolute -top-2 left-2">
                        الأكثر طلباً
                      </span>
                      <span className="text-xs font-bold text-stone-900 block">عربون 30%</span>
                      <span className="text-[11px] font-extrabold text-[#E84375] font-mono block mt-1">
                        {formatDZD(Math.round(calculatedTotal * 0.3))} دج
                      </span>
                      <span className="text-[9px] text-stone-500 block mt-0.5">تأكيد أولي للحجز</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentType('DEPOSIT_50')}
                      className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                        paymentType === 'DEPOSIT_50'
                          ? 'border-[#E84375] bg-pink-50/70 shadow-xs'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <span className="text-xs font-bold text-stone-900 block">عربون 50%</span>
                      <span className="text-[11px] font-extrabold text-[#E84375] font-mono block mt-1">
                        {formatDZD(Math.round(calculatedTotal * 0.5))} دج
                      </span>
                      <span className="text-[9px] text-stone-500 block mt-0.5">نصف قيمة الطلب</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentType('FULL')}
                      className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                        paymentType === 'FULL'
                          ? 'border-[#E84375] bg-pink-50/70 shadow-xs'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <span className="text-xs font-bold text-stone-900 block">كامل المبلغ 100%</span>
                      <span className="text-[11px] font-extrabold text-[#E84375] font-mono block mt-1">
                        {formatDZD(calculatedTotal)} دج
                      </span>
                      <span className="text-[9px] text-stone-500 block mt-0.5">تسوية شاملة</span>
                    </button>
                  </div>

                  {/* بطاقة الحساب المالي المباشر */}
                  <div className="p-3.5 bg-gradient-to-br from-stone-50 to-pink-50/40 rounded-2xl border border-stone-200/90 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-600 font-semibold">إجمالي قيمة الطلبية:</span>
                      <span className="font-mono font-bold text-stone-900" dir="ltr">{formatDZD(calculatedTotal)} دج</span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-200/60">
                      <span className="text-[#E84375] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>المبلغ المسدد الآن كعربون :</span>
                      </span>
                      <span className="font-mono font-extrabold text-sm text-[#E84375]" dir="ltr">
                        {formatDZD(calculatedDeposit)} دج
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-200/60">
                      <span className="text-stone-700 font-semibold flex items-center gap-1">
                        <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                        <span>المتبقي للتحصيل عند الاستلام :</span>
                      </span>
                      <span className="font-mono font-bold text-stone-800" dir="ltr">
                        {formatDZD(calculatedRemaining)} دج
                      </span>
                    </div>

                    <div className="pt-1.5 flex items-center gap-1 text-[10px] text-stone-500">
                      <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>يُصدر النظام وصلاً رسمياً معتمداً للتسديد فور تأكيد العملية، يمكن طباعته أو حفظه PDF.</span>
                    </div>
                  </div>
                </div>

                {/* القسم 4 : وسيلة الدفع بالدينار */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 text-stone-800 text-xs font-bold border-b border-stone-100 pb-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[#E84375]" />
                    <span>4. اختيار وسيلة الدفع بالدينار الجزائري</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* دفع عند الاستلام */}
                    <label
                      onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                      className={`p-3 rounded-2xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                        paymentMethod === 'CASH_ON_DELIVERY'
                          ? 'border-[#E84375] bg-pink-50/50 shadow-xs'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <Banknote className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'CASH_ON_DELIVERY'}
                          onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                          className="accent-[#E84375]"
                        />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-stone-900 block">الدفع عند الاستلام</span>
                        <span className="text-[10px] text-stone-500">تسديد يداً بيد عند التوصيل</span>
                      </div>
                    </label>

                    {/* بريدي موب */}
                    <label
                      onClick={() => setPaymentMethod('BARIDIMOB')}
                      className={`p-3 rounded-2xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                        paymentMethod === 'BARIDIMOB'
                          ? 'border-[#E84375] bg-pink-50/50 shadow-xs'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                          <Smartphone className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'BARIDIMOB'}
                          onChange={() => setPaymentMethod('BARIDIMOB')}
                          className="accent-[#E84375]"
                        />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-stone-900 block">بريدي موب (BaridiMob)</span>
                        <span className="text-[10px] text-stone-500">تحويل سريع ومباشر 24/7</span>
                      </div>
                    </label>

                    {/* البطاقة الذهبية / CIB */}
                    <label
                      onClick={() => setPaymentMethod('CIB_EDAHABIA')}
                      className={`p-3 rounded-2xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                        paymentMethod === 'CIB_EDAHABIA'
                          ? 'border-[#E84375] bg-pink-50/50 shadow-xs'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                          <CreditCard className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'CIB_EDAHABIA'}
                          onChange={() => setPaymentMethod('CIB_EDAHABIA')}
                          className="accent-[#E84375]"
                        />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-stone-900 block">الذهبية / CIB</span>
                        <span className="text-[10px] text-stone-500">دفع إلكتروني فوري SATIM</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* ملاحظات وتوصيات خاصة */}
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">
                    ملاحظات أو توصيات خاصة للحرفي الصانع :
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="العبارة المكتوبة على الكعكة، تفاصيل التوصيل، الحساسية، أو أي رغبة خاصة..."
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#E84375]/30 focus:border-[#E84375]"
                  />
                </div>

              </div>

              {/* شريط الإجراءات السفلي الثابت - Sticky Footer */}
              <div className="flex-shrink-0 px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
                <div className="text-right">
                  <span className="text-[10px] font-bold text-stone-400 block">
                    {paymentType === 'FULL' ? 'إجمالي الطلب للدفع' : 'العربون المطلوب تسديده'}
                  </span>
                  <div className="inline-flex items-baseline gap-1" dir="rtl">
                    <span dir="ltr" className="text-xl font-mono font-extrabold text-[#E84375] tracking-tight">
                      {formatDZD(calculatedDeposit)}
                    </span>
                    <span className="text-xs text-stone-700 font-bold">دج</span>
                  </div>
                  {paymentType !== 'FULL' && (
                    <span className="text-[10px] text-stone-500 block">
                      المتبقي: {formatDZD(calculatedRemaining)} دج
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-[#E84375] hover:bg-[#d83768] text-white font-bold rounded-xl shadow-md hover:shadow-lg shadow-pink-200 text-xs sm:text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <span>جاري التأكيد...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-pink-100" />
                        <span>تأكيد وحجز الطلبية</span>
                        <ArrowLeft className="w-4 h-4 text-white/80" />
                      </>
                    )}
                  </button>
                </div>
              </div>

            </form>
          )}

        </div>
      </div>

      {/* نافذة عرض وصل التسديد والطباعة / الحفظ PDF */}
      {createdOrder && (
        <ReceiptModal
          isOpen={showReceiptModal}
          onClose={() => setShowReceiptModal(false)}
          order={createdOrder}
        />
      )}
    </>
  );
};