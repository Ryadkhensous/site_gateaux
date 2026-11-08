import { WILAYAS_DZ, Wilaya } from "../data/wilayas.js";
import {
  INITIAL_ARTISANS,
  INITIAL_PRODUCTS,
  CUSTOMIZATION_OPTIONS,
  ArtisanData,
  ProductData,
  CustomizationOption
} from "../data/initialData.js";

export interface OrderItem {
  id: string;
  orderNumber: string;
  clientId?: string;
  artisanId: string;
  artisanName: string;
  productId?: string;
  productName?: string;
  // Identité du client
  customerName: string;
  customerPhone: string;
  customerIdDocType: "CNI" | "PASSEPORT" | "PERMIS";
  customerIdDocNumber: string;
  // Logistique en Algérie
  deliveryWilayaCode: number;
  deliveryWilayaName: string;
  deliveryAddress: string;
  eventDate: string;
  // B2B
  isB2B: boolean;
  companyName?: string;
  companyNIF?: string;
  // Statut & Paiement
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING_BASE"
    | "BAKING_ASSEMBLY"
    | "DECORATING"
    | "READY"
    | "DELIVERING"
    | "DELIVERED"
    | "CANCELLED";
  paymentMethod: "CASH_ON_DELIVERY" | "CIB_EDAHABIA" | "BANK_TRANSFER" | "BARIDIMOB";
  paymentType?: "FULL" | "DEPOSIT_30" | "DEPOSIT_50" | "DEPOSIT_CUSTOM";
  depositAmountDZD?: number;
  remainingAmountDZD?: number;
  isDepositPaid?: boolean;
  receiptNumber?: string;
  totalPriceDZD: number;
  notes?: string;
  createdAt: string;
  // Personnalisation
  customization?: {
    sizeName?: string;
    servingsCount?: number;
    flavorName?: string;
    fillingName?: string;
    colorHex?: string;
    colorName?: string;
    toppingsList?: string[];
    extra3dType?: string;
    photoUrl?: string;
    messageOnCake?: string;
  };
  trackingSteps: TrackingStep[];
}

export interface TrackingStep {
  stepId: number;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  status: OrderItem["status"];
  completed: boolean;
  completedAt?: string;
  photoProofUrl?: string;
}

export const DEFAULT_TRACKING_STEPS: { stepId: number; title: string; titleAr: string; description: string; descriptionAr: string; status: OrderItem["status"] }[] = [
  {
    stepId: 1,
    title: "Commande reçue & Validée",
    titleAr: "تم تأكيد وقبول الطلب في الورشة",
    description: "L'artisan a vérifié votre commande et réservé le créneau dans son atelier.",
    descriptionAr: "قام الحرفي بمراجعة كافة تفاصيل طلبكم وحجز موعد التصنيع في الورشة.",
    status: "CONFIRMED"
  },
  {
    stepId: 2,
    title: "Préparation des bases & Génoises",
    titleAr: "تحضير المكونات وخبز الجينواز",
    description: "Pesée des ingrédients nobles, préparation et cuisson au four des génoises moelleuses.",
    descriptionAr: "وزن المكونات الفاخرة، خلط وخفق العجين وخبز طبقات الجينواز الهشة في الفرن.",
    status: "PREPARING_BASE"
  },
  {
    stepId: 3,
    title: "Fourrage & Montage des étages",
    titleAr: "حشو الكعكة وتركيب الطبقات",
    description: "Application des ganaches, croustillants et structuration des étages du gâteau.",
    descriptionAr: "فرد طبقات الغاناش الغنية، حشوات البراليني المقرمشة وبناء توازن الطبقات بدقة.",
    status: "BAKING_ASSEMBLY"
  },
  {
    stepId: 4,
    title: "Glaçage & Décoration artistique",
    titleAr: "التغليف والتزيين الفني المخصص",
    description: "Glaçage personnalisé, modelage des figurines 3D, fleurs fraîches et finitions dorées.",
    descriptionAr: "تطبيق التغليف الملون المختار، نحت المجسمات 3D، وتثبيت الورود الطبيعية وأوراق الذهب.",
    status: "DECORATING"
  },
  {
    stepId: 5,
    title: "Contrôle qualité & Mise en boîte",
    titleAr: "جلسة التصوير ومراقبة الجودة والتغليف",
    description: "Vérification rigoureuse du gâteau, mise en boîte isotherme sécurisée.",
    descriptionAr: "التقاط صورة الإثبات النهائية ومطابقة المواصفات قبل وضعها في الصندوق العازل الفاخر.",
    status: "READY"
  },
  {
    stepId: 6,
    title: "En route pour la livraison",
    titleAr: "الشحن في النقل المبرد الآمن",
    description: "Pris en charge par notre livreur spécialisé équipé pour le transport réfrigéré.",
    descriptionAr: "تسليم الكعكة للمندوب المعتمد والمجهز بنظام تبريد للحفاظ على سلامة ونضارة الحلويات.",
    status: "DELIVERING"
  },
  {
    stepId: 7,
    title: "Livraison effectuée avec succès",
    titleAr: "تم التسليم بنجاح للزبون",
    description: "Gâteau remis en mains propres au client pour sa célébration.",
    descriptionAr: "تسليم الكعكة باليد إلى الزبون للاحتفال بأجمل اللحظات وأحلاها.",
    status: "DELIVERED"
  }
];

