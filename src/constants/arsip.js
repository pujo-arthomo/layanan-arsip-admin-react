export const TINGKAT_PERKEMBANGAN_OPTIONS = ["Asli", "Salinan", "Duplikat"];

export function bersihkanRetribusi(value) {
  if (!value) return "0";
  let s = String(value).trim();
  s = s.replace(/rp\.?/gi, "").trim();
  s = s.split(",")[0];
  s = s.replace(/\D/g, "");
  return s || "0";
}

export function formatRupiah(value) {
  const angka = Number(value) || 0;
  return `Rp. ${angka.toLocaleString("id-ID")}`;
}