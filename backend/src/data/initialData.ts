export interface ArtisanData {
  id: string;
  name: string;
  nameAr?: string;
  storeName: string;
  storeNameAr?: string;
  wilayaCode: number;
  wilayaName: string;
  wilayaNameAr?: string;
  address: string;
  phone: string;
  rating: number;
  reviewsCount: number;
  bio: string;
  bioAr?: string;
  avatar: string;
  banner: string;
  specialties: string[];
  specialtiesAr?: string[];
}

export interface ProductData {
  id: string;
  artisanId: string;
  name: string;
  nameAr?: string;
  category: "TRADITIONNEL" | "MODERNE" | "MARIAGE" | "ANNIVERSAIRE" | "B2B_ENTREPRISE";
  categoryAr?: string;
  description: string;
  descriptionAr?: string;
  priceDZD: number;
  servings: number;
  prepTimeDays: number;
  imageUrl: string;
  isCustomizable: boolean;
  tags: string[];
}

export interface CustomizationOption {
  id: string;
  category: "SIZE" | "FLAVOR" | "FILLING" | "COLOR" | "TOPPING" | "EXTRA_3D";
  name: string;
  nameAr?: string;
  priceDZD: number;
  description?: string;
  descriptionAr?: string;
  colorHex?: string;
}

export const INITIAL_ARTISANS: ArtisanData[] = [
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
    rating: 4.95,
    reviewsCount: 164,
    bio: "حرفية معتمدة ومتخصصة في أرقى الحلويات الجزائرية التقليدية العاصمية (مقروط اللوز، العرايش المذهبة، تشاراك المسكر، الدزيريات وصواني المهيبة والأعراس).",
    bioAr: "حرفية معتمدة ومتخصصة في أرقى الحلويات الجزائرية التقليدية العاصمية (مقروط اللوز، العرايش المذهبة، تشاراك المسكر، الدزيريات وصواني المهيبة والأعراس).",
    avatar: "/images/artisan_pastry_chef.jpg",
    banner: "/images/traditional_siniyet_aroussa.jpg",
    specialties: ["مقروط اللوز العاصمي", "عرايش مذهبة", "تشاراك مسكر وعريان", "صواني الأعراس الملكية"],
    specialtiesAr: ["مقروط اللوز العاصمي", "عرايش مذهبة", "تشاراك مسكر وعريان", "صواني الأعراس الملكية"]
  },
  {
    id: "art-2",
    name: "كريم جبار",
    nameAr: "كريم جبار",
    storeName: "قصر الحلويات القسنطينية",
    storeNameAr: "قصر الحلويات القسنطينية العريقة",
    wilayaCode: 25,
    wilayaName: "Constantine",
    wilayaNameAr: "قسنطينة",
    address: "حي سيدي مبروك، قسنطينة",
    phone: "0661 98 76 54",
    rating: 4.9,
    reviewsCount: 128,
    bio: "وريث خبرة عائلية لأكثر من 35 عاماً في صناعة البقلاوة القسنطينية المورقة بالسمن البلدي والعسل الحر، الرفيس الفاخر ومعسلات المناسبات والولائم.",
    bioAr: "وريث خبرة عائلية لأكثر من 35 عاماً في صناعة البقلاوة القسنطينية المورقة بالسمن البلدي والعسل الحر، الرفيس الفاخر ومعسلات المناسبات والولائم.",
    avatar: "/images/traditional_baklawa.jpg",
    banner: "/images/traditional_algerian_sweets.jpg",
    specialties: ["بقلاوة قسنطينية بالعسل الحر", "رفيس قسنطيني فاخر", "صامصة مورقة بالجوز", "صواني الضيافة النحاسية"],
    specialtiesAr: ["بقلاوة قسنطينية بالعسل الحر", "رفيس قسنطيني فاخر", "صامصة مورقة بالجوز", "صواني الضيافة النحاسية"]
  },
  {
    id: "art-3",
    name: "خديجة منصوري",
    nameAr: "خديجة منصوري",
    storeName: "دار المعسلات والتراث الجزائري",
    storeNameAr: "دار المعسلات والتراث الجزائري",
    wilayaCode: 31,
    wilayaName: "Oran",
    wilayaNameAr: "وهران",
    address: "العقيد لطفي، وهران",
    phone: "0770 45 67 89",
    rating: 4.88,
    reviewsCount: 142,
    bio: "صانعة حلويات تقليدية عريقة متخصصة في مقروط الكوشة بتمر الغرس، مشوك اللوز المعسل، القريوش الذهبي، وتقديم أرقى كعكات المناسبات العائلية والأفراح.",
    bioAr: "صانعة حلويات تقليدية عريقة متخصصة في مقروط الكوشة بتمر الغرس، مشوك اللوز المعسل، القريوش الذهبي، وتقديم أرقى كعكات المناسبات العائلية والأفراح.",
    avatar: "/images/traditional_mchewek.jpg",
    banner: "/images/traditional_makroud_koucha.jpg",
    specialties: ["مقروط الكوشة بتمر الغرس", "مشوك اللوز والكرز", "قريوش السنبلة المقرمش", "كعكات المناسبات"],
    specialtiesAr: ["مقروط الكوشة بتمر الغرس", "مشوك اللوز والكرز", "قريوش السنبلة المقرمش", "كعكات المناسبات"]
  }
];

