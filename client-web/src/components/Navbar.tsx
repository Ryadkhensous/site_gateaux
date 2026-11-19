import React, { useState, useRef, useEffect } from 'react';
import {
  Cake,
  Sparkles,
  Truck,
  Search,
  Store,
  Building2,
  MapPin,
  ChevronDown,
  Menu,
  X,
  Phone,
  Mail,
  ShoppingBag,
  User,
  Heart,
  LogOut,
  Package,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Wilaya } from '../types';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string, category?: string) => void;
  marketplaceCategory?: string;
  wilayas: Wilaya[];
  selectedWilaya: number;
  setSelectedWilaya: (code: number) => void;
  orderNumberSearch: string;
  setOrderNumberSearch: (val: string) => void;
  onSearchOrder: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  marketplaceCategory = 'ALL',
  wilayas,
  selectedWilaya,
  setSelectedWilaya,
  orderNumberSearch,
  setOrderNumberSearch,
  onSearchOrder
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const { user, isAuthenticated, openAuthModal, openProfileModal, logout } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const shopDropdownRef = useRef<HTMLDivElement>(null);
  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // إغلاق القوائم المنسدلة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (shopDropdownRef.current && !shopDropdownRef.current.contains(event.target as Node)) {
        setShopDropdownOpen(false);
      }
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // تركيز حقل البحث عند فتح شريط البحث المنسدل
  useEffect(() => {
    if (showSearchModal && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearchModal]);

  const artisanAdminUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5174'
    : 'https://artisan-admin-xi.vercel.app';

  const handleNavClick = (tab: string, category?: string) => {
    setCurrentTab(tab, category);
    setMobileMenuOpen(false);
    setShopDropdownOpen(false);
    setMoreDropdownOpen(false);
    setShowSearchModal(false);
  };

  const handleGoToSection = (sectionId: string) => {
    if (currentTab !== 'home') {
      setCurrentTab('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
    setShowSearchModal(false);
  };

  const executeSearch = () => {
    if (orderNumberSearch.trim()) {
      onSearchOrder();
      setShowSearchModal(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 transition-all duration-300 w-full" dir="rtl">
      
      {/* 1. الشريط العلوي الرقيق للإعلانات والهاتف (Top Announcement Bar) */}
      <div className="bg-[#E84375] text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-6 shadow-xs border-b border-pink-400/30">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          
          {/* الجانب الأيمن (في RTL): رسالة التوصيل السريع لـ 69 ولاية */}
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            <span className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white/20 text-white shrink-0">
              <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </span>
            <span className="font-medium truncate">
              توصيل السعادة والحلويات الفاخرة إلى كافة الـ 69 ولاية الجزائرية!
            </span>
          </div>

          {/* الجانب الأيسر (في RTL): الهاتف ولوحة الحرفي والبريد */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 font-light">
            <a 
              href="tel:+213550123456" 
              className="hidden md:flex items-center gap-1 hover:text-pink-100 transition-colors"
              title="اتصال مباشر"
            >
              <Phone className="w-3 h-3 text-pink-200" />
              <span dir="ltr" className="font-mono">+213 550 12 34 56</span>
            </a>
            
            <span className="hidden md:inline-block text-pink-300/60">•</span>
            
            <a
              href={artisanAdminUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-[10px] font-bold transition-colors"
            >
              <Store className="w-2.5 h-2.5 text-pink-200" />
              <span>فضاء الحرفيين</span>
            </a>
          </div>

        </div>
      </div>

      {/* 2. شريط الملاحة الرئيسي الأبيض فائق الأناقة والتجاوب (Main Responsive Navbar) */}
      <div className="bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-[0_2px_15px_rgba(232,67,117,0.05)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
            
            {/* الشعار والهوية الرسمية: حلويات بوكس SweetBox DZ */}
            <button 
              onClick={() => handleGoToSection('hero-logo')}
              className="flex items-center gap-2 sm:gap-3 text-right focus:outline-none group shrink-0 cursor-pointer"
              title="العودة للصفحة الأولى"
            >
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-amber-200 to-[#E84375] shadow-md group-hover:scale-105 transition-all duration-300">
                <img 
                  src="/images/sweetbox_logo.jpg" 
                  alt="حلويات بوكس Sweet Box" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              <div className="flex flex-col justify-center">
                <div className="flex items-baseline gap-1 sm:gap-1.5">
                  <span className="text-base sm:text-xl font-serif font-black tracking-tight text-stone-900 leading-none group-hover:text-[#E84375] transition-colors">
                    حلويات بوكس
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-[#E84375] font-serif leading-none">
                    Sweet Box
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-amber-800 mt-0.5 sm:mt-1 font-sans tracking-wide">
                  صناعة • بيع • تدريب
                </span>
              </div>
            </button>

            {/* روابط التنقل للشاشات الكبيرة (Desktop Navigation - xl+) */}
            <nav className="hidden xl:flex items-center gap-1.5 2xl:gap-2 shrink-0">
              
              {/* 1. الرئيسية */}
              <button
                onClick={() => handleGoToSection('hero-logo')}
                className={`shrink-0 whitespace-nowrap px-3 py-2 rounded-xl text-xs 2xl:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  currentTab === 'home'
                    ? 'text-[#E84375] bg-pink-50 font-extrabold shadow-2xs'
                    : 'text-stone-700 hover:text-[#E84375] hover:bg-pink-50/50'
                }`}
              >
                الرئيسية
              </button>

              {/* 2. التعريف بالمنصة */}
              <button
                onClick={() => handleGoToSection('about-platform')}
                className="shrink-0 whitespace-nowrap px-3 py-2 rounded-xl text-xs 2xl:text-sm font-bold text-stone-700 hover:text-[#E84375] hover:bg-pink-50/50 transition-all duration-200 cursor-pointer"
              >
                التعريف بالمنصة
              </button>

              {/* 3. تسوق الآن */}
              <button
                onClick={() => handleGoToSection('shop-now')}
                className="shrink-0 whitespace-nowrap px-3 py-2 rounded-xl text-xs 2xl:text-sm font-bold text-stone-700 hover:text-[#E84375] hover:bg-pink-50/50 transition-all duration-200 cursor-pointer flex items-center gap-1.5"
              >
                <Store className="w-3.5 h-3.5 text-[#E84375]" />
                <span>تسوق الآن</span>
              </button>

              {/* 4. الأصناف والكتالوج (Dropdown) */}
              <div
                className="relative shrink-0"
                ref={shopDropdownRef}
                onMouseEnter={() => setShopDropdownOpen(true)}
                onMouseLeave={() => setShopDropdownOpen(false)}
              >
                <button
                  onClick={() => handleNavClick('marketplace', 'ALL')}
                  className={`shrink-0 whitespace-nowrap px-3 py-2 rounded-xl text-xs 2xl:text-sm font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                    currentTab === 'marketplace' || currentTab === 'traditional'
                      ? 'text-[#E84375] bg-pink-50 font-extrabold shadow-2xs'
                      : 'text-stone-700 hover:text-[#E84375] hover:bg-pink-50/50'
                  }`}
                  aria-expanded={shopDropdownOpen}
                >
                  <span>الأصناف والكتالوج</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      shopDropdownOpen ? 'rotate-180 text-[#E84375]' : 'text-stone-400'
                    }`}
                  />
                </button>

                {shopDropdownOpen && (
                  <div className="absolute right-0 top-full pt-2 w-72 z-50 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-2 space-y-1 text-right">
                      <button
                        onClick={() => handleNavClick('marketplace', 'ALL')}
                        className="w-full text-right p-2.5 rounded-xl hover:bg-pink-50/70 transition-colors flex items-start gap-3 group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-xl bg-pink-50 text-[#E84375] group-hover:bg-[#E84375] group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                          <Store className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-stone-900 group-hover:text-[#E84375] transition-colors">
                            كافة المعروضات
                          </div>
                          <div className="text-[10px] text-stone-500 font-light mt-0.5">
                            تصفح التشكيلة الكاملة من الحلويات والكعكات
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNavClick('marketplace', 'TRADITIONNEL')}
                        className="w-full text-right p-2.5 rounded-xl hover:bg-amber-50/70 transition-colors flex items-start gap-3 group cursor-pointer border border-amber-100 bg-amber-50/30"
                      >
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                              حلويات تقليدية أصيلة
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                              تراث 100%
                            </span>
                          </div>
                          <div className="text-[10px] text-stone-500 font-light mt-0.5">
                            بقلاوة، مقروط اللوز، تشاراك، عرايش وصواني الأعراس
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNavClick('marketplace', 'MARIAGE')}
                        className="w-full text-right p-2.5 rounded-xl hover:bg-pink-50/70 transition-colors flex items-start gap-3 group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                          <Cake className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-stone-900 group-hover:text-[#E84375] transition-colors">
                            صواني وكعكات الأعراس
                          </div>
                          <div className="text-[10px] text-stone-500 font-light mt-0.5">
                            تشكيلات فخمة للأفراح والمناسبات السعيدة
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. النجم الرئيسي: أطلب رغبتك حسب ذوقك (مستحيل ينكسر أو يلتف) */}
              <button
                onClick={() => handleNavClick('customizer')}
                className={`shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs 2xl:text-sm font-bold transition-all duration-200 shadow-xs cursor-pointer ${
                  currentTab === 'customizer'
                    ? 'bg-gradient-to-r from-[#E84375] to-[#f43f7a] text-white shadow-pink-300 scale-[1.02]'
                    : 'bg-gradient-to-r from-pink-50 to-pink-100/70 hover:from-pink-100 hover:to-pink-200/90 text-[#E84375] border border-pink-200/90 hover:border-pink-300'
                }`}
                title="تخصيص الكعكة حسب ذوقك واختياراتك"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow shrink-0" />
                <span>أطلب رغبتك حسب ذوقك</span>
              </button>

              {/* 6. المناسبات والشركات */}
              <button
                onClick={() => handleNavClick('b2b')}
                className={`shrink-0 whitespace-nowrap px-3 py-2 rounded-xl text-xs 2xl:text-sm font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  currentTab === 'b2b'
                    ? 'text-[#E84375] bg-pink-50 font-extrabold'
                    : 'text-stone-700 hover:text-[#E84375] hover:bg-pink-50/50'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-stone-400" />
                <span>المناسبات والشركات</span>
              </button>

              {/* 7. تتبع الطلب المباشر */}
              <button
                onClick={() => handleNavClick('tracking')}
                className={`shrink-0 whitespace-nowrap px-3 py-2 rounded-xl text-xs 2xl:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  currentTab === 'tracking'
                    ? 'text-[#E84375] bg-pink-50 font-extrabold'
                    : 'text-stone-700 hover:text-[#E84375] hover:bg-pink-50/50'
                }`}
              >
                تتبع الطلب
              </button>
            </nav>

            {/* أدوات وأيقونات الجانب الأيسر (Search, Profile, Cart, Mobile Menu) */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              
              {/* اختيار الولاية للشاشات الكبيرة جداً فقط (2xl) */}
              <div className="relative hidden 2xl:flex items-center">
                <MapPin className="w-3.5 h-3.5 text-[#E84375] absolute right-3 pointer-events-none" />
                <select
                  value={selectedWilaya}
                  onChange={(e) => setSelectedWilaya(Number(e.target.value))}
                  className="pr-8 pl-6 py-2 bg-stone-50 hover:bg-white border border-stone-200 hover:border-pink-300 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all appearance-none cursor-pointer shadow-2xs"
                >
                  <option value={0}>كل الـ 69 ولاية</option>
                  {wilayas.map((w) => (
                    <option key={w.code} value={w.code}>
                      {w.code.toString().padStart(2, '0')} - {w.nameAr}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-stone-400 absolute left-2 pointer-events-none" />
              </div>

              {/* حقل البحث للشاشات العريضة (2xl+) */}
              <div
                className={`hidden 2xl:flex items-center bg-stone-50 rounded-xl p-1 border transition-all duration-200 ${
                  searchFocused
                    ? 'border-[#E84375] bg-white ring-2 ring-pink-100 shadow-sm'
                    : 'border-stone-200'
                }`}
              >
                <input
                  type="text"
                  placeholder="ابحث عن كعكة أو كود..."
                  value={orderNumberSearch}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  onChange={(e) => setOrderNumberSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
                  className="bg-transparent text-xs px-2 py-1 text-stone-800 placeholder-stone-400 focus:outline-none w-28 2xl:w-36 font-medium text-right"
                />
                <button
                  onClick={executeSearch}
                  title="بحث"
                  className="p-1.5 bg-[#E84375] hover:bg-[#D83264] text-white rounded-lg transition-all shadow-2xs hover:scale-105 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* زر البحث الذكي للأجهزة اللوحية والهواتف (أيقونة تفتح شريط البحث المنسدل) */}
              <button
                onClick={() => setShowSearchModal(!showSearchModal)}
                title="البحث عن كعكة أو تتبع طلب"
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
                  showSearchModal
                    ? 'bg-[#E84375] text-white shadow-pink-200'
                    : 'bg-stone-50 hover:bg-pink-50 text-stone-700 hover:text-[#E84375] border border-stone-200/80'
                }`}
              >
                <Search className="w-4 h-4" />
              </button>

              {/* أيقونة المفضلة (للشاشات فوق الهاتف) */}
              <button
                onClick={() => handleNavClick('marketplace')}
                title="قائمة المفضلة"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-stone-50 hover:bg-pink-50 border border-stone-200/80 text-stone-700 hover:text-[#E84375] transition-colors hidden sm:flex items-center justify-center shadow-2xs cursor-pointer"
              >
                <Heart className="w-4 h-4" />
              </button>

              {/* ========================================================================= */}
              {/* ⭐ زر البروفايل الملكي الفاخر المطور بدقة (VIP Profile Button)             */}
              {/* ========================================================================= */}
              {!isAuthenticated ? (
                /* في حالة الزائر (غير مسجل الدخول): كبسولة أنيقة ناعمة الملمس */
                <button
                  onClick={() => openAuthModal('LOGIN')}
                  className="shrink-0 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl bg-gradient-to-r from-pink-50/90 via-white to-amber-50/60 hover:from-pink-100 hover:to-amber-100/80 border border-pink-200 hover:border-[#E84375]/60 text-stone-800 transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer group active:scale-95"
                  title="تسجيل الدخول أو فتح حساب جديد"
                >
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#E84375] to-pink-400 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex flex-col text-right leading-tight">
                    <span className="text-xs font-bold text-stone-900 group-hover:text-[#E84375] transition-colors whitespace-nowrap">
                      حسابي
                    </span>
                    <span className="text-[9px] text-stone-400 font-medium hidden md:inline whitespace-nowrap">
                      دخول / تسجيل
                    </span>
                  </div>
                </button>
              ) : (
                /* في حالة المستخدم المسجل: بطاقة VIP مع هالة ذهبية وقائمة زجاجية فاخرة */
                <div className="relative shrink-0" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="shrink-0 flex items-center gap-1.5 sm:gap-2 pl-2 sm:pl-3 pr-1.5 sm:pr-2 py-1 sm:py-1.5 rounded-2xl bg-gradient-to-r from-white to-pink-50/90 hover:from-pink-50 hover:to-pink-100/80 border border-pink-200 hover:border-[#E84375] text-stone-800 transition-all duration-200 shadow-2xs hover:shadow-sm cursor-pointer active:scale-95 group"
                    title="حسابي المسجل"
                  >
                    {/* الأفاتار مع مؤشر النشاط الأخضر */}
                    <div className="relative shrink-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-[#E84375] via-[#f43f7a] to-amber-400 text-white flex items-center justify-center text-xs font-bold shadow-xs ring-2 ring-pink-100 group-hover:ring-pink-300 transition-all">
                        {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="absolute -bottom-0.5 -left-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-2xs" />
                    </div>

                    {/* الاسم واللقب والترحيب */}
                    <div className="hidden sm:flex flex-col text-right leading-tight max-w-[85px] sm:max-w-[100px]">
                      <span className="text-[9px] text-pink-600 font-bold truncate">زبون معتمد</span>
                      <span className="text-xs font-bold text-stone-900 truncate">
                        {user?.fullName?.split(' ')[0] || 'حسابي'}
                      </span>
                    </div>

                    <ChevronDown className={`w-3.5 h-3.5 text-stone-400 group-hover:text-[#E84375] transition-transform duration-200 shrink-0 ${userDropdownOpen ? 'rotate-180 text-[#E84375]' : ''}`} />
                  </button>

                  {/* القائمة المنسدلة الملكية الفاخرة للبروفايل (محمية من الخروج خارج الشاشة) */}
                  {userDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-64 max-w-[calc(100vw-24px)] bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-pink-100/90 py-2 z-50 animate-fadeIn text-right">
                      {/* رأس القائمة مع بيانات العميل */}
                      <div className="px-4 py-3 border-b border-pink-100/70 bg-gradient-to-r from-pink-50/80 via-white to-amber-50/40 rounded-t-2xl">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E84375] to-amber-400 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="overflow-hidden flex-1">
                            <p className="text-xs font-black text-stone-900 truncate">{user?.fullName}</p>
                            <p className="text-[10px] text-stone-500 font-mono truncate">{user?.phone || user?.email}</p>
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-100 text-[#E84375] text-[9px] font-bold mt-1">
                              <Sparkles className="w-2.5 h-2.5 text-[#E84375]" />
                              <span>عضوية معتمدة SweetBox</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            openProfileModal();
                          }}
                          className="w-full text-right px-4 py-2.5 text-xs font-bold text-stone-700 hover:text-[#E84375] hover:bg-pink-50/80 flex items-center gap-2.5 cursor-pointer transition-colors"
                        >
                          <User className="w-4 h-4 text-[#E84375] shrink-0" />
                          <span>بياناتي الشخصية وعناويني</span>
                        </button>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            openProfileModal();
                          }}
                          className="w-full text-right px-4 py-2.5 text-xs font-bold text-stone-700 hover:text-[#E84375] hover:bg-pink-50/80 flex items-center gap-2.5 cursor-pointer transition-colors"
                        >
                          <Package className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>سجل طلباتي ووصولات الدفع</span>
                        </button>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            handleNavClick('marketplace');
                          }}
                          className="w-full text-right px-4 py-2.5 text-xs font-bold text-stone-700 hover:text-[#E84375] hover:bg-pink-50/80 flex items-center gap-2.5 cursor-pointer transition-colors"
                        >
                          <Heart className="w-4 h-4 text-pink-500 shrink-0" />
                          <span>قائمة المفضلة</span>
                        </button>
                      </div>

                      <div className="border-t border-pink-100/70 pt-1 mt-1">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full text-right px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer transition-colors"
                        >
                          <LogOut className="w-4 h-4 shrink-0" />
                          <span>تسجيل الخروج من الحساب</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* أيقونة السلة (مع عداد المنتجات) */}
              <button
                onClick={() => handleNavClick('marketplace')}
                title="سلة المشتريات"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl relative bg-stone-50 hover:bg-pink-50 border border-stone-200/80 text-stone-700 hover:text-[#E84375] transition-colors flex items-center justify-center shadow-2xs cursor-pointer shrink-0"
              >
                <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E84375] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  0
                </span>
              </button>

              {/* زر القائمة للشاشات الصغيرة والمتوسطة (الهواتف والتابلت) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة الرئيسية'}
                className="xl:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-stone-50 hover:bg-pink-50 border border-stone-200/80 text-stone-800 flex items-center justify-center transition-colors cursor-pointer shadow-2xs shrink-0"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-[#E84375]" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>

          </div>
        </div>

        {/* 3. شريط البحث المنبثق السلس (Search Overlay for Mobile / Tablet / Desktop) */}
        {showSearchModal && (
          <div className="border-t border-pink-100 bg-[#FFFDF9] px-3 sm:px-6 py-3 shadow-md animate-fadeIn">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative w-full flex-1">
                <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="ابحث عن حلوى، بقلاوة، كعكة، أو رقم الطلب (مثال: CMD-2026-DZ001)..."
                  value={orderNumberSearch}
                  onChange={(e) => setOrderNumberSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
                  className="w-full bg-white border border-stone-200 focus:border-[#E84375] rounded-xl pr-10 pl-4 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-pink-100 shadow-2xs text-right"
                />
              </div>

              {/* اختيار الولاية داخل شريط البحث */}
              <div className="w-full sm:w-56 shrink-0 relative">
                <MapPin className="w-3.5 h-3.5 text-[#E84375] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={selectedWilaya}
                  onChange={(e) => setSelectedWilaya(Number(e.target.value))}
                  className="w-full pr-8 pl-6 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:border-[#E84375] appearance-none cursor-pointer text-right shadow-2xs"
                >
                  <option value={0}>كل الولايات (69 ولاية)</option>
                  {wilayas.map((w) => (
                    <option key={w.code} value={w.code}>
                      {w.code.toString().padStart(2, '0')} - {w.nameAr}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={executeSearch}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-[#E84375] hover:bg-[#D83264] text-white font-bold rounded-xl text-xs shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>بحث مباشر</span>
                </button>
                <button
                  onClick={() => setShowSearchModal(false)}
                  className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-xs transition-colors cursor-pointer"
                  title="إغلاق البحث"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. القائمة الشاملة للشاشات الصغيرة والمتوسطة (Mobile & Tablet Drawer Menu) */}
        {mobileMenuOpen && (
          <div className="xl:hidden max-h-[82vh] overflow-y-auto px-4 py-5 bg-white/98 backdrop-blur-xl border-t border-pink-100 space-y-4 shadow-2xl animate-fadeIn text-right">
            
            {/* بطاقة المستخدم السريعة في أعلى القائمة */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-50 via-white to-amber-50/50 border border-pink-200/80 shadow-2xs">
              {isAuthenticated ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E84375] to-amber-400 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900">{user?.fullName}</p>
                      <p className="text-[10px] text-stone-500 font-mono">{user?.phone || user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openProfileModal();
                      }}
                      className="p-2 bg-white text-[#E84375] rounded-xl text-xs font-bold border border-pink-200 shadow-2xs cursor-pointer hover:bg-pink-50"
                      title="ملفي الشخصي"
                    >
                      <User className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="p-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-200 cursor-pointer hover:bg-rose-100"
                      title="خروج"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-pink-100 text-[#E84375] flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-stone-800">أهلاً بك في سويت بوكس</span>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('LOGIN');
                    }}
                    className="py-1.5 px-4 bg-[#E84375] hover:bg-[#D83264] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    دخول / تسجيل
                  </button>
                </div>
              )}
            </div>

            {/* الزر المميز الملون: أطلب رغبتك حسب ذوقك */}
            <button
              onClick={() => handleNavClick('customizer')}
              className={`w-full text-right p-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between shadow-md transition-all cursor-pointer ${
                currentTab === 'customizer'
                  ? 'bg-gradient-to-r from-[#E84375] to-[#f43f7a] text-white shadow-pink-300'
                  : 'bg-gradient-to-r from-pink-50 to-pink-100/90 text-[#E84375] border-2 border-pink-200'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow shrink-0" />
                <span className="font-extrabold text-sm">أطلب رغبتك حسب ذوقك</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/80 text-[#E84375] font-bold shadow-2xs">
                ورشة تفاعلية
              </span>
            </button>

            {/* قائمة الروابط الأساسية للهاتف والتابلت */}
            <div className="space-y-1.5">
              <button
                onClick={() => handleGoToSection('hero-logo')}
                className={`w-full text-right px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-between ${
                  currentTab === 'home' ? 'bg-pink-50 text-[#E84375]' : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span>الرئيسية (الواجهة الرسمية)</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 rotate-180" />
              </button>

              <button
                onClick={() => handleGoToSection('about-platform')}
                className="w-full text-right px-4 py-2.5 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50 transition-colors flex items-center justify-between"
              >
                <span>التعريف بالمنصة وركائزها</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 rotate-180" />
              </button>

              <button
                onClick={() => handleGoToSection('shop-now')}
                className="w-full text-right px-4 py-2.5 rounded-xl text-xs font-bold text-[#E84375] bg-pink-50/70 hover:bg-pink-50 transition-colors flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Store className="w-3.5 h-3.5" />
                  <span>تسوق الآن مباشرة</span>
                </span>
                <span className="text-[10px] bg-[#E84375] text-white px-2 py-0.5 rounded-full font-bold">
                  المتجر
                </span>
              </button>
            </div>

            {/* أقسام الأصناف والحلويات التقليدية */}
            <div className="bg-pink-50/50 rounded-2xl p-3 border border-pink-100 space-y-2">
              <div className="text-[11px] font-extrabold text-stone-700 flex items-center justify-between px-1">
                <span>تصفح حسب الأصناف:</span>
                <span className="text-[10px] text-pink-600 font-bold">الكتالوج الكامل</span>
              </div>

              <button
                onClick={() => handleNavClick('marketplace', 'TRADITIONNEL')}
                className="w-full text-right p-2.5 rounded-xl bg-white border border-amber-200 text-stone-900 text-xs font-bold flex items-center justify-between shadow-2xs hover:bg-amber-50/50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>حلويات تقليدية أصيلة (16 صنف)</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800">
                  تراث جزائري
                </span>
              </button>

              <button
                onClick={() => handleNavClick('marketplace', 'ALL')}
                className="w-full text-right p-2.5 rounded-xl bg-white/70 hover:bg-white text-stone-800 text-xs font-bold flex items-center justify-between transition-colors"
              >
                <span>كافة التشكيلة والكعكات العصرية</span>
                <span className="text-[10px] text-stone-400">الكل</span>
              </button>
            </div>

            {/* المناسبات والشركات وتتبع الطلبات */}
            <div className="space-y-1.5 pt-1">
              <button
                onClick={() => handleNavClick('b2b')}
                className={`w-full text-right px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-between ${
                  currentTab === 'b2b' ? 'bg-pink-50 text-[#E84375]' : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-stone-400" />
                  <span>المناسبات والشركات (B2B)</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 rotate-180" />
              </button>

              <button
                onClick={() => handleNavClick('tracking')}
                className={`w-full text-right px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-between ${
                  currentTab === 'tracking' ? 'bg-pink-50 text-[#E84375]' : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 text-[#E84375]" />
                  <span>تتبع الطلب المباشر</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 rotate-180" />
              </button>
            </div>

            {/* اختيار الولاية على الهاتف والتابلت */}
            <div className="pt-2 border-t border-pink-100">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1 text-right">
                تصفية الحلويات حسب الولاية (69 ولاية)
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-[#E84375] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={selectedWilaya}
                  onChange={(e) => setSelectedWilaya(Number(e.target.value))}
                  className="w-full pr-8 pl-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-800 text-right appearance-none"
                >
                  <option value={0}>كل الـ 69 ولاية جزائرية</option>
                  {wilayas.map((w) => (
                    <option key={w.code} value={w.code}>
                      {w.code.toString().padStart(2, '0')} - {w.nameAr}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* رابط فضاء الحرفي على الهاتف */}
            <div className="pt-1">
              <a
                href={artisanAdminUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 p-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <Store className="w-4 h-4 text-pink-400" />
                <span>دخول فضاء الحرفيين المعتمدين</span>
              </a>
            </div>

          </div>
        )}

      </div>

    </header>
  );
};
