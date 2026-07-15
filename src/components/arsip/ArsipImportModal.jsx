import { useState } from "react";
import Papa from "papaparse";
import { TINGKAT_PERKEMBANGAN_OPTIONS } from "../../constants/arsip";

const KOLOM_MAP = {
  "No Berkas": "no_berkas",
  "Kode Klasifikasi": "kode_klasifikasi",
  "Lokasi Bangunan": "lokasi_bangunan",
  "Jenis Bangunan": "jenis_bangunan",
  "Kurun Waktu": "kurun_waktu",
  "Jumlah Arsip": "jumlah_arsip",
  "Tingkat Perkembangan": "tingkat_perkembangan",
  "Retribusi": "retribusi",
  "Keterangan Boks": "keterangan_boks",
};

function validasiBaris(row, nomorBaris) {
  const errors = [];

  if (!row.no_berkas) errors.push("No Berkas kosong");
  if (!row.kode_klasifikasi) errors.push("Kode Klasifikasi kosong");
  if (!row.lokasi_bangunan) errors.push("Lokasi Bangunan kosong");
  if (!row.jenis_bangunan) errors.push("Jenis Bangunan kosong");
  if (!row.kurun_waktu) errors.push("Kurun Waktu kosong");
  if (!row.jumlah_arsip) errors.push("Jumlah Arsip kosong");
  if (!TINGKAT_PERKEMBANGAN_OPTIONS.includes(row.tingkat_perkembangan)) {
    errors.push(`Tingkat Perkembangan "${row.tingkat_perkembangan}" tidak valid`);
  }
  if (!row.keterangan_boks) errors.push("Keterangan Boks kosong");

  return errors.length > 0 ? { baris: nomorBaris, errors } : null;
}

function ArsipImportModal({ open, onClose, tambahArsip }) {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);

  if (!open) return null;

  function handleFileChange(e) {
    setFile(e.target.files?.[0] ?? null);
    setResult(null);
  }

  function handleClose() {
    setFile(null);
    setResult(null);
    onClose();
  }

  function handleParse() {
    if (!file) return;
    setProcessing(true);
    setResult(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data.map((raw) => {
          const mapped = {};
          for (const [kolom, field] of Object.entries(KOLOM_MAP)) {
            mapped[field] = (raw[kolom] ?? "").toString().trim();
          }
          return mapped;
        });

        const validasiErrors = [];
        rows.forEach((row, idx) => {
          const err = validasiBaris(row, idx + 2);
          if (err) validasiErrors.push(err);
        });

        if (validasiErrors.length > 0) {
          setResult({ status: "invalid", errors: validasiErrors });
          setProcessing(false);
          return;
        }

        let sukses = 0;
        const gagal = [];

        for (let i = 0; i < rows.length; i++) {
          const payload = {
            ...rows[i],
            file_path: null,
          };
          const { error } = await tambahArsip(payload);
          if (error) {
            gagal.push({ baris: i + 2, pesan: error.message });
          } else {
            sukses++;
          }
        }

        setResult({ status: "done", sukses, gagal, total: rows.length });
        setProcessing(false);
      },
      error: (err) => {
        setResult({ status: "parse_error", pesan: err.message });
        setProcessing(false);
      },
    });
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg p-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold text-[#1B4B3A]">Import CSV</h3>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-[#1B4B3A] text-xl leading-none"
          >
            &times;
          </button>
        </div>
        <p className="text-sm text-[#5C6B63] mb-4">
          Upload file CSV sesuai format template untuk menambahkan banyak arsip sekaligus.
        </p>

        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="w-full border border-[#DDD3BC] px-3 py-2 rounded-lg bg-white text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-[#8BC53F]"
        />

        {result?.status === "invalid" && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3 mb-4 space-y-1 max-h-48 overflow-y-auto">
            <p className="font-medium">
              File belum bisa diimport, ada {result.errors.length} baris bermasalah:
            </p>
            {result.errors.map((e) => (
              <p key={e.baris}>
                Baris {e.baris}: {e.errors.join(", ")}
              </p>
            ))}
          </div>
        )}

        {result?.status === "parse_error" && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3 mb-4">
            Gagal membaca file: {result.pesan}
          </div>
        )}

        {result?.status === "done" && (
          <div className="text-sm bg-[#EFF7DC] border border-[#8BC53F] rounded p-3 mb-4 space-y-1">
            <p className="text-[#1B4B3A] font-medium">
              {result.sukses} dari {result.total} baris berhasil diimport.
            </p>
            {result.gagal.length > 0 && (
              <div className="text-red-600 max-h-32 overflow-y-auto">
                {result.gagal.map((g) => (
                  <p key={g.baris}>
                    Baris {g.baris} gagal: {g.pesan}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 border border-[#DDD3BC] text-[#1B4B3A] rounded-full hover:bg-[#F5F0E4]"
          >
            {result?.status === "done" ? "Tutup" : "Batal"}
          </button>
          {result?.status !== "done" && (
            <button
              type="button"
              onClick={handleParse}
              disabled={!file || processing}
              className="px-4 py-2 bg-[#1B4B3A] text-white rounded-full font-medium disabled:opacity-50"
            >
              {processing ? "Memproses..." : "Import"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArsipImportModal;