import { ArtisanProfile, OrderItem, ProductItem, TrackingStep } from '../types';

export const DEFAULT_TRACKING_STEPS: TrackingStep[] = [
  {
    stepId: 1,
    title: "تأكيد الطلب وقبول الحرفي",
    titleAr: "تأكيد الطلب وقبول الحرفي",
    description: "مراجعة متطلبات التصميم والتاريخ",
    status: "CONFIRMED",
    completed: true,
    completedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
  },
  {
    stepId: 2,
    title: "تحضير وخبز القواعد والجينواز",
    titleAr: "تحضير وخبز القواعد والجينواز",
    description: "خلط المكونات الطبيعية وخبز الطبقات",
    status: "PREPARING_BASE",
    completed: true,
    completedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  },
  {
    stepId: 3,
    title: "المونتاج، الحشوات والغاناش",
    titleAr: "المونتاج، الحشوات والغاناش",
    description: "تطبيق الحشوة المقرمشة وتركيب الطبقات",
    status: "BAKING_ASSEMBLY",
    completed: true,
    completedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
  },
  {
    stepId: 4,
    title: "التزيين، النحت والتذهيب 24k",
    titleAr: "التزيين، النحت والتذهيب 24k",
    description: "إضافة المجسمات، الورود وورق الذهب الخالص",
    status: "DECORATING",
    completed: false,
    photoProofUrl: "/images/chocolate_praline_layer_cake.jpg"
  },
  {
    stepId: 5,
    title: "التغليف الاحترافي والتبريد",
    titleAr: "التغليف الاحترافي والتبريد",
    description: "وضع الكعكة في صندوق معزول حرارياً مع دعامات التثبيت",
    status: "READY",
    completed: false
  },
  {
    stepId: 6,
    title: "التوصيل المبرد إلى باب البيت",
    titleAr: "التوصيل المبرد إلى باب البيت",
    description: "التسليم بسيارة مهيأة ومكيفة",
    status: "DELIVERING",
    completed: false
  }
];

export const INITIAL_ARTISANS: ArtisanProfile[] = [
  {
    id: "art-1",
    name: "ياسمين بن علي",
    nameAr: "ياسمين بن علي",
    storeName: "حلويات العاصمة الفاخرة",
    storeNameAr: "حلويات العاصمة الفاخرة (Les Délices d'Alger)",
    wilayaCode: 16,
    wilayaName: "Alger",
    wilayaNameAr: "الجزائر العاصمة",
    address: "حيدرة، الجزائر العاصمة",
    phone: "0550 12 34 56",
    rating: 4.9,
    reviewsCount: 142,
    bio: "حرفية معتمدة ومتخصصة في كعكات الأعراس الملكية والحلويات المصنوعة يدوياً بورق الذهب عيار 24 قيراط وتصاميم ثلاثية الأبعاد.",
    bioAr: "حرفية معتمدة ومتخصصة في كعكات الأعراس الملكية والحلويات المصنوعة يدوياً بورق الذهب عيار 24 قيراط وتصاميم ثلاثية الأبعاد.",
    avatar: "/images/artisan_pastry_chef.jpg",
    banner: "/images/hero_wedding_cake.jpg",
    specialties: ["كعكات أعراس ملكية", "لاير كيك براليني", "ماكارون فرنسي فاخر", "مجسمات سكرية 3D"]
  },
  {
    id: "art-2",
    name: "كريم جبار",
    nameAr: "كريم جبار",
    storeName: "قصر الحلويات القسنطينية",
    storeNameAr: "قصر الحلويات القسنطينية",
    wilayaCode: 25,
    wilayaName: "Constantine",
    wilayaNameAr: "قسنطينة",
    address: "حي سيدي مبروك، قسنطينة",
    phone: "0661 98 76 54",
    rating: 4.85,
    reviewsCount: 89,
    bio: "وريث خبرة عائلية لأكثر من 30 عاماً في صناعة الحلويات التقليدية وبوفيهات الشركات والمناسبات الرسمية.",
    bioAr: "وريث خبرة عائلية لأكثر من 30 عاماً في صناعة الحلويات التقليدية وبوفيهات الشركات والمناسبات الرسمية.",
    avatar: "/images/traditional_algerian_sweets.jpg",
    banner: "/images/traditional_algerian_sweets.jpg",
    specialties: ["بقلاوة قسنطينية بالعسل الحر", "مقروط اللوز", "دزيريات ملكية", "بوفيهات الشركات B2B"]
  },
  {
    id: "art-3",
    name: "أميرة منصوري",
    nameAr: "أميرة منصوري",
    storeName: "إبداعات سويت وهران",
    storeNameAr: "إبداعات سويت وهران (Sweet Oran)",
    wilayaCode: 31,
    wilayaName: "Oran",
    wilayaNameAr: "وهران",
    address: "العقيد لطفي، وهران",
    phone: "0770 45 67 89",
    rating: 4.95,
    reviewsCount: 210,
    bio: "ماستر شيف في الكيك ديزاين الحديث والحلويات البوتيك ونحت الشوكولاتة المعاصرة.",
    bioAr: "ماستر شيف في الكيك ديزاين الحديث والحلويات البوتيك ونحت الشوكولاتة المعاصرة.",
    avatar: "/images/artisan_pastry_chef.jpg",
    banner: "/images/chocolate_praline_layer_cake.jpg",
    specialties: ["كيك ديزاين عصري", "حلويات بوتيك", "شوكولاتة حرفية", "كعكات تخرج ونجاح"]
  }
];

