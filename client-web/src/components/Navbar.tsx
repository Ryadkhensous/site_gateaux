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
  Package
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
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const { user, isAuthenticated, openAuthModal, openProfileModal, logout } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const shopDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (shopDropdownRef.current && !shopDropdownRef.current.contains(event.target as Node)) {
        setShopDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const artisanAdminUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5174'
    : 'https://artisan-admin-xi.vercel.app';

  const handleNavClick = (tab: string, category?: string) => {
    setCurrentTab(tab, category);
    setMobileMenuOpen(false);
    setShopDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 transition-all duration-300 shadow-xs">
      {/* 1. الشريط العلوي للإعلانات باللون الوردي المطابق للتصميم (Top Announcement Bar) */}
      <div className="bg-[#E84375] text-white text-xs py-2 px-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">
          
          {/* الجانب الأيمن (في RTL): رسالة التوصيل السريع والبهجة */}
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-white flex-shrink-0">
              <Truck className="w-3.5 h-3.5" />
            </span>
            <span className="font-medium text-[11px] sm:text-xs">
              توصيل السعادة والمذاق الرفيع إلى باب بيتكم في كافة الـ 69 ولاية!
            </span>
          </div>

          {/* الجانب الأيسر (في RTL): الهاتف، البريد وشبكات التواصل */}
          <div className="flex items-center gap-4 text-[11px] sm:text-xs font-light">
            <a href="tel:+213550123456" className="hidden md:flex items-center gap-1.5 hover:text-pink-100 transition-colors">
              <Phone className="w-3 h-3 text-pink-200" />
              <span dir="ltr">+213 550 12 34 56</span>
            </a>
            <span className="hidden md:inline-block text-pink-300">•</span>
            <a href="mailto:contact@sweetbox.dz" className="hidden sm:flex items-center gap-1.5 hover:text-pink-100 transition-colors">
              <Mail className="w-3 h-3 text-pink-200" />
              <span>contact@sweetbox.dz</span>
            </a>
            <span className="hidden sm:inline-block text-pink-300">•</span>
            <div className="flex items-center gap-2">
              <a href="#" className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-[10px]" title="Facebook">f</a>
              <a href="#" className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-[10px]" title="Instagram">ig</a>
              <a href="#" className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-[10px]" title="WhatsApp">wa</a>
            </div>
          </div>

        </div>
      </div>

      {/* 2. شريط الملاحة الرئيسي الأبيض النظيف (Main Clean White Navbar) */}
      <div className="bg-white border-b border-pink-100/80 shadow-[0_2px_15px_rgba(232,67,117,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* الشعار والهوية البصرية الوردية (Logo SweetBox DZ) */}
            <button 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 text-right focus:outline-none group flex-shrink-0 cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#E84375] to-[#F472B6] flex items-center justify-center text-white shadow-md shadow-pink-200 group-hover:scale-105 transition-all duration-300">
                <Cake className="w-6 h-6 text-white" />
              </div>

              <div className="flex flex-col justify-center">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-serif font-bold tracking-tight text-stone-900 leading-none group-hover:text-[#E84375] transition-colors">
                    SweetBox
                  </span>
                  <span className="text-sm font-bold text-[#E84375] font-mono leading-none">
                    .DZ
                  </span>
                </div>
                <span className="text-[10px] font-medium tracking-wide text-stone-400 mt-1 font-sans">
                  — مخبوز بكل حب وإتقان —
                </span>
              </div>
            </button>

            {/* روابط التنقل الرئيسية (Navigation Links) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {/* الرئيسية (Home) */}
              <button
                onClick={() => handleNavClick('home')}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                  currentTab === 'home'
                    ? 'text-[#E84375] bg-pink-50/80 font-extrabold'
                    : 'text-stone-700 hover:text-[#E84375] hover:bg-pink-50/40'
                }`}
              >
                الرئيسية
              </button>

              {/* المتجر والحلويات الموحد مع القائمة المنسدلة الذكية (Shop & Sweets Dropdown) */}
              <div
                className="relative"
                ref={shopDropdownRef}
                onMouseEnter={() => setShopDropdownOpen(true)}
                onMouseLeave={() => setShopDropdownOpen(false)}
              >
                <button
                  onClick={() => handleNavClick('marketplace', 'ALL')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                    currentTab === 'marketplace' || currentTab === 'traditional'
                      ? 'text-[#E84375] bg-pink-50/80 font-extrabold shadow-2xs'
                      : 'text-stone-700 hover:text-[#E84375] hover:bg-pink-50/40'
                  }`}
                  aria-expanded={shopDropdownOpen}
                >
                  <span>المتجر والحلويات</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      shopDropdownOpen ? 'rotate-180 text-[#E84375]' : 'text-stone-400'
                    }`}
                  />
                </button>

                {/* القائمة المنسدلة الفاخرة للحلويات والكعكات */}
                {shopDropdownOpen && (
                  <div className="absolute right-0 top-full pt-2 w-72 z-50 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-2 space-y-1 text-right">
                      <button
                        onClick={() => handleNavClick('marketplace', 'ALL')}
                        className="w-full text-right p-2.5 rounded-xl hover:bg-pink-50/70 transition-colors flex items-start gap-3 group cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#E84375] group-hover:bg-[#E84375] group-hover:text-white flex items-center justify-center flex-shrink-0 transition-colors shadow-2xs">
                          <Store className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-stone-900 group-hover:text-[#E84375] transition-colors">
                            كافة الحلويات والكعكات
                          </div>
                          <div className="text-[10px] text-stone-500 font-light mt-0.5">
                            تصفح التشكيلة الكاملة والتورتات العصرية
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNavClick('marketplace', 'TRADITIONNEL')}
                        className="w-full text-right p-2.5 rounded-xl hover:bg-amber-50/70 transition-colors flex items-start gap-3 group cursor-pointer border border-amber-100/60 bg-amber-50/20"
                      >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                              حلويات تقليدية جزائرية
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                              أصالة جزائرية
                            </span>
                          </div>
                          <div className="text-[10px] text-stone-500 font-light mt-0.5">
                            بقلاوة، مقروط اللوز، تشاراك وصواني الأعراس
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleNavClick('marketplace', 'MARIAGE')}
                        className="w-full text-right p-2.5 rounded-xl hover:bg-pink-50/70 transition-colors flex items-start gap-3 group cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white flex items-center justify-center flex-shrink-0 transition-colors shadow-2xs">
                          <Cake className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-stone-900 group-hover:text-[#E84375] transition-colors">
                            كعكات الأعراس والمناسبات
                          </div>
                          <div className="text-[10px] text-stone-500 font-light mt-0.5">
                            تصاميم ملكية وطبقات متعددة للأفراح
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ورشة التصميم 3D (Custom Cake) */}
              <button
                onClick={() => handleNavClick('customizer')}
                className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-300 shadow-xs ${
                  currentTab === 'customizer'
                    ? 'bg-[#E84375] text-white shadow-md shadow-pink-200 scale-[1.02]'
                    : 'text-[#E84375] bg-pink-50 hover:bg-pink-100/80 border border-pink-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-spin-slow" />
                <span>صمّم كعكتك (3D)</span>
              </button>

              {/* عروض الشركات (Corporate B2B) */}
              <button
                onClick={() => handleNavClick('b2b')}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all duration-200 ${
                  currentTab === 'b2b'
                    ? 'text-[#E84375] bg-pink-50/80 font-extrabold'
                    : 'text-stone-700 hover:text-[#E84375] hover:bg-pink-50/40'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-stone-400" />
                <span>المناسبات والشركات</span>
              </button>

              {/* تتبع الطلب (Track Order) */}
              <button
                onClick={() => handleNavClick('tracking')}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                  currentTab === 'tracking'
                    ? 'text-[#E84375] bg-pink-50/80 font-extrabold'
                    : 'text-stone-700 hover:text-[#E84375] hover:bg-pink-50/40'
                }`}
              >
                تتبع الطلب المباشر
              </button>
            </nav>

            {/* أيقونات الإجراءات والأدوات (Icons & Tools) */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* قائمة الـ 69 ولاية */}
              <div className="relative hidden xl:flex items-center">
                <MapPin className="w-3.5 h-3.5 text-[#E84375] absolute right-3 pointer-events-none" />
                <select
                  value={selectedWilaya}
                  onChange={(e) => setSelectedWilaya(Number(e.target.value))}
                  className="pr-8 pl-7 py-2 bg-stone-50 hover:bg-white border border-stone-200 hover:border-pink-300 rounded-xl text-xs font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-pink-200 transition-all appearance-none cursor-pointer shadow-2xs"
                >
                  <option value={0}>كل الـ 69 ولاية</option>
                  {wilayas.map((w) => (
                    <option key={w.code} value={w.code}>
                      {w.code.toString().padStart(2, '0')} - {w.nameAr}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-stone-400 absolute left-2.5 pointer-events-none" />
              </div>

              {/* حقل البحث السريع */}
              <div
                className={`hidden md:flex items-center bg-stone-50 rounded-xl p-1 border transition-all duration-200 ${
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
                  onKeyDown={(e) => e.key === 'Enter' && onSearchOrder()}
                  className="bg-transparent text-xs px-2.5 py-1 text-stone-800 placeholder-stone-400 focus:outline-none w-36 font-medium text-right"
                />
                <button
                  onClick={onSearchOrder}
                  title="بحث"
                  className="p-1.5 bg-[#E84375] hover:bg-[#D83264] text-white rounded-lg transition-all shadow-2xs hover:scale-105"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* أيقونة المفضلة */}
              <button
                onClick={() => handleNavClick('marketplace')}
                title="المفضلة"
                className="p-2.5 rounded-xl text-stone-700 hover:text-[#E84375] hover:bg-pink-50 transition-colors hidden sm:flex"
              >
                <Heart className="w-5 h-5" />
              </button>

              {/* أيقونة وحساب المستخدم / تسجيل الدخول */}
              {!isAuthenticated ? (
                <button
                  onClick={() => openAuthModal('LOGIN')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-pink-50 hover:bg-pink-100 text-[#E84375] border border-pink-200 transition-all shadow-2xs hover:scale-102 cursor-pointer"
                  title="تسجيل الدخول / حساب جديد"
                >
                  <User className="w-4 h-4 text-[#E84375]" />
                  <span className="hidden sm:inline">دخول / تسجيل</span>
                </button>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100/80 border border-pink-200 text-stone-800 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#E84375] to-[#F472B6] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                      {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                    <span className="hidden md:inline max-w-[100px] truncate text-stone-900">
                      {user?.fullName?.split(' ')[0] || 'حسابي'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-pink-100 py-1.5 z-50 animate-fadeIn text-right">
                      <div className="px-3.5 py-2.5 border-b border-stone-100 bg-pink-50/40 rounded-t-xl">
                        <p className="text-xs font-bold text-stone-900 truncate">{user?.fullName}</p>
                        <p className="text-[10px] text-stone-400 font-mono truncate">{user?.phone || user?.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          openProfileModal();
                        }}
                        className="w-full text-right px-3.5 py-2.5 text-xs font-bold text-stone-700 hover:text-[#E84375] hover:bg-pink-50 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <User className="w-4 h-4 text-[#E84375]" />
                        <span>بياناتي الشخصية والعنوان</span>
                      </button>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          openProfileModal();
                        }}
                        className="w-full text-right px-3.5 py-2.5 text-xs font-bold text-stone-700 hover:text-[#E84375] hover:bg-pink-50 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <Package className="w-4 h-4 text-[#E84375]" />
                        <span>سجل طلباتي</span>
                      </button>
                      <div className="border-t border-stone-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full text-right px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>تسجيل الخروج</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* أيقونة السلة مع العداد الوردي (Cart with Pink Counter Badge) */}
              <button
                onClick={() => handleNavClick('marketplace')}
                title="سلة التسوق"
                className="relative p-2.5 rounded-xl text-stone-700 hover:text-[#E84375] hover:bg-pink-50 transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute 1 top-1 -right-0.5 w-4 h-4 bg-[#E84375] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  0
                </span>
              </button>

              {/* زر فضاء الحرفيين (Vue 3) */}
              <a
                href={artisanAdminUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all duration-200"
              >
                <Store className="w-3.5 h-3.5 text-pink-300" />
                <span>لوحة الحرفي</span>
              </a>

              {/* زر القائمة للشاشات الصغيرة */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="فتح القائمة"
                className="lg:hidden p-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 hover:bg-pink-50 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-[#E84375]" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>

          </div>
        </div>

        {/* 3. القائمة للشاشات الصغيرة (Mobile Menu) */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 py-5 bg-white border-t border-pink-100 space-y-2.5 shadow-xl animate-fadeIn text-right">
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full text-right px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                currentTab === 'home' ? 'bg-pink-50 text-[#E84375]' : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              الرئيسية
            </button>

            {/* المتجر والحلويات (كتالوج موحد مع خيارات سريعة للشاشات الصغيرة) */}
            <div className="bg-pink-50/40 rounded-2xl p-2.5 border border-pink-100/80 space-y-1.5">
              <div className="text-[11px] font-extrabold text-stone-600 px-2 py-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-[#E84375]" />
                  <span>المتجر والحلويات</span>
                </span>
                <span className="text-[10px] text-pink-600 font-bold bg-pink-100/80 px-2 py-0.5 rounded-full">
                  الكتالوج الموحد
                </span>
              </div>

              <button
                onClick={() => handleNavClick('marketplace', 'ALL')}
                className={`w-full text-right px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                  currentTab === 'marketplace' && marketplaceCategory !== 'TRADITIONNEL'
                    ? 'bg-white text-[#E84375] shadow-xs'
                    : 'text-stone-700 hover:bg-white/60'
                }`}
              >
                <span>كافة الحلويات والكعكات</span>
                <span className="text-[10px] text-stone-400">تصفح الكل</span>
              </button>

              <button
                onClick={() => handleNavClick('marketplace', 'TRADITIONNEL')}
                className={`w-full text-right px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                  currentTab === 'traditional' || (currentTab === 'marketplace' && marketplaceCategory === 'TRADITIONNEL')
                    ? 'bg-white text-amber-700 shadow-xs'
                    : 'text-stone-700 hover:bg-white/60'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>حلويات تقليدية جزائرية</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  أصالة جزائرية
                </span>
              </button>
            </div>

            <button
              onClick={() => handleNavClick('customizer')}
              className={`w-full text-right px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs transition-colors ${
                currentTab === 'customizer'
                  ? 'bg-[#E84375] text-white'
                  : 'text-[#E84375] bg-pink-50 border border-pink-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>صمّم كعكتك (3D)</span>
              </span>
            </button>

            <button
              onClick={() => handleNavClick('b2b')}
              className={`w-full text-right px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                currentTab === 'b2b' ? 'bg-pink-50 text-[#E84375]' : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              المناسبات والشركات
            </button>

            <button
              onClick={() => handleNavClick('tracking')}
              className={`w-full text-right px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                currentTab === 'tracking' ? 'bg-pink-50 text-[#E84375]' : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              تتبع الطلب المباشر
            </button>

            {/* حساب العميل على الهاتف */}
            <div className="pt-2 border-t border-pink-100">
              {isAuthenticated ? (
                <div className="bg-pink-50/70 p-3 rounded-2xl border border-pink-200/60 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-full bg-[#E84375] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                      {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-stone-900">{user?.fullName}</p>
                      <p className="text-[10px] text-stone-500 font-mono">{user?.phone || user?.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openProfileModal();
                      }}
                      className="py-1.5 px-2 bg-white text-[#E84375] rounded-xl text-xs font-bold border border-pink-200 flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>ملفي الشخصي</span>
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="py-1.5 px-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-200 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>خروج</span>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('LOGIN');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#E84375] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>تسجيل الدخول / إنشاء حساب</span>
                </button>
              )}
            </div>

            {/* اختيار الولاية على الهاتف */}
            <div className="pt-3 border-t border-pink-100">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5 text-right">
                اختر ولايتك (69 ولاية)
              </label>
              <select
                value={selectedWilaya}
                onChange={(e) => setSelectedWilaya(Number(e.target.value))}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-800 text-right"
              >
                <option value={0}>كل الـ 69 ولاية</option>
                {wilayas.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.code.toString().padStart(2, '0')} - {w.nameAr}
                  </option>
                ))}
              </select>
            </div>

            {/* رابط فضاء الحرفي على الهاتف */}
            <div className="pt-2">
              <a
                href={artisanAdminUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 p-3 bg-stone-900 text-white text-xs font-bold rounded-xl shadow-sm"
              >
                <Store className="w-4 h-4 text-pink-400" />
                <span>دخول فضاء الحرفيين (Vue 3)</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
