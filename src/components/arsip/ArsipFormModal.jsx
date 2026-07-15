import { useState, useEffect } from "react";
import { uploadArsipFile } from "../../services/arsipService";
import { TINGKAT_PERKEMBANGAN_OPTIONS } from "../../constants/arsip";

const KOSONG = {
  no_berkas: "",
  kode_klasifikasi: "",
  lokasi_bangunan: "",
  jenis_bangunan: "",
  kurun_waktu: "",
  jumlah_arsip: "",
  tingkat_perkembangan: "Asli",
  retribusi: "",
  keterangan_boks: "",
};

const inputClass =
  "w-full border border-[#DDD3BC] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F]";

function ArsipFormModal({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState(KOSONG);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const isEdit = Boolean(initialData);

  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? {
              no_berkas: initialData.no_berkas ?? "",
              kode_klasifikasi: initialData.kode_klasifikasi ?? "",
              lokasi_bangunan: initialData.lokasi_bangunan ?? "",
              jenis_bangunan: initialData.jenis_bangunan ?? "",
              kurun_waktu: initialData.kurun_waktu ?? "",
              jumlah_arsip: initialData.jumlah_arsip ?? "",
              tingkat_perkembangan: initialData.tingkat_perkembangan ?? "Asli",
              retribusi: initialData.retribusi ?? "",
              keterangan_boks: initialData.keterangan_boks ?? "",
            }
          : KOSONG
      );
      setFile(null);
      setError(null);
    }
  }, [open, initialData]);

  if (!open) return null;

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    let file_path = initialData?.file_path ?? null;

    if (file) {
      const { path, error: uploadError } = await uploadArsipFile(file);
      if (uploadError) {
        setError(`Gagal upload file: ${uploadError.message}`);
        setSaving(false);
        return;
      }
      file_path = path;
    }

    const payload = {
      ...form,
      file_path,
    };

    const { error } = await onSubmit(payload);

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold text-[#1B4B3A]">
            {isEdit ? "Edit arsip" : "Tambah arsip"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-[#1B4B3A] text-xl leading-none"
          >
            &times;
          </button>
        </div>
        <p className="text-sm text-[#5C6B63] mb-4">
          {isEdit ? "Ubah data koleksi arsip ini." : "Lengkapi data koleksi arsip baru."}
        </p>

        {error && (
          <div className="text-sm text-red-600 mb-3">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-[#5C6B63] mb-1">No berkas</label>
            <input
              type="text"
              required
              value={form.no_berkas}
              onChange={(e) => handleChange("no_berkas", e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm text-[#5C6B63] mb-1">Kode klasifikasi</label>
              <input
                type="text"
                required
                value={form.kode_klasifikasi}
                onChange={(e) => handleChange("kode_klasifikasi", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-[#5C6B63] mb-1">Jumlah arsip</label>
              <input
                type="text"
                required
                placeholder="cth. 1 Berkas"
                value={form.jumlah_arsip}
                onChange={(e) => handleChange("jumlah_arsip", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#5C6B63] mb-1">Lokasi bangunan</label>
            <input
              type="text"
              required
              value={form.lokasi_bangunan}
              onChange={(e) => handleChange("lokasi_bangunan", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-[#5C6B63] mb-1">Jenis bangunan</label>
            <input
              type="text"
              required
              placeholder="cth. Mendirikan Bangunan Toko"
              value={form.jenis_bangunan}
              onChange={(e) => handleChange("jenis_bangunan", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-[#5C6B63] mb-1">Kurun waktu</label>
            <input
              type="text"
              required
              value={form.kurun_waktu}
              onChange={(e) => handleChange("kurun_waktu", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-[#5C6B63] mb-1">Tingkat perkembangan</label>
            <select
              required
              value={form.tingkat_perkembangan}
              onChange={(e) => handleChange("tingkat_perkembangan", e.target.value)}
              className={`${inputClass} bg-white`}
            >
              {TINGKAT_PERKEMBANGAN_OPTIONS.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-[#5C6B63] mb-1">
              Retribusi <span className="text-[#8A8168] font-normal">(opsional)</span>
            </label>
            <input
              type="text"
              placeholder="cth. Rp 1.419.203, atau kosongkan jika tidak ada"
              value={form.retribusi}
              onChange={(e) => handleChange("retribusi", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-[#5C6B63] mb-1">Keterangan boks</label>
            <input
              type="text"
              required
              value={form.keterangan_boks}
              onChange={(e) => handleChange("keterangan_boks", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-[#5C6B63] mb-1">
              File scan (PDF)
            </label>
            {isEdit && initialData?.file_path && !file && (
              <p className="text-xs text-[#5C6B63] mb-1">
                Sudah ada file tersimpan. Pilih file baru untuk menggantinya, atau biarkan kosong untuk tetap pakai yang lama.
              </p>
            )}
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className={`${inputClass} bg-white text-sm`}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#DDD3BC] text-[#1B4B3A] rounded-full hover:bg-[#F5F0E4]"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-[#1B4B3A] text-white rounded-full font-medium disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ArsipFormModal;