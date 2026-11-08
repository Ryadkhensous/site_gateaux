import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Camera, 
  MapPin, 
  Store, 
  ChefHat, 
  Sparkles, 
  Receipt,
  Printer,
  Banknote,
  Coins
} from 'lucide-react';
import { Order } from '../types';
import { api } from '../services/api';
import { formatDZD } from '../utils/format';
import { ReceiptModal } from './ReceiptModal';

interface TrackingViewProps {
  initialOrderNumber?: string;
}

export const TrackingView: React.FC<TrackingViewProps> = ({ initialOrderNumber = 'CMD-2026-DZ001' }) => {
  const [searchQuery, setSearchQuery] = useState(initialOrderNumber);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const fetchOrder = async (orderNum: string) => {
    if (!orderNum.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.getOrder(orderNum.trim());
      if (res.success && res.data) {
        setOrder(res.data);
      } else {
        setError(res.message || 'لم يتم العثور على طلبيّة بهذا الرقم.');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تحميل بيانات الطلبية');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      setSearchQuery(initialOrderNumber);
      fetchOrder(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  // الاتصال المباشر بتقنية Socket.io لتحديث الخطوات فورياً
  useEffect(() => {
    const backendUrl = ((import.meta as any).env?.VITE_API_URL as string) || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://patisserie-dz-db.onrender.com');
    const s = io(backendUrl);
    setSocket(s);

    if (order?.orderNumber) {
      s.emit('join_order', order.orderNumber);
    }

    s.on('order_updated', (updatedOrder: Order) => {
      console.log('[TrackingView] تم تحديث بيانات الطلبية في الوقت الفعلي :', updatedOrder);
      setOrder(updatedOrder);
    });

    return () => {
      s.disconnect();
    };
  }, [order?.orderNumber]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(searchQuery);
  };

  const totalAmount = order?.totalPriceDZD || 0;
  const depositPaid = (order as any)?.depositAmountDZD !== undefined
    ? Number((order as any)?.depositAmountDZD)
    : Math.round(totalAmount * 0.3);
  const remainingAmount = (order as any)?.remainingAmountDZD !== undefined
    ? Number((order as any)?.remainingAmountDZD)
    : Math.max(0, totalAmount - depositPaid);

  return (
    <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
      {/* رأس الصفحة والمقدمة */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold mb-3 border border-rose-200">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          <span>متابعة حية ومباشرة من قلب ورشة الحرفي</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mb-3">
          تابع مراحل تصنيع حلوياتك في الوقت الفعلي
        </h1>
        <p className="text-stone-600 text-sm sm:text-base font-light">
          من وزن المكونات وخبز الجينواز إلى التزيين الفني والتوصيل المبرد، رافق صانع الحلوى خطوة بخطوة بالصور المباشرة.
        </p>
      </div>

      {/* شريط البحث عن الطلبية */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-10 flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-l from-dore-500 to-rose-500 hover:from-dore-600 hover:to-rose-600 text-white font-bold rounded-2xl shadow-md transition-all text-xs flex items-center gap-2 flex-shrink-0 cursor-pointer"
        >
          {loading ? 'جاري البحث...' : 'بحث عن الطلب'}
        </button>
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="أدخل رقم الطلبية (مثال: CMD-2026-DZ001)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-11 pl-4 py-3 bg-white border border-beige-300 rounded-2xl text-xs font-semibold text-stone-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-400 font-mono text-left"
          />
          <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3.5" />
        </div>
      </form>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs max-w-md mx-auto mb-8 text-center flex items-center justify-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {order && (
        <div className="space-y-8 animate-fadeIn">
          {/* بطاقة ملخص تفاصيل الطلب */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-beige-200 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-beige-100">
              <div>
                <span className="text-xs uppercase font-bold text-dore-700 tracking-wider">رقم الطلبية المعتمد</span>
                <h3 className="text-2xl font-mono font-extrabold text-stone-900">{order.orderNumber}</h3>
                <span className="text-xs text-stone-500">
                  تاريخ الحجز: {new Date(order.createdAt).toLocaleDateString('ar-DZ', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>

              {/* الملخص المالي: الإجمالي، العربون، المتبقي */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3 flex items-center gap-4 text-xs">
                  <div className="text-center">
                    <span className="text-[10px] text-stone-400 font-bold block">إجمالي الطلب</span>
                    <span className="font-mono font-bold text-stone-900" dir="ltr">{formatDZD(totalAmount)}</span>
                    <span className="text-[10px] text-stone-600 mr-1">دج</span>
                  </div>

                  <div className="h-7 w-px bg-stone-200"></div>

                  <div className="text-center">
                    <span className="text-[10px] text-[#E84375] font-bold block">العربون المسدد</span>
                    <span className="font-mono font-bold text-[#E84375]" dir="ltr">{formatDZD(depositPaid)}</span>
                    <span className="text-[10px] text-pink-600 mr-1">دج</span>
                  </div>

                  <div className="h-7 w-px bg-stone-200"></div>

                  <div className="text-center">
                    <span className="text-[10px] text-emerald-700 font-bold block">المتبقي عند التسليم</span>
                    <span className="font-mono font-bold text-emerald-800" dir="ltr">{formatDZD(remainingAmount)}</span>
                    <span className="text-[10px] text-emerald-700 mr-1">دج</span>
                  </div>
                </div>

                {/* زر استعراض الوصل الرسمي */}
                <button
                  type="button"
                  onClick={() => setShowReceiptModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#E84375] hover:bg-[#d83768] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Receipt className="w-4 h-4" />
                  <span>وصل الدفع والعربون</span>
                </button>
              </div>
            </div>

            {/* تفاصيل سريعة : الحرفي، الوجهة، والمواصفات */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-xs">
              <div className="flex items-start gap-3">
                <Store className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase block">الحرفي الصانع</span>
                  <span className="font-bold text-stone-800 text-sm">{order.artisanName}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-dore-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase block">وجهة التسليم (الولاية)</span>
                  <span className="font-bold text-stone-800 text-sm">{order.deliveryWilayaName}</span>
                  <p className="text-[11px] text-stone-500 mt-0.5 font-light">{order.deliveryAddress}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase block">المواصفات والرسالة</span>
                  <span className="font-bold text-stone-800 text-sm">
                    {order.customization?.sizeName || 'كعكة مخصصة فاخرة'}
                  </span>
                  {order.customization?.messageOnCake && (
                    <p className="text-xs text-rose-800 italic font-serif mt-0.5">
                      "{order.customization.messageOnCake}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* الخط الزمني لمراحل التصنيع (Timeline Stepper RTL) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-beige-200 shadow-md">
            <h4 className="text-lg font-serif font-bold text-stone-900 mb-6 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-dore-600" />
              <span>سجل مراحل التصنيع في ورشة الحرفي</span>
            </h4>

            {/* الخط الزمني باتجاه اليمين RTL */}
            <div className="relative border-r-2 border-beige-200 mr-4 sm:mr-6 pr-8 sm:pr-10 space-y-8">
              {order.trackingSteps.map((step, idx) => {
                const isCurrent = !step.completed && (idx === 0 || order.trackingSteps[idx - 1]?.completed);

                return (
                  <div key={step.stepId} className="relative group">
                    {/* أيقونة الدائرة على الخط */}
                    <div
                      className={`absolute -right-[43px] sm:-right-[51px] top-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        step.completed
                          ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                          : isCurrent
                          ? 'bg-dore-500 text-white ring-4 ring-rose-100 animate-pulse'
                          : 'bg-beige-100 text-stone-400'
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <span className="text-xs font-bold font-mono">{step.stepId}</span>
                      )}
                    </div>

                    {/* نص المرحلة */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-sm font-bold ${
                            step.completed
                              ? 'text-stone-900'
                              : isCurrent
                              ? 'text-dore-700'
                              : 'text-stone-400'
                          }`}
                        >
                          المرحلة {step.stepId} : {step.titleAr || step.title}
                        </span>

                        {step.completed && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                            اكتملت بنجاح
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-[10px] bg-dore-50 text-dore-800 font-bold px-2 py-0.5 rounded-full border border-dore-200 animate-pulse">
                            قيد التنفيذ في الورشة الآن
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-stone-500 leading-relaxed font-light">
                        {step.descriptionAr || step.description}
                      </p>

                      {step.completedAt && (
                        <span className="text-[10px] text-stone-400 block font-mono">
                          تم التوثيق في : {new Date(step.completedAt).toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}

                      {/* صورة الإثبات الحية إذا أرفقها الحرفي */}
                      {step.photoProofUrl && (
                        <div className="mt-3 p-3 bg-beige-50 rounded-2xl border border-beige-300 max-w-sm">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-dore-800 mb-2">
                            <Camera className="w-3.5 h-3.5 text-rose-500" />
                            <span>صورة إثبات حية ملتقطة في ورشة الحرفي :</span>
                          </div>
                          <div className="h-44 rounded-xl overflow-hidden shadow-xs border border-beige-200">
                            <img
                              src={step.photoProofUrl}
                              alt="إثبات مرحلة التصنيع"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* نافذة عرض وصل التسديد والطباعة / الحفظ PDF */}
      {order && (
        <ReceiptModal
          isOpen={showReceiptModal}
          onClose={() => setShowReceiptModal(false)}
          order={order}
        />
      )}
    </div>
  );
};