import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Layers,
  Palette,
  Camera,
  Check,
  ShoppingBag,
  Info,
  ChevronLeft,
  ShieldCheck,
  Flame,
  Award,
  Crown,
  Heart,
  Eye,
  SlidersHorizontal,
  UploadCloud,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { CustomizationOption, Artisan } from '../types';
import { formatDZD } from '../utils/format';
import TierSelector, { TIER_OPTIONS, TierOption } from './TierSelector';

const idToTiersMap: Record<string, number> = {
  'single-smooth': 1,
  'single-tall': 1.5,
  'double': 2,
  'triple': 3,
};

const tiersToIdMap: Record<number, string> = {
  1: 'single-smooth',
  1.5: 'single-tall',
  2: 'double',
  3: 'triple',
};

interface CakeCustomizerProps {
  artisans: Artisan[];
  onOpenOrderModal: (customConfig: any) => void;
}

export const CakeCustomizer: React.FC<CakeCustomizerProps> = ({
  artisans,
  onOpenOrderModal
}) => {
  // الحالة التفاعلية لاختيارات الزبون
  const [selectedArtisanId, setSelectedArtisanId] = useState<string>(artisans[0]?.id || 'art-1');
  const [selectedTier, setSelectedTier] = useState<number>(1);
  const [selectedFlavor, setSelectedFlavor] = useState<string>('فانيليا بوربون مدغشقر الفاخرة');
  const [selectedFilling, setSelectedFilling] = useState<string>('غاناش كيندر بوينو مع قرمشة الوافل');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string; price: number }>({
    name: 'أبيض لؤلؤي مع لمسات ذهبية',
    hex: '#FAFAF8',
    price: 0
  });
  const [selectedToppings, setSelectedToppings] = useState<string[]>([
    'تاج من 8 حبات ماكارون مشكلة',
    'تذهيب بورق الذهب الخالص عيار 24 قيراط'
  ]);
  const [selected3DExtra, setSelected3DExtra] = useState<string>('مجسم سكري 3D منحوت يدوياً (شخصية أو ثيم)');
  const [messageOnCake, setMessageOnCake] = useState<string>('ألف مبروك النجاح والتميز');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setPhotoUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const [activeTab, setActiveTab] = useState<'tiers' | 'flavor' | 'filling' | 'color' | 'toppings' | 'extra3d'>('tiers');

  // وضع العرض : معاينة واقعية حقيقية بالصور أو مخطط هيكلي
  const [viewMode, setViewMode] = useState<'realistic' | 'structure'>('realistic');
  const [selectedAngle, setSelectedAngle] = useState<'front' | 'detail' | 'cross'>('front');

  // خيارات الأحجام والطبقات
  const tiersOptions = [
    {
      tiers: 1,
      name: 'طابق واحد ناعم (8 - 10 قطع)',
      servings: 10,
      basePrice: 6000,
      desc: 'مثالي للاحتفالات العائلية الصغيرة والمناسبات الدافئة',
      image: '/images/cake_preview_1tier.jpg'
    },
    {
      tiers: 1.5,
      name: 'طابق واحد مرتفع بريستيج (15 - 20 قطعة)',
      servings: 18,
      basePrice: 9500,
      desc: 'ارتفاع 18 سم - خيار رائع وشهير لحفلات التخرج والنجاح والمناسبات السعيدة',
      image: '/images/cake_preview_1tier_tall.jpg'
    },
    {
      tiers: 2,
      name: 'طابقان للاحتفالات (30 - 35 قطعة)',
      servings: 32,
      basePrice: 18000,
      desc: 'طابقان متناسقان - رائع لحفلات الخطوبة والختان والاستقبال',
      image: '/images/cake_preview_2tiers.jpg'
    },
    {
      tiers: 3,
      name: '3 طوابق ملكية فاخرة (50 - 65 قطعة)',
      servings: 60,
      basePrice: 32000,
      desc: 'تحفة ملكية شامخة مصممة للأعراس الفخمة والاحتفالات الكبرى',
      image: '/images/hero_wedding_cake.jpg'
    }
  ];

  // خيارات نكهة الجينواز
  const flavorOptions = [
    { name: 'فانيليا بوربون مدغشقر الفاخرة', price: 0, tag: 'النكهة الأصلية' },
    { name: 'كاكاو مكثف 70% وحبيبات الشوكولاتة', price: 500, tag: 'عشاق الكاكاو' },
    { name: 'ريد فيلفيت المخملي الوردي', price: 800, tag: 'أناقة فاخرة' },
    { name: 'فستق إيراني فاخر وماء زهر البرتقال', price: 1500, tag: 'مذاق ملكي' }
  ];

  // خيارات الحشوة والغاناش
  const fillingOptions = [
    { name: 'غاناش كيندر بوينو مع قرمشة الوافل', price: 1200, desc: 'حشوة كيندر غنية مع قرمشة براليني البندق' },
    { name: 'براليني بندق محمص منزلي وحبيبات مقرمشة', price: 1000, desc: '100% بندق محمص طبيعي على الطريقة الحرفية' },
    { name: 'كريمة التوت المشكل وتوت العليق الطازج', price: 1200, desc: 'مذاق منعش وخفيف يوازن الحلاوة' },
    { name: 'كورد الليمون المتوسطي مع الميرانغ', price: 800, desc: 'نكهة حمضيات جزائرية منعشة مع ميرانغ فرنسي' },
    { name: 'كراميل بالزبدة المالحة وجوز بيكان', price: 900, desc: 'كراميل كريمي غني مع حبات البيكان المقرمشة' }
  ];

  // ألوان التغليف : بيج، أبيض، وردي، ذهبي، وشوكولاتة دافئة
  const colorOptions = [
    { name: 'أبيض لؤلؤي مع لمسات ذهبية', hex: '#FAF9F6', price: 0 },
    { name: 'وردي ناعم باستيل (Rose Poudré)', hex: '#FACDD8', price: 400 },
    { name: 'بيج مخملي كريمي (Beige Crème)', hex: '#F5EBE1', price: 400 },
    { name: 'وردي بيوني ساحر (Rose Pivoine)', hex: '#F6A5B9', price: 500 },
    { name: 'ذهبي ملكي مع ترخيم فاخر (Doré Royal)', hex: '#E5CD6E', price: 1500 },
    { name: 'شوكولاتة دافئة مع ورق الذهب', hex: '#3D2D20', price: 1200 }
  ];

  // خيارات الزينة والورود
  const toppingOptions = [
    { name: 'تاج من 8 حبات ماكارون مشكلة', price: 1400, icon: Crown },
    { name: 'باقة ورود طبيعية معقمة صالحة للحلويات', price: 2200, icon: Heart },
    { name: 'تذهيب بورق الذهب الخالص عيار 24 قيراط', price: 1800, icon: Sparkles },
    { name: 'شلال دريب ذهبي أو شوكولاتة مرآة لامعة', price: 800, icon: Award }
  ];

  // خيارات الإضافات ثلاثية الأبعاد والصور
  const extra3DOptions = [
    { name: 'بدون إضافات 3D (تصميم كلاسيكي ناعم)', price: 0, desc: 'تشطيب ناعم وبسيط بدون مجسمات إضافية' },
    { name: 'توبر أكريليك مذهب بالاسم والسن (خط عربي فاخر)', price: 1200, desc: 'مقطوع بدقة بالليزر بلون الذهب المرآتي' },
    { name: 'طباعة صورة شخصية غذائية عالية الدقة (ورق سكر)', price: 1500, desc: 'ورقة سكرية صالحة للأكل بألوان زاهية' },
    { name: 'مجسم سكري 3D منحوت يدوياً (شخصية أو ثيم)', price: 3500, desc: 'نحت يدوي حرفي للشخصية أو الثيم المطلوب' }
  ];

  // الحصول على الصورة الحقيقية للنموذج المختار
  const currentTierObj = tiersOptions.find((t) => t.tiers === selectedTier) || tiersOptions[0];
  const flavorObj = flavorOptions.find((f) => f.name === selectedFlavor);
  const fillingObj = fillingOptions.find((fi) => fi.name === selectedFilling);
  const extra3DObj = extra3DOptions.find((e) => e.name === selected3DExtra);

  const getRealCakeImage = () => {
    // إذا كان المذاق شوكولاتة أو اللون شوكولاتة دافئة
    if (selectedColor.hex === '#3D2D20' || selectedFlavor.includes('كاكاو')) {
      return '/images/cake_preview_chocolate.jpg';
    }
    return currentTierObj.image;
  };

  // دوال تنسيق الأسعار بالدينار الجزائري بدون فواصل (مسافة بين الآلاف فقط) لتجنب اللبس مع السنتيم
  const renderPrice = (amount: number, prefix: string = '', isLarge: boolean = false) => (
    <span className="inline-flex items-baseline gap-1" dir="rtl">
      <span dir="ltr" className={`font-mono ${isLarge ? 'text-2xl sm:text-3xl font-extrabold text-stone-900' : 'font-bold text-dore-700 text-xs'}`}>
        {prefix}{formatDZD(amount)}
      </span>
      <span className={`font-sans font-bold ${isLarge ? 'text-sm text-dore-700' : 'text-[10px] text-dore-700'}`}>دج</span>
    </span>
  );

  const renderBreakdownItem = (label: string, amount: number, prefix: string = '+') => (
    <div className="flex justify-between items-center font-light text-xs text-stone-600">
      <span>{label}</span>
      <span className="inline-flex items-baseline gap-1" dir="rtl">
        <span dir="ltr" className="font-semibold text-stone-900 font-mono">
          {prefix}{formatDZD(amount)}
        </span>
        <span className="text-stone-500 text-[10px]">دج</span>
      </span>
    </div>
  );

  const toppingsPrice = selectedToppings.reduce((sum, topName) => {
    const item = toppingOptions.find((t) => t.name === topName);
    return sum + (item ? item.price : 0);
  }, 0);

  const totalPriceDZD =
    currentTierObj.basePrice +
    (flavorObj ? flavorObj.price : 0) +
    (fillingObj ? fillingObj.price : 0) +
    selectedColor.price +
    toppingsPrice +
    (extra3DObj ? extra3DObj.price : 0);

  const toggleTopping = (toppingName: string) => {
    if (selectedToppings.includes(toppingName)) {
      setSelectedToppings(selectedToppings.filter((t) => t !== toppingName));
    } else {
      setSelectedToppings([...selectedToppings, toppingName]);
    }
  };

  const handleOrderClick = () => {
    const customConfig = {
      artisanId: selectedArtisanId,
      sizeName: currentTierObj.name,
      servingsCount: currentTierObj.servings,
      flavorName: selectedFlavor,
      fillingName: selectedFilling,
      colorName: selectedColor.name,
      colorHex: selectedColor.hex,
      toppingsList: selectedToppings,
      extra3dType: selected3DExtra,
      photoUrl: photoUrl,
      messageOnCake: messageOnCake,
      totalPriceDZD: totalPriceDZD,
      cakeImage: getRealCakeImage()
    };
    onOpenOrderModal(customConfig);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
      {/* رأس الورشة الافتراضية */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold mb-3 border border-rose-200 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-dore-600 animate-spin-slow" />
          <span>الورشة الافتراضية ثلاثية الأبعاد • محاكاة تصويرية فائقة الواقعية</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 mb-3 tracking-tight">
          صمّم كعكتك الاستثنائية بلمستك الخاصة
        </h1>
        <p className="text-stone-600 text-sm sm:text-base font-light">
          اختر الحجم، الطبقات، نكهات الجينواز، ألوان التغليف والزينة المذهبة. المعاينة تعرض صوراً فوتوغرافية حقيقية مع حساب فوري للسعر بالدينار الجزائري.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* العمود الأيمن : لوحة المعاينة التصويرية الحقيقية وتفاصيل السعر */}
        <div className="lg:col-span-5 sticky top-28 bg-white rounded-3xl p-6 sm:p-7 border border-beige-200 shadow-xl">
          
          {/* رأس بطاقة المعاينة مع مبدل الأوضاع */}
          <div className="flex items-center justify-between pb-4 border-b border-beige-200">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-dore-700 block">
                معاينة بصرية واقعية
              </span>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                تحفتك الفنية تتشكل
              </h3>
            </div>

            {/* مبدل نمط العرض */}
            <div className="flex bg-beige-100 p-1 rounded-xl border border-beige-200 text-xs">
              <button
                onClick={() => setViewMode('realistic')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                  viewMode === 'realistic'
                    ? 'bg-white text-rose-800 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Eye className="w-3 h-3 text-dore-600" />
                <span>صورة حقيقية</span>
              </button>
              <button
                onClick={() => setViewMode('structure')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                  viewMode === 'structure'
                    ? 'bg-white text-rose-800 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Layers className="w-3 h-3 text-dore-600" />
                <span>المخطط</span>
              </button>
            </div>
          </div>

          {/* لوحة العرض الرئيسية (Photo Canvas) */}
          <div className="relative h-96 rounded-2xl my-5 border border-beige-300 overflow-hidden shadow-inner group bg-gradient-to-b from-[#2E241E] to-[#1C1510]">
            
            {viewMode === 'realistic' ? (
              /* 1. عرض الصورة الفوتوغرافية الحقيقية فائقة الدقة */
              <div className="relative w-full h-full isolate">
                <img
                  src={getRealCakeImage()}
                  alt="معاينة الكعكة الواقعية"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform transform-gpu"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/20 to-transparent pointer-events-none"></div>

                {/* طبقة رقائق الذهب المتحركة إذا تم اختيار تذهيب الذهب 24k */}
                {selectedToppings.includes('تذهيب بورق الذهب الخالص عيار 24 قيراط') && (
                  <div className="absolute inset-0 pointer-events-none flex justify-around items-center">
                    <Sparkles className="w-5 h-5 text-amber-300 animate-ping opacity-75" />
                    <Sparkles className="w-4 h-4 text-amber-200 animate-pulse opacity-90" />
                    <Sparkles className="w-6 h-6 text-amber-400 animate-pulse opacity-80" />
                  </div>
                )}

                {/* توبر الأكريليك المذهب الليزري مع النص المخصص فوق الكعكة */}
                {selected3DExtra.includes('توبر أكريليك') && (
                  <div className="absolute top-7 inset-x-0 flex flex-col items-center z-30 animate-float pointer-events-none will-change-transform transform-gpu">
                    <div className="px-5 py-2 rounded-full bg-gradient-to-l from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-stone-900 text-xs font-serif font-extrabold shadow-xl border border-[#FBF5B7] tracking-wider text-center max-w-[260px] truncate drop-shadow-md">
                      {messageOnCake.slice(0, 22) || 'ألف مبروك'}
                    </div>
                    {/* ساق التوبر الشفاف في الكعكة */}
                    <div className="w-1 h-6 bg-gradient-to-b from-[#B38728] to-transparent opacity-90 shadow-sm"></div>
                  </div>
                )}

                {/* شارة المجسم السكري 3D */}
                {selected3DExtra.includes('مجسم سكري') && (
                  <div className="absolute top-4 left-4 z-30 bg-white/95 px-3 py-1.5 rounded-full border border-dore-300 shadow-md flex items-center gap-1.5 text-xs font-bold text-stone-900 animate-float will-change-transform transform-gpu">
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                    <span>مجسم سكري 3D منحوت</span>
                  </div>
                )}

                {/* شارات الزينة النشطة */}
                <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-20 pointer-events-none">
                  {selectedToppings.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-white/95 px-3 py-1 rounded-full text-stone-800 shadow-xs border border-rose-200/80 font-bold"
                    >
                      {t.split(' ')[0]} {t.split(' ')[1]} {t.split(' ')[2] || ''}
                    </span>
                  ))}
                </div>

                {/* شريط المعلومات السفلي فوق الصورة */}
                <div className="absolute bottom-4 right-4 left-4 text-white flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-dore-300 font-semibold block uppercase tracking-wider">
                      {selectedTier} {selectedTier === 1 ? 'طابق' : 'طوابق'} • تكفي {currentTierObj.servings} شخص
                    </span>
                    <h4 className="font-serif font-bold text-base text-white line-clamp-1">
                      {currentTierObj.name.split('(')[0]}
                    </h4>
                    <span className="text-[11px] text-beige-200 block font-light">
                      جينواز: {selectedFlavor.split(' ')[0]} {selectedFlavor.split(' ')[1]} • {selectedColor.name.split('&')[0]}
                    </span>
                  </div>
                  <div className="px-3.5 py-1 rounded-full text-xs font-bold bg-white/95 text-stone-900 shadow-xs inline-flex items-baseline gap-1" dir="rtl">
                    <span dir="ltr" className="font-mono font-extrabold">{formatDZD(totalPriceDZD)}</span>
                    <span className="text-dore-700">دج</span>
                  </div>
                </div>
              </div>
            ) : (
              /* 2. عرض المخطط الهيكلي للطبقات (Structure Blueprint View) */
              <div className="relative w-full h-full flex flex-col items-center justify-end py-7 bg-gradient-to-b from-[#FDFCF9] via-[#FAF3EC] to-[#F3E7DC] overflow-hidden">
                {/* توبر الأكريليك في المخطط */}
                {selected3DExtra.includes('توبر أكريليك') && (
                  <div className="absolute top-8 px-4 py-1 rounded-full bg-gradient-to-l from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-stone-900 text-xs font-serif font-bold shadow-md border border-[#C5A028] z-30 animate-float">
                    {messageOnCake.slice(0, 20) || 'ألف مبروك'}
                  </div>
                )}

                {/* مجسم الكعكة الهندسي المحاكي */}
                <div className="flex flex-col items-center gap-1.5 z-10 w-full px-8 transition-all duration-500">
                  {selectedTier >= 3 && (
                    <div
                      style={{ backgroundColor: selectedColor.hex }}
                      className="w-32 h-14 rounded-t-2xl border-2 border-white/60 relative flex items-center justify-center shadow-md"
                    >
                      <span className="text-[10px] font-bold text-stone-700/80 font-serif">الطابق 3</span>
                    </div>
                  )}

                  {selectedTier >= 2 && (
                    <div
                      style={{ backgroundColor: selectedColor.hex }}
                      className="w-48 h-16 rounded-t-2xl border-2 border-white/60 relative flex items-center justify-center shadow-md"
                    >
                      <span className="text-[11px] font-bold text-stone-700/80 font-serif">الطابق 2</span>
                    </div>
                  )}

                  <div
                    style={{
                      backgroundColor: selectedColor.hex,
                      height: selectedTier === 1.5 ? '5.8rem' : '4.6rem'
                    }}
                    className="w-64 rounded-t-3xl border-2 border-white/60 relative flex flex-col items-center justify-center shadow-lg"
                  >
                    <p className="text-xs font-serif font-bold text-stone-800 tracking-wide text-center px-4 truncate max-w-[220px]">
                      {messageOnCake || 'عبارتكم المخصصة'}
                    </p>
                    <span className="text-[10px] text-stone-500 font-sans mt-0.5">
                      {selectedFlavor.split(' ')[0]} {selectedFlavor.split(' ')[1]}
                    </span>
                  </div>

                  <div className="w-72 h-4 cake-pedestal rounded-full shadow-lg border border-dore-300"></div>
                </div>
              </div>
            )}
          </div>

          {/* مصغرات زوايا العرض الواقعية السريعة */}
          <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 scrollbar-none">
            {tiersOptions.map((t) => (
              <button
                key={t.tiers}
                onClick={() => {
                  setSelectedTier(t.tiers);
                  setViewMode('realistic');
                }}
                className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                  selectedTier === t.tiers
                    ? 'border-rose-500 ring-2 ring-rose-200 scale-105'
                    : 'border-beige-200 hover:border-beige-300 opacity-80'
                }`}
              >
                <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-stone-950/80 text-[9px] text-white font-mono text-center py-0.5">
                  {t.tiers === 1.5 ? 'طابق مرتفع' : `${t.tiers} طوابق`}
                </span>
              </button>
            ))}

            {/* مصغر كعكة الشوكولاتة */}
            <button
              onClick={() => {
                setSelectedFlavor('كاكاو مكثف 70% وحبيبات الشوكولاتة');
                setSelectedColor({ name: 'شوكولاتة دافئة مع ورق الذهب', hex: '#3D2D20', price: 1200 });
                setViewMode('realistic');
              }}
              className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                selectedColor.hex === '#3D2D20'
                  ? 'border-rose-500 ring-2 ring-rose-200 scale-105'
                  : 'border-beige-200 hover:border-beige-300 opacity-80'
              }`}
            >
              <img src="/images/cake_preview_chocolate.jpg" alt="شوكولاتة" className="w-full h-full object-cover" />
              <span className="absolute bottom-0 inset-x-0 bg-stone-950/80 text-[9px] text-white font-mono text-center py-0.5">
                شوكولاتة
              </span>
            </button>
          </div>

          {/* تفصيل عناصر السعر بالدينار الجزائري المنظمة */}
          <div className="bg-beige-50/80 rounded-2xl p-4 border border-beige-200/90 mb-5 space-y-2.5">
            {renderBreakdownItem(`القاعدة والحجم (${currentTierObj.name.split('(')[0]}) :`, currentTierObj.basePrice, '')}
            {renderBreakdownItem(`الجينواز (${selectedFlavor.slice(0, 22)}) :`, flavorObj?.price || 0, '+')}
            {renderBreakdownItem(`الحشوة والغاناش (${selectedFilling.slice(0, 22)}...) :`, fillingObj?.price || 0, '+')}
            {renderBreakdownItem(`اللون والزينة (${selectedToppings.length} عناصر مختارة) :`, selectedColor.price + toppingsPrice, '+')}
            {extra3DObj && extra3DObj.price > 0 && renderBreakdownItem(`إضافات ثلاثية الأبعاد (${extra3DObj.name.split('(')[0]}) :`, extra3DObj.price, '+')}

            <div className="pt-3 border-t border-beige-200 flex items-baseline justify-between">
              <div>
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
                  إجمالي السعر التقديري
                </span>
                <span className="text-xs text-rose-600 font-semibold">شامل الرسوم • تسعير فوري</span>
              </div>
              <div className="text-left">
                {renderPrice(totalPriceDZD, '', true)}
              </div>
            </div>
          </div>

          {/* زر تأكيد الحجز والانتقال للطلب */}
          <button
            onClick={handleOrderClick}
            className="w-full py-4 bg-gradient-to-l from-dore-500 via-rose-500 to-rose-600 hover:from-dore-600 hover:to-rose-700 text-white font-bold rounded-2xl shadow-xl shadow-rose-200/60 flex items-center justify-center gap-2 group transition-all text-sm hover:scale-[1.01]"
          >
            <ShoppingBag className="w-4 h-4 text-dore-100 group-hover:scale-110 transition-transform" />
            <span>تأكيد وحجز هذه الكعكة</span>
            <ChevronLeft className="w-4 h-4 text-dore-100 group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>

        {/* العمود الأيسر : أدوات التحكم التفاعلية والخيارات */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-beige-200 shadow-md">
          
          {/* اختيار الحرفي الصانع وموقعه */}
          <div className="mb-8 p-4 rounded-2xl bg-beige-50/70 border border-beige-300">
            <label className="text-xs font-bold uppercase tracking-wider text-dore-800 block mb-2">
              الحرفي الصانع المعتمد للطلبية
            </label>
            <select
              value={selectedArtisanId}
              onChange={(e) => setSelectedArtisanId(e.target.value)}
              className="w-full p-3 bg-white border border-beige-300 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-400"
            >
              {artisans.map((art) => (
                <option key={art.id} value={art.id}>
                  {art.storeNameAr || art.storeName} ({art.wilayaNameAr || art.wilayaName} - ولاية {art.wilayaCode.toString().padStart(2, '0')}) • تقييم {art.rating} / 5
                </option>
              ))}
            </select>
            <p className="text-[11px] text-stone-500 mt-2 flex items-center gap-1.5 font-light">
              <ShieldCheck className="w-3.5 h-3.5 text-dore-600" />
              <span>يتكفل الحرفي بتصنيع الكعكة ومشاركتكم صور الإثبات الحية لمراحل العمل في ورشته.</span>
            </p>
          </div>

          {/* أزرار التبويب للخطوات الست */}
          <div className="flex overflow-x-auto pb-3 mb-6 gap-2 border-b border-beige-200 scrollbar-none">
            {[
              { id: 'tiers', label: '1. الحجم والطبقات' },
              { id: 'flavor', label: '2. نكهة الجينواز' },
              { id: 'filling', label: '3. الحشوة والغاناش' },
              { id: 'color', label: '4. ألوان التغليف' },
              { id: 'toppings', label: '5. الزينة والورود' },
              { id: 'extra3d', label: '6. مجسمات 3D والصور' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#3D2D20] text-dore-200 shadow-sm'
                    : 'bg-beige-50 text-stone-600 hover:bg-beige-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* تبويب 1 : الحجم والطبقات مع حاسبة عدد المدعوين الذكية */}
          {activeTab === 'tiers' && (
            <TierSelector
              options={TIER_OPTIONS}
              value={tiersToIdMap[selectedTier] || 'single-smooth'}
              onChange={(opt) => {
                const numericTier = idToTiersMap[opt.id] || 1;
                setSelectedTier(numericTier);
                setViewMode('realistic');
              }}
            />
          )}

          {/* تبويب 2 : نكهة الجينواز */}
          {activeTab === 'flavor' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-stone-900 mb-1">اختر نكهة الجينواز الإسفنجية :</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {flavorOptions.map((fl) => (
                  <div
                    key={fl.name}
                    onClick={() => {
                      setSelectedFlavor(fl.name);
                      if (fl.name.includes('كاكاو')) {
                        setSelectedColor({ name: 'شوكولاتة دافئة مع ورق الذهب', hex: '#3D2D20', price: 1200 });
                      }
                      setViewMode('realistic');
                    }}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedFlavor === fl.name
                        ? 'border-rose-400 bg-rose-50/40 shadow-sm'
                        : 'border-beige-200 hover:border-beige-300 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-stone-900 text-xs">{fl.name}</span>
                      <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                        {fl.tag}
                      </span>
                    </div>
                    {fl.price === 0 ? (
                      <span className="text-xs text-stone-500 font-medium">مشمول في السعر</span>
                    ) : (
                      renderPrice(fl.price, '+')
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* تبويب 3 : الحشوة والغاناش */}
          {activeTab === 'filling' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-stone-900 mb-1">اختر الحشوة والغاناش الداخلي :</h4>
              <div className="space-y-3">
                {fillingOptions.map((fi) => (
                  <div
                    key={fi.name}
                    onClick={() => setSelectedFilling(fi.name)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      selectedFilling === fi.name
                        ? 'border-rose-400 bg-rose-50/40 shadow-sm'
                        : 'border-beige-200 hover:border-beige-300 bg-white'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-stone-900 text-xs block mb-0.5">{fi.name}</span>
                      <span className="text-[11px] text-stone-500 font-light">{fi.desc}</span>
                    </div>
                    <span className="whitespace-nowrap mr-3">
                      {renderPrice(fi.price, '+')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* تبويب 4 : ألوان التغليف */}
          {activeTab === 'color' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-stone-900 mb-1">اختر لون الغلاساج والتغليف :</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {colorOptions.map((col) => (
                  <div
                    key={col.name}
                    onClick={() => setSelectedColor(col)}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-2 ${
                      selectedColor.hex === col.hex
                        ? 'border-rose-400 bg-rose-50/40 shadow-sm'
                        : 'border-beige-200 hover:border-beige-300 bg-white'
                    }`}
                  >
                    <div
                      style={{ backgroundColor: col.hex }}
                      className="w-12 h-12 rounded-full border-2 border-stone-200 shadow-sm"
                    ></div>
                    <span className="text-[11px] font-bold text-stone-800 line-clamp-1">{col.name}</span>
                    <span className="text-[10px] text-stone-500 font-semibold">
                      {col.price === 0 ? 'مشمول' : renderPrice(col.price, '+')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* تبويب 5 : الزينة والورود */}
          {activeTab === 'toppings' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-stone-900 mb-1">اختر عناصر الزينة والتزيين (يمكن اختيار أكثر من عنصر) :</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {toppingOptions.map((top) => {
                  const isChecked = selectedToppings.includes(top.name);
                  return (
                    <div
                      key={top.name}
                      onClick={() => toggleTopping(top.name)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        isChecked
                          ? 'border-rose-400 bg-rose-50/40 shadow-sm'
                          : 'border-beige-200 hover:border-beige-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-pink-50 text-[#E84375] flex items-center justify-center flex-shrink-0 shadow-2xs">
                          {React.createElement(top.icon, { className: 'w-4 h-4 text-[#E84375]' })}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-stone-900 block">{top.name}</span>
                          {renderPrice(top.price, '+')}
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                          isChecked
                            ? 'bg-rose-500 border-rose-500 text-white'
                            : 'border-stone-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* تبويب 6 : المجسمات 3D والصور والعبارة المخصصة */}
          {activeTab === 'extra3d' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-stone-900 mb-2">المجسمات ثلاثية الأبعاد والصور الغذائية :</h4>
                <div className="space-y-3">
                  {extra3DOptions.map((extra) => (
                    <div
                      key={extra.name}
                      onClick={() => setSelected3DExtra(extra.name)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        selected3DExtra === extra.name
                          ? 'border-rose-400 bg-rose-50/40 shadow-sm'
                          : 'border-beige-200 hover:border-beige-300 bg-white'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold text-stone-900 block">{extra.name}</span>
                        <span className="text-[11px] text-stone-500">{extra.desc}</span>
                      </div>
                      <span className="whitespace-nowrap mr-3">
                        {extra.price === 0 ? <span className="text-xs text-stone-500">بدون تكلفة</span> : renderPrice(extra.price, '+')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* حقل العبارة المخصصة بالخط العربي أو اللاتيني */}
              <div className="pt-4 border-t border-beige-200 space-y-2">
                <label className="text-xs font-bold text-stone-800 block">
                  العبارة المكتوبة على الكعكة (خط عربي مذهب أو لاتيني) :
                </label>
                <input
                  type="text"
                  value={messageOnCake}
                  onChange={(e) => setMessageOnCake(e.target.value)}
                  placeholder="مثال: ألف مبروك النجاح أمينة / بالبركة والسرور"
                  className="w-full p-3 bg-beige-50 border border-beige-300 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-400 font-serif"
                />
              </div>

              {/* حقل رفع وتحديد الصورة للطباعة الغذائية */}
              {selected3DExtra.includes('صورة شخصية') && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-stone-800 block">
                    صورة الطباعة الغذائية على الكعكة (ورق سكر) :
                  </label>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />

                  {photoUrl ? (
                    <div className="p-3 bg-pink-50/70 border-2 border-pink-200 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img
                          src={photoUrl}
                          alt="معاينة الصورة المطبوعة"
                          className="w-14 h-14 rounded-xl object-cover border border-pink-300 shadow-xs flex-shrink-0 bg-white"
                        />
                        <div className="text-right truncate">
                          <span className="text-xs font-bold text-stone-900 block truncate">
                            صورة جاهزة للطباعة الغذائية
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-0.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            تم تحديد ومعاينة صورتكم بنجاح
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1.5 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold rounded-xl border border-stone-200 transition-colors shadow-2xs"
                        >
                          تغيير
                        </button>
                        <button
                          type="button"
                          onClick={() => setPhotoUrl('')}
                          className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-3.5 px-4 bg-pink-50/70 hover:bg-pink-100/90 border-2 border-dashed border-pink-300 hover:border-pink-400 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-[#E84375] transition-colors shadow-2xs cursor-pointer"
                      >
                        <UploadCloud className="w-4 h-4" />
                        <span>تصفح ورفع صورة من جهازك (Téléverser une photo)</span>
                      </button>
                      <input
                        type="url"
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                        placeholder="أو اكتب رابطاً خارجياً (https://...)"
                        className="w-full p-2.5 bg-beige-50 border border-beige-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-400 font-mono text-left"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
