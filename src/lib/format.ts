/** Price helpers — all product prices are stored as integer cents (IDR sen). */

export const formatRupiah = (cents: number): string => {
  const rupiah = Math.round(cents);
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(rupiah);
};

/** For short inline price text without currency symbol clutter. */
export const formatRupiahShort = (cents: number): string => {
  const rupiah = Math.round(cents);
  return new Intl.NumberFormat('id-ID').format(rupiah);
};

export const pluralize = (n: number, singular: string, plural?: string) =>
  n === 1 ? singular : plural ?? `${singular}s`;
