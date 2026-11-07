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
    rating: 4.9,
    reviewsCount: 142,
    bio: "حرفية معتمدة ومتخصصة في كعكات الأعراس الملكية والحلويات المصنوعة يدوياً بورق الذهب عيار 24 قيراط وتصاميم ثلاثية الأبعاد.",
    bioAr: "حرفية معتمدة ومتخصصة في كعكات الأعراس الملكية والحلويات المصنوعة يدوياً بورق الذهب عيار 24 قيراط وتصاميم ثلاثية الأبعاد.",
    avatar: "/images/artisan_pastry_chef.jpg",
    banner: "/images/hero_wedding_cake.jpg",
    specialties: ["كعكات أعراس ملكية", "لاير كيك براليني", "ماكارون فرنسي فاخر", "مجسمات سكرية 3D"],
    specialtiesAr: ["كعكات أعراس ملكية", "لاير كيك براليني", "ماكارون فرنسي فاخر", "مجسمات سكرية 3D"]
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
    bio: "وريث خبرة عائلية لأكثر من 30 عاماً في صناعة الحلويات التقليدية القسنطينية وبوفيهات الشركات والمناسبات الرسمية.",
    bioAr: "وريث خبرة عائلية لأكثر من 30 عاماً في صناعة الحلويات التقليدية القسنطينية وبوفيهات الشركات والمناسبات الرسمية.",
    avatar: "/images/traditional_algerian_sweets.jpg",
    banner: "/images/traditional_algerian_sweets.jpg",
    specialties: ["بقلاوة قسنطينية بالعسل الحر", "مقروط اللوز", "دزيريات ملكية", "بوفيهات الشركات B2B"],
    specialtiesAr: ["بقلاوة قسنطينية بالعسل الحر", "مقروط اللوز", "دزيريات ملكية", "بوفيهات الشركات B2B"]
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
    reviewsCount: 176,
    bio: "مصممة كعكات أعياد الميلاد بالأرقام والحروف والطبقات الغنية بالشوكولاتة مع متابعة مراحل التصنيع بالصور المباشرة.",
    bioAr: "مصممة كعكات أعياد الميلاد بالأرقام والحروف والطبقات الغنية بالشوكولاتة مع متابعة مراحل التصنيع بالصور المباشرة.",
    avatar: "/images/number_cake_fruits.jpg",
    banner: "/images/chocolate_praline_layer_cake.jpg",
    specialties: ["نمبر كيك بالفواكه وماكارون", "بينتو كيك عصري", "توبرز بالخط العربي 3D", "طلبيات الحفلات العائلية"],
    specialtiesAr: ["نمبر كيك بالفواكه وماكارون", "بينتو كيك عصري", "توبرز بالخط العربي 3D", "طلبيات الحفلات العائلية"]
  }
];

