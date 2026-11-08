import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Store,
  Clock,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Heart,
  CheckCircle2,
  Star,
  MapPin,
  ShieldCheck,
  Award,
  Truck,
  Cake,
  ShoppingBag,
  Layers
} from 'lucide-react';
import { Artisan, Product } from '../types';
import { formatDZD } from '../utils/format';

interface HomeViewProps {
  onNavigate: (tab: string, category?: string) => void;
  featuredProducts?: Product[];
  artisans?: Artisan[];
  onSelectProductToOrder?: (product: Product) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  featuredProducts = [],
  artisans = [],
  onSelectProductToOrder
}) => {
  // شرائح العرض الرئيسية للمنصة
  const heroSlides = [
    {
      id: 'slide-traditional-tray',
      tag: 'أصالة وتراث الأجداد الجزائري',
      titlePart1: 'حلويات جزائرية تقليدية',
      titlePart2: 'صواني الضيافة والأعراس الفاخرة',
      subtitle:
        'تشكيلة ملوكية أصيلة على صواني نحاسية مطروقة تضم البقلاوة المورقة، مقروط اللوز المذاب، التشاراك والدزيريات، تُخبز بأجود أنواع اللوز البلدي والعسل الحر الصافي.',
      image: '/images/traditional_algerian_sweets.jpg',
      badge: 'تراث وأصالة جزائرية',
      linkTab: 'traditional',
      linkText: 'اكتشف الحلويات التقليدية'
    },
    {
      id: 'slide-1',
      tag: 'إبداع يدوي بالورود الطبيعية',
      titlePart1: 'كعكات شهية ومميزة',
      titlePart2: 'لكل مناسباتكم السعيدة',
      subtitle:
        'تُصنع يدوياً بكل شغف وحب باستخدام أرقى المكونات الطبيعية الفاخرة. اطلب كعكتك المفضلة أونلاين واستلمها طازجة ومبردة إلى باب منزلك عبر الـ 69 ولاية.',
      image: '/images/pink_flower_hero_cake.jpg',
      badge: 'الأكثر طلباً للمناسبات',
      linkTab: 'marketplace',
      linkText: 'تسوق الآن'
    },
    {
      id: 'slide-baklawa',
      tag: 'مذاق قسنطينة الأسطوري',
      titlePart1: 'بقلاوة قسنطينية ملكية',
      titlePart2: 'مورقة باللوز والجوز والعسل الحر',
      subtitle:
        'طبقات رقيقة ومقرمشة بالسمن الطبيعي، محشوة بقلب اللوز والجوز المحمص ومسقية بالعسل الصافي، مقطعة هندسياً ومزينة بحبات لوز ذهبية تليق بأبهى مناسباتكم.',
      image: '/images/traditional_baklawa.jpg',
      badge: 'عسل حر 100%',
      linkTab: 'traditional',
      linkText: 'طلب البقلاوة الملكية'
    },
    {
      id: 'slide-2',
      tag: 'الأعراس والمناسبات الكبرى',
      titlePart1: 'كعكة الزفاف الملكية 3 طبقات',
      titlePart2: 'بزهور الباستيل وورق الذهب',
      subtitle:
        'تحفة ملكية فاخرة مزينة بزهور الباستيل، ورق الذهب الخالص عيار 24 قيراط ولآلئ السكر المنسدلة على قاعدة شامبانيا ساحرة.',
      image: '/images/hero_wedding_cake.jpg',
      badge: 'كعكة ملكية فاخرة',
      linkTab: 'marketplace',
      linkText: 'تسوق الآن'
    },
    {
      id: 'slide-makroud',
      tag: 'حلوى العاصمة البيضاء',
      titlePart1: 'مقروط اللوز العاصمي',
      titlePart2: 'يذوب في الفم بماء الزهر والليمون',
      subtitle:
        'حلوى ملوكية جزائرية لا تغيب عن بهجة الأعراس والمناسبات السعيدة، غنية بنكهة قشور الليمون الطازجة وماء زهر البرتقال ومغلفة بنعومة السكر الأبيض.',
      image: '/images/traditional_makroud_el_louz.jpg',
      badge: 'طراوة ومذاق ساحر',
      linkTab: 'traditional',
      linkText: 'طلب مقروط اللوز'
    },
    {
      id: 'slide-3',
      tag: 'عشاق الشوكولاتة الفاخرة',
      titlePart1: 'كعكة الشوكولاتة والبراليني',
      titlePart2: 'مع الغاناش الغني والكراميل',
      subtitle:
        'طبقات إسفنجية غنية بكاكاو 70%، حشوة البراليني المقرمشة بالبندق المحمص وصوص الشوكولاتة المرآة اللامع المذهب.',
      image: '/images/chocolate_praline_layer_cake.jpg',
      badge: 'مذاق استثنائي',
      linkTab: 'marketplace',
      linkText: 'تسوق الآن'
    }
  ];

  // حالة السلايدر في الواجهة الرئيسية (Hero Carousel)
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [isHeroHovered, setIsHeroHovered] = useState(false);

  // دوران عشوائي تلقائي للكاروسيل كل 3 ثوانٍ
  useEffect(() => {
    if (isHeroHovered) return;

    const interval = setInterval(() => {
      setCurrentHeroSlide((prev) => {
        // اختيار شريحة عشوائية مختلفة تماماً عن الشريحة المعروضة حالياً
        const availableIndexes = heroSlides
          .map((_, idx) => idx)
          .filter((idx) => idx !== prev);
        const randomIndex = Math.floor(Math.random() * availableIndexes.length);
        return availableIndexes[randomIndex];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isHeroHovered, heroSlides.length]);

  // قائمة المفضلة التفاعلية للزبون
  const [wishlist, setWishlist] = useState<string[]>(['prod-2']);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const nextHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const activeSlide = heroSlides[currentHeroSlide];

  // أصناف التسوق الدائرية المطابقة تماماً لـ (Shop by Category)
  const categoriesList = [
    {
      id: 'cat-traditional',
      nameAr: 'حلويات تقليدية أصيلة',
      nameEn: 'Traditional Algerian Pastries',
      image: '/images/traditional_algerian_sweets.jpg',
      filter: 'TRADITIONNEL'
    },
    {
      id: 'cat-layer-cake',
      nameAr: 'تورتات ولاير كيك فاخرة',
      nameEn: 'Luxury Layer Cakes',
      image: '/images/category_birthday_cake.jpg',
      filter: 'ALL'
    },
    {
      id: 'cat-wedding',
      nameAr: 'كعكات الزفاف الملكية',
      nameEn: 'Wedding Cakes',
      image: '/images/hero_wedding_cake.jpg',
      filter: 'MARIAGE'
    },
    {
      id: 'cat-engagement',
      nameAr: 'كعكات الخطوبة والمناسبات',
      nameEn: 'Engagement & Celebrations',
      image: '/images/category_anniversary_cake.jpg',
      filter: 'MARIAGE'
    },
    {
      id: 'cat-photo',
      nameAr: 'كعكات بالصور المطبوعة',
      nameEn: 'Photo Cakes',
      image: '/images/category_photo_cake.jpg',
      filter: 'MODERNE'
    },
    {
      id: 'cat-cupcakes',
      nameAr: 'كب كيك وماكارون',
      nameEn: 'Cupcakes & Macarons',
      image: '/images/category_cupcakes.jpg',
      filter: 'MODERNE'
    }
  ];

  // تشكيلة الحلويات التقليدية الجزائرية المعروضة في الصفحة الرئيسية
  const traditionalHighlights = [
    {
      id: 'prod-18',
      nameAr: 'بقلاوة قسنطينية ملكية بالجوز واللوز',
      nameEn: 'Royal Constantinoise Baklawa',
      priceDZD: 7500,
      servings: 24,
      prepTimeDays: 2,
      rating: 5.0,
      reviewsCount: 94,
      image: '/images/traditional_baklawa.jpg',
      city: 'قسنطينة',
      categoryAr: 'مورقة بالعسل الحر'
    },
    {
      id: 'prod-19',
      nameAr: 'مقروط اللوز العاصمي بماء الزهر والليمون',
      nameEn: 'Algiers Makroud El Louz',
      priceDZD: 4800,
      servings: 20,
      prepTimeDays: 2,
      rating: 4.9,
      reviewsCount: 88,
      image: '/images/traditional_makroud_el_louz.jpg',
      city: 'الجزائر العاصمة',
      categoryAr: 'يذوب في الفم'
    },
    {
      id: 'prod-20',
      nameAr: 'تشاراك المسكر الملكي محشو باللوز',
      nameEn: 'Royal Tcharek Msekker',
      priceDZD: 4500,
      servings: 20,
      prepTimeDays: 2,
      rating: 4.9,
      reviewsCount: 76,
      image: '/images/traditional_tcharek_msekker.jpg',
      city: 'الجزائر العاصمة',
      categoryAr: 'لوز وسكر ناعم'
    },
    {
      id: 'prod-3',
      nameAr: 'صينية الضيافة الملكية للأفراح والمهيبة',
      nameEn: 'Royal Algerian Heritage Tray',
      priceDZD: 16500,
      servings: 30,
      prepTimeDays: 4,
      rating: 5.0,
      reviewsCount: 142,
      image: '/images/traditional_algerian_sweets.jpg',
      city: 'تشكيلة وطنية',
      categoryAr: 'صواني الأفراح'
    }
  ];

  // منتجات الأكثر طلباً ومبيعاً (Best Sellers) المطابقة للبطاقات الأربعة في الصورة
  const bestSellersList = [
    {
      id: 'best-1',
      nameAr: 'شوكولاتة ديلايت الفاخرة',
      nameEn: 'Chocolate Delight',
      priceDZD: 2499,
      rating: 5.0,
      reviewsCount: 120,
      image: '/images/cake_preview_chocolate.jpg',
      categoryAr: 'شوكولاتة غنية'
    },
    {
      id: 'best-2',
      nameAr: 'كعكة ريد فيلفيت المخملية',
      nameEn: 'Red Velvet Cake',
      priceDZD: 2699,
      rating: 4.9,
      reviewsCount: 98,
      image: '/images/bestseller_red_velvet.jpg',
      categoryAr: 'ريد فيلفيت'
    },
    {
      id: 'best-3',
      nameAr: 'كعكة الغابة السوداء بلاك فوريست',
      nameEn: 'Black Forest Cake',
      priceDZD: 2399,
      rating: 4.9,
      reviewsCount: 110,
      image: '/images/bestseller_black_forest.jpg',
      categoryAr: 'بلاك فوريست'
    },
    {
      id: 'best-4',
      nameAr: 'كعكة المانجو والفواكه الاستوائية',
      nameEn: 'Mango Cake',
      priceDZD: 2299,
      rating: 4.8,
      reviewsCount: 85,
      image: '/images/bestseller_mango.jpg',
      categoryAr: 'فواكه طازجة'
    }
  ];

  const handleOrderBestSeller = (item: typeof bestSellersList[0]) => {
    if (onSelectProductToOrder) {
      onSelectProductToOrder({
        id: item.id,
        artisanId: 'art-1',
        name: item.nameAr,
        nameAr: item.nameAr,
        category: 'MODERNE',
        description: item.nameAr,
        priceDZD: item.priceDZD,
        servings: 10,
        prepTimeDays: 2,
        imageUrl: item.image,
        isCustomizable: true,
        tags: ['أفضل المبيعات', 'طازج']
      });
    } else {
      onNavigate('marketplace');
    }
  };

  const handleOrderTraditional = (item: any) => {
    if (onSelectProductToOrder) {
      onSelectProductToOrder({
        id: item.id,
        artisanId: 'art-2',
        name: item.nameAr,
        nameAr: item.nameAr,
        category: 'TRADITIONNEL',
        description: item.nameAr,
        priceDZD: item.priceDZD,
        servings: item.servings,
        prepTimeDays: item.prepTimeDays,
        imageUrl: item.image,
        isCustomizable: false,
        tags: ['حلويات تقليدية', 'أصالة', item.city]
      });
    } else {
      onNavigate('traditional');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. قسم الواجهة الرئيسية الممتد على كامل المساحة (Full-Bleed Hero Banner) - دوران عشوائي كل 3 ثوانٍ */}
      <section 
        onMouseEnter={() => setIsHeroHovered(true)}
        onMouseLeave={() => setIsHeroHovered(false)}
        className="relative overflow-hidden min-h-[560px] sm:min-h-[620px] lg:min-h-[680px] flex items-center border-b border-pink-100/60 pt-6 pb-16 sm:pb-20"
      >
        
        {/* خلفية الصور المتراكبة بانتقال ذوبان ناعم وزوم سينمائي فخم (Smooth Crossfade & Ken Burns) */}
        <div className="absolute inset-0 w-full h-full overflow-hidden isolate pointer-events-none">
          {heroSlides.map((slide, idx) => {
            const isActive = idx === currentHeroSlide;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.titlePart1}
                  className={`w-full h-full object-cover object-[25%_center] sm:object-[28%_center] lg:object-[32%_center] transition-transform duration-[3500ms] ease-out will-change-transform transform-gpu ${
                    isActive ? 'scale-100 animate-heroImage' : 'scale-105'
                  }`}
                />
              </div>
            );
          })}

          {/* تدرج لوني لطيف ومدروس على اليمين فقط لحماية وضوح النصوص، مع ترك الكعكة والصورة واضحة وناصعة بالكامل */}
          <div className="absolute inset-0 bg-gradient-to-l from-[#FFF5F7]/95 via-[#FFF5F7]/70 via-35% to-transparent hidden lg:block z-20 pointer-events-none" />

          {/* تدرج مخصص للشاشات المتوسطة والصغيرة */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFF5F7]/90 via-[#FFF5F7]/65 to-[#FFF5F7]/30 lg:hidden z-20 pointer-events-none" />
        </div>

        {/* أزرار التنقل الدائرية على أطراف الواجهة الخارجية (كما في الموكاب تماماً) */}
        <button
          onClick={prevHeroSlide}
          aria-label="السابق"
          className="absolute right-3 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-[#E84375] shadow-lg flex items-center justify-center border border-pink-100 transition-all hover:scale-110 backdrop-blur-xs cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <button
          onClick={nextHeroSlide}
          aria-label="التالي"
          className="absolute left-3 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-[#E84375] shadow-lg flex items-center justify-center border border-pink-100 transition-all hover:scale-110 backdrop-blur-xs cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* المحتوى النصي الأيمن فوق التدرج اللوني */}
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 relative z-20 w-full">
          <div className="max-w-xl lg:max-w-2xl space-y-6 text-right pr-0 lg:pr-4">
            
            {/* الحاوية المتحركة للنصوص مع المفتاح key={activeSlide.id} لتشغيل الأنيميشن الفخمة عند كل دوران */}
            <div key={activeSlide.id} className="space-y-4 animate-heroText">
              {/* شارة التميز */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100/90 text-[#E84375] text-xs font-bold border border-pink-200 shadow-2xs backdrop-blur-xs animate-heroTag">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{activeSlide.tag}</span>
              </div>

              {/* العنوان الكبير المطابق للصورة: أسود عريض + وردي زاهي */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 leading-[1.18] tracking-tight drop-shadow-2xs">
                {activeSlide.titlePart1} <br />
                <span className="text-[#E84375] font-serif font-bold">
                  {activeSlide.titlePart2}
                </span>
              </h1>

              {/* الفقرة الوصفية */}
              <p className="text-stone-800 text-sm sm:text-base leading-relaxed max-w-xl font-normal drop-shadow-2xs">
                {activeSlide.subtitle}
              </p>
            </div>

            {/* أزرار الإجراء السريع CTA */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* زر الإجراء الأساسي */}
              <button
                onClick={() => onNavigate(activeSlide.linkTab || 'marketplace')}
                className="px-8 py-3.5 bg-[#E84375] hover:bg-[#D83264] text-white font-bold rounded-xl text-sm shadow-md shadow-pink-200/80 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{activeSlide.linkText || 'تسوق الآن'}</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>

              {/* زر الإجراء الثانوي */}
              {activeSlide.linkTab === 'traditional' ? (
                <button
                  onClick={() => onNavigate('marketplace')}
                  className="px-7 py-3.5 bg-white/95 hover:bg-white text-stone-800 hover:text-[#E84375] border-2 border-pink-200/80 hover:border-[#E84375] font-bold rounded-xl text-sm shadow-xs transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-xs cursor-pointer"
                >
                  <Store className="w-4 h-4 text-[#E84375]" />
                  <span>تصفح كل المعرض</span>
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('customizer')}
                  className="px-7 py-3.5 bg-white/95 hover:bg-white text-stone-800 hover:text-[#E84375] border-2 border-pink-200/80 hover:border-[#E84375] font-bold rounded-xl text-sm shadow-xs transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-xs cursor-pointer"
                >
                  <Cake className="w-4 h-4 text-[#E84375]" />
                  <span>صمّم كعكتك ثلاثية الأبعاد (3D)</span>
                </button>
              )}
            </div>

          </div>
        </div>

        {/* مؤشرات الترقيم (Pagination Dots) في أسفل الواجهة بالوسط */}
        <div className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-30">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentHeroSlide(idx)}
              aria-label={`شريحة ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentHeroSlide === idx
                  ? 'w-8 bg-[#E84375] shadow-xs'
                  : 'w-2.5 bg-pink-300/80 hover:bg-[#E84375]/60'
              }`}
            />
          ))}
        </div>

      </section>

      {/* 2. شريط المزايا الأربع المطابق للموكاب (Features Bar / 4 Pillars) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl shadow-pink-900/5 border border-pink-100 p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-right">
          
          {/* الميزة 1: توصيل سريع ومبرد (Fast Delivery) */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#E84375] flex items-center justify-center flex-shrink-0 border border-pink-100 shadow-2xs">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-stone-900 leading-tight">توصيل سريع ومبرد</h4>
              <p className="text-xs text-stone-500 mt-1 font-light">في الموعد المحدد لكافة الولايات</p>
            </div>
          </div>

          {/* الميزة 2: أفضل جودة فاخرة (Best Quality) */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#E84375] flex items-center justify-center flex-shrink-0 border border-pink-100 shadow-2xs">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-stone-900 leading-tight">أعلى معايير الجودة</h4>
              <p className="text-xs text-stone-500 mt-1 font-light">نستخدم مكونات طبيعية 100%</p>
            </div>
          </div>

          {/* الميزة 3: طازجة ومصنوعة للطلب (100% Fresh) */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#E84375] flex items-center justify-center flex-shrink-0 border border-pink-100 shadow-2xs">
              <Cake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-stone-900 leading-tight">100% طازجة يومياً</h4>
              <p className="text-xs text-stone-500 mt-1 font-light">تُخبز خصيصاً يوم مناسبتكم</p>
            </div>
          </div>

          {/* الميزة 4: دفع آمن ومضمون (Secure Payments) */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-[#E84375] flex items-center justify-center flex-shrink-0 border border-pink-100 shadow-2xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-stone-900 leading-tight">دفع آمن ومحمي</h4>
              <p className="text-xs text-stone-500 mt-1 font-light">بريدي موب، الذهبية أو عند الاستلام</p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. تسوق حسب الأصناف (Categories Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            تسوق حسب الأصناف
          </h2>
          <div className="w-12 h-0.5 bg-[#E84375] mx-auto mt-2.5 rounded-full"></div>
          <p className="text-stone-500 text-xs sm:text-sm mt-2 font-normal">
            تسوق حسب المناسبة والصنف المفضل لديك من تشكيلة الحلويات والكعكات الراقية
          </p>
        </div>

        {/* الحاويات الدائرية الست */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-6 justify-center">
          {categoriesList.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                if (cat.filter === 'TRADITIONNEL') {
                  onNavigate('marketplace', 'TRADITIONNEL');
                } else if (cat.filter === 'MARIAGE') {
                  onNavigate('marketplace', 'MARIAGE');
                } else {
                  onNavigate('marketplace', 'ALL');
                }
              }}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white shadow-md group-hover:shadow-xl group-hover:border-[#E84375] transition-all duration-300 relative bg-pink-50">
                <img
                  src={cat.image}
                  alt={cat.nameAr}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out will-change-transform transform-gpu"
                />
              </div>
              <h3 className="font-bold text-sm text-stone-800 mt-3.5 group-hover:text-[#E84375] transition-colors text-center">
                {cat.nameAr}
              </h3>
              <span className="text-[11px] text-[#E84375] font-semibold mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                استكشف التشكيلة ←
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. الأكثر طلباً ومبيعاً (Best Sellers Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            الأكثر طلباً ومبيعاً
          </h2>
          <div className="w-12 h-0.5 bg-[#E84375] mx-auto mt-2.5 rounded-full"></div>
          <p className="text-stone-500 text-xs sm:text-sm mt-2 font-normal">
            إبداعات نالت أعلى تقييمات الذواقة في الجزائر ومصنوعة بأيدي أمهر الحرفيين
          </p>
        </div>

        {/* بطاقات المنتجات الأربعة في صف متناسق */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellersList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-pink-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-pink-300 transition-all duration-300 flex flex-col justify-between group text-right"
            >
              {/* صورة المنتج مع زر المفضلة */}
              <div className="relative h-56 bg-stone-50 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.nameAr}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out will-change-transform transform-gpu"
                />

                {/* زر القلب المفضلة */}
                <button
                  onClick={(e) => toggleWishlist(item.id, e)}
                  title="إضافة للمفضلة"
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-stone-400 hover:text-[#E84375] shadow-xs transition-colors cursor-pointer"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      wishlist.includes(item.id)
                        ? 'fill-[#E84375] text-[#E84375]'
                        : 'text-stone-400'
                    }`}
                  />
                </button>

                {/* شارة التصنيف */}
                <span className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-stone-700 shadow-2xs">
                  {item.categoryAr}
                </span>
              </div>

              {/* تفاصيل البطاقة: الاسم، التقييم، السعر والزر */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-stone-900 text-base leading-snug group-hover:text-[#E84375] transition-colors">
                    {item.nameAr}
                  </h3>

                  {/* تقييم النجوم: 5 نجوم ذهبية مع عدد التقييمات */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="flex text-amber-400 gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] text-stone-500 font-medium">
                      ({item.reviewsCount} تقييم ممتاز)
                    </span>
                  </div>

                  {/* السعر منسق بالدينار الجزائري */}
                  <div className="mt-3 inline-flex items-baseline gap-1" dir="rtl">
                    <span className="text-xs font-bold text-stone-500">السعر:</span>
                    <span dir="ltr" className="text-xl font-mono font-extrabold text-stone-900">
                      {formatDZD(item.priceDZD)}
                    </span>
                    <span className="text-xs font-bold text-[#E84375]">دج</span>
                  </div>
                </div>

                {/* زر أضف إلى السلة الوردي */}
                <button
                  onClick={() => handleOrderBestSeller(item)}
                  className="w-full py-2.5 bg-[#E84375] hover:bg-[#D83264] text-white font-bold rounded-xl text-xs shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>طلب وحجز الآن</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* قسم الحلويات التقليدية الجزائرية الأصيلة (Traditional Algerian Pastries Showcase) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-gradient-to-b from-[#FFF5F7] via-white to-[#FFFBF8] rounded-3xl border border-pink-200/80 p-6 sm:p-10 shadow-sm text-right space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100 text-[#E84375] text-xs font-bold mb-2 border border-pink-200">
                <span>أصالة وتراث الأجداد</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-900 tracking-tight">
                الحلويات التقليدية الجزائرية
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-xl">
                أشهى صواني البقلاوة المورقة، مقروط اللوز المعسل، التشاراك والدزيريات المخبوزة بأجود أنواع اللوز الجزائري والعسل الحر.
              </p>
            </div>

            <button
              onClick={() => onNavigate('marketplace', 'TRADITIONNEL')}
              className="px-6 py-2.5 bg-white hover:bg-[#E84375] text-[#E84375] hover:text-white border-2 border-[#E84375] rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-2xs self-start md:self-auto cursor-pointer"
            >
              <span>استكشف كافة الحلويات التقليدية</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {traditionalHighlights.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-pink-100 hover:border-pink-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div className="relative h-52 bg-stone-50 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.nameAr}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                  />
                  <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E84375] text-white shadow-xs">
                    {item.categoryAr}
                  </span>
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-lg text-[10px] font-medium bg-stone-900/75 text-white backdrop-blur-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#E84375]" />
                    {item.city}
                  </span>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm leading-snug group-hover:text-[#E84375] transition-colors line-clamp-2">
                      {item.nameAr}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-1">
                      <span>{item.servings} قطعة</span>
                      <span>•</span>
                      <span>{item.prepTimeDays} أيام تحضير</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-pink-50">
                    <div>
                      <span className="text-[10px] text-stone-400 block font-medium">السعر :</span>
                      <span className="text-base font-bold text-[#E84375] font-mono">
                        {formatDZD(item.priceDZD)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleOrderTraditional(item)}
                      className="px-3.5 py-1.5 bg-[#E84375] hover:bg-[#D83264] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>طلب</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. البانر الترويجي لورشة الكعكات المخصصة ثلاثية الأبعاد */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-[#FFF0F4] border border-pink-200/80 rounded-3xl p-8 sm:p-12 overflow-hidden shadow-sm relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* جهة النصوص والدعوة للإجراء (في RTL اليمين) */}
            <div className="md:col-span-7 space-y-5 text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E84375] bg-white px-3.5 py-1 rounded-full border border-pink-200 shadow-2xs inline-block">
                خدمة التفصيل الحصرية
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 leading-tight">
                كعكة مخصصة <br />
                <span className="text-[#E84375]">للحظاتكم الاستثنائية</span>
              </h2>

              <p className="text-stone-600 text-sm sm:text-base font-normal max-w-lg leading-relaxed">
                شاركنا أفكارك، ألوانك المفضلة والمجسمات التي تحبها، وسنقوم بتحويل حلمك إلى حقيقة لذيذة تخطف الأنظار في ورشتنا ثلاثية الأبعاد التفاعلية!
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('customizer')}
                  className="px-7 py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-pink-400 group-hover:rotate-12 transition-transform" />
                  <span>بدء تصميم كعكتك في الورشة 3D</span>
                  <ArrowLeft className="w-4 h-4 text-pink-300 group-hover:-translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* جهة صورة كعكة الشوكولاتة والبراليني على الحامل المرتفع */}
            <div className="md:col-span-5 flex items-center justify-center">
              <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-pink-100 isolate group">
                <img
                  src="/images/chocolate_praline_layer_cake.jpg"
                  alt="كعكة شوكولاتة مخصصة"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform transform-gpu"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. بطاقة إبراز الـ 69 ولاية والنقل المبرد الوطني */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 text-center space-y-3 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-widest text-pink-700 bg-pink-50 px-3.5 py-1 rounded-full border border-pink-200">
            تغطية وطنية شاملة وموثوقة
          </span>
          <h3 className="font-serif font-bold text-xl sm:text-2xl text-stone-900">
            من تمنراست إلى الجزائر العاصمة، ومن وهران إلى عنابة
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto font-light">
            كافة الحرفيين وصناع الحلوى معتمدون مع الالتزام الصارم بمعايير النظافة وشروط النقل والتوصيل المبرد لضمان وصول كعكتك بأبهى حلة وطعم طازج عبر 69 ولاية.
          </p>
        </div>
      </section>

    </div>
  );
};
