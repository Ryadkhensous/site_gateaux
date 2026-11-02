import React from 'react';
import { Building2, Briefcase, FileCheck, CheckCircle2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Wilaya } from '../types';
import { formatDZD } from '../utils/format';

interface B2BViewProps {
  wilayas: Wilaya[];
  onOpenOrderModal: (config: any) => void;
}

export const B2BView: React.FC<B2BViewProps> = ({ wilayas, onOpenOrderModal }) => {
  const packs = [
    {
      id: 'seminar',
      title: 'باقة استراحة القهوة والندوات (50 شخصاً)',
      priceDZD: 26000,
      description: 'مثالية لاجتماعات مجالس الإدارة، الأيام الدراسية والندوات. ميني تارتليت، بريوش حرفي، ماكارون وكؤوس تحلية راقية.',
      items: [
        '50 كأس تحلية صغيرة راقية (Mini Verrines)',
        '50 ميني تارتليت بفواكه الموسم الطازجة',
        '50 حبة ماكارون فرنسي ناعم بنكهات مشكلة',
        '50 قطعة مخبوزات وحلويات حرفية طازجة'
      ]
    },
    {
      id: 'annual',
      title: 'بوفيه كوكتيل فعاليات واحتفالات الشركات (100 شخص)',
      priceDZD: 45000,
      description: 'صيغة متكاملة لافتتاح المقرات، واحتفالات نهاية السنة والملتقيات. تتضمن كعكة 3 طوابق بشعار شركتكم بتقنية 3D.',
      items: [
        'كعكة ملكية 3 طبقات مخصصة بشعار الشركة السكري 3D',
        '100 تشكيلة حلويات جزائرية تقليدية فاخرة',
        '100 قطعة بيتي فور وميني كيك فرنسي معاصر',
        'توصيل مبرد وتنظيم البوفيه في مقر المؤسسة'
      ]
    },
    {
      id: 'vip',
      title: 'علب هدايا الشركاء والزبائن VIP (20 علبة فاخرة)',
      priceDZD: 38000,
      description: 'علب كرتونية صلبة راقية مخصصة بألوان وهوية علامتكم التجارية، محشوة بأرقى الحلويات الجزائرية الملكية بالعسل الحر.',
      items: [
        '20 علبة فاخرة مطبوعة بالحرير وهوية شركتكم',
        'حلويات ملكية أصيلة بالعسل الحر وماء الزهر (مقروط، بقلاوة)',
        'بطاقة تهنئة مخصصة بالخط العربي الأنيق',
        'فوترة رسمية تتضمن الرقم الجبائي NIF والرسم على القيمة المضافة'
      ]
    }
  ];

  const handleOrderPack = (pack: typeof packs[0]) => {
    onOpenOrderModal({
      name: pack.title,
      priceDZD: pack.priceDZD,
      isB2B: true,
      notes: `طلبية شركات B2B : ${pack.title}. مطلوب فاتورة ضريبية رسمية.`
    });
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
      {/* الواجهة العلوية لخدمات الشركات B2B */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-l from-[#3D2D20] via-[#523D2E] to-[#3D2D20] text-white p-8 sm:p-12 mb-12 shadow-2xl border border-dore-500/30">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/20 text-rose-200 text-xs font-semibold border border-rose-300/30">
            <Building2 className="w-4 h-4 text-dore-400" />
            <span>خدمة B2B المخصصة للمؤسسات والشركات</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
            ارتقِ بفعاليات ومناسبات شركتك في الجزائر
          </h1>
          <p className="text-beige-200 text-sm sm:text-base leading-relaxed font-light">
            من استراحة القهوة في ندواتكم إلى علب الهدايا الفاخرة لزبائنكم وشركائكم، نربط مؤسستكم بأفضل صناع الحلوى المحترفين مع عروض أسعار رسمية، فوترة جبائية معتمدة وتوصيل مبرد في الموعد المحدد.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-dore-200">
            <span className="flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-dore-400" /> فوترة نظامية بالرقم الجبائي (NIF) والسجل التجاري
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-rose-300" /> عقود توريد دورية أسبوعية أو شهرية
            </span>
          </div>
        </div>
      </div>

      {/* باقات الشركات الجاهزة */}
      <div className="mb-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-2">
            باقات الضيافة المخصصة للشركات
          </h2>
          <p className="text-stone-600 text-sm">
            يمكنكم حجز باقة قياسية مباشرة أو طلب تخصيص كامل لشعار وهوية شركتكم.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packs.map((pack) => (
            <div
              key={pack.id}
              className="bg-white rounded-3xl p-6 border-2 border-beige-200 hover:border-rose-400 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 inline-block mb-3">
                  عروض الشركات
                </span>
                <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">{pack.title}</h3>
                <p className="text-xs text-stone-600 mb-6 leading-relaxed font-light">{pack.description}</p>

                <div className="space-y-2.5 mb-6">
                  {pack.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-stone-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-dore-600 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-beige-100">
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-xs text-stone-400 font-bold">سعر الباقة الإجمالي</span>
                  <div className="inline-flex items-baseline gap-1" dir="rtl">
                    <span dir="ltr" className="text-2xl font-bold font-mono text-stone-900 tracking-tight">
                      {formatDZD(pack.priceDZD)}
                    </span>
                    <span className="text-xs font-sans text-dore-700 font-bold">دج</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOrderPack(pack)}
                  className="w-full py-3 bg-gradient-to-l from-dore-500 to-rose-500 hover:from-dore-600 hover:to-rose-600 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-200/50 transition-all flex items-center justify-center gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>حجز هذه الباقة للشركة</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
