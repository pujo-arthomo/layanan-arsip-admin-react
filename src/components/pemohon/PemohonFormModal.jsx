import { useState, useEffect } from "react";

const STATUS_OPTIONS = ["Menunggu", "Diproses", "Selesai"];

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
    status: "Menunggu",
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
      <div className="bg-white rounded-lg w-full max-w-md p-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold">
            {isEdit ? "Edit pemohon" : "Tambah pemohon"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl leading-none"
          >
            &times;
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          {isEdit ? "Ubah data pemohon ini." : "Lengkapi data pemohon baru."}
        </p>

        {error && (
          <div className="text-sm text-red-600 mb-3">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Waktu pengajuan</label>
            <input
              type="datetime-local"
              required
              value={form.waktu_pengajuan}
              onChange={(e) => handleChange("waktu_pengajuan", e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Nama</label>
            <input
              type="text"
              required
              value={form.nama}
              onChange={(e) => handleChange("nama", e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Domisili</label>
            <input
              type="text"
              required
              value={form.domisili}
              onChange={(e) => handleChange("domisili", e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Keterangan (arsip/keperluan yang dicari)
            </label>
            <textarea
              required
              rows={3}
              value={form.keterangan}
              onChange={(e) => handleChange("keterangan", e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">No rekomendasi</label>
            <input
              type="text"
              required
              value={form.no_rekomendasi}
              onChange={(e) => handleChange("no_rekomendasi", e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Status</label>
            <select
              required
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="w-full border px-3 py-2 rounded bg-white"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Batal
            </button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PemohonFormModal;