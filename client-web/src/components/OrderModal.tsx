import React, { useState } from 'react';
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
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Wilaya } from '../types';
import { api } from '../services/api';
import { formatDZD } from '../utils/format';

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

  // حالة استمارة الحجز
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [idDocType, setIdDocType] = useState<'CNI' | 'PASSEPORT' | 'PERMIS'>('CNI');
  const [idDocNumber, setIdDocNumber] = useState('');
  const [showOptionalDoc, setShowOptionalDoc] = useState(false);
  const [deliveryWilayaCode, setDeliveryWilayaCode] = useState<number>(16); // الجزائر العاصمة افتراضياً
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [eventDate, setEventDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [isB2B, setIsB2B] = useState(Boolean(config.isB2B));
  const [companyName, setCompanyName] = useState('');
  const [companyNIF, setCompanyNIF] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH_ON_DELIVERY' | 'BARIDIMOB' | 'CIB_EDAHABIA'>('CASH_ON_DELIVERY');
  const [notes, setNotes] = useState(config.notes || config.messageOnCake ? `العبارة المكتوبة: ${config.messageOnCake || ''}` : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim() || !eventDate) {
      setError('يرجى ملء جميع الحقول المطلوبة (الاسم الكامل، رقم الهاتف، ولاية الاستلام، العنوان وتاريخ التسليم).');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        artisanId: config.artisanId || 'art-1',
        productId: config.productId,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerIdDocType: idDocType,
        customerIdDocNumber: idDocNumber.trim() || 'DZ-CLIENT-WEB',
        deliveryWilayaCode,
        deliveryAddress: deliveryAddress.trim(),
        eventDate: new Date(eventDate).toISOString(),
        isB2B,
        companyName: isB2B ? companyName.trim() : undefined,
        companyNIF: isB2B ? companyNIF.trim() : undefined,
        paymentMethod,
        totalPriceDZD: config.totalPriceDZD || config.priceDZD || 8500,
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

  const calculatedPrice = config.totalPriceDZD || config.priceDZD || 8500;
  const minDateString = new Date().toISOString().split('T')[0];

  return (
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

            <div className="p-4 bg-pink-50/60 rounded-2xl border border-pink-200 max-w-md mx-auto">
              <span className="text-xs text-stone-500 block font-bold mb-1">رقم تتبع الطلبية الخاص بك :</span>
              <span className="text-2xl font-mono font-extrabold text-[#E84375] tracking-wider block">
                {createdOrder.orderNumber}
              </span>
              <p className="text-[11px] text-stone-500 mt-2">
                احتفظ بهذا الرقم لمتابعة خطوات تحضير وتزيين كعكتك بالصور الحية من الورشة.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleFinishAndTrack}
                className="px-6 py-3.5 bg-[#E84375] hover:bg-[#d83768] text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-2 transition-colors"
              >
                <span>الانتقال لمتابعة التصنيع في الوقت الفعلي</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs transition-colors"
              >
                إغلاق النافذة
              </button>
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
                      {formatDZD(calculatedPrice)}
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
                    className="text-[11px] font-semibold text-stone-500 hover:text-[#E84375] flex items-center gap-1 transition-colors"
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

              {/* القسم 3 : وسيلة الدفع بالدينار */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 text-stone-800 text-xs font-bold border-b border-stone-100 pb-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#E84375]" />
                  <span>3. اختيار وسيلة الدفع بالدينار الجزائري</span>
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
                <span className="text-[10px] font-bold text-stone-400 block">المبلغ للدفع</span>
                <div className="inline-flex items-baseline gap-1" dir="rtl">
                  <span dir="ltr" className="text-xl font-mono font-extrabold text-[#E84375] tracking-tight">
                    {formatDZD(calculatedPrice)}
                  </span>
                  <span className="text-xs text-stone-700 font-bold">دج</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#E84375] hover:bg-[#d83768] text-white font-bold rounded-xl shadow-md hover:shadow-lg shadow-pink-200 text-xs sm:text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
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
  );
};
