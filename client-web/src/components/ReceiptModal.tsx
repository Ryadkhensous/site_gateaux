import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  ChefHat, 
  MapPin, 
  Phone, 
  Calendar, 
  CreditCard, 
  Sparkles,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { formatDZD } from '../utils/format';
import { Order } from '../types';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | any;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  order
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const total = Number(order.totalPriceDZD) || 8500;
  const deposit = Number(order.depositAmountDZD) !== undefined 
    ? Number(order.depositAmountDZD) 
    : (order.paymentType === 'DEPOSIT_30' ? Math.round(total * 0.3) : order.paymentType === 'DEPOSIT_50' ? Math.round(total * 0.5) : total);
  const remaining = Number(order.remainingAmountDZD) !== undefined 
    ? Number(order.remainingAmountDZD) 
    : Math.max(0, total - deposit);

  const receiptNumber = order.receiptNumber || `REC-2026-${order.orderNumber ? order.orderNumber.replace('CMD-', '') : 'DZ4055'}`;
  const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('ar-DZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : new Date().toLocaleDateString('ar-DZ');

  const deliveryDate = order.eventDate ? new Date(order.eventDate).toLocaleDateString('ar-DZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'قيد التحديد';

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'BARIDIMOB':
        return 'بريدي موب (BaridiMob)';
      case 'CIB_EDAHABIA':
        return 'البطاقة الذهبية / CIB (SATIM)';
      case 'BANK_TRANSFER':
        return 'تحويل بنكي رسمي';
      case 'CASH_ON_DELIVERY':
      default:
        return 'دفع نقدي عند الاستلام';
    }
  };

  const getPaymentTypeLabel = () => {
    if (order.paymentType === 'DEPOSIT_30') return 'عربون حجز مسبق (30%)';
    if (order.paymentType === 'DEPOSIT_50') return 'عربون حجز مسبق (50%)';
    if (order.paymentType === 'DEPOSIT_CUSTOM') return 'عربون مخصص مسبق';
    if (deposit < total) return 'تسديد دفعة عربون جزئية';
    return 'دفع كامل المبلغ (100%)';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 text-right">
      <div className="bg-white rounded-3xl max-w-2xl w-full flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-fadeIn">
        
        {/* شريط الإجراءات العلوي (يُخفى عند الطباعة) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/70 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-[#E84375] hover:bg-[#d83768] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الوصل / حفظ PDF</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-700">وصل الدفع والعربون المعتمد</span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white hover:bg-stone-200 border border-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors shadow-2xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* جسم الوصل القابل للطباعة والحفظ */}
        <div id="printable-receipt" className="p-6 sm:p-10 space-y-6 text-stone-800 bg-white">
          
          {/* ترويسة الوصل الرسمي */}
          <div className="flex items-start justify-between border-b-2 border-stone-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E84375] to-[#f4729c] flex items-center justify-center text-white shadow-md">
                <ChefHat className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-stone-900 tracking-tight">SweetBox DZ</h2>
                <span className="text-[11px] font-semibold text-[#E84375] block">
                  منصة الحلويات الفاخرة بالجزائر
                </span>
                <span className="text-[10px] text-stone-400 block font-light">
                  سجل تجاري رقمي معتمد عبر 69 ولاية
                </span>
              </div>
            </div>

            <div className="text-left font-mono">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>وصل تسديد معتمد</span>
              </div>
              <div className="text-xs text-stone-600 font-bold">{receiptNumber}</div>
              <div className="text-[10px] text-stone-400">{orderDate}</div>
            </div>
          </div>

          {/* تفاصيل الطلب والزبون */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-stone-50/70 border border-stone-200/80 text-xs">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                بيانات الزبون
              </span>
              <div className="font-bold text-stone-900 text-sm">{order.customerName}</div>
              <div className="text-stone-600 font-mono text-left" dir="ltr">{order.customerPhone}</div>
              <div className="text-stone-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#E84375] shrink-0" />
                <span>{order.deliveryWilayaName || ('ولاية ' + order.deliveryWilayaCode)} - {order.deliveryAddress}</span>
              </div>
              {order.isB2B && order.companyName && (
                <div className="text-blue-700 font-semibold pt-1">
                  المؤسسة: {order.companyName} {order.companyNIF ? `(NIF: ${order.companyNIF})` : ''}
                </div>
              )}
            </div>

            <div className="space-y-1.5 sm:border-r sm:border-stone-200 sm:pr-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                معلومات الحجز والورشة
              </span>
              <div className="font-bold text-stone-900">
                رقم الطلبية: <span className="font-mono text-[#E84375]">#{order.orderNumber}</span>
              </div>
              <div className="text-stone-600">
                الورشة المنفذة: <strong className="text-stone-800">{order.artisanName || 'حلويات العاصمة الفاخرة'}</strong>
              </div>
              <div className="text-stone-600 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>تاريخ التسليم المطلوب: <strong>{deliveryDate}</strong></span>
              </div>
              <div className="text-stone-600">
                طريقة السداد: <strong>{getPaymentMethodLabel(order.paymentMethod)}</strong>
              </div>
            </div>
          </div>

          {/* وصف الطلبية والوصفة */}
          <div className="border border-stone-200 rounded-2xl p-4 text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <span className="font-bold text-stone-800">تفاصيل المنتج والمواصفات</span>
              <span className="font-mono text-[#E84375] font-bold">{formatDZD(total)} دج</span>
            </div>
            
            <div className="text-sm font-bold text-stone-900">
              {order.customization?.sizeName || order.productName || 'كعكة مخصصة فاخرة'}
            </div>

            <div className="grid grid-cols-2 gap-2 text-stone-600 text-[11px] pt-1">
              {order.customization?.flavorName && (
                <div>• نكهة الجينواز: <strong>{order.customization.flavorName}</strong></div>
              )}
              {order.customization?.fillingName && (
                <div>• الحشوة الداخلية: <strong>{order.customization.fillingName}</strong></div>
              )}
              {order.customization?.servingsCount && (
                <div>• الحجم: <strong>{order.customization.servingsCount} قطعة / أفراد</strong></div>
              )}
              {order.customization?.extra3dType && (
                <div>• تخصيص إضافي: <strong>{order.customization.extra3dType}</strong></div>
              )}
            </div>

            {order.customization?.messageOnCake && (
              <div className="p-2 bg-pink-50/60 rounded-xl text-stone-800 border border-pink-100 text-[11px] mt-1">
                العبارة المكتوبة: <strong className="text-[#E84375] italic">"{order.customization.messageOnCake}"</strong>
              </div>
            )}
          </div>

          {/* الجدول المالي المفصل : الإجمالي، العربون المسدد، والمتبقي */}
          <div className="rounded-2xl border-2 border-stone-200 overflow-hidden">
            <div className="bg-stone-50 px-4 py-2.5 border-b border-stone-200 flex items-center justify-between font-bold text-xs text-stone-700">
              <span>البيان المالي</span>
              <span>المبلغ بالدينار (DZD)</span>
            </div>

            <div className="p-4 space-y-3 text-xs">
              {/* إجمالي الطلب */}
              <div className="flex items-center justify-between text-stone-600">
                <span>المبلغ الإجمالي للطلبية (Montant Total) :</span>
                <span className="font-mono font-bold text-stone-900 text-sm">{formatDZD(total)} دج</span>
              </div>

              {/* نوع الدفع والعربون */}
              <div className="flex items-center justify-between text-stone-600">
                <span>صيغة الدفع المختارة :</span>
                <span className="font-semibold text-stone-800">{getPaymentTypeLabel()}</span>
              </div>

              {/* العربون المسدد */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold">المبلغ المسدد الآن كعربون (Acompte Réglé) :</span>
                </div>
                <span className="font-mono font-extrabold text-base text-emerald-700">{formatDZD(deposit)} دج</span>
              </div>

              {/* المبلغ المتبقي عند الاستلام */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-pink-50/80 border border-pink-200 text-stone-900">
                <div>
                  <span className="font-bold block">المبلغ المتبقي واجب الدفع عند الاستلام (Solde Restant) :</span>
                  <span className="text-[10px] text-stone-500 font-normal">يُسدد نقداً لعامل التوصيل أو بالورشة عند استلام الكعكة</span>
                </div>
                <span className="font-mono font-extrabold text-base text-[#E84375]">{formatDZD(remaining)} دج</span>
              </div>
            </div>
          </div>

          {/* الخاتم والضمانة الرسمية */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 border-t border-stone-100">
            <div className="flex items-center gap-2 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>هذا الوصل يضمن حجز موعد التصنيع بالورشة ويثبت دفع العربون طبقاً للشروط والأحكام.</span>
            </div>

            <div className="text-center sm:text-left font-serif text-[11px] text-stone-400">
              SweetBox DZ • منصة الحلويات الجزائرية
            </div>
          </div>

        </div>

        {/* أزرار الإجراء السفلية */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3 print:hidden">
          <span className="text-xs text-stone-500">
            يمكنك طباعة هذا الوصل أو حفظه كملف PDF للرجوع إليه عند الاستلام.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-stone-200 text-stone-700 border border-stone-200 rounded-xl text-xs font-semibold transition-colors"
            >
              إغلاق
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#E84375] hover:bg-[#d83768] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة / حفظ الوصل</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

