import React, { useState, useEffect } from 'react';
import {
  Star,
  MapPin,
  Clock,
  Sparkles,
  Store,
  ArrowLeft,
  ShieldCheck,
  Search,
  Filter,
  Heart,
  ShoppingBag,
  Award,
  Truck,
  Layers,
  ChevronDown
} from 'lucide-react';
import { Artisan, Product, Wilaya } from '../types';
import { formatDZD } from '../utils/format';

interface MarketplaceViewProps {
  artisans: Artisan[];
  products: Product[];
  wilayas: Wilaya[];
  selectedWilaya: number;
  setSelectedWilaya: (code: number) => void;
  onSelectProductToOrder: (product: Product) => void;
  onNavigateToCustomizer: () => void;
  initialCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  artisans,
  products,
  wilayas,
  selectedWilaya,
  setSelectedWilaya,
  onSelectProductToOrder,
  onNavigateToCustomizer,
  initialCategory = 'ALL',
  onCategoryChange
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [activeTab, setActiveTab] = useState<'creations' | 'artisans'>('creations');
  const [traditionalSubFilter, setTraditionalSubFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'FEATURED' | 'PRICE_ASC' | 'PRICE_DESC' | 'PREP_TIME'>('FEATURED');
  const [wishlist, setWishlist] = useState<string[]>([]);

  // مزامنة التصنيف عند تغييره من الشريط العلوي أو التمرير الخارجي
  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    onCategoryChange?.(catId);
  };

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const categories = [
    { id: 'ALL', label: 'كافة الإبداعات', icon: '🍰' },
    { id: 'TRADITIONNEL', label: 'حلويات تقليدية جزائرية ✨', isSpecial: true, icon: '🍯' },
    { id: 'MARIAGE', label: 'أعراس ومناسبات كبرى', icon: '💍' },
    { id: 'B2B_ENTREPRISE', label: 'بوفيهات وشركات B2B', icon: '🏢' }
  ];

