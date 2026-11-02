/**
 * تنسيق المبالغ المالية بالدينار الجزائري بدون فواصل (تجنباً للبس مع السنتيم)
 * Format monetary amounts in Algerian Dinars without commas, using spaces for thousands
 * @example formatDZD(38000) => "38 000"
 */
export const formatDZD = (amount: number): string => {
  if (typeof amount !== 'number' || isNaN(amount)) return '0';
  return Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

