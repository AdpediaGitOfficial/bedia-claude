/**
 * Derives the clay type for a gift voucher from a booking item's optionTitle.
 *
 * optionTitle looks like "Air-Dry Clay - Kids" or "Ceramic Clay - Adults".
 * The trailing " - Kids"/" - Adults" audience suffix is stripped so only the
 * clay type remains (e.g. "Air-Dry Clay", "Ceramic Clay").
 */
export const deriveClayType = (optionTitle?: string | null): string => {
  return (optionTitle || '').replace(/\s*-\s*(Kids|Adults)\s*$/i, '').trim();
};