export const INITIAL_PRODUCTS: ProductData[] = [
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
    id: "prod-3",
    artisanId: "art-2",
    name: "صينية الضيافة الملكية للحلويات التقليدية الجزائرية",
    nameAr: "صينية الضيافة الملكية للحلويات التقليدية الجزائرية",
    category: "TRADITIONNEL",
    categoryAr: "حلويات جزائرية أصيلة",
    description: "تشكيلة راقية على صينية نحاسية تقليدية: مقروط اللوز بنكهة الليمون، بقلاوة قسنطينية بالعسل الصافي واللوز، تشاراك العريان ودزيريات ملكية.",
    descriptionAr: "تشكيلة راقية على صينية نحاسية تقليدية: مقروط اللوز بنكهة الليمون، بقلاوة قسنطينية بالعسل الصافي واللوز، تشاراك العريان ودزيريات ملكية.",
    priceDZD: 16500,
    servings: 30,
    prepTimeDays: 4,
    imageUrl: "/images/traditional_algerian_sweets.jpg",
    isCustomizable: false,
    tags: ["تقليدي", "قسنطينة", "عسل حر", "أفراح"]
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
  },
  {
    id: "prod-7",
    artisanId: "art-3",
    name: "كعكة ريد فيلفيت المخملية بالجبن الكريمي",
    nameAr: "كعكة ريد فيلفيت المخملية بالجبن الكريمي",
    category: "MODERNE",
    categoryAr: "ريد فيلفيت وكريم تشيز",
    description: "جينواز ريد فيلفيت غنية ولينة بلونها القرمزي المميز، محشوة ومغطاة بكريمة الجبن اللذيذة ومزينة بفتات الكعك المخملي.",
    descriptionAr: "جينواز ريد فيلفيت غنية ولينة بلونها القرمزي المميز، محشوة ومغطاة بكريمة الجبن اللذيذة ومزينة بفتات الكعك المخملي.",
    priceDZD: 2699,
    servings: 10,
    prepTimeDays: 2,
    imageUrl: "/images/bestseller_red_velvet.jpg",
    isCustomizable: true,
    tags: ["ريد فيلفيت", "الأكثر مبيعاً", "فانيلا"]
  },
  {
    id: "prod-8",
    artisanId: "art-1",
    name: "كعكة الغابة السوداء الأصلية بالكرز والشوكولاتة",
    nameAr: "كعكة الغابة السوداء الأصلية بالكرز والشوكولاتة",
    category: "MODERNE",
    categoryAr: "بلاك فوريست وشوكولاتة",
    description: "الكعكة الكلاسيكية الشهيرة بطبقات الكاكاو الهشة، كريمة شانتيه مخفوقة طازجة، حبات الكرز الأسود اللامعة ورقائق الشوكولاتة الداكنة.",
    descriptionAr: "الكعكة الكلاسيكية الشهيرة بطبقات الكاكاو الهشة، كريمة شانتيه مخفوقة طازجة، حبات الكرز الأسود اللامعة ورقائق الشوكولاتة الداكنة.",
    priceDZD: 2399,
    servings: 10,
    prepTimeDays: 2,
    imageUrl: "/images/bestseller_black_forest.jpg",
    isCustomizable: true,
    tags: ["بلاك فوريست", "كرز", "شوكولاتة", "كلاسيكي"]
  },
  {
    id: "prod-9",
    artisanId: "art-3",
    name: "كعكة المانجو والفواكه الاستوائية بصوص الميروار",
    nameAr: "كعكة المانجو والفواكه الاستوائية بصوص الميروار",
    category: "MODERNE",
    categoryAr: "فواكه استوائية ومنعشة",
    description: "كعكة فواكه استوائية مفعمة بالحيوية مع صصوص مانجو مرآة براق ينسدل على الجوانب، وردات مانجو طازجة ولمسات من النعناع الأخضر المنعش.",
    descriptionAr: "كعكة فواكه استوائية مفعمة بالحيوية مع صوص مانجو مرآة براق ينسدل على الجوانب، وردات مانجو طازجة ولمسات من النعناع الأخضر المنعش.",
    priceDZD: 2299,
    servings: 10,
    prepTimeDays: 2,
    imageUrl: "/images/bestseller_mango.jpg",
    isCustomizable: true,
    tags: ["مانجو", "فواكه", "صيف", "انتعاش"]
  },
  {
    id: "prod-10",
    artisanId: "art-1",
    name: "كعكة الاحتفالات الفاخرة بشلال الشوكولاتة الداكنة",
    nameAr: "كعكة الاحتفالات الفاخرة بشلال الشوكولاتة الداكنة",
    category: "MODERNE",
    categoryAr: "احتفالات وشوكولاتة فاخرة",
    description: "كعكة احتفالية غنية بطبقات كاكاو إكسترا، صوص شوكولاتة ذائب وتزيين فخم يدوي يضفي البهجة على كل مناسبة.",
    descriptionAr: "كعكة احتفالية غنية بطبقات كاكاو إكسترا، صوص شوكولاتة ذائب وتزيين فخم يدوي يضفي البهجة على كل مناسبة.",
    priceDZD: 3800,
    servings: 12,
    prepTimeDays: 2,
    imageUrl: "/images/category_birthday_cake.jpg",
    isCustomizable: true,
    tags: ["احتفال", "شوكولاتة", "حفلات"]
  },
  {
    id: "prod-11",
    artisanId: "art-3",
    name: "كعكة ذكرى الزواج والخطوبة بالزهور الطبيعية واللؤلؤ",
    nameAr: "كعكة ذكرى الزواج والخطوبة بالزهور الطبيعية واللؤلؤ",
    category: "MARIAGE",
    categoryAr: "ذكرى زواج وخطوبة",
    description: "تصميم أنيق ورومانسي مزين بباقة ورود طبيعية معقمة، لآلئ السكر البيضاء الفاخرة وتغليف زبدة سويسرية كريمية بلون عاجي راقٍ.",
    descriptionAr: "تصميم أنيق ورومانسي مزين بباقة ورود طبيعية معقمة، لآلئ السكر البيضاء الفاخرة وتغليف زبدة سويسرية كريمية بلون عاجي راقٍ.",
    priceDZD: 4200,
    servings: 12,
    prepTimeDays: 2,
    imageUrl: "/images/category_anniversary_cake.jpg",
    isCustomizable: true,
    tags: ["ذكرى زواج", "خطوبة", "ورود طبيعية", "رومانسي"]
  },
  {
    id: "prod-12",
    artisanId: "art-3",
    name: "كعكة الصور الشخصية المطبوعة على ورق السكر عالي الجودة",
    nameAr: "كعكة الصور الشخصية المطبوعة على ورق السكر عالي الجودة",
    category: "MODERNE",
    categoryAr: "كعكات الصور المطبوعة",
    description: "اطبع صورتك المفضلة أو صورة من تحب بدقة ألوان فائقة على ورق سكر غذائي صالح للأكل، محاطة بإكليل ورد ناعم وغاناش الفانيلا اللذيذ.",
    descriptionAr: "اطبع صورتك المفضلة أو صورة من تحب بدقة ألوان فائقة على ورق سكر غذائي صالح للأكل، محاطة بإكليل ورد ناعم وغاناش الفانيلا اللذيذ.",
    priceDZD: 3200,
    servings: 10,
    prepTimeDays: 1,
    imageUrl: "/images/category_photo_cake.jpg",
    isCustomizable: true,
    tags: ["صورة شخصية", "طباعة غذائية", "أطفال", "تخرج"]
  },
  {
    id: "prod-13",
    artisanId: "art-1",
    name: "بوكس الكب كيك والماكارون الفرنسي الفاخر بنكهات التوت",
    nameAr: "بوكس الكب كيك والماكارون الفرنسي الفاخر بنكهات التوت",
    category: "MODERNE",
    categoryAr: "كب كيك وماكارون فاخر",
    description: "تشكيلة ساحرة من 12 قطعة كب كيك ميني مع حبات ماكارون فرنسي باريسي محشو بمربى توت العليق الطازج وغاناش الشوكولاتة البيضاء.",
    descriptionAr: "تشكيلة ساحرة من 12 قطعة كب كيك ميني مع حبات ماكارون فرنسي باريسي محشو بمربى توت العليق الطازج وغاناش الشوكولاتة البيضاء.",
    priceDZD: 1950,
    servings: 8,
    prepTimeDays: 1,
    imageUrl: "/images/category_cupcakes.jpg",
    isCustomizable: false,
    tags: ["كب كيك", "ماكارون", "توت", "ضيافة"]
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
    id: "prod-15",
    artisanId: "art-1",
    name: "كعكة المهيبة والخطوبة الملكية طابقين بترخيم ذهبي",
    nameAr: "كعكة المهيبة والخطوبة الملكية طابقين بترخيم ذهبي",
    category: "MARIAGE",
    categoryAr: "خطوبة ومهيبة",
    description: "طابقان متناسقان بارتفاع شاهق وتأثير رخامي وردي مذهب، ورود سكرية منحوتة يدوياً وحشوة غاناش الكيندر بوينو المقرمشة.",
    descriptionAr: "طابقان متناسقان بارتفاع شاهق وتأثير رخامي وردي مذهب، ورود سكرية منحوتة يدوياً وحشوة غاناش الكيندر بوينو المقرمشة.",
    priceDZD: 18500,
    servings: 35,
    prepTimeDays: 4,
    imageUrl: "/images/cake_preview_2tiers.jpg",
    isCustomizable: true,
    tags: ["خطوبة", "مهيبة", "طابقين", "ترخيم ذهبي"]
  },
  {
    id: "prod-16",
    artisanId: "art-2",
    name: "كعكة قصور الأعراس الفخمة 3 طوابق مع تذهيب ملكي",
    nameAr: "كعكة قصور الأعراس الفخمة 3 طوابق مع تذهيب ملكي",
    category: "MARIAGE",
    categoryAr: "أعراس كبرى",
    description: "تحفة معمارية سكرية لليالي العمر والأفراح الكبرى، 3 طبقات محشوة بالبراليني والمكسرات الجزائرية الفاخرة مع إضاءة خفية وقاعدة نحاسية.",
    descriptionAr: "تحفة معمارية سكرية لليالي العمر والأفراح الكبرى، 3 طبقات محشوة بالبراليني والمكسرات الجزائرية الفاخرة مع إضاءة خفية وقاعدة نحاسية.",
    priceDZD: 34000,
    servings: 55,
    prepTimeDays: 6,
    imageUrl: "/images/cake_preview_3tiers.jpg",
    isCustomizable: true,
    tags: ["أعراس كبرى", "3 طوابق", "ملكي", "ذهب"]
  },
  {
    id: "prod-17",
    artisanId: "art-1",
    name: "لاير كيك مرتفع بريستيج مع سيلان الكراميل والغاناش",
    nameAr: "لاير كيك مرتفع بريستيج مع سيلان الكراميل والغاناش",
    category: "MODERNE",
    categoryAr: "لاير كيك بريستيج",
    description: "كعكة مرتفعة بتصميم عمودي جذاب، شلال كراميل زبدة مالحة ينسدل من الأعلى مع حبات بيكان مكرملة وشوكولاتة روشيه مقرمشة.",
    descriptionAr: "كعكة مرتفعة بتصميم عمودي جذاب، شلال كراميل زبدة مالحة ينسدل من الأعلى مع حبات بيكان مكرملة وشوكولاتة روشيه مقرمشة.",
    priceDZD: 5600,
    servings: 15,
    prepTimeDays: 2,
    imageUrl: "/images/cake_preview_1tier_tall.jpg",
    isCustomizable: true,
    tags: ["لاير كيك", "كراميل", "بيكان", "مرتفع"]
  },
  {
    id: "prod-18",
    artisanId: "art-2",
    name: "بقلاوة قسنطينية ملكية بالجوز واللوز والعسل الصافي",
    nameAr: "بقلاوة قسنطينية ملكية بالجوز واللوز والعسل الصافي",
    category: "TRADITIONNEL",
    categoryAr: "حلويات جزائرية تقليدية",
    description: "بقلاوة جزائرية قسنطينية مورقة ومقرمشة بطبقات السمن الطبيعي، محشوة باللوز والجوز ومسقية بالعسل الحر المصفى مع حبات لوز محمصة كاملة.",
    descriptionAr: "بقلاوة جزائرية قسنطينية مورقة ومقرمشة بطبقات السمن الطبيعي، محشوة باللوز والجوز ومسقية بالعسل الحر المصفى مع حبات لوز محمصة كاملة.",
    priceDZD: 7500,
    servings: 24,
    prepTimeDays: 2,
    imageUrl: "/images/traditional_baklawa.jpg",
    isCustomizable: false,
    tags: ["بقلاوة", "قسنطينة", "لوز وجوز", "عسل حر", "أفراح"]
  },
  {
    id: "prod-19",
    artisanId: "art-1",
    name: "مقروط اللوز العاصمي بماء الزهر والليمون",
    nameAr: "مقروط اللوز العاصمي بماء الزهر والليمون",
    category: "TRADITIONNEL",
    categoryAr: "حلويات جزائرية تقليدية",
    description: "مقروط اللوز التقليدي الجزائري الأصيل، طري ويذوب في الفم، بنكهة قشور الليمون الطازجة وماء زهر البرتقال المقطر ومغلف بالسكر الناعم الأبيض.",
    descriptionAr: "مقروط اللوز التقليدي الجزائري الأصيل، طري ويذوب في الفم، بنكهة قشور الليمون الطازجة وماء زهر البرتقال المقطر ومغلف بالسكر الناعم الأبيض.",
    priceDZD: 4800,
    servings: 20,
    prepTimeDays: 2,
    imageUrl: "/images/traditional_makroud_el_louz.jpg",
    isCustomizable: false,
    tags: ["مقروط اللوز", "عاصمي", "سكر ناعم", "ليمون", "ماء زهر"]
  },
  {
    id: "prod-20",
    artisanId: "art-1",
    name: "تشاراك المسكر الملكي بالسكر الناعم ولوز بلدي",
    nameAr: "تشاراك المسكر الملكي بالسكر الناعم ولوز بلدي",
    category: "TRADITIONNEL",
    categoryAr: "حلويات جزائرية تقليدية",
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
    artisanId: "art-2",
    name: "دزيريات وقنيدلات العاصمة بريستيج مع لمسات ذهبية",
    nameAr: "دزيريات وقنيدلات العاصمة بريستيج مع لمسات ذهبية",
    category: "TRADITIONNEL",
    categoryAr: "حلويات جزائرية تقليدية",
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
    id: "prod-22",
    artisanId: "art-2",
    name: "صينية العروس والمهيبة الفاخرة للحلويات التقليدية",
    nameAr: "صينية العروس والمهيبة الفاخرة للحلويات التقليدية",
    category: "TRADITIONNEL",
    categoryAr: "صواني الأعراس والمهيبة",
    description: "صينية نحاسية تقليدية مطروقة ومذهبة تضم 45 قطعة مشكلة من أشهى الحلويات: بقلاوة، مقروط اللوز، تشاراك العريان، دزيريات، عرايش وقنيدلات.",
    descriptionAr: "صينية نحاسية تقليدية مطروقة ومذهبة تضم 45 قطعة مشكلة من أشهى الحلويات: بقلاوة، مقروط اللوز، تشاراك العريان، دزيريات، عرايش وقنيدلات.",
    priceDZD: 22000,
    servings: 45,
    prepTimeDays: 4,
    imageUrl: "/images/traditional_algerian_sweets.jpg",
    isCustomizable: false,
    tags: ["صينية العروس", "مهيبة", "أعراس", "تشكيلة ملوكية"]
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

  // الحشوات والغاناش
  { id: "fill-kinder", category: "FILLING", name: "غاناش كيندر بوينو مع قرمشة الوافل", nameAr: "غاناش كيندر بوينو مع قرمشة الوافل", priceDZD: 1200 },
  { id: "fill-praline", category: "FILLING", name: "براليني بندق محمص منزلي وحبيبات مقرمشة", nameAr: "براليني بندق محمص منزلي وحبيبات مقرمشة", priceDZD: 1000 },
  { id: "fill-fruits", category: "FILLING", name: "كريمة التوت المشكل وتوت العليق الطازج", nameAr: "كريمة التوت المشكل وتوت العليق الطازج", priceDZD: 1200 },
  { id: "fill-citron", category: "FILLING", name: "كورد الليمون المتوسطي مع الميرانغ", nameAr: "كورد الليمون المتوسطي مع الميرانغ", priceDZD: 800 },
  { id: "fill-caramel", category: "FILLING", name: "كراميل زبدة مالحة وجوز بيكان", nameAr: "كراميل زبدة مالحة وجوز بيكان", priceDZD: 900 },

  // الألوان والتغليف
  { id: "col-blanc", category: "COLOR", name: "أبيض لؤلؤي مع لمسات ذهبية", nameAr: "أبيض لؤلؤي مع لمسات ذهبية", priceDZD: 0, colorHex: "#FAFAF8" },
  { id: "col-rose", category: "COLOR", name: "وردي ناعم باستيل (Rose Poudré)", nameAr: "وردي ناعم باستيل (Rose Poudré)", priceDZD: 400, colorHex: "#FACDD8" },
  { id: "col-beige", category: "COLOR", name: "بيج مخملي كريمي (Beige Crème)", nameAr: "بيج مخملي كريمي (Beige Crème)", priceDZD: 400, colorHex: "#F5EBE1" },
  { id: "col-pivoine", category: "COLOR", name: "وردي بيوني ساحر (Rose Pivoine)", nameAr: "وردي بيوني ساحر (Rose Pivoine)", priceDZD: 500, colorHex: "#F6A5B9" },
  { id: "col-dore", category: "COLOR", name: "ذهبي ملكي مع ترخيم فاخر (Doré Royal)", nameAr: "ذهبي ملكي مع ترخيم فاخر (Doré Royal)", priceDZD: 1500, colorHex: "#E5CD6E" },
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
