import React, { useState } from 'react';
import { Star, MapPin, Clock, Sparkles, Store, ArrowLeft, ShieldCheck } from 'lucide-react';
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
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  artisans,
  products,
  wilayas,
  selectedWilaya,
  setSelectedWilaya,
  onSelectProductToOrder,
  onNavigateToCustomizer,
  initialCategory = 'ALL'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [activeTab, setActiveTab] = useState<'creations' | 'artisans'>('creations');

  const categories = [
    { id: 'ALL', label: 'كافة الإبداعات' },
    { id: 'TRADITIONNEL', label: 'حلويات تقليدية جزائرية' },
    { id: 'MARIAGE', label: 'أعراس ومناسبات كبرى' },
    { id: 'ANNIVERSAIRE', label: 'أعياد ميلاد وذكرى' },
    { id: 'B2B_ENTREPRISE', label: 'بوفيهات وشركات B2B' }
  ];

  // تصفية المنتجات حسب التصنيف والولاية
  const filteredProducts = products.filter((prod) => {
    const matchesCat = selectedCategory === 'ALL' || prod.category === selectedCategory;
    if (!matchesCat) return false;

    if (selectedWilaya !== 0) {
      const art = artisans.find((a) => a.id === prod.artisanId);
      return art?.wilayaCode === selectedWilaya;
    }
    return true;
  });

  // تصفية الحرفيين حسب الولاية
  const filteredArtisans = artisans.filter((art) => {
    if (selectedWilaya !== 0) {
      return art.wilayaCode === selectedWilaya;
    }
    return true;
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
      {/* رأس صفحة المعرض */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold mb-2 border border-rose-200">
            <Store className="w-3.5 h-3.5 text-dore-600" />
            <span>السوق الوطني للحلويات B2C & B2B</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
            معرض نخبة الحرفيين وصناع الحلوى
          </h1>
          <p className="text-stone-600 text-sm mt-1">
            اكتشف إبداعات حرفية راقية أو اطلب مباشرة من صانعي الحلوى المعتمدين في ولايتك.
          </p>
        </div>

        {/* مبدّل العرض : الإبداعات أو الحرفيين */}
        <div className="flex bg-beige-100 p-1 rounded-xl self-start md:self-auto border border-beige-300">
          <button
            onClick={() => setActiveTab('creations')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'creations'
                ? 'bg-white text-rose-800 shadow-sm border border-rose-100'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            كتالوج الإبداعات ({filteredProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('artisans')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'artisans'
                ? 'bg-white text-rose-800 shadow-sm border border-rose-100'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            ملفات الحرفيين ({filteredArtisans.length})
          </button>
        </div>
      </div>

      {/* شريط الفلاتر : التصنيفات والولايات */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center mb-8 p-4 bg-white rounded-2xl border border-beige-200 shadow-sm">
        {/* أزرار التصنيفات */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-l from-dore-500 to-rose-500 text-white shadow-sm'
                  : 'bg-beige-50 text-stone-700 hover:bg-beige-100 border border-beige-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* فلتر الولاية */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <MapPin className="w-4 h-4 text-dore-600" />
          <select
            value={selectedWilaya}
            onChange={(e) => setSelectedWilaya(Number(e.target.value))}
            className="p-2.5 bg-beige-50 border border-beige-300 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-400"
          >
            <option value={0}>كافة الـ 69 ولاية</option>
            {wilayas.map((w) => (
              <option key={w.code} value={w.code}>
                {w.code.toString().padStart(2, '0')} - {w.nameAr} ({w.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* شبكة المحتوى */}
      {activeTab === 'creations' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => {
            const artisan = artisans.find((a) => a.id === prod.artisanId);
            return (
              <div
                key={prod.id}
                className="bg-white rounded-3xl overflow-hidden border border-beige-200 shadow-sm hover:shadow-xl hover:border-rose-200 transition-all flex flex-col justify-between group"
              >
                {/* الصورة والغلاف */}
                <div className="relative h-56 overflow-hidden bg-beige-50">
                  <img
                    src={prod.imageUrl}
                    alt={prod.nameAr || prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 text-stone-800 shadow-sm backdrop-blur border border-beige-200">
                      {prod.categoryAr || prod.category}
                    </span>
                    {prod.isCustomizable && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-l from-dore-500 to-rose-500 text-white shadow-sm flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-dore-200" /> تخصيص 3D
                      </span>
                    )}
                  </div>
                </div>

                {/* التفاصيل والأسعار */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {artisan && (
                      <div className="flex items-center gap-2 mb-2 text-xs text-stone-500">
                        <span className="font-semibold text-stone-800">{artisan.storeNameAr || artisan.storeName}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-dore-600" />
                          {artisan.wilayaNameAr || artisan.wilayaName} (ولاية {artisan.wilayaCode.toString().padStart(2, '0')})
                        </span>
                      </div>
                    )}
                    <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-rose-700 transition-colors line-clamp-1">
                      {prod.nameAr || prod.name}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-2 mt-1.5 mb-4 font-light">
                      {prod.descriptionAr || prod.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-beige-100">
                    <div className="flex items-baseline justify-between mb-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400 block mb-0.5">السعر النهائي</span>
                        <div className="inline-flex items-baseline gap-1" dir="rtl">
                          <span dir="ltr" className="text-xl font-bold font-mono text-stone-900 tracking-tight">
                            {formatDZD(prod.priceDZD)}
                          </span>
                          <span className="text-xs font-sans text-dore-700 font-bold">دج</span>
                        </div>
                      </div>
                      <span className="text-xs text-stone-500 flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-stone-400" /> التحضير: {prod.prepTimeDays} أيام
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onSelectProductToOrder(prod)}
                        className="flex-1 py-2.5 bg-gradient-to-l from-dore-500 to-rose-500 hover:from-dore-600 hover:to-rose-600 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-200/50 transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>طلب هذه الحلوى</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                      {prod.isCustomizable && (
                        <button
                          onClick={onNavigateToCustomizer}
                          title="تخصيص في الورشة 3D"
                          className="px-3 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all"
                        >
                          <Sparkles className="w-4 h-4 text-dore-600" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* تبويب بطاقات الحرفيين المعتمدين */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtisans.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-3xl overflow-hidden border border-beige-200 shadow-sm hover:shadow-lg hover:border-rose-200 p-6 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={art.avatar}
                    alt={art.nameAr || art.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-dore-300 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-serif font-bold text-base text-stone-900">{art.storeNameAr || art.storeName}</h4>
                      <ShieldCheck className="w-4 h-4 text-dore-600" />
                    </div>
                    <span className="text-xs text-stone-500 block">{art.nameAr || art.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex items-center text-dore-500 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-current ml-0.5" /> {art.rating}
                      </span>
                      <span className="text-[11px] text-stone-400">({art.reviewsCount} تقييم موثق)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-rose-800 bg-rose-50 px-2.5 py-1 rounded-lg w-fit mb-3 border border-rose-100">
                  <MapPin className="w-3.5 h-3.5 text-dore-600" />
                  <span>{art.address} • ولاية {art.wilayaCode.toString().padStart(2, '0')}</span>
                </div>

                <p className="text-xs text-stone-600 line-clamp-3 mb-4 leading-relaxed font-light">
                  {art.bioAr || art.bio}
                </p>

                {/* التخصصات */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(art.specialtiesAr || art.specialties).map((spec, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-beige-100 text-stone-700 border border-beige-200"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={onNavigateToCustomizer}
                className="w-full py-2.5 bg-[#433124] hover:bg-[#523d2e] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-dore-500/30"
              >
                <span>طلب حلويات مخصصة من هذه الورشة</span>
                <ArrowLeft className="w-3.5 h-3.5 text-dore-300" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
