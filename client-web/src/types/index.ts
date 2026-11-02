export interface Wilaya {
  code: number;
  name: string;
  nameAr: string;
}

export interface Artisan {
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

export interface Product {
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

export interface TrackingStep {
  stepId: number;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  status: string;
  completed: boolean;
  completedAt?: string;
  photoProofUrl?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  artisanId: string;
  artisanName: string;
  customerName: string;
  customerPhone: string;
  customerIdDocType: "CNI" | "PASSEPORT" | "PERMIS";
  customerIdDocNumber: string;
  deliveryWilayaCode: number;
  deliveryWilayaName: string;
  deliveryAddress: string;
  eventDate: string;
  isB2B: boolean;
  companyName?: string;
  companyNIF?: string;
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
  totalPriceDZD: number;
  notes?: string;
  createdAt: string;
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
