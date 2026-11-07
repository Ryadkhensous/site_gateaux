import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  Clock,
  MapPin,
  Truck,
  ShieldCheck,
  Star,
  ShoppingBag,
  Heart,
  ChevronDown,
  CheckCircle2,
  Store,
  Layers
} from 'lucide-react';
import { Product, Artisan, Wilaya } from '../types';
import { formatDZD } from '../utils/format';

interface TraditionalViewProps {
  products: Product[];
  artisans: Artisan[];
  wilayas: Wilaya[];
  selectedWilaya: number;
  setSelectedWilaya: (code: number) => void;
  onSelectProductToOrder: (product: Product) => void;
  onNavigateToCustomizer?: () => void;
}

export const TraditionalView: React.FC<TraditionalViewProps> = ({
  products,
  artisans,
  wilayas,
  selectedWilaya,
  setSelectedWilaya,
  onSelectProductToOrder,
  onNavigateToCustomizer
}) => {
  const [activeSubFilter, setActiveSubFilter] = useState<string>('ALL');
  const [wishlist, setWishlist] = useState<string[]>([]);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filtrer les produits traditionnels
  const traditionalProducts = products.filter((prod) => {
    const isTrad = prod.category === 'TRADITIONNEL' || 
                   prod.tags?.some(t => t.includes('تقليدي') || t.includes('بقلاوة') || t.includes('مقروط'));
    if (!isTrad) return false;

    // Filtre de wilaya
    if (selectedWilaya !== 0) {
      const art = artisans.find((a) => a.id === prod.artisanId);
      if (art && art.wilayaCode !== selectedWilaya) return false;
    }

    // Sous-filtre par type
    if (activeSubFilter === 'BAKLAWA_MAKROUD') {
      return prod.name.includes('بقلاوة') || prod.name.includes('مقروط');
    }
    if (activeSubFilter === 'ALMOND_SWEETS') {
      return prod.name.includes('لوز') || prod.name.includes('تشاراك') || prod.name.includes('دزيريات');
    }
    if (activeSubFilter === 'TRAYS_WEDDING') {
      return prod.name.includes('صينية') || prod.name.includes('عروس') || prod.servings >= 25;
    }

    return true;
  });

  return (
    <div className="space-y-12 pb-16 text-right" dir="rtl">
      {/* 1. بانر الواجهة الفاخرة للحلويات التقليدية (Heritage Hero Banner) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F7] via-[#FFFBF8] to-white border-b border-pink-100/70 pt-8 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100/90 text-[#E84375] text-xs font-bold border border-pink-200 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>أصالة المذاق الجزائري العريق — تراث الأجداد</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 leading-tight">
              حلويات جزائرية تقليدية <br />
              <span className="text-[#E84375]">تُخبز بكل حب، إتقان وأصالة</span>
            </h1>

            <p className="text-stone-700 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              من قسنطينة وتلمسان إلى الجزائر العاصمة ووهران، نجمع لكم أمهر صانعي الحلويات التقليدية المعتمدين.
              تذوقوا أرقى أصناف البقلاوة المورقة، مقروط اللوز المذاب بماء الزهر، التشاراك المسكر والدزيريات الملكية المصنوعة بأجود أنواع اللوز والعسل الحر.
            </p>

            {/* ميزات التراث والأصالة */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-white rounded-xl border border-pink-100/80 shadow-2xs flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-pink-50 text-[#E84375] flex items-center justify-center font-bold text-xs flex-shrink-0">
                  🍯
                </span>
                <span className="text-xs font-bold text-stone-800">عسل حر ولوز بلدي</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-pink-100/80 shadow-2xs flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-pink-50 text-[#E84375] flex items-center justify-center font-bold text-xs flex-shrink-0">
                  🏛️
                </span>
                <span className="text-xs font-bold text-stone-800">وصفات أصيلة متوارثة</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-pink-100/80 shadow-2xs flex items-center gap-2.5 col-span-2 sm:col-span-1">
                <span className="w-7 h-7 rounded-lg bg-pink-50 text-[#E84375] flex items-center justify-center font-bold text-xs flex-shrink-0">
                  🚚
                </span>
                <span className="text-xs font-bold text-stone-800">شحن مبرد لـ 69 ولاية</span>
              </div>
            </div>
          </div>

          {/* صورة الغلاف للحلويات التقليدية */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white shadow-pink-900/10 group aspect-4/3 sm:aspect-16/10 lg:aspect-square">
              <img
                src="/images/traditional_algerian_sweets.jpg"
                alt="تشكيلة حلويات تقليدية جزائرية"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                <span className="px-2.5 py-1 rounded-full bg-[#E84375] text-white text-[11px] font-bold self-start mb-1 shadow-xs">
                  صواني الأفراح والمهيبة
                </span>
                <p className="text-sm font-bold">صواني نحاسية مطروقة تضم نخبة الحلويات الجزائرية</p>
                <p className="text-[11px] text-pink-200">جاهزة للأعراس، الختان والضيافة الرفيعة</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. شريط الفلاتر السريعة واختيار الولاية */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-4 bg-white rounded-2xl border border-pink-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* تصنيفات سريعة */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setActiveSubFilter('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubFilter === 'ALL'
                  ? 'bg-[#E84375] text-white shadow-xs'
                  : 'bg-stone-50 text-stone-700 hover:bg-pink-50 hover:text-[#E84375]'
              }`}
            >
              كافة الحلويات التقليدية ({traditionalProducts.length})
            </button>
            <button
              onClick={() => setActiveSubFilter('BAKLAWA_MAKROUD')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubFilter === 'BAKLAWA_MAKROUD'
                  ? 'bg-[#E84375] text-white shadow-xs'
                  : 'bg-stone-50 text-stone-700 hover:bg-pink-50 hover:text-[#E84375]'
              }`}
            >
              بقلاوة ومقروط العسل
            </button>
            <button
              onClick={() => setActiveSubFilter('ALMOND_SWEETS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubFilter === 'ALMOND_SWEETS'
                  ? 'bg-[#E84375] text-white shadow-xs'
                  : 'bg-stone-50 text-stone-700 hover:bg-pink-50 hover:text-[#E84375]'
              }`}
            >
              حلويات اللوز (تشاراك ودزيريات)
            </button>
            <button
              onClick={() => setActiveSubFilter('TRAYS_WEDDING')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubFilter === 'TRAYS_WEDDING'
                  ? 'bg-[#E84375] text-white shadow-xs'
                  : 'bg-stone-50 text-stone-700 hover:bg-pink-50 hover:text-[#E84375]'
              }`}
            >
              صواني الأعراس والمهيبة
            </button>
          </div>

          {/* محدد الولاية */}
          <div className="relative flex items-center w-full md:w-auto">
            <MapPin className="w-3.5 h-3.5 text-[#E84375] absolute right-3 pointer-events-none" />
            <select
              value={selectedWilaya}
              onChange={(e) => setSelectedWilaya(Number(e.target.value))}
              className="pr-8 pl-8 py-2 w-full md:w-48 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-pink-200 appearance-none cursor-pointer"
            >
              <option value={0}>كل الولايات (69 ولاية)</option>
              {wilayas.map((w) => (
                <option key={w.code} value={w.code}>
                  {w.code.toString().padStart(2, '0')} - {w.nameAr}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-stone-400 absolute left-2.5 pointer-events-none" />
          </div>

        </div>
      </section>

      {/* 3. شبكة منتجات الحلويات التقليدية (Products Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {traditionalProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-pink-100 p-8 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-pink-50 text-[#E84375] flex items-center justify-center text-2xl font-bold">
              🍯
            </div>
            <h3 className="text-lg font-bold text-stone-800">لا توجد منتجات تقليدية مطابقة في هذه الولاية حالياً</h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              يمكنك اختيار &quot;كل الولايات&quot; للاطلاع على كامل إبداعات الحرفيين وتوصيلها إلى باب بيتكم.
            </p>
            <button
              onClick={() => setSelectedWilaya(0)}
              className="px-5 py-2.5 bg-[#E84375] text-white rounded-xl text-xs font-bold hover:bg-[#D83264] transition-colors cursor-pointer"
            >
              عرض كافة الولايات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {traditionalProducts.map((prod) => {
              const art = artisans.find((a) => a.id === prod.artisanId);
              const isWishlisted = wishlist.includes(prod.id);

              return (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl border border-pink-100 hover:border-pink-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  {/* حاوية الصورة والوسوم */}
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
                      className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-xs flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isWishlisted ? 'text-[#E84375] fill-[#E84375]' : 'text-stone-600'
                        }`}
                      />
                    </button>

                    {/* شارة الأصالة */}
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#E84375] text-white text-[10px] font-bold shadow-xs">
                      أصالة جزائرية
                    </span>

                    {/* شريط معلومات الحرفي السريع أسفل الصورة */}
                    {art && (
                      <div className="absolute bottom-2 right-2 left-2 bg-stone-900/75 backdrop-blur-xs text-white px-2.5 py-1.5 rounded-xl text-[11px] flex items-center justify-between">
                        <span className="truncate font-medium">{art.storeName}</span>
                        <span className="flex items-center gap-1 text-pink-200 text-[10px] flex-shrink-0">
                          <MapPin className="w-3 h-3 text-[#E84375]" />
                          {art.wilayaNameAr || art.wilayaName}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* تفاصيل المنتج */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 leading-snug group-hover:text-[#E84375] transition-colors line-clamp-2">
                        {prod.nameAr || prod.name}
                      </h3>
                      <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                        {prod.descriptionAr || prod.description}
                      </p>
                    </div>

                    {/* تفاصيل القطع ومدة التحضير */}
                    <div className="flex items-center gap-3 text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-stone-400" />
                        {prod.prepTimeDays} أيام تحضير
                      </span>
                      <span>•</span>
                      <span className="font-medium">
                        {prod.servings} قطعة / حصة
                      </span>
                    </div>

                    {/* السعر وزر الطلب المباشر */}
                    <div className="pt-2 flex items-center justify-between border-t border-pink-50">
                      <div>
                        <span className="text-[10px] text-stone-400 block font-medium">السعر :</span>
                        <span className="text-base font-bold text-[#E84375] font-mono">
                          {formatDZD(prod.priceDZD)}
                        </span>
                      </div>

                      <button
                        onClick={() => onSelectProductToOrder(prod)}
                        className="px-4 py-2 bg-[#E84375] hover:bg-[#D83264] text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-md hover:scale-102 flex items-center gap-1.5 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>طلب الآن</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. نبذة عن خبرة الحرفيين وجودة المكونات */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-gradient-to-r from-stone-900 via-[#35151F] to-[#E84375] rounded-3xl p-6 sm:p-10 text-white shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-4">
            <span className="px-3 py-1 rounded-full bg-white/20 text-pink-200 text-xs font-bold inline-block border border-white/20">
              ضمان الذوق والجودة
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              حلويات تصنع بأيدٍ خبيرة وحب موروث
            </h3>
            <p className="text-xs sm:text-sm text-pink-100 leading-relaxed font-light">
              نلتزم باستخدام مكونات فاخرة خالية من المواد الحافظة: لوز مقشر طازج، جوز جزائري، عسل نحل مصفى،
              وماء زهر مقطر تقليدياً. كل صينية تعكس كرم الضيافة الجزائرية وأبهى تقاليد الأفراح والمناسبات السعيدة.
            </p>
          </div>

          <div className="md:col-span-4 flex flex-col gap-3">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
              <span className="text-2xl font-bold font-mono text-white block">100%</span>
              <span className="text-xs text-pink-200">مكونات طبيعية وأصيلة</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
              <span className="text-2xl font-bold font-mono text-white block">69 ولاية</span>
              <span className="text-xs text-pink-200">توصيل مبرد ومحمي حتى باب البيت</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