export const INITIAL_ORDERS: OrderItem[] = [
  {
    id: "ord-dz-101",
    orderNumber: "CMD-2026-DZ001",
    artisanId: "art-1",
    artisanName: "حلويات العاصمة الفاخرة",
    customerName: "رياض محرز",
    customerPhone: "0555 12 34 56",
    customerIdDocType: "CNI",
    customerIdDocNumber: "109823475612",
    deliveryWilayaCode: 16,
    deliveryWilayaName: "الجزائر العاصمة",
    deliveryAddress: "12 شارع ديدوش مراد، الجزائر الوسطى",
    eventDate: "2026-11-06T15:00:00.000Z",
    isB2B: false,
    status: "DECORATING",
    paymentMethod: "CIB_EDAHABIA",
    totalPriceDZD: 13900,
    notes: "كتابة 'عيد ميلاد سعيد أمينة' بالخط العربي المذهب عيار 24",
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    customization: {
      sizeName: "طابق واحد مرتفع بريستيج (15 إلى 20 قطعة)",
      servingsCount: 18,
      flavorName: "جينواز كاكاو مكثف 70% وحبيبات الشوكولاتة",
      fillingName: "غاناش كيندر بوينو مع قرمشة الوافل",
      colorHex: "#FAFAF8",
      colorName: "أبيض لؤلؤي مع لمسات ذهبية",
      toppingsList: ["تاج من 8 حبات ماكارون مشكلة", "تذهيب بورق الذهب الخالص عيار 24 قيراط"],
      extra3dType: "مجسم سكري 3D منحوت يدوياً",
      messageOnCake: "عيد ميلاد سعيد أمينة"
    },
    trackingSteps: DEFAULT_TRACKING_STEPS
  },
  {
    id: "ord-dz-102",
    orderNumber: "CMD-2026-DZ002",
    artisanId: "art-1",
    artisanName: "حلويات العاصمة الفاخرة",
    customerName: "أمينة بلقاسم",
    customerPhone: "0550 99 88 77",
    customerIdDocType: "CNI",
    customerIdDocNumber: "1602938475",
    deliveryWilayaCode: 16,
    deliveryWilayaName: "الجزائر العاصمة",
    deliveryAddress: "حي الموز، باب الزوار، الجزائر",
    eventDate: "2026-11-08T18:00:00.000Z",
    isB2B: false,
    status: "CONFIRMED",
    paymentMethod: "CASH_ON_DELIVERY",
    totalPriceDZD: 38000,
    notes: "كعكة زفاف ملكية 3 طبقات مع ورود باستيل طبيعية",
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    customization: {
      sizeName: "3 طوابق ملكية فاخرة (50 إلى 65 قطعة)",
      servingsCount: 60,
      flavorName: "جينواز فانيليا بوربون مدغشقر",
      fillingName: "براليني بندق محمص منزلي وحبيبات مقرمشة",
      colorHex: "#FACDD8",
      colorName: "وردي ناعم باستيل (Rose Poudré)",
      toppingsList: ["باقة ورود طبيعية معقمة صالحة للحلويات", "تذهيب بورق الذهب الخالص عيار 24 قيراط"],
      messageOnCake: "مبروك الزواج محمد وأمينة"
    },
    trackingSteps: [
      {
        stepId: 1,
        title: "تأكيد الطلب وقبول الحرفي",
        description: "مراجعة متطلبات التصميم والتاريخ",
        status: "CONFIRMED",
        completed: true,
        completedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
      },
      {
        stepId: 2,
        title: "تحضير وخبز القواعد والجينواز",
        description: "خلط المكونات الطبيعية وخبز الطبقات",
        status: "PREPARING_BASE",
        completed: false
      },
      {
        stepId: 3,
        title: "المونتاج، الحشوات والغاناش",
        description: "تطبيق الحشوة المقرمشة وتركيب الطبقات",
        status: "BAKING_ASSEMBLY",
        completed: false
      },
      {
        stepId: 4,
        title: "التزيين، النحت والتذهيب 24k",
        description: "إضافة المجسمات، الورود وورق الذهب الخالص",
        status: "DECORATING",
        completed: false
      },
      {
        stepId: 5,
        title: "التغليف الاحترافي والتبريد",
        description: "وضع الكعكة في صندوق معزول حرارياً مع دعامات التثبيت",
        status: "READY",
        completed: false
      },
      {
        stepId: 6,
        title: "التوصيل المبرد إلى باب البيت",
        description: "التسليم بسيارة مهيأة ومكيفة",
        status: "DELIVERING",
        completed: false
      }
    ]
  },
  {
    id: "ord-dz-103",
    orderNumber: "CMD-2026-DZ003",
    artisanId: "art-2",
    artisanName: "قصر الحلويات القسنطينية",
    customerName: "شركة نوميديا تك SARL",
    customerPhone: "031 92 11 22",
    customerIdDocType: "CNI",
    customerIdDocNumber: "2501928374",
    deliveryWilayaCode: 25,
    deliveryWilayaName: "قسنطينة",
    deliveryAddress: "المنطقة الصناعية الرمال، قسنطينة",
    eventDate: "2026-11-10T09:00:00.000Z",
    isB2B: true,
    companyName: "SARL Numidia Tech",
    companyNIF: "001825019283746",
    status: "CONFIRMED",
    paymentMethod: "BANK_TRANSFER",
    totalPriceDZD: 45000,
    notes: "حفل سنوي للشركة. يرجى توفير فاتورة رسمية مع الـ TVA",
    createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    trackingSteps: [
      {
        stepId: 1,
        title: "تأكيد الطلب وقبول الحرفي",
        description: "مراجعة متطلبات التصميم والتاريخ",
        status: "CONFIRMED",
        completed: true,
        completedAt: new Date().toISOString()
      },
      {
        stepId: 2,
        title: "تحضير وخبز القواعد والجينواز",
        description: "خلط المكونات الطبيعية وخبز الطبقات",
        status: "PREPARING_BASE",
        completed: false
      },
      {
        stepId: 3,
        title: "المونتاج، الحشوات والغاناش",
        description: "تطبيق الحشوة المقرمشة وتركيب الطبقات",
        status: "BAKING_ASSEMBLY",
        completed: false
      },
      {
        stepId: 4,
        title: "التزيين، النحت والتذهيب 24k",
        description: "إضافة المجسمات، الورود وورق الذهب الخالص",
        status: "DECORATING",
        completed: false
      },
      {
        stepId: 5,
        title: "التغليف الاحترافي والتبريد",
        description: "وضع الكعكة في صندوق معزول حرارياً مع دعامات التثبيت",
        status: "READY",
        completed: false
      },
      {
        stepId: 6,
        title: "التوصيل المبرد إلى باب البيت",
        description: "التسليم بسيارة مهيأة ومكيفة",
        status: "DELIVERING",
        completed: false
      }
    ]
  }
];

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: "prod-1",
    artisanId: "art-1",
    name: "كعكة الزفاف الملكية 3 طبقات بزهور الباستيل وورق الذهب",
    nameAr: "كعكة الزفاف الملكية 3 طبقات بزهور الباستيل وورق الذهب",
    category: "MARIAGE",
    categoryAr: "أعراس ومناسبات كبرى",
    description: "تحفة ملكية فاخرة مزينة بزهور الباستيل وورق الذهب الخالص عيار 24 قيراط ولآلئ السكر المنسدلة على قاعدة شامبانيا ساحرة.",
    descriptionAr: "تحفة ملكية فاخرة مزينة بزهور الباستيل وورق الذهب الخالص عيار 24 قيراط ولآلئ السكر المنسدلة على قاعدة شامبانيا ساحرة.",
    priceDZD: 38000,
    servings: 60,
    prepTimeDays: 4,
    imageUrl: "/images/hero_wedding_cake.jpg",
    isCustomizable: true,
    tags: ["أعراس", "ملكي", "ورق ذهب", "زهور طبيعية"]
  },
  {
    id: "prod-2",
    artisanId: "art-1",
    name: "كعكة الشوكولاتة والبراليني مع الغاناش الغني والكراميل",
    nameAr: "كعكة الشوكولاتة والبراليني مع الغاناش الغني والكراميل",
    category: "MODERNE",
    categoryAr: "شوكولاتة فاخرة ولاير كيك",
    description: "طبقات إسفنجية غنية بكاكاو 70%، حشوة البراليني المقرمشة بالبندق المحمص وصوص الشوكولاتة المرآة اللامع المذهب.",
    descriptionAr: "طبقات إسفنجية غنية بكاكاو 70%، حشوة البراليني المقرمشة بالبندق المحمص وصوص الشوكولاتة المرآة اللامع المذهب.",
    priceDZD: 7500,
    servings: 15,
    prepTimeDays: 2,
    imageUrl: "/images/chocolate_praline_layer_cake.jpg",
    isCustomizable: true,
    tags: ["شوكولاتة", "براليني", "كراميل", "أعياد ميلاد"]
  },
  {
    id: "prod-3",
    artisanId: "art-2",
    name: "صينية بقلاوة قسنطينية بالعسل الحر والجوز الجزائري",
    nameAr: "صينية بقلاوة قسنطينية بالعسل الحر والجوز الجزائري",
    category: "TRADITIONNEL",
    categoryAr: "حلويات تقليدية أصيلة",
    description: "صينية بقلاوة أصيلة مورقة بالسمن البلدي محشوة بأجود أنواع الجوز ومسقية بالعسل الحر المقطر مع ماء زهر البرتقال.",
    priceDZD: 12000,
    servings: 40,
    prepTimeDays: 3,
    imageUrl: "/images/traditional_algerian_sweets.jpg",
    isCustomizable: false,
    tags: ["تقليدي", "قسنطينة", "جوز", "عسل حر"]
  }
];
