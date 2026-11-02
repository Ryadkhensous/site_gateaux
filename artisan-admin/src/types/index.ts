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

export interface CustomizationData {
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
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  artisanId: string;
  artisanName: string;
  productId?: string;
  productName?: string;
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
  paymentMethod: "CASH_ON_DELIVERY" | "CIB_EDAHABIA" | "BANK_TRANSFER";
  totalPriceDZD: number;
  notes?: string;
  createdAt: string;
  customization?: CustomizationData;
  trackingSteps: TrackingStep[];
}

export interface ProductItem {
  id: string;
  artisanId: string;
  name: string;
  nameAr?: string;
  category: string;
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

export type Product = ProductItem;

export interface ArtisanProfile {
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
}