export const INITIAL_PRODUCTS: ProductData[] = [
  // ==========================================
  // 1. الحلويات الجزائرية التقليدية الأصيلة (الأغلبية الساحقة)
  // ==========================================
  {
    id: "prod-18",
    artisanId: "art-2",
    name: "بقلاوة قسنطينية ملكية بالجوز واللوز والعسل الصافي",
    nameAr: "بقلاوة قسنطينية ملكية بالجوز واللوز والعسل الصافي",
    category: "TRADITIONNEL",
    categoryAr: "حلويات جزائرية تقليدية أصيلة",
    description: "بقلاوة جزائرية قسنطينية مورقة ومقرمشة بطبقات السمن الطبيعي، محشوة باللوز والجوز ومسقية بالعسل الحر المصفى مع حبات لوز محمصة كاملة.",
    descriptionAr: "بقلاوة جزائرية قسنطينية مورقة ومقرمشة بطبقات السمن الطبيعي، محشوة باللوز والجوز ومسقية بالعسل الحر المصفى مع حبات لوز محمصة كاملة.",
    priceDZD: 7500,
    servings: 24,
    prepTimeDays: 2,
    imageUrl: "/images/traditional_baklawa.jpg",
    isCustomizable: false,
    tags: ["بقلاوة", "قسنطينة", "لوز وجوز", "عسل حر", "أفراح", "الأكثر طلباً"]
  },
  {
    id: "prod-19",
    artisanId: "art-1",
    name: "مقروط اللوز العاصمي بماء الزهر والليمون",
    nameAr: "مقروط اللوز العاصمي بماء الزهر والليمون",
    category: "TRADITIONNEL",
    categoryAr: "حلويات جزائرية تقليدية أصيلة",
    description: "مقروط اللوز التقليدي الجزائري الأصيل، طري ويذوب في الفم، بنكهة قشور الليمون الطازجة وماء زهر البرتقال المقطر ومغلف بالسكر الناعم الأبيض الفاخر.",
    descriptionAr: "مقروط اللوز التقليدي الجزائري الأصيل، طري ويذوب في الفم، بنكهة قشور الليمون الطازجة وماء زهر البرتقال المقطر ومغلف بالسكر الناعم الأبيض الفاخر.",
    priceDZD: 4800,
    servings: 20,
    prepTimeDays: 2,
    imageUrl: "/images/traditional_makroud_el_louz.jpg",
    isCustomizable: false,
    tags: ["مقروط اللوز", "عاصمي", "سكر ناعم", "ليمون", "ماء زهر", "تراث"]
  },
  {
    id: "prod-20",
    artisanId: "art-1",
    name: "تشاراك المسكر الملكي بالسكر الناعم ولوز بلدي",
    nameAr: "تشاراك المسكر الملكي بالسكر الناعم ولوز بلدي",
    category: "TRADITIONNEL",
    categoryAr: "حلويات جزائرية تقليدية أصيلة",
    description: "قرون الغزال الجزائرية الهشة (تشاراك مسكر) محشوة بعقدة اللوز المعطرة بالقرفة وماء الزهر ومغطاة بغلاف سكري ناعم يذوب في الفم.",
    descriptionAr: "قرون الغزال الجزائرية الهشة (تشاراك مسكر) محشوة بعقدة اللوز المعطرة بالقرفة وماء الزهر ومغطاة بغلاف سكري ناعم يذوب في الفم.",
    priceDZD: 4500,
    servings: 20,
    prepTimeDays: 2,
    imageUrl: "/images/traditional_tcharek_msekker.jpg",
    isCustomizable: false,
    tags: ["تشاراك مسكر", "لوز", "أعياد", "ضيافة", "أصالة"]
  },
  {
    id: "prod-21",
    artisanId: "art-1",
    name: "دزيريات وقنيدلات العاصمة بريستيج مع لمسات ذهبية",
    nameAr: "دزيريات وقنيدلات العاصمة بريستيج مع لمسات ذهبية",
    category: "TRADITIONNEL",
    categoryAr: "حلويات جزائرية تقليدية أصيلة",
    description: "وردات الدزيريات المنقوشة يدوياً بإتقان والمحشوة بقلب اللوز المعسل والفستق، مزينة بورق الذهب الصالح للأكل لتزيين موائد الخطوبة والأفراح.",
    descriptionAr: "وردات الدزيريات المنقوشة يدوياً بإتقان والمحشوة بقلب اللوز المعسل والفستق، مزينة بورق الذهب الصالح للأكل لتزيين موائد الخطوبة والأفراح.",
    priceDZD: 5200,
    servings: 18,
    prepTimeDays: 3,
    imageUrl: "/images/traditional_dziriat.jpg",
    isCustomizable: false,
    tags: ["دزيريات", "قنيدلات", "لوز", "ذهب 24k", "بريستيج"]
  },
  {
    id: "prod-arayech",
    artisanId: "art-1",
    name: "عرايش جزائرية مذهبة بطعم الليمون وقلاصاج ملوكي",
    nameAr: "عرايش جزائرية مذهبة بطعم الليمون وقلاصاج ملوكي",
    category: "TRADITIONNEL",
    categoryAr: "حلويات جزائرية تقليدية أصيلة",
    description: "عرايش عاصمية بنجمة ثلاثية متناسقة، عجينة هشة تذوب في الفم محشوة بعقدة اللوز وقشور الليمون مع قلاصاج ملكي ناعم وتذهيب يدوي فاخر.",
    descriptionAr: "عرايش عاصمية بنجمة ثلاثية متناسقة، عجينة هشة تذوب في الفم محشوة بعقدة اللوز وقشور الليمون مع قلاصاج ملكي ناعم وتذهيب يدوي فاخر.",
    priceDZD: 4600,
    servings: 18,
    prepTimeDays: 2,
    imageUrl: "/images/traditional_arayech.jpg",
    isCustomizable: false,
    tags: ["عرايش", "قلاصاج ملكي", "ليمون", "أفراح", "عاصمي"]
  },
  {
    id: "prod-makroud-koucha",
    artisanId: "art-3",
    name: "مقروط الكوشة التقليدي بتمر الغرس والسمسم وعسل النحل",
    nameAr: "مقروط الكوشة التقليدي بتمر الغرس والسمسم وعسل النحل",
    category: "TRADITIONNEL",
    categoryAr: "معسلات تقليدية جزائرية",
    description: "مقروط الكوشة التقليدي الأصيل بتمر الغرس المعطر بالقرفة والقرنفل، محمص بالفرن ومسقي بعسل النحل ومزين بالجلجلان المحمص.",
    descriptionAr: "مقروط الكوشة التقليدي الأصيل بتمر الغرس المعطر بالقرفة والقرنفل، محمص بالفرن ومسقي بعسل النحل ومزين بالجلجلان المحمص.",
    priceDZD: 3900,
    servings: 24,
    prepTimeDays: 2,
    imageUrl: "/images/traditional_makroud_koucha.jpg",
    isCustomizable: false,
    tags: ["مقروط الكوشة", "تمر الغرس", "بسكرة", "عسل حر", "سمسم"]
  },
  {
    id: "prod-mchewek",
    artisanId: "art-3",
    name: "مشوك معسل بلوز إكسترا وكرز أحمر فاخر",
    nameAr: "مشوك معسل بلوز إكسترا وكرز أحمر فاخر",
    category: "TRADITIONNEL",
    categoryAr: "حلويات اللوز المعسلة",
    description: "حلوى المشوك الجزائرية الأصيلة، كرات اللوز الناعمة المغلفة بشرائح ورقائق اللوز المحمص المقرمش، معسلة فور خروجها من الفرن ومزينة بحبة كرز معسلة.",
    descriptionAr: "حلوى المشوك الجزائرية الأصيلة، كرات اللوز الناعمة المغلفة بشرائح ورقائق اللوز المحمص المقرمش، معسلة فور خروجها من الفرن ومزينة بحبة كرز معسلة.",
    priceDZD: 4400,
    servings: 20,
    prepTimeDays: 2,
    imageUrl: "/images/traditional_mchewek.jpg",
    isCustomizable: false,
    tags: ["مشوك", "لوز إكسترا", "معسل", "كرز", "ضيافة الجزائريين"]
  },
  {
    id: "prod-griwech",
    artisanId: "art-3",
    name: "قريوش السنبلة المقرمش بماء الزهر والجلجلان وعسل النحل",
    nameAr: "قريوش السنبلة المقرمش بماء الزهر والجلجلان وعسل النحل",
    category: "TRADITIONNEL",
    categoryAr: "معسلات ومقرمشات جزائرية",
    description: "قريوش جزائري تقليدي مورق ومقرمش على شكل سنبلة وضفيرة، منكه بماء الزهر المقطر ومعسل بعسل طبيعي صافٍ ومرشوش ببذور السمسم الأبيض المحمص.",
    descriptionAr: "قريوش جزائري تقليدي مورق ومقرمش على شكل سنبلة وضفيرة، منكه بماء الزهر المقطر ومعسل بعسل طبيعي صافٍ ومرشوش ببذور السمسم الأبيض المحمص.",
    priceDZD: 2900,
    servings: 25,
    prepTimeDays: 1,
    imageUrl: "/images/traditional_griwech.jpg",
    isCustomizable: false,
    tags: ["قريوش", "سنبلة", "مقرمش", "عسل حر", "سهرات وأعراس"]
  },
  {
    id: "prod-siniyet-mehiba",
    artisanId: "art-1",
    name: "صينية المهيبة والأفراح الملوكية النحاسية (60 قطعة مشكلة)",
    nameAr: "صينية المهيبة والأفراح الملوكية النحاسية (60 قطعة مشكلة)",
    category: "TRADITIONNEL",
    categoryAr: "صواني الأعراس والمهيبة",
    description: "صينية نحاسية تقليدية كبيرة مطروقة باليد تضم 60 قطعة مختارة من أرقى الحلويات: بقلاوة قسنطينية، مقروط اللوز، تشاراك مسكر، عرايش، ودزيريات بريستيج.",
    descriptionAr: "صينية نحاسية تقليدية كبيرة مطروقة باليد تضم 60 قطعة مختارة من أرقى الحلويات: بقلاوة قسنطينية، مقروط اللوز، تشاراك مسكر، عرايش، ودزيريات بريستيج.",
    priceDZD: 24000,
    servings: 60,
    prepTimeDays: 5,
    imageUrl: "/images/traditional_siniyet_aroussa.jpg",
    isCustomizable: false,
    tags: ["صينية المهيبة", "أفراح", "نحاس جزائري", "تشكيلة ملوكية", "الأعراس"]
  },
  {
    id: "prod-22",
    artisanId: "art-2",
    name: "صينية العروس الفاخرة للحلويات التقليدية (45 قطعة مختارة)",
    nameAr: "صينية العروس الفاخرة للحلويات التقليدية (45 قطعة مختارة)",
    category: "TRADITIONNEL",
    categoryAr: "صواني الأعراس والمهيبة",
    description: "صينية نحاسية جزائرية راقية مزينة بشرائط الساتان والورد تضم 45 قطعة مشكلة من أشهى حلويات المناسبات مع تذهيب ورق الذهب 24k.",
    descriptionAr: "صينية نحاسية جزائرية راقية مزينة بشرائط الساتان والورد تضم 45 قطعة مشكلة من أشهى حلويات المناسبات مع تذهيب ورق الذهب 24k.",
    priceDZD: 18500,
    servings: 45,
    prepTimeDays: 4,
    imageUrl: "/images/traditional_siniyet_aroussa.jpg",
    isCustomizable: false,
    tags: ["صينية العروس", "مهيبة", "أعراس", "تشكيلة ملوكية"]
  },
  {
    id: "prod-3",
    artisanId: "art-2",
    name: "صينية الضيافة الملكية للأفراح وحلويات اللوز التراثية (30 قطعة)",
    nameAr: "صينية الضيافة الملكية للأفراح وحلويات اللوز التراثية (30 قطعة)",
    category: "TRADITIONNEL",
    categoryAr: "حلويات جزائرية أصيلة",
    description: "تشكيلة راقية على صينية تقليدية: مقروط اللوز بنكهة الليمون، بقلاوة قسنطينية بالعسل الصافي واللوز، تشاراك العريان ودزيريات ملكية.",
    descriptionAr: "تشكيلة راقية على صينية تقليدية: مقروط اللوز بنكهة الليمون، بقلاوة قسنطينية بالعسل الصافي واللوز، تشاراك العريان ودزيريات ملكية.",
    priceDZD: 16500,
    servings: 30,
    prepTimeDays: 4,
    imageUrl: "/images/traditional_algerian_sweets.jpg",
    isCustomizable: false,
    tags: ["تقليدي", "قسنطينة", "عسل حر", "أفراح", "ضيافة"]
  },
  {
    id: "prod-tcharek-aryan",
    artisanId: "art-1",
    name: "تشاراك العريان المرمل باللوز البلدي المحمص",
    nameAr: "تشاراك العريان المرمل باللوز البلدي المحمص",
    category: "TRADITIONNEL",
    categoryAr: "حلويات جزائرية تقليدية أصيلة",
    description: "تشاراك العريان المقرمش والمرمل المصنوع بالسمن الطبيعي، محشو بعقدة لوز معطرة بالقرفة ومغطى برقائق لوز محمص ذهبي ولمسة خفيفة من العسل.",
    descriptionAr: "تشاراك العريان المقرمش والمرمل المصنوع بالسمن الطبيعي، محشو بعقدة لوز معطرة بالقرفة ومغطى برقائق لوز محمص ذهبي ولمسة خفيفة من العسل.",
    priceDZD: 4200,
    servings: 20,
    prepTimeDays: 2,
    imageUrl: "/images/traditional_tcharek_msekker.jpg",
    isCustomizable: false,
    tags: ["تشاراك العريان", "لوز بلدي", "سمن طبيعي", "أصالة"]
  },
  {
    id: "prod-samsa",
    artisanId: "art-2",
    name: "صامصة عاصمية مورقة بالجوز والجلجلان والعسل الصافي",
    nameAr: "صامصة عاصمية مورقة بالجوز والجلجلان والعسل الصافي",
    category: "TRADITIONNEL",
    categoryAr: "معسلات تقليدية جزائرية",
    description: "مثلثات الصامصة المورقة بفقاعات ذهبية مقرمشة، محشوة بقلب الجوز المكسر ونكهة ماء الزهر، معسلة وساخنة مع رشة سمسم لتزين سهرات الشاي الجزائري.",
    descriptionAr: "مثلثات الصامصة المورقة بفقاعات ذهبية مقرمشة، محشوة بقلب الجوز المكسر ونكهة ماء الزهر، معسلة وساخنة مع رشة سمسم لتزين سهرات الشاي الجزائري.",
    priceDZD: 3500,
    servings: 20,
    prepTimeDays: 2,
    imageUrl: "/images/traditional_baklawa.jpg",
    isCustomizable: false,
    tags: ["صامصة", "عاصمي", "جوز", "مورق", "سهرة شاي"]
  },
  {
    id: "prod-knidlet",
    artisanId: "art-1",
    name: "قنيدلات الجوز واللوز بريستيج في قوالب مذهبة",
    nameAr: "قنيدلات الجوز واللوز بريستيج في قوالب مذهبة",
    category: "TRADITIONNEL",
    categoryAr: "حلويات بريستيج للأفراح",
    description: "قنيدلات جزائرية فاخرة في كؤوس مسننة رقيقة، محشوة بمزيج غني من اللوز والجوز المطحون ومعطرة ببرش الليمون ومغموسة في العسل مع ورقة ذهب.",
    descriptionAr: "قنيدلات جزائرية فاخرة في كؤوس مسننة رقيقة، محشوة بمزيج غني من اللوز والجوز المطحون ومعطرة ببرش الليمون ومغموسة في العسل مع ورقة ذهب.",
    priceDZD: 5400,
    servings: 18,
    prepTimeDays: 3,
    imageUrl: "/images/traditional_dziriat.jpg",
    isCustomizable: false,
    tags: ["قنيدلات", "جوز ولوز", "بريستيج", "أفراح"]
  },
  {
    id: "prod-rfiss",
    artisanId: "art-2",
    name: "رفيس قسنطيني فاخر بماء الورد والمكسرات والعسل والزبدة الحرة",
    nameAr: "رفيس قسنطيني فاخر بماء الورد والمكسرات والعسل والزبدة الحرة",
    category: "TRADITIONNEL",
    categoryAr: "أطباق وتحليات تراثية",
    description: "تحفة قسنطينية تراثية لا غنى عنها في الأفراح والزيارات السعيدة، سميد مفور ناعم مشرب بماء الورد المقطر والزبدة الحرة، مزين بالجوز وحبات اللوز وسكر قلاص.",
    descriptionAr: "تحفة قسنطينية تراثية لا غنى عنها في الأفراح والزيارات السعيدة، سميد مفور ناعم مشرب بماء الورد المقطر والزبدة الحرة، مزين بالجوز وحبات اللوز وسكر قلاص.",
    priceDZD: 4800,
    servings: 12,
    prepTimeDays: 1,
    imageUrl: "/images/traditional_algerian_sweets.jpg",
    isCustomizable: false,
    tags: ["رفيس", "قسنطينة", "ماء ورد", "زبدة حرة", "تراث"]
  },
  {
    id: "prod-skandraniate",
    artisanId: "art-1",
    name: "سكندرانيات بريستيج بالفستق واللوز وعطر الزهر",
    nameAr: "سكندرانيات بريستيج بالفستق واللوز وعطر الزهر",
    category: "TRADITIONNEL",
    categoryAr: "حلويات اللوز الراقية",
    description: "قطع سكندرانيات هندسية أنيقة بعجينة رقيقة شفافة تكشف طبقات اللوز والفستق الحلبي الأخضر الطبيعي، منقوشة بدقة ومزينة باللؤلؤ الغذائي.",
    descriptionAr: "قطع سكندرانيات هندسية أنيقة بعجينة رقيقة شفافة تكشف طبقات اللوز والفستق الحلبي الأخضر الطبيعي، منقوشة بدقة ومزينة باللؤلؤ الغذائي.",
    priceDZD: 5600,
    servings: 20,
    prepTimeDays: 3,
    imageUrl: "/images/traditional_makroud_el_louz.jpg",
    isCustomizable: false,
    tags: ["سكندرانيات", "فستق", "لوز", "نقش يدوي"]
  },

  // ==========================================
  // 2. كعكات المناسبات الكبرى الحديثة (مختارة بعناية)
  // ==========================================
  {
    id: "prod-1",
    artisanId: "art-1",
    name: "كعكة الزفاف الملكية 3 طبقات بزهور الباستيل وورق الذهب",
    nameAr: "كعكة الزفاف الملكية 3 طبقات بزهور الباستيل وورق الذهب",
    category: "MARIAGE",
    categoryAr: "أعراس ومناسبات كبرى",
    description: "تحفة فنية فاخرة للأعراس مزينة بزهور الورد الطبيعية ولمسات ورق الذهب الخالص عيار 24 ولآلئ السكر على قاعدة شامبانيه ساحرة.",
    descriptionAr: "تحفة فنية فاخرة للأعراس مزينة بزهور الورد الطبيعية ولمسات ورق الذهب الخالص عيار 24 ولآلئ السكر على قاعدة شامبانيه ساحرة.",
    priceDZD: 38000,
    servings: 60,
    prepTimeDays: 7,
    imageUrl: "/images/hero_wedding_cake.jpg",
    isCustomizable: true,
    tags: ["أعراس", "كعكة ملكية", "ذهب 24k", "فاخر"]
  },
  {
    id: "prod-2",
    artisanId: "art-3",
    name: "نمبر كيك بالأرقام بالفواكه الطازجة والماكارون الوردي",
    nameAr: "نمبر كيك بالأرقام بالفواكه الطازجة والماكارون الوردي",
    category: "MODERNE",
    categoryAr: "تورتات عصرية وفاخرة",
    description: "بسكويت سابليه مقرمش باللوز، كريمة دبلوماسية خفيفة بفانيلا مدغشقر، توت العليق الطازج، حبات ماكارون وردية ولمسات ذهبية رقيقة.",
    descriptionAr: "بسكويت سابليه مقرمش باللوز، كريمة دبلوماسية خفيفة بفانيلا مدغشقر، توت العليق الطازج، حبات ماكارون وردية ولمسات ذهبية رقيقة.",
    priceDZD: 8500,
    servings: 12,
    prepTimeDays: 3,
    imageUrl: "/images/cake_preview_number.jpg",
    isCustomizable: true,
    tags: ["نمبر كيك", "توت أحمر", "ماكارون", "مناسبات خاصة"]
  },
  {
    id: "prod-4",
    artisanId: "art-1",
    name: "لاير كيك الشوكولاتة الداكنة والبراليني المقرمش مع توبر مذهب",
    nameAr: "لاير كيك الشوكولاتة الداكنة والبراليني المقرمش مع توبر مذهب",
    category: "MODERNE",
    categoryAr: "لاير كيك وشوكولاتة",
    description: "جينواز إسفنجية غنية بالكاكاو 70%، صوص شوكولاتة مرآة لامع، بندق محمص مقرمش، ورق ذهب صالح للأكل مع توبر ثلاثي الأبعاد مخصص.",
    descriptionAr: "جينواز إسفنجية غنية بالكاكاو 70%، صوص شوكولاتة مرآة لامع، بندق محمص مقرمش، ورق ذهب صالح للأكل مع توبر ثلاثي الأبعاد مخصص.",
    priceDZD: 11500,
    servings: 16,
    prepTimeDays: 3,
    imageUrl: "/images/cake_preview_chocolate.jpg",
    isCustomizable: true,
    tags: ["شوكولاتة", "لاير كيك", "براليني", "توبر 3D"]
  },
  {
    id: "prod-5",
    artisanId: "art-2",
    name: "بوفيه فاخر للمؤتمرات واجتماعات الشركات (100 شخص)",
    nameAr: "بوفيه فاخر للمؤتمرات واجتماعات الشركات (100 شخص)",
    category: "B2B_ENTREPRISE",
    categoryAr: "شركات وفعاليات B2B",
    description: "باقة متكاملة للمؤتمرات والندوات تتضمن ميني تارتليت بالفواكه الطازجة، كؤوس الحلى الراقية، ماكارون مشكل ومخبوزات مع فاتورة رسمية NIF.",
    descriptionAr: "باقة متكاملة للمؤتمرات والندوات تتضمن ميني تارتليت بالفواكه الطازجة، كؤوس الحلى الراقية، ماكارون مشكل ومخبوزات مع فاتورة رسمية NIF.",
    priceDZD: 45000,
    servings: 100,
    prepTimeDays: 5,
    imageUrl: "/images/b2b_corporate_buffet.jpg",
    isCustomizable: true,
    tags: ["شركات", "مؤتمرات", "فاتورة رسمية", "بوفيه"]
  },
  {
    id: "prod-14",
    artisanId: "art-3",
    name: "بينتو كيك الباستيل الكوري العصري للاحتفالات الخاصة",
    nameAr: "بينتو كيك الباستيل الكوري العصري للاحتفالات الخاصة",
    category: "MODERNE",
    categoryAr: "بينتو كيك عصري",
    description: "الكعكة الصغيرة الأكثر رواجاً، حجم مثالي للمفاجآت لشخصين إلى 4 أشخاص، مع علبة قصبية بيئية وشمعة احتفالية وكتابة مخصصة.",
    descriptionAr: "الكعكة الصغيرة الأكثر رواجاً، حجم مثالي للمفاجآت لشخصين إلى 4 أشخاص، مع علبة قصبية بيئية وشمعة احتفالية وكتابة مخصصة.",
    priceDZD: 1800,
    servings: 4,
    prepTimeDays: 1,
    imageUrl: "/images/cake_preview_1tier.jpg",
    isCustomizable: true,
    tags: ["بينتو كيك", "باستيل", "مفاجأة", "صغير"]
  },
  {
    id: "prod-6",
    artisanId: "art-1",
    name: "كعكة الزهور الوردية الاحتفالية",
    nameAr: "كعكة الزهور الوردية الاحتفالية",
    category: "MARIAGE",
    categoryAr: "مناسبات واحتفالات فاخرة",
    description: "كعكة وردية فاخرة مزينة بزهور الورد الطبيعية والبيوني مع كريمة زبدة سويسرية ناعمة، لمسات ذهبية وقاعدة سيراميك أنيقة.",
    descriptionAr: "كعكة وردية فاخرة مزينة بزهور الورد الطبيعية والبيوني مع كريمة زبدة سويسرية ناعمة، لمسات ذهبية وقاعدة سيراميك أنيقة.",
    priceDZD: 4500,
    servings: 12,
    prepTimeDays: 2,
    imageUrl: "/images/pink_flower_hero_cake.jpg",
    isCustomizable: true,
    tags: ["وردي", "زهور طبيعية", "احتفال", "مخبوز بحب"]
  }
];

