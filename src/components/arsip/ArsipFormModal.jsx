import { useState } from "react";

const KOSONG = {
  no_berkas: "",
  kode_klasifikasi: "",
  lokasi_bangunan: "",
  jenis_bangunan: "",
  kurun_waktu: "",
  jumlah_arsip: "",
  tingkat_perkembangan: "Asli",
  keterangan_boks: "",
};

function ArsipFormModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(KOSONG);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

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
      jumlah_arsip: form.jumlah_arsip === "" ? null : Number(form.jumlah_arsip),
    };

    const { error } = await onSubmit(payload);

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    setForm(KOSONG);
    setSaving(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold">Tambah arsip</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl leading-none"
          >
            &times;
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Lengkapi data koleksi arsip baru.
        </p>

        {error && (
          <div className="text-sm text-red-600 mb-3">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">No berkas</label>
            <input
              type="text"
              value={form.no_berkas}
              onChange={(e) => handleChange("no_berkas", e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Kode klasifikasi</label>
              <input
                type="text"
                value={form.kode_klasifikasi}
                onChange={(e) => handleChange("kode_klasifikasi", e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Jumlah arsip</label>
              <input
                type="number"
                value={form.jumlah_arsip}
                onChange={(e) => handleChange("jumlah_arsip", e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Lokasi bangunan</label>
            <input
              type="text"
              value={form.lokasi_bangunan}
              onChange={(e) => handleChange("lokasi_bangunan", e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Jenis bangunan</label>
              <input
                type="text"
                value={form.jenis_bangunan}
                onChange={(e) => handleChange("jenis_bangunan", e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Kurun waktu</label>
              <input
                type="text"
                value={form.kurun_waktu}
                onChange={(e) => handleChange("kurun_waktu", e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Tingkat perkembangan</label>
            <select
              value={form.tingkat_perkembangan}
              onChange={(e) => handleChange("tingkat_perkembangan", e.target.value)}
              className="w-full border px-3 py-2 rounded bg-white"
            >
              <option>Asli</option>
              <option>Salinan</option>
              <option>Duplikat</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Keterangan boks</label>
            <input
              type="text"
              value={form.keterangan_boks}
              onChange={(e) => handleChange("keterangan_boks", e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
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