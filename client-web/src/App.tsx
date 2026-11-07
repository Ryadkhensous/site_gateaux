import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeView } from './pages/HomeView';
import { TraditionalView } from './pages/TraditionalView';
import { MarketplaceView } from './components/MarketplaceView';
import { CakeCustomizer } from './components/CakeCustomizer';
import { TrackingView } from './components/TrackingView';
import { B2BView } from './components/B2BView';
import { OrderModal } from './components/OrderModal';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { api } from './services/api';
import { Artisan, Product, Wilaya } from './types';
import { WILAYAS_DZ } from './data/wilayas';
import { Cake, Heart, Send, Store, ShieldCheck, Truck, CreditCard } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [marketplaceCategory, setMarketplaceCategory] = useState<string>('ALL');
  const [wilayas, setWilayas] = useState<Wilaya[]>(WILAYAS_DZ);
  const [selectedWilaya, setSelectedWilaya] = useState<number>(0);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orderNumberSearch, setOrderNumberSearch] = useState<string>('');
  const [activeTrackingNumber, setActiveTrackingNumber] = useState<string>('CMD-2026-DZ001');

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Modal State
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<any>({});

  const handleNavigate = (tab: string, category?: string) => {
    if (tab === 'traditional') {
      setCurrentTab('marketplace');
      setMarketplaceCategory('TRADITIONNEL');
    } else {
      setCurrentTab(tab);
      if (category) {
        setMarketplaceCategory(category);
      }
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const [fetchedWilayas, fetchedArtisans, fetchedProducts] = await Promise.all([
        api.getWilayas(),
        api.getArtisans(),
        api.getProducts()
      ]);

      if (fetchedWilayas.length > 0) setWilayas(fetchedWilayas);
      if (fetchedArtisans.length > 0) setArtisans(fetchedArtisans);
      if (fetchedProducts.length > 0) setProducts(fetchedProducts);
    };

    loadData();
  }, []);

  const handleOpenOrderModal = (config: any) => {
    setModalConfig(config);
    setIsOrderModalOpen(true);
  };

  const handleSelectProductToOrder = (product: Product) => {
    handleOpenOrderModal({
      productId: product.id,
      artisanId: product.artisanId,
      name: product.nameAr || product.name,
      priceDZD: product.priceDZD,
      isCustomizable: product.isCustomizable
    });
  };

  const handleSearchOrder = () => {
    if (orderNumberSearch.trim()) {
      setActiveTrackingNumber(orderNumberSearch.trim());
      setCurrentTab('tracking');
    }
  };

  const handleOrderSuccess = (createdOrder: any) => {
    setActiveTrackingNumber(createdOrder.orderNumber);
    setCurrentTab('tracking');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setTimeout(() => setNewsletterSubscribed(false), 4000);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFBF8] font-sans text-stone-900" dir="rtl">
      {/* شريط الملاحة والتنقل العلوي المتكامل المطابق للتصميم الوردي */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={handleNavigate}
        marketplaceCategory={marketplaceCategory}
        wilayas={wilayas}
        selectedWilaya={selectedWilaya}
        setSelectedWilaya={setSelectedWilaya}
        orderNumberSearch={orderNumberSearch}
        setOrderNumberSearch={setOrderNumberSearch}
        onSearchOrder={handleSearchOrder}
      />

      {/* المحتوى الرئيسي للتبويب النشط */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            featuredProducts={products}
            artisans={artisans}
            onSelectProductToOrder={handleSelectProductToOrder}
          />
        )}

        {(currentTab === 'marketplace' || currentTab === 'traditional') && (
          <MarketplaceView
            artisans={artisans}
            products={products}
            wilayas={wilayas}
            selectedWilaya={selectedWilaya}
            setSelectedWilaya={setSelectedWilaya}
            onSelectProductToOrder={handleSelectProductToOrder}
            onNavigateToCustomizer={() => setCurrentTab('customizer')}
            initialCategory={currentTab === 'traditional' ? 'TRADITIONNEL' : marketplaceCategory}
            onCategoryChange={(cat) => setMarketplaceCategory(cat)}
          />
        )}

        {currentTab === 'customizer' && (
          <CakeCustomizer
            artisans={artisans}
            onOpenOrderModal={handleOpenOrderModal}
          />
        )}

        {currentTab === 'b2b' && (
          <B2BView
            wilayas={wilayas}
            onOpenOrderModal={handleOpenOrderModal}
          />
        )}

        {currentTab === 'tracking' && (
          <TrackingView
            initialOrderNumber={activeTrackingNumber}
          />
        )}
      </main>

      {/* نافذة استمارة الحجز والطلبيات */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        config={modalConfig}
        wilayas={wilayas}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* نافذة تسجيل الدخول وإنشاء حساب عميل جديد */}
      <AuthModal wilayas={wilayas} />

      {/* نافذة الملف الشخصي وسجل الطلبيات للعميل */}
      <ProfileModal
        wilayas={wilayas}
        onTrackOrder={(orderNumber) => {
          setActiveTrackingNumber(orderNumber);
          setCurrentTab('tracking');
        }}
        onGoToShop={() => setCurrentTab('marketplace')}
      />

      {/* تذييل الصفحة الأنيق المطابق لموكاب SweetBox الوردي الناعم (Footer) */}
      <footer className="bg-white text-stone-700 pt-16 pb-8 border-t border-pink-100 text-right mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* العمود 1: الشعار والرسالة والشبكات الاجتماعية */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#E84375] flex items-center justify-center text-white shadow-xs">
                <Cake className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-serif font-bold text-stone-900 block leading-tight">
                  SweetBox <span className="text-[#E84375] text-sm">.DZ</span>
                </span>
                <span className="text-[10px] text-stone-400 font-sans block">
                  — مخبوز بكل حب وإتقان —
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed font-normal">
              نخبز أكثر من مجرد كعكات، نخبز السعادة والحب في كل مناسبة! شكراً لاختياركم منصتنا كوجهتكم الأولى للحلويات الفاخرة عبر 69 ولاية.
            </p>

            {/* أيقونات التواصل الاجتماعي الدائرية */}
            <div className="flex items-center gap-2 pt-1">
              <a href="#" className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-xs font-bold hover:opacity-90 transition-opacity">
                f
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center text-xs font-bold hover:opacity-90 transition-opacity">
                ig
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center text-xs font-bold hover:opacity-90 transition-opacity">
                wa
              </a>
            </div>
          </div>

          {/* العمود 2: روابط سريعة */}
          <div>
            <h5 className="font-bold text-sm text-stone-900 mb-4 font-serif">
              روابط سريعة
            </h5>
            <ul className="space-y-2.5 text-xs text-stone-600 font-medium">
              <li>
                <button onClick={() => handleNavigate('home')} className="hover:text-[#E84375] transition-colors cursor-pointer">
                  الصفحة الرئيسية
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('marketplace', 'ALL')} className="hover:text-[#E84375] transition-colors cursor-pointer">
                  متجر الكعكات والحلويات
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigate('marketplace', 'TRADITIONNEL')} className="hover:text-[#E84375] transition-colors cursor-pointer flex items-center gap-1.5 text-amber-700 font-bold">
                  <span>حلويات تقليدية جزائرية</span>
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('customizer')} className="hover:text-[#E84375] transition-colors cursor-pointer">
                  ورشة التصميم ثلاثية الأبعاد (3D)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('b2b')} className="hover:text-[#E84375] transition-colors cursor-pointer">
                  عروض المناسبات والشركات
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('tracking')} className="hover:text-[#E84375] transition-colors cursor-pointer">
                  تتبع طلبيتي مباشرة
                </button>
              </li>
            </ul>
          </div>

          {/* العمود 3: خدمة الزبائن */}
          <div>
            <h5 className="font-bold text-sm text-stone-900 mb-4 font-serif">
              خدمة الزبائن والدعم
            </h5>
            <ul className="space-y-2.5 text-xs text-stone-600 font-medium">
              <li>
                <button onClick={() => setCurrentTab('tracking')} className="hover:text-[#E84375] transition-colors cursor-pointer">
                  متابعة الطلب وحالته
                </button>
              </li>
              <li>
                <span className="hover:text-[#E84375] transition-colors cursor-pointer">
                  سياسة النقل والتوصيل المبرد (69 ولاية)
                </span>
              </li>
              <li>
                <span className="hover:text-[#E84375] transition-colors cursor-pointer">
                  ضمان الجودة ومعايير النظافة
                </span>
              </li>
              <li>
                <span className="hover:text-[#E84375] transition-colors cursor-pointer">
                  الشروط والأحكام العامة
                </span>
              </li>
              <li>
                <a
                  href="http://localhost:5174"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E84375] hover:underline pt-1"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>بوابة الحرفيين وصناع الحلوى</span>
                </a>
              </li>
            </ul>
          </div>

          {/* العمود 4: النشرة البريدية */}
          <div>
            <h5 className="font-bold text-sm text-stone-900 mb-4 font-serif">
              النشرة البريدية والعروض
            </h5>
            <p className="text-xs text-stone-500 mb-3.5 leading-relaxed font-normal">
              اشترك معنا لتصلك أحدث تصاميم الكعكات والحلويات والعروض الحصرية مباشرة إلى بريدك.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني هنا..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-[#E84375] text-right"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-[#E84375] hover:bg-[#D83264] text-white font-bold rounded-xl text-xs shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>اشتراك في النشرة</span>
              </button>
            </form>

            {newsletterSubscribed && (
              <span className="text-[11px] text-emerald-600 font-bold block mt-2 text-center">
                تم اشتراكك بنجاح في النشرة البريدية!
              </span>
            )}
          </div>

        </div>

        {/* الشريط السفلي لحقوق النشر ووسائل الدفع الجزائرية (Bottom Bar) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-10 border-t border-stone-100 flex flex-wrap justify-between items-center gap-4 text-xs text-stone-400">
          <p>
            © 2026 SweetBox DZ (سويت بوكس الجزائر). جميع الحقوق محفوظة. صُمم بحب في الجزائر.
          </p>

          {/* أيقونات وشارات الدفع المعتمدة */}
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-lg text-[10px] font-bold text-stone-700">
              بريدي موب BaridiMob
            </span>
            <span className="px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-lg text-[10px] font-bold text-amber-700">
              البطاقة الذهبية Edahabia
            </span>
            <span className="px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-lg text-[10px] font-bold text-blue-700">
              بطاقة CIB
            </span>
            <span className="px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-lg text-[10px] font-bold text-emerald-700">
              الدفع عند الاستلام
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
