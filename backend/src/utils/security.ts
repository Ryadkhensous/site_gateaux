/**
 * Utilitaires de sécurité et d'assainissement pour l'API Pâtisserie DZ
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
