import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Clock,
  MapPin,
  ShieldCheck,
  Award,
  Truck,
  Cake,
  Heart,
  ChevronDown,
  Search,
  BookOpen,
  Store,
  Layers,
  ArrowDown,
  Phone,
  CheckCircle2
} from 'lucide-react';
import { Artisan, Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialData';
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
  // فرز وتقديم الحلويات التقليدية الأصيلة في الصدارة مع تقليص الباتيسري الغربية
  const curatedProducts: Product[] = useMemo(() => {
    const raw = featuredProducts && featuredProducts.length > 0 ? featuredProducts : INITIAL_PRODUCTS;
    // تقليص الباتيسري الغربية وإبقاء الكعكات الملوكية المناسباتية الأساسية فقط
    const filtered = raw.filter((p) => {
      if (p.category === 'TRADITIONNEL') return true;
      // إبقاء كعكة الزفاف الملكية، نمبر كيك، وبينتو كيك فقط
      if (p.id === 'prod-1' || p.id === 'prod-2' || p.id === 'prod-14') return true;
      return false;
    });

    // الترتيب: صواني الأعراس أولاً، ثم الحلويات التقليدية الكلاسيكية، ثم كعكات الزفاف
    return filtered.sort((a, b) => {
      if (a.tags.includes('صواني') && !b.tags.includes('صواني')) return -1;
      if (!a.tags.includes('صواني') && b.tags.includes('صواني')) return 1;
      if (a.category === 'TRADITIONNEL' && b.category !== 'TRADITIONNEL') return -1;
      if (a.category !== 'TRADITIONNEL' && b.category === 'TRADITIONNEL') return 1;
      return 0;
    });
  }, [featuredProducts]);

  // حالة التصفية والبحث في الصفحة الثالثة: البداية الافتراضية مع الحلويات التقليدية
  const [selectedCategory, setSelectedCategory] = useState<string>('TRADITIONNEL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [wishlist, setWishlist] = useState<string[]>([]);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // تصفية المنتجات حسب الفئة والبحث مع إعطاء الأسبقية للحلويات التقليدية
  const filteredProducts = useMemo(() => {
    return curatedProducts.filter((product) => {
      const matchCategory =
        selectedCategory === 'ALL' ||
        (selectedCategory === 'TRADITIONNEL' && product.category === 'TRADITIONNEL') ||
        (selectedCategory === 'MODERNE' && product.category !== 'TRADITIONNEL') ||
        (selectedCategory === 'MARIAGE' && (product.category === 'MARIAGE' || product.tags.includes('أفراح') || product.tags.includes('صواني')));

      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        (product.nameAr && product.nameAr.toLowerCase().includes(q)) ||
        (product.descriptionAr && product.descriptionAr.toLowerCase().includes(q)) ||
        product.tags.some((t) => t.toLowerCase().includes(q));

      return matchCategory && matchSearch;
    });
  }, [curatedProducts, selectedCategory, searchQuery]);

  // إجراء الطلب السريع عند الضغط على "اضغط للطلب"
  const handleSelectProduct = (product: Product) => {
    if (onSelectProductToOrder) {
      onSelectProductToOrder(product);
    } else {
      onNavigate('marketplace');
    }
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-24 pb-20 text-right font-sans" dir="rtl">
      
      {/* ========================================================================= */}
      {/* 1. الواجهة الأولى: اللوغو الملكي الفاخر فقط (Hero View - لوڨو برك)           */}
      {/* ========================================================================= */}
      <section
        id="hero-logo"
        className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-radial from-[#FFFDF9] via-[#FFF9F2] to-[#FFF0F5] border-b border-pink-100/70"
      >
        {/* خلفية زخرفية ناعمة مع إضاءة ذهبية خافتة */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[520px] lg:w-[680px] h-[340px] sm:h-[520px] lg:h-[680px] bg-gradient-to-tr from-amber-200/25 via-pink-200/20 to-amber-100/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-10 right-10 w-48 h-48 bg-pink-100/40 rounded-full blur-2xl" />
          <div className="absolute bottom-10 left-10 w-56 h-56 bg-amber-100/40 rounded-full blur-2xl" />
        </div>

        {/* الحاوية المركزية: اللوغو برك مع الأناقة الملكية */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-6 pt-6 pb-12">
          
          {/* الشعار الرسمي الدائري الفاخر (SweetBox DZ Logo) */}
          <div className="relative group cursor-pointer transition-transform duration-500 hover:scale-[1.02]">
            {/* هالة ذهبية ناعمة خلف الشعار */}
            <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-tr from-[#C5A028]/40 via-[#E84375]/30 to-[#8A1538]/30 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition duration-700" />
            
            {/* إطار الشعار الدائري الملكي */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full p-2 bg-gradient-to-b from-amber-300 via-amber-100 to-amber-400 shadow-2xl shadow-amber-950/20">
              <div className="w-full h-full rounded-full overflow-hidden bg-white p-1 border-2 border-amber-400/60 shadow-inner">
                <img
                  src="/images/sweetbox_logo.jpg"
                  alt="شعار حلويات بوكس Sweet Box DZ - صناعة بيع تدريب"
                  loading="eager"
                  fetchPriority="high"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>

          {/* الاسم والسلوغان الرسمي المقتبس من الهوية البصرية للشعار */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black text-stone-900 tracking-tight leading-tight">
              حلويات بوكس <span className="text-[#E84375]">Sweet Box</span>
            </h1>
            
            <p className="text-lg sm:text-2xl text-stone-700 font-serif font-bold italic">
              ...حلويات بطعم السعادة
            </p>

            {/* شريط الركائز الثلاث للشعار */}
            <div className="pt-2 flex flex-col items-center gap-2">
              <div className="inline-flex items-center gap-3 sm:gap-4 px-6 sm:px-8 py-2 rounded-full bg-gradient-to-r from-amber-800 via-[#8A1538] to-amber-800 text-amber-100 text-xs sm:text-sm font-bold shadow-lg shadow-pink-900/10 border border-amber-300/40">
                <span className="tracking-wide">صناعة</span>
                <span className="text-amber-300 text-xs">•</span>
                <span className="tracking-wide">بيع</span>
                <span className="text-amber-300 text-xs">•</span>
                <span className="tracking-wide">تدريب</span>
              </div>
              <span className="text-xs sm:text-sm text-amber-800 font-semibold tracking-wider">
                تجربة مذاق استثنائية
              </span>
            </div>
          </div>

          {/* أزرار الإجراء السريع للانتقال السلس إلى الصفحتين التاليتين */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => scrollToSection('about-platform')}
              className="px-7 py-3.5 bg-white hover:bg-pink-50/80 text-stone-800 hover:text-[#E84375] font-bold rounded-2xl text-xs sm:text-sm border-2 border-pink-200/90 hover:border-[#E84375] shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#E84375]" />
              <span>التعريف بالمنصة</span>
              <ArrowDown className="w-3.5 h-3.5 text-stone-400" />
            </button>

            <button
              onClick={() => scrollToSection('shop-now')}
              className="px-8 py-3.5 bg-[#E84375] hover:bg-[#D83264] text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md shadow-pink-300/60 hover:shadow-lg transition-all hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>تسوق الآن مباشرة</span>
              <ArrowDown className="w-3.5 h-3.5 text-pink-200" />
            </button>
          </div>

          {/* مؤشر التمرير الناعم */}
          <button
            onClick={() => scrollToSection('about-platform')}
            aria-label="التمرير للأسفل"
            className="pt-6 text-stone-400 hover:text-[#E84375] transition-colors flex flex-col items-center gap-1 cursor-pointer group"
          >
            <span className="text-[11px] font-medium text-stone-400 group-hover:text-[#E84375]">
              انتقل لصفحة التعريف
            </span>
            <ChevronDown className="w-5 h-5 animate-bounce text-pink-400" />
          </button>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 2. الصفحة الثانية: التعريف بالمنصة (About SweetBox DZ Platform)             */}
      {/* ========================================================================= */}
      <section
        id="about-platform"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 space-y-12"
      >
        {/* رأس صفحة التعريف */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/90 text-[#E84375] text-xs font-bold border border-pink-200 shadow-2xs">
            <Award className="w-4 h-4" />
            <span>منصة حلويات بوكس الجزائرية — SweetBox DZ</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
            التعريف بالمنصة
          </h2>

          <div className="w-16 h-1 bg-gradient-to-r from-amber-400 via-[#E84375] to-amber-400 mx-auto rounded-full" />

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
            منصة وطنية متكاملة ورائدة تجمع بين عراقة الحلويات التقليدية الجزائرية وإبداع الكعكات العصرية الفاخرة، مرتكزة على شعارنا الخالد: <strong className="text-stone-900 font-bold">صناعة • بيع • تدريب</strong> لتقديم أرقى تجربة ذوق لزبائننا في كل المناسبات.
          </p>
        </div>

        {/* بطاقات الركائز الثلاث المستوحاة من الشعار الرسمي */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* الركيزة 1: صناعة */}
          <div className="bg-white rounded-3xl p-8 border border-pink-100 shadow-sm hover:shadow-xl hover:border-pink-300 transition-all duration-300 space-y-5 text-right flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-white flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Cake className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest block mb-1">
                  الركيزة الأولى
                </span>
                <h3 className="text-2xl font-serif font-bold text-stone-900 group-hover:text-[#E84375] transition-colors">
                  صناعة يدوية فاخرة
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                صناعة يومية متقنة بأيدي أمهر الحرفيات والحرفيين المعتمدين رسمياً في الجزائر، مع الالتزام التام بالمكونات الطبيعية 100%:
              </p>

              <ul className="space-y-2 text-xs text-stone-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>لوز جزائري بلدي خالص وعسل النحل الطبيعي</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>حلويات تقليدية أصيلة: مقروط اللوز، بقلاوة، عرايش، وتشاراك</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>كعكات ملكية فاخرة للأعراس والمناسبات الكبرى ثلاثية الأبعاد</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-pink-50">
              <span className="text-[11px] font-bold text-[#E84375]">
                جودة ونظافة مضمونة 100%
              </span>
            </div>
          </div>

          {/* الركيزة 2: بيع وتوصيل */}
          <div className="bg-white rounded-3xl p-8 border border-pink-100 shadow-sm hover:shadow-xl hover:border-pink-300 transition-all duration-300 space-y-5 text-right flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#E84375] to-pink-400 text-white flex items-center justify-center shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform">
                <Truck className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#E84375] uppercase tracking-widest block mb-1">
                  الركيزة الثانية
                </span>
                <h3 className="text-2xl font-serif font-bold text-stone-900 group-hover:text-[#E84375] transition-colors">
                  بيع وتوصيل 69 ولاية
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                تجربة تسوق وحجز إلكترونية واضحة وموثوقة بالدينار الجزائري (دج) مع خيارات دفع مرنة وتوصيل مبرد متخصص:
              </p>

              <ul className="space-y-2 text-xs text-stone-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>إمكانية دفع عربون فقط (30% أو 50%) أو الدفع عند الاستلام</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>وصل دفع رسمي موثق قابل للتنزيل والطباعة فورياً</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>أسطول نقل مبرد يضمن وصول الحلويات طازجة إلى باب البيت</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-pink-50">
              <span className="text-[11px] font-bold text-[#E84375]">
                تغطية شاملة لكل ربوع الجزائر
              </span>
            </div>
          </div>

          {/* الركيزة 3: تدريب وتمكين */}
          <div className="bg-white rounded-3xl p-8 border border-pink-100 shadow-sm hover:shadow-xl hover:border-pink-300 transition-all duration-300 space-y-5 text-right flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
                <BookOpen className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-purple-600 uppercase tracking-widest block mb-1">
                  الركيزة الثالثة
                </span>
                <h3 className="text-2xl font-serif font-bold text-stone-900 group-hover:text-[#E84375] transition-colors">
                  تدريب وتمكين الحرفيين
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                نقل أسرار المهنة وتطوير مهارات الحرفيات وصناع الحلوى لتمكينهم من تأسيس وتنمية مشاريعهم الخاصة:
              </p>

              <ul className="space-y-2 text-xs text-stone-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>ورشات تطبيقية متخصصة في الحلويات التقليدية وتزيين الكعك</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>مرافقة تقنية وفنية للشباب والمشاريع المنزلية المصغرة</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>شهادات تدريبية وإشراف مباشر من كبار شيفات الحلويات</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-pink-50">
              <span className="text-[11px] font-bold text-[#E84375]">
                دعم ريادة الأعمال وصناعة المستقبل
              </span>
            </div>
          </div>

        </div>

        {/* شريط الضمانات والأرقام البارزة */}
        <div className="bg-gradient-to-r from-[#FFF5F7] via-white to-[#FFF9F2] rounded-3xl border border-pink-200/80 p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center shadow-2xs">
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-mono font-black text-[#E84375]">69</span>
            <span className="text-xs sm:text-sm font-bold text-stone-800 block">ولاية مشمولة بالتوصيل</span>
            <span className="text-[10px] text-stone-500 block">نقل مبرد ومكيف</span>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-mono font-black text-amber-600">100%</span>
            <span className="text-xs sm:text-sm font-bold text-stone-800 block">مكونات طبيعية</span>
            <span className="text-[10px] text-stone-500 block">لوز جزائري وعسل حر</span>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-mono font-black text-emerald-600">30%</span>
            <span className="text-xs sm:text-sm font-bold text-stone-800 block">عربون حجز مرن</span>
            <span className="text-[10px] text-stone-500 block">مع وصل دفع رسمي</span>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-mono font-black text-purple-600">7/7</span>
            <span className="text-xs sm:text-sm font-bold text-stone-800 block">متابعة مراحل الصنع</span>
            <span className="text-[10px] text-stone-500 block">صور حية في الوقت الفعلي</span>
          </div>
        </div>

        {/* زر الانتقال المباشر إلى الصفحة الثالثة: تسوق الآن */}
        <div className="text-center pt-2">
          <button
            onClick={() => scrollToSection('shop-now')}
            className="px-8 py-4 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-2xl text-sm shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-pink-400" />
            <span>انتقل إلى المتجر وتسوق الآن</span>
            <ArrowDown className="w-4 h-4 text-pink-300" />
          </button>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 3. الصفحة الثالثة: تسوق الآن (Shop Now - تحت كل حلوة اضغط للطلب)            */}
      {/* ========================================================================= */}
      <section
        id="shop-now"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 space-y-10"
      >
        {/* رأس صفحة المتجر */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-pink-100 pb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100 text-[#E84375] text-xs font-bold border border-pink-200">
              <Store className="w-3.5 h-3.5" />
              <span>المتجر الوطني المعتمد</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight">
              تسوق الآن
            </h2>
            
            <p className="text-stone-600 text-xs sm:text-sm max-w-2xl font-light">
              تصفح التشكيلة الكاملة من أرقى الحلويات الجزائرية التقليدية والعصرية — <strong className="text-[#E84375] font-bold">تحت كل حلوة اضغط للطلب</strong> لحجز طلبيتك فورياً.
            </p>
          </div>

          {/* شريط البحث المباشر */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="ابحث عن حلوى، كعكة، أو ولاية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-2xl pr-10 pl-4 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#E84375] focus:ring-2 focus:ring-pink-100 shadow-2xs"
            />
          </div>
        </div>

        {/* أزرار فلاتر الأصناف - مع تقديم الحلويات التقليدية في الصدارة */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('TRADITIONNEL')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              selectedCategory === 'TRADITIONNEL'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-200'
                : 'bg-white text-stone-700 hover:bg-amber-50 border border-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>حلويات تقليدية أصيلة ({curatedProducts.filter((p) => p.category === 'TRADITIONNEL').length})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('MARIAGE')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'MARIAGE'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                : 'bg-white text-stone-700 hover:bg-purple-50 border border-stone-200'
            }`}
          >
            صواني ومجموعات الأعراس والمهيبة
          </button>

          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-[#E84375] text-white shadow-md shadow-pink-200'
                : 'bg-white text-stone-700 hover:bg-pink-50 border border-stone-200'
            }`}
          >
            كافة المعروضات المختارة ({curatedProducts.length})
          </button>

          <button
            onClick={() => setSelectedCategory('MODERNE')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'MODERNE'
                ? 'bg-[#E84375] text-white shadow-md shadow-pink-200'
                : 'bg-white text-stone-700 hover:bg-pink-50 border border-stone-200'
            }`}
          >
            كعكات المناسبات الخاصة ({curatedProducts.filter((p) => p.category !== 'TRADITIONNEL').length})
          </button>
        </div>

        {/* لافتة فخر التراث والحلويات الجزائرية الأصيلة */}
        <div className="relative rounded-3xl bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 p-6 sm:p-8 text-amber-50 shadow-xl border border-amber-500/30 overflow-hidden text-right">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>تراث جزائري 100% — فخر الأصالة والعراقة</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-amber-100">
                أرقى الحلويات الجزائرية التقليدية بأيدي أمهر الحرفيات
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 font-light max-w-2xl leading-relaxed">
                مصنوعة يومياً بأجود المكونات الطبيعية: لوز جزائري بلدي، عسل النحل الصافي، ماء الزهر المقطر، وسمن طبيعي فاخر — جاهزة لطلبياتكم مع إمكانية دفع عربون واستلام وصل رسمي موثق.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-center px-4 py-2 rounded-2xl bg-white/5 border border-amber-400/20">
                <span className="block text-2xl font-mono font-bold text-amber-300">16</span>
                <span className="text-[11px] text-stone-300">صنف تقليدي أصيل</span>
              </div>
              <div className="text-center px-4 py-2 rounded-2xl bg-white/5 border border-amber-400/20">
                <span className="block text-2xl font-mono font-bold text-amber-300">100%</span>
                <span className="text-[11px] text-stone-300">لوز بلدي خالص</span>
              </div>
            </div>
          </div>
        </div>

        {/* شبكة المنتجات الكاملة (تحت كل حلوة اضغط للطلب) */}
        {filteredProducts.length === 0 ? (
          <div className="p-16 bg-white rounded-3xl border border-pink-100 text-center space-y-3 shadow-2xs">
            <Cake className="w-12 h-12 mx-auto text-stone-300" />
            <h3 className="font-bold text-stone-800 text-base">لا توجد حلويات مطابقة لمعايير البحث</h3>
            <p className="text-xs text-stone-500">جرب كتابة اسم مختلف أو اختر فئة أخرى من القائمة</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
            {filteredProducts.map((item) => {
              const isTraditional = item.category === 'TRADITIONNEL';
              const artisan = artisans.find((a) => a.id === item.artisanId);

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-pink-100/90 hover:border-pink-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group text-right"
                >
                  {/* حاوية الصورة وشارات التصنيف */}
                  <div className="relative h-56 bg-stone-50 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.nameAr || item.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    />

                    {/* زر القلب في المفضلة */}
                    <button
                      onClick={(e) => toggleWishlist(item.id, e)}
                      title="إضافة للمفضلة"
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-stone-400 hover:text-[#E84375] shadow-xs transition-colors cursor-pointer z-10"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          wishlist.includes(item.id)
                            ? 'fill-[#E84375] text-[#E84375]'
                            : 'text-stone-400'
                        }`}
                      />
                    </button>

                    {/* شارات الصنف والنوع */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                      {isTraditional ? (
                        <>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-xs flex items-center gap-1 border border-amber-300/40">
                            <Sparkles className="w-2.5 h-2.5 text-amber-200" />
                            <span>تراث جزائري أصيل</span>
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-stone-900/85 text-amber-200 backdrop-blur-xs shadow-xs border border-amber-400/30">
                            لوز بلدي وعسل حر
                          </span>
                        </>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-stone-800 shadow-xs border border-pink-100">
                          {item.categoryAr || item.category}
                        </span>
                      )}

                      {item.isCustomizable && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E84375] text-white shadow-xs flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-pink-200" />
                          <span>تخصيص 3D</span>
                        </span>
                      )}
                    </div>

                    {/* منشأ الحلوى ومدينة الصنع */}
                    <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg text-[10px] font-medium bg-stone-950/75 text-white backdrop-blur-xs flex items-center gap-1 z-10">
                      <MapPin className="w-3 h-3 text-pink-400" />
                      <span>{artisan?.wilayaNameAr || artisan?.wilayaName || 'الجزائر'}</span>
                    </div>
                  </div>

                  {/* تفاصيل الحلوى */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {artisan && (
                        <span className="text-[10px] font-bold text-[#E84375] block mb-1">
                          {artisan.storeNameAr || artisan.storeName}
                        </span>
                      )}

                      <h3 className="font-bold text-base text-stone-900 group-hover:text-[#E84375] transition-colors line-clamp-1 leading-snug">
                        {item.nameAr || item.name}
                      </h3>

                      <p className="text-xs text-stone-500 line-clamp-2 mt-1.5 font-light leading-relaxed">
                        {item.descriptionAr || item.description}
                      </p>
                    </div>

                    {/* المواصفات السريعة: الحصص والتحضير */}
                    <div className="pt-2 border-t border-pink-50 space-y-3">
                      <div className="flex items-center justify-between text-[11px] text-stone-500">
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-stone-400" />
                          <span>تحضير: {item.prepTimeDays} أيام</span>
                        </span>
                        <span className="bg-stone-50 px-2 py-0.5 rounded-md border border-stone-200 text-stone-700 font-medium">
                          {item.servings} قطعة / فرد
                        </span>
                      </div>

                      {/* السعر بالدينار الجزائري */}
                      <div className="flex items-baseline justify-between" dir="rtl">
                        <span className="text-xs font-bold text-stone-400">السعر الإجمالي:</span>
                        <div className="inline-flex items-baseline gap-1">
                          <span dir="ltr" className="text-xl font-mono font-bold text-stone-900">
                            {formatDZD(item.priceDZD)}
                          </span>
                          <span className="text-xs font-bold text-[#E84375]">دج</span>
                        </div>
                      </div>

                      {/* الزر الرئيسي المطلوب بدقة: تحت كل حلوة اضغط للطلب */}
                      <div className="flex items-center gap-2 pt-1">
                        {item.isCustomizable && (
                          <button
                            onClick={() => onNavigate('customizer')}
                            title="تخصيص الكعكة في الورشة ثلاثية الأبعاد 3D"
                            className="p-3 rounded-2xl bg-pink-50 hover:bg-pink-100 text-[#E84375] border border-pink-200 transition-all cursor-pointer shadow-2xs hover:scale-105"
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => handleSelectProduct(item)}
                          className="flex-1 py-3 px-4 bg-[#E84375] hover:bg-[#D83264] text-white font-bold rounded-2xl text-xs sm:text-sm shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 group/btn cursor-pointer active:scale-95"
                        >
                          <ShoppingBag className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                          <span>اضغط للطلب</span>
                        </button>
                      </div>

                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </section>

    </div>
  );
};