  // تصفية المنتجات بذكاء مع دعم الحلويات التقليدية والمرشحات الفرعية
  const filteredProducts = products
    .filter((prod) => {
      // 1. فلتر التصنيف الرئيسي
      if (selectedCategory === 'TRADITIONNEL') {
        const isTrad =
          prod.category === 'TRADITIONNEL' ||
          prod.tags?.some((t) => t.includes('تقليدي') || t.includes('بقلاوة') || t.includes('مقروط') || t.includes('تشاراك') || t.includes('دزيريات')) ||
          prod.name.includes('بقلاوة') ||
          prod.name.includes('مقروط') ||
          prod.name.includes('تشاراك') ||
          prod.name.includes('دزيريات');

        if (!isTrad) return false;

        // فلتر فرعي للحلويات التقليدية
        if (traditionalSubFilter === 'BAKLAWA_MAKROUD') {
          return prod.name.includes('بقلاوة') || prod.name.includes('مقروط') || prod.description.includes('بقلاوة');
        }
        if (traditionalSubFilter === 'ALMOND_SWEETS') {
          return (
            prod.name.includes('لوز') ||
            prod.name.includes('تشاراك') ||
            prod.name.includes('دزيريات') ||
            prod.name.includes('قنيدلات')
          );
        }
        if (traditionalSubFilter === 'TRAYS_WEDDING') {
          return prod.name.includes('صينية') || prod.name.includes('عروس') || prod.servings >= 25;
        }
      } else if (selectedCategory !== 'ALL') {
        if (prod.category !== selectedCategory) return false;
      }

      // 2. فلتر الولاية
      if (selectedWilaya !== 0) {
        const art = artisans.find((a) => a.id === prod.artisanId);
        if (art && art.wilayaCode !== selectedWilaya) return false;
      }

      // 3. فلتر البحث النصي السريع
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (prod.nameAr || prod.name).toLowerCase().includes(q);
        const matchesDesc = (prod.descriptionAr || prod.description).toLowerCase().includes(q);
        const matchesTags = prod.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesTags) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'PRICE_ASC') return a.priceDZD - b.priceDZD;
      if (sortBy === 'PRICE_DESC') return b.priceDZD - a.priceDZD;
      if (sortBy === 'PREP_TIME') return a.prepTimeDays - b.prepTimeDays;
      return 0; // FEATURED
    });

  // تصفية الحرفيين حسب الولاية
  const filteredArtisans = artisans.filter((art) => {
    if (selectedWilaya !== 0) {
      return art.wilayaCode === selectedWilaya;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-16 text-right" dir="rtl">
      {/* 1. رأس الصفحة الديناميكي (يتغير حسب اختيار الحلويات التقليدية أو كافة المعرض) */}
      {selectedCategory === 'TRADITIONNEL' ? (
        <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F7] via-[#FFFBF8] to-white border-b border-pink-100/70 pt-8 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100/90 text-[#E84375] text-xs font-bold border border-pink-200 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>أصالة المذاق الجزائري العريق — تراث الأجداد</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 leading-tight">
                حلويات جزائرية تقليدية <br />
                <span className="text-[#E84375]">تُخبز بكل حب، إتقان وأصالة</span>
              </h1>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
                نجمع لكم نخبة صانعي الحلويات التقليدية المعتمدين عبر الـ 69 ولاية. تذوقوا أرقى أصناف البقلاوة
                القسنطينية المورقة، مقروط اللوز العاصمي بماء الزهر والليمون، التشاراك المسكر والدزيريات الملكية
                المصنوعة بأجود أنواع اللوز والعسل الحر الصافي.
              </p>

              {/* بطاقات ميزات التراث الجزائري */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-white rounded-xl border border-pink-100/80 shadow-2xs flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    🍯
                  </span>
                  <span className="text-xs font-bold text-stone-800">عسل حر ولوز بلدي</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-pink-100/80 shadow-2xs flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-lg bg-pink-50 text-[#E84375] flex items-center justify-center font-bold text-sm flex-shrink-0">
                    🏛️
                  </span>
                  <span className="text-xs font-bold text-stone-800">وصفات أصيلة متوارثة</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-pink-100/80 shadow-2xs flex items-center gap-2.5 col-span-2 sm:col-span-1">
                  <span className="w-8 h-8 rounded-lg bg-pink-50 text-[#E84375] flex items-center justify-center font-bold text-sm flex-shrink-0">
                    🚚
                  </span>
                  <span className="text-xs font-bold text-stone-800">توصيل مبرد لـ 69 ولاية</span>
                </div>
              </div>
            </div>

            {/* صورة البانر الفاخرة للحلويات التقليدية */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white shadow-pink-900/10 group aspect-4/3 sm:aspect-16/10 lg:aspect-square">
                <img
                  src="/images/traditional_algerian_sweets.jpg"
                  alt="تشكيلة حلويات تقليدية جزائرية"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                  <span className="px-2.5 py-1 rounded-full bg-[#E84375] text-white text-[11px] font-bold self-start mb-1 shadow-xs">
                    صواني الأفراح والمهيبة
                  </span>
                  <p className="text-sm font-bold">صواني نحاسية مطروقة تضم نخبة الحلويات الجزائرية</p>
                  <p className="text-[11px] text-pink-200">تُخبز طازجة حسب الطلب لأعراسكم ومناسباتكم الراقية</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-gradient-to-b from-[#FFF5F7] via-[#FFFBF8] to-white border-b border-pink-100/70 pt-8 pb-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-[#E84375] text-xs font-bold mb-2 border border-pink-200 shadow-2xs">
                <Store className="w-3.5 h-3.5 text-[#E84375]" />
                <span>المتجر الوطني الشامل للحلويات والكعكات</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
                معرض الحلويات والكعكات الفاخرة
              </h1>
              <p className="text-stone-600 text-sm mt-1 max-w-2xl font-light">
                تصفح تشكيلة متكاملة تجمع بين الكعكات العصرية المخصصة، كعكات الأعراس، وحلويات التراث الجزائري الأصيل من أمهر الحرفيين.
              </p>
            </div>

            {/* مبدّل العرض : كتالوج الإبداعات أو ملفات الحرفيين */}
            <div className="flex bg-stone-100 p-1.5 rounded-2xl self-start md:self-auto border border-stone-200 shadow-2xs">
              <button
                onClick={() => setActiveTab('creations')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'creations'
                    ? 'bg-white text-[#E84375] shadow-xs border border-pink-100'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                كتالوج الحلويات ({filteredProducts.length})
              </button>
              <button
                onClick={() => setActiveTab('artisans')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'artisans'
                    ? 'bg-white text-[#E84375] shadow-xs border border-pink-100'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                ملفات الحرفيين ({filteredArtisans.length})
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 2. شريط التصنيفات الرئيسية الموحدة والفلترة السريعة */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* أزرار التصنيفات الأساسية */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-2xs ${
                  isSelected
                    ? cat.isSpecial
                      ? 'bg-gradient-to-r from-amber-500 to-[#E84375] text-white shadow-md shadow-pink-200 scale-[1.02]'
                      : 'bg-[#E84375] text-white shadow-md shadow-pink-200 scale-[1.02]'
                    : cat.isSpecial
                    ? 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                    : 'bg-white text-stone-700 hover:bg-pink-50 hover:text-[#E84375] border border-pink-100'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* فلاتر فرعية إضافية خاصة بالحلويات التقليدية الجزائريّة */}
        {selectedCategory === 'TRADITIONNEL' && (
          <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-200/80 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-amber-900 pl-2 flex items-center gap-1">
              <span>🏺</span>
              <span>أصناف التراث:</span>
            </span>
            <button
              onClick={() => setTraditionalSubFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                traditionalSubFilter === 'ALL'
                  ? 'bg-[#E84375] text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-amber-100/80 border border-amber-100'
              }`}
            >
              الكل ({products.filter((p) => p.category === 'TRADITIONNEL').length})
            </button>
            <button
              onClick={() => setTraditionalSubFilter('BAKLAWA_MAKROUD')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                traditionalSubFilter === 'BAKLAWA_MAKROUD'
                  ? 'bg-[#E84375] text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-amber-100/80 border border-amber-100'
              }`}
            >
              بقلاوة ومقروط العسل
            </button>
            <button
              onClick={() => setTraditionalSubFilter('ALMOND_SWEETS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                traditionalSubFilter === 'ALMOND_SWEETS'
                  ? 'bg-[#E84375] text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-amber-100/80 border border-amber-100'
              }`}
            >
              حلويات اللوز (تشاراك ودزيريات)
            </button>
            <button
              onClick={() => setTraditionalSubFilter('TRAYS_WEDDING')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                traditionalSubFilter === 'TRAYS_WEDDING'
                  ? 'bg-[#E84375] text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-amber-100/80 border border-amber-100'
              }`}
            >
              صواني الأعراس والمهيبة
            </button>
          </div>
        )}

        {/* شريط الأدوات: البحث، الفرز ومحدد الولاية */}
        <div className="p-4 bg-white rounded-2xl border border-pink-100 shadow-sm flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
          {/* حقل البحث داخل الكتالوج */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="ابحث عن اسم الحلوى، المكونات (لوز، شوكولاتة...) أو المناسبة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:bg-white transition-all"
            />
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            {/* الترتيب حسب */}
            <div className="relative flex items-center flex-1 sm:flex-initial">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="pr-4 pl-8 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-pink-200 appearance-none cursor-pointer w-full"
              >
                <option value="FEATURED">الترتيب: الأكثر تميزاً</option>
                <option value="PRICE_ASC">السعر: من الأقل للأعلى</option>
                <option value="PRICE_DESC">السعر: من الأعلى للأقل</option>
                <option value="PREP_TIME">أسرع مدة تحضير</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 pointer-events-none" />
            </div>

            {/* محدد الولاية من بين الـ 69 ولاية */}
            <div className="relative flex items-center flex-1 sm:flex-initial">
              <MapPin className="w-3.5 h-3.5 text-[#E84375] absolute right-3 pointer-events-none" />
              <select
                value={selectedWilaya}
                onChange={(e) => setSelectedWilaya(Number(e.target.value))}
                className="pr-8 pl-8 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-pink-200 appearance-none cursor-pointer w-full"
              >
                <option value={0}>كل الولايات (69 ولاية)</option>
                {wilayas.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.code.toString().padStart(2, '0')} - {w.nameAr}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. شبكة المحتوى (المنتجات أو الحرفيين) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {activeTab === 'creations' ? (
          filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-pink-100 p-8 space-y-4 shadow-sm">
              <div className="w-16 h-16 mx-auto rounded-full bg-pink-50 text-[#E84375] flex items-center justify-center text-2xl font-bold">
                🍰
              </div>
              <h3 className="text-lg font-bold text-stone-800">لا توجد حلويات مطابقة لخيارات الفلترة الحالية</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                جرّب إزالة نص البحث أو اختيار &quot;كل الولايات&quot; للاطلاع على كامل إبداعات المتجر.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                {selectedWilaya !== 0 && (
                  <button
                    onClick={() => setSelectedWilaya(0)}
                    className="px-4 py-2 bg-pink-50 hover:bg-pink-100 text-[#E84375] rounded-xl text-xs font-bold transition-colors cursor-pointer border border-pink-200"
                  >
                    عرض كافة الـ 69 ولاية
                  </button>
                )}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    مسح البحث
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((prod) => {
                const artisan = artisans.find((a) => a.id === prod.artisanId);
                const isWishlisted = wishlist.includes(prod.id);
                const isTraditional = prod.category === 'TRADITIONNEL';

                return (
                  <div
                    key={prod.id}
                    className="bg-white rounded-3xl overflow-hidden border border-pink-100 shadow-sm hover:shadow-xl hover:border-pink-300 transition-all duration-300 flex flex-col justify-between group"
                  >
                    {/* الصورة والحاويات العلوية */}
                    <div className="relative h-56 bg-stone-50 overflow-hidden">
                      <img
                        src={prod.imageUrl}
                        alt={prod.nameAr || prod.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                      />

                      {/* زر المفضلة */}
                      <button
                        onClick={(e) => toggleWishlist(prod.id, e)}
                        aria-label="إضافة للمفضلة"
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-stone-400 hover:text-[#E84375] shadow-xs transition-colors cursor-pointer z-10"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isWishlisted ? 'fill-[#E84375] text-[#E84375]' : 'text-stone-400'
                          }`}
                        />
                      </button>

                      {/* شارات المنتج */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                        {isTraditional ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-xs">
                            أصالة جزائرية 🇩🇿
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-stone-800 shadow-xs backdrop-blur-xs border border-pink-100">
                            {prod.categoryAr || prod.category}
                          </span>
                        )}

                        {prod.isCustomizable && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E84375] text-white shadow-xs flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-pink-200" />
                            <span>تخصيص 3D</span>
                          </span>
                        )}
                      </div>

                      {/* موقع الحرفي على الصورة */}
                      {artisan && (
                        <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg text-[10px] font-medium bg-stone-950/75 text-white backdrop-blur-xs flex items-center gap-1 z-10">
                          <MapPin className="w-3 h-3 text-pink-300" />
                          <span>
                            {artisan.wilayaNameAr || artisan.wilayaName} (ولاية{' '}
                            {artisan.wilayaCode.toString().padStart(2, '0')})
                          </span>
                        </div>
                      )}
                    </div>

                    {/* تفاصيل البطاقة */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        {artisan && (
                          <p className="text-[11px] font-bold text-[#E84375] mb-1">
                            {artisan.storeNameAr || artisan.storeName}
                          </p>
                        )}
                        <h3 className="font-bold text-base text-stone-900 group-hover:text-[#E84375] transition-colors line-clamp-1">
                          {prod.nameAr || prod.name}
                        </h3>
                        <p className="text-xs text-stone-500 line-clamp-2 mt-1.5 font-light leading-relaxed">
                          {prod.descriptionAr || prod.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-pink-50">
                        {/* مواصفات سريعة: القطع ومدة التحضير */}
                        <div className="flex items-center justify-between text-xs text-stone-500 mb-3">
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3.5 h-3.5 text-stone-400" />
                            <span>التحضير: {prod.prepTimeDays} أيام</span>
                          </span>
                          <span className="font-medium bg-stone-50 px-2 py-0.5 rounded-md border border-stone-100">
                            {prod.servings} قطعة / فرد
                          </span>
                        </div>

                        {/* السعر والطلب */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="inline-flex items-baseline gap-1" dir="rtl">
                            <span className="text-xs font-bold text-stone-400">السعر:</span>
                            <span dir="ltr" className="text-xl font-bold font-mono text-stone-900">
                              {formatDZD(prod.priceDZD)}
                            </span>
                            <span className="text-xs font-bold text-[#E84375]">دج</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {prod.isCustomizable && (
                              <button
                                onClick={onNavigateToCustomizer}
                                title="تخصيص في الورشة 3D"
                                className="p-2.5 bg-pink-50 hover:bg-pink-100 text-[#E84375] border border-pink-200 rounded-xl transition-all cursor-pointer shadow-2xs"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => onSelectProductToOrder(prod)}
                              className="px-4 py-2.5 bg-[#E84375] hover:bg-[#D83264] text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>طلب</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* تبويب ملفات الحرفيين وصناع الحلوى */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtisans.map((art) => (
              <div
                key={art.id}
                className="bg-white rounded-3xl overflow-hidden border border-pink-100 shadow-sm hover:shadow-xl hover:border-pink-300 p-6 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={art.avatar}
                      alt={art.nameAr || art.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-pink-200 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-serif font-bold text-base text-stone-900">
                          {art.storeNameAr || art.storeName}
                        </h4>
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-xs text-stone-500 block">{art.nameAr || art.name}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center text-amber-500 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-current ml-0.5" /> {art.rating}
                        </span>
                        <span className="text-[11px] text-stone-400">({art.reviewsCount} تقييم موثق)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-[#E84375] bg-pink-50 px-2.5 py-1 rounded-lg w-fit mb-3 border border-pink-100">
                    <MapPin className="w-3.5 h-3.5 text-[#E84375]" />
                    <span>
                      {art.address} • ولاية {art.wilayaCode.toString().padStart(2, '0')}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-3 mb-4 leading-relaxed font-light">
                    {art.bioAr || art.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(art.specialtiesAr || art.specialties).map((spec, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-200"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={onNavigateToCustomizer}
                  className="w-full py-2.5 bg-stone-900 hover:bg-[#E84375] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>طلب حلويات مخصصة من هذه الورشة</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