class MemoryStore {
  public wilayas: Wilaya[] = [...WILAYAS_DZ];
  public artisans: ArtisanData[] = [...INITIAL_ARTISANS];
  public products: ProductData[] = [...INITIAL_PRODUCTS];
  public customizationOptions: CustomizationOption[] = [...CUSTOMIZATION_OPTIONS];
  public orders: OrderItem[] = [];
  public users: any[] = [];

  constructor() {
    this.seedDemoOrders();
  }

  private seedDemoOrders() {
    const demoOrder: OrderItem = {
      id: "ord-dz-101",
      orderNumber: "CMD-2026-DZ001",
      artisanId: "art-1",
      artisanName: "Les Délices d'Alger",
      customerName: "Riad Mahrez",
      customerPhone: "0555 12 34 56",
      customerIdDocType: "CNI",
      customerIdDocNumber: "109823475612",
      deliveryWilayaCode: 16,
      deliveryWilayaName: "Alger",
      deliveryAddress: "12 Rue Didouche Mourad, Alger Centre",
      eventDate: "2026-11-05T15:00:00.000Z",
      isB2B: false,
      status: "DECORATING",
      paymentMethod: "CIB_EDAHABIA",
      totalPriceDZD: 13900,
      notes: "Écrire 'Joyeux Anniversaire Amina' en calligraphie dorée",
      createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      customization: {
        sizeName: "1 Étage Haut (15 - 20 parts)",
        servingsCount: 18,
        flavorName: "Génoise Moelleuse Vanille Bourbon",
        fillingName: "Ganache Kinder Bueno & Croustillant",
        colorHex: "#FAFAFA",
        colorName: "Blanc Pur & Nacre",
        toppingsList: ["Couronne de 8 Macarons assortis", "Dorure à la Feuille d'Or 24 carats"],
        extra3dType: "Figurine Thème 3D (Héros, Personnage, Objet sculpté)",
        messageOnCake: "Joyeux Anniversaire Amina"
      },
      trackingSteps: DEFAULT_TRACKING_STEPS.map((step) => {
        if (step.stepId === 1) {
          return {
            ...step,
            completed: true,
            completedAt: new Date(Date.now() - 30 * 3600 * 1000).toISOString()
          };
        }
        if (step.stepId === 2) {
          return {
            ...step,
            completed: true,
            completedAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString()
          };
        }
        if (step.stepId === 3) {
          return {
            ...step,
            completed: true,
            completedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString()
          };
        }
        if (step.stepId === 4) {
          return {
            ...step,
            completed: false,
            photoProofUrl: "/images/chocolate_praline_layer_cake.jpg"
          };
        }
        return {
          ...step,
          completed: false
        };
      })
    };

    const b2bOrder: OrderItem = {
      id: "ord-dz-102",
      orderNumber: "CMD-2026-DZ002",
      artisanId: "art-2",
      artisanName: "Palais de la Pâtisserie Constantine",
      customerName: "SARL Numidia Tech",
      customerPhone: "031 92 11 22",
      customerIdDocType: "CNI",
      customerIdDocNumber: "201948576123",
      deliveryWilayaCode: 25,
      deliveryWilayaName: "Constantine",
      deliveryAddress: "Zone Industrielle Le Rhumel, Constantine",
      eventDate: "2026-11-08T09:00:00.000Z",
      isB2B: true,
      companyName: "SARL Numidia Tech",
      companyNIF: "001825019283746",
      status: "CONFIRMED",
      paymentMethod: "BANK_TRANSFER",
      totalPriceDZD: 45000,
      notes: "Séminaire annuel des cadres d'entreprise. Facture avec TVA requise.",
      createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      trackingSteps: DEFAULT_TRACKING_STEPS.map((step, idx) => ({
        ...step,
        completed: idx === 0,
        completedAt: idx === 0 ? new Date().toISOString() : undefined
      }))
    };

    this.orders.push(demoOrder, b2bOrder);
  }
}

export const store = new MemoryStore();