export const CUSTOMIZATION_OPTIONS: CustomizationOption[] = [
  // الأحجام والطبقات
  { id: "size-1", category: "SIZE", name: "طابق واحد ناعم (8 إلى 10 قطع)", nameAr: "طابق واحد ناعم (8 إلى 10 قطع)", priceDZD: 6000, description: "قطر 15 سم - مثالي للاحتفالات العائلية الصغيرة" },
  { id: "size-2", category: "SIZE", name: "طابق واحد مرتفع بريستيج (15 إلى 20 قطعة)", nameAr: "طابق واحد مرتفع بريستيج (15 إلى 20 قطعة)", priceDZD: 9500, description: "ارتفاع 18 سم - الأكثر طلباً لأعياد الميلاد والنجاح" },
  { id: "size-3", category: "SIZE", name: "طابقان للاحتفالات (30 إلى 35 قطعة)", nameAr: "طابقان للاحتفالات (30 إلى 35 قطعة)", priceDZD: 18000, description: "طابقان متناسقان - مثالي للخطوبة والحفلات" },
  { id: "size-4", category: "SIZE", name: "3 طوابق ملكية فاخرة (50 إلى 65 قطعة)", nameAr: "3 طوابق ملكية فاخرة (50 إلى 65 قطعة)", priceDZD: 32000, description: "تحفة ملكية شامخة لأعراس الأحلام" },

  // نكهة الجينواز
  { id: "flav-vanille", category: "FLAVOR", name: "جينواز فانيليا بوربون مدغشقر", nameAr: "جينواز فانيليا بوربون مدغشقر", priceDZD: 0 },
  { id: "flav-choc", category: "FLAVOR", name: "جينواز كاكاو مكثف 70% وحبيبات الشوكولاتة", nameAr: "جينواز كاكاو مكثف 70% وحبيبات الشوكولاتة", priceDZD: 500 },
  { id: "flav-redvelvet", category: "FLAVOR", name: "ريد فيلفيت المخملي الوردي", nameAr: "ريد فيلفيت المخملي الوردي", priceDZD: 800 },
  { id: "flav-pistache", category: "FLAVOR", name: "فستق إيراني فاخر وماء زهر البرتقال", nameAr: "فستق إيراني فاخر وماء زهر البرتقال", priceDZD: 1500 },

  // الحشوات الكريمة
  { id: "fil-praline", category: "FILLING", name: "براليني مقرمش بالبندق المحمص والشوكولاتة", nameAr: "براليني مقرمش بالبندق المحمص والشوكولاتة", priceDZD: 1200 },
  { id: "fil-caramel", category: "FILLING", name: "كراميل زبدة مملحة وجوز بيكان محمص", nameAr: "كراميل زبدة مملحة وجوز بيكان محمص", priceDZD: 1000 },
  { id: "fil-fruits-rouges", category: "FILLING", name: "كمبوت الفواكه الحمراء وتوت العليق الطازج", nameAr: "كمبوت الفواكه الحمراء وتوت العليق الطازج", priceDZD: 1400 },
  { id: "fil-kinder", category: "FILLING", name: "غاناش كيندر بوينو ولواكر مقرمش", nameAr: "غاناش كيندر بوينو ولواكر مقرمش", priceDZD: 1300 },

  // اللون الخارجي والتغطية
  { id: "col-blanc", category: "COLOR", name: "أبيض عاجي ناعم كلاسيكي (Blanc Nacré)", nameAr: "أبيض عاجي ناعم كلاسيكي (Blanc Nacré)", priceDZD: 0, colorHex: "#FFFDF9" },
  { id: "col-rose", category: "COLOR", name: "وردي باستيل ناعم أنيق (Rose Poudré)", nameAr: "وردي باستيل ناعم أنيق (Rose Poudré)", priceDZD: 500, colorHex: "#FAD2E1" },
  { id: "col-or", category: "COLOR", name: "ذهبي ملكي مع ترخيم فاخر (Doré Royal)", nameAr: "ذهبي ملكي مع ترخيم فاخر (Doré Royal)", priceDZD: 1500, colorHex: "#E5CD6E" },
  { id: "col-choc", category: "COLOR", name: "شوكولاتة دافئة مع ورق الذهب", nameAr: "شوكولاتة دافئة مع ورق الذهب", priceDZD: 1200, colorHex: "#3D2D20" },

  // الزينة والورود
  { id: "top-macarons", category: "TOPPING", name: "تاج من 8 حبات ماكارون مشكلة", nameAr: "تاج من 8 حبات ماكارون مشكلة", priceDZD: 1400 },
  { id: "top-fleurs", category: "TOPPING", name: "باقة ورود طبيعية معقمة صالحة للحلويات", nameAr: "باقة ورود طبيعية معقمة صالحة للحلويات", priceDZD: 2200 },
  { id: "top-or", category: "TOPPING", name: "تذهيب بورق الذهب الخالص عيار 24 قيراط", nameAr: "تذهيب بورق الذهب الخالص عيار 24 قيراط", priceDZD: 1800 },
  { id: "top-choc-drip", category: "TOPPING", name: "شلال دريب ذهبي أو شوكولاتة مرآة لامعة", nameAr: "شلال دريب ذهبي أو شوكولاتة مرآة لامعة", priceDZD: 800 },

  // المجسمات ثلاثية الأبعاد والصور
  { id: "ext-topper-nom", category: "EXTRA_3D", name: "توبر أكريليك مذهب بالاسم والسن (خط عربي فاخر)", nameAr: "توبر أكريليك مذهب بالاسم والسن (خط عربي فاخر)", priceDZD: 1200 },
  { id: "ext-photo-alimentaire", category: "EXTRA_3D", name: "طباعة صورة شخصية غذائية عالية الدقة (ورق سكر)", nameAr: "طباعة صورة شخصية غذائية عالية الدقة (ورق سكر)", priceDZD: 1500 },
  { id: "ext-figurine-3d", category: "EXTRA_3D", name: "مجسم سكري 3D منحوت يدوياً (شخصية أو ثيم)", nameAr: "مجسم سكري 3D منحوت يدوياً (شخصية أو ثيم)", priceDZD: 3500 }
];
