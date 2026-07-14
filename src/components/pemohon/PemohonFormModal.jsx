import { useState, useEffect } from "react";

const STATUS_OPTIONS = ["Menunggu", "Diproses", "Selesai"];

const inputClass =
  "w-full border border-[#DDD3BC] px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F]";

function toDatetimeLocal(isoString) {
  const d = isoString ? new Date(isoString) : new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function buatKosong() {
  return {
    waktu_pengajuan: toDatetimeLocal(),
    nama: "",
    domisili: "",
    keterangan: "",
    no_rekomendasi: "",
    status: "Diproses",
  };
}

function PemohonFormModal({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState(buatKosong());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const isEdit = Boolean(initialData);

  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? {
              waktu_pengajuan: toDatetimeLocal(initialData.waktu_pengajuan),
              nama: initialData.nama ?? "",
              domisili: initialData.domisili ?? "",
              keterangan: initialData.keterangan ?? "",
              no_rekomendasi: initialData.no_rekomendasi ?? "",
              status: initialData.status ?? "Menunggu",
            }
          : buatKosong()
      );
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

    const payload = {
      ...form,
      waktu_pengajuan: form.waktu_pengajuan
        ? new Date(form.waktu_pengajuan).toISOString()
        : null,
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
            {isEdit ? "Edit pemohon" : "Tambah pemohon"}
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
          {isEdit
            ? "Ubah data pemohon ini."
            : "Lengkapi data pemohon baru. Status otomatis \"Diproses\" karena diinput langsung oleh petugas."}
        </p>

        {isEdit && initialData?.nomor_layanan && (
          <div className="text-sm bg-[#F5F0E4] border border-[#EEE6D6] rounded-lg px-3 py-2 mb-3">
            <span className="text-[#5C6B63]">Nomor layanan: </span>
            <span className="font-medium text-[#1B4B3A]">
              {initialData.nomor_layanan}
            </span>
          </div>
        )}

        {error && (
          <div className="text-sm text-red-600 mb-3">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-[#5C6B63] mb-1">Waktu pengajuan</label>
            <input
              type="datetime-local"
              required
              value={form.waktu_pengajuan}
              onChange={(e) => handleChange("waktu_pengajuan", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-[#5C6B63] mb-1">Nama</label>
            <input
              type="text"
              required
              value={form.nama}
              onChange={(e) => handleChange("nama", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-[#5C6B63] mb-1">Domisili</label>
            <input
              type="text"
              required
              value={form.domisili}
              onChange={(e) => handleChange("domisili", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-[#5C6B63] mb-1">
              Keterangan (arsip/keperluan yang dicari)
            </label>
            <textarea
              required
              rows={3}
              value={form.keterangan}
              onChange={(e) => handleChange("keterangan", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-[#5C6B63] mb-1">
              No rekomendasi (dari PTSP)
            </label>
            <input
              type="text"
              required
              value={form.no_rekomendasi}
              onChange={(e) => handleChange("no_rekomendasi", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-[#5C6B63] mb-1">Status</label>
            <select
              required
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className={`${inputClass} bg-white`}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
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

export default PemohonFormModal;