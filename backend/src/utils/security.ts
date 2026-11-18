/**
 * Utilitaires de sécurité et d'assainissement pour l'API Pâtisserie DZ
 * Conformité : Loi 18-07 relative à la protection des données à caractère personnel
 */

// Regex pour vérifier un numéro de téléphone algérien valide (Mobilis, Djezzy, Ooredoo)
export const ALGERIA_PHONE_REGEX = /^(0|\+213)[5-7][0-9]{8}$/;

/**
 * Nettoie une chaîne de caractères en supprimant les balises HTML et les scripts malveillants (Anti-XSS)
 */
export function sanitizeString(input?: string | null): string {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
}

/**
 * Masque un numéro de téléphone pour préserver la vie privée (ex: 0550112233 -> 0550 •••• 33)
 */
export function maskPhoneNumber(phone?: string | null): string {
  if (!phone || typeof phone !== "string") return "";
  const cleaned = phone.trim().replace(/\s+/g, "");
  if (cleaned.length < 8) return "••••••••";
  const start = cleaned.substring(0, 4);
  const end = cleaned.substring(cleaned.length - 2);
  return `${start} •••• ${end}`;
}

/**
 * Masque le numéro de document d'identité CNI / Passeport (ex: 109876543210 -> 1098 •••• 10)
 */
export function maskIdDocNumber(doc?: string | null): string {
  if (!doc || typeof doc !== "string") return "";
  const trimmed = doc.trim();
  if (trimmed.length <= 4) return "••••";
  const start = trimmed.substring(0, Math.min(4, trimmed.length - 2));
  const end = trimmed.substring(trimmed.length - 2);
  return `${start} •••• ${end}`;
}

/**
 * Masque une adresse de livraison pour n'afficher que la commune/wilaya (masquage rue/étage/numéro)
 */
export function maskAddress(address?: string | null, wilayaName?: string | null): string {
  if (!address || typeof address !== "string") return wilayaName ? `ولاية ${wilayaName}` : "";
  const parts = address.split(/[,\-–]/).map((p) => p.trim()).filter(Boolean);
  if (parts.length > 1) {
    const broadArea = parts[parts.length - 1];
    return `${broadArea} (العنوان التفصيلي محمي للخصوصية)`;
  }
  return wilayaName ? `${wilayaName} (تفاصيل التوصيل محمية)` : "العنوان محمي وفق قانون حماية البيانات 18-07";
}

/**
 * Masque les données PII sensibles d'une commande pour le suivi public non-authentifié
 */
export function maskOrderForPublic(order: any): any {
  if (!order) return order;
  return {
    ...order,
    customerPhone: maskPhoneNumber(order.customerPhone),
    customerIdDocNumber: maskIdDocNumber(order.customerIdDocNumber),
    deliveryAddress: maskAddress(order.deliveryAddress, order.deliveryWilayaName),
    companyNIF: order.companyNIF ? maskIdDocNumber(order.companyNIF) : undefined,
    isDataProtected: true
  };
}

/**
 * Valide et nettoie les données d'une commande
 */
export function sanitizeOrderInput(data: any) {
  return {
    customerName: sanitizeString(data.customerName),
    customerPhone: sanitizeString(data.customerPhone).replace(/\s+/g, ""),
    deliveryAddress: sanitizeString(data.deliveryAddress),
    customerIdDocNumber: sanitizeString(data.customerIdDocNumber),
    companyName: data.companyName ? sanitizeString(data.companyName) : undefined,
    companyNIF: data.companyNIF ? sanitizeString(data.companyNIF) : undefined,
    notes: data.notes ? sanitizeString(data.notes) : undefined,
    messageOnCake: data.customization?.messageOnCake ? sanitizeString(data.customization.messageOnCake) : undefined
  };
}

/**
 * Valide un upload d'image Base64
 */
export function validateBase64Image(base64String: string): { valid: boolean; error?: string; mime?: string; buffer?: Buffer } {
  if (!base64String || typeof base64String !== "string") {
    return { valid: false, error: "Aucune donnée image fournie" };
  }

  // Vérifier format standard data URI
  const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    // Si c'est déjà une URL relative ou HTTP
    if (base64String.startsWith("http") || base64String.startsWith("/")) {
      return { valid: true };
    }
    return { valid: false, error: "Format Base64 non reconnu" };
  }

  const mime = matches[1].toLowerCase();
  const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (!allowedMimes.includes(mime)) {
    return { valid: false, error: `Type MIME non autorisé (${mime}). Types acceptés : JPEG, PNG, WEBP` };
  }

  const buffer = Buffer.from(matches[2], "base64");
  const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 Mo

  if (buffer.length > MAX_SIZE_BYTES) {
    return { valid: false, error: `Image trop volumineuse (${(buffer.length / 1024 / 1024).toFixed(1)} Mo). Limite : 5 Mo` };
  }

  return { valid: true, mime, buffer };
}

