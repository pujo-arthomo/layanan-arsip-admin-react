import { useState, useMemo, useEffect } from "react";
import { useArsip } from "../../hooks/useArsip";
import ArsipTable from "../../components/table/ArsipTable";
import PageHeader from "../../components/layout/PageHeader";
import TableSearch from "../../components/table/TableSearch";
import TableFilter from "../../components/table/TableFilter";
import TablePagination from "../../components/table/TablePagination";
import ArsipFormModal from "../../components/arsip/ArsipFormModal";
import ArsipImportModal from "../../components/arsip/ArsipImportModal";
import { getArsipFileUrl } from "../../services/arsipService";
import { useToast } from "../../components/ui/ToastProvider";
import { exportCsv, cetakPdf } from "../../utils/export";

const KOLOM_EXPORT = [
  { label: "No Berkas", field: "no_berkas" },
  { label: "Kode Klasifikasi", field: "kode_klasifikasi" },
  { label: "Lokasi Bangunan", field: "lokasi_bangunan" },
  { label: "Jenis Bangunan", field: "jenis_bangunan" },
  { label: "Kurun Waktu", field: "kurun_waktu" },
  { label: "Jumlah Arsip", field: "jumlah_arsip" },
  { label: "Tingkat Perkembangan", field: "tingkat_perkembangan" },
  { label: "Keterangan Boks", field: "keterangan_boks" },
];

function ArsipPage() {
  const { data, loading, error, tambahArsip, editArsip, hapusArsip } = useArsip();
  const { showToast } = useToast();

  const [query, setQuery] = useState("");
  const [jenisBangunan, setJenisBangunan] = useState("");
  const [kurunWaktu, setKurunWaktu] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [importOpen, setImportOpen] = useState(false);

  const [selectedIds, setSelectedIds] = useState(new Set());

  const jenisBangunanOptions = useMemo(
    () =>
      Array.from(
        new Set(data.map((item) => item.jenis_bangunan).filter(Boolean))
      ),
    [data]
  );

  const kurunWaktuOptions = useMemo(
    () =>
      Array.from(
        new Set(data.map((item) => item.kurun_waktu).filter(Boolean))
      ),
    [data]
  );

  const filteredData = useMemo(() => {
    let result = data;

    if (query) {
      const q = query.toLowerCase();
      result = result.filter((item) =>
        [
          item.no_berkas,
          item.kode_klasifikasi,
          item.lokasi_bangunan,
          item.jenis_bangunan,
          item.kurun_waktu,
          item.tingkat_perkembangan,
          item.keterangan_boks,
        ]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(q))
      );
    }

    if (jenisBangunan) {
      result = result.filter((item) => item.jenis_bangunan === jenisBangunan);
    }

    if (kurunWaktu) {
      result = result.filter((item) => item.kurun_waktu === kurunWaktu);
    }

    return result;
  }, [data, query, jenisBangunan, kurunWaktu]);

  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;

    return [...filteredData].sort((a, b) => {
      const va = a[sortField] ?? "";
      const vb = b[sortField] ?? "";
      if (va < vb) return sortDirection === "asc" ? -1 : 1;
      if (va > vb) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortField, sortDirection]);

  useEffect(() => {
    setPage(1);
    setSelectedIds(new Set());
  }, [query, jenisBangunan, kurunWaktu, sortField, sortDirection]);

  useEffect(() => {
    setSelectedIds(new Set());
  }, [page]);

  const totalPages = Math.ceil(sortedData.length / PAGE_SIZE);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sortedData.slice(start, start + PAGE_SIZE);
  }, [sortedData, page]);

  function handleSort(field) {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  function toggleSelect(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelectedIds((prev) => {
      const allSelected =
        paginatedData.length > 0 &&
        paginatedData.every((item) => prev.has(item.id));
      if (allSelected) return new Set();
      return new Set(paginatedData.map((item) => item.id));
    });
  }

  function openTambah() {
    setEditingItem(null);
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditingItem(item);
    setModalOpen(true);
  }

  async function handleModalSubmit(payload) {
    const result = editingItem
      ? await editArsip(editingItem.id, payload)
      : await tambahArsip(payload);

    if (!result.error) {
      showToast(
        editingItem ? "Arsip berhasil diubah" : "Arsip berhasil ditambahkan",
        "success"
      );
    }

    return result;
  }

  async function handleDelete(item) {
    const konfirmasi = window.confirm(
      `Yakin mau hapus arsip "${item.no_berkas}"? Data yang dihapus tidak bisa dikembalikan.`
    );
    if (!konfirmasi) return;

    const { error } = await hapusArsip(item.id);
    if (error) {
      showToast(`Gagal menghapus: ${error.message}`, "error");
    } else {
      showToast("Arsip berhasil dihapus", "success");
    }
  }

  async function handleBulkDelete() {
    const konfirmasi = window.confirm(
      `Yakin mau hapus ${selectedIds.size} arsip terpilih? Data yang dihapus tidak bisa dikembalikan.`
    );
    if (!konfirmasi) return;

    let sukses = 0;
    for (const id of selectedIds) {
      const { error } = await hapusArsip(id);
      if (!error) sukses++;
    }

    showToast(`${sukses} dari ${selectedIds.size} arsip berhasil dihapus`, "success");
    setSelectedIds(new Set());
  }

  async function handleViewFile(item) {
    const { data, error } = await getArsipFileUrl(item.file_path);
    if (error) {
      showToast(`Gagal membuka file: ${error.message}`, "error");
      return;
    }
    window.open(data.signedUrl, "_blank");
  }

  function getDataUntukExport() {
    if (selectedIds.size > 0) {
      return sortedData.filter((item) => selectedIds.has(item.id));
    }
    return sortedData;
  }

  function handleExportCsv() {
    const items = getDataUntukExport();
    const rows = items.map((item) => {
      const row = {};
      KOLOM_EXPORT.forEach((k) => {
        row[k.label] = item[k.field] ?? "";
      });
      return row;
    });
    exportCsv("koleksi-arsip", rows);
  }

  function handleCetakPdf() {
    cetakPdf("Koleksi Arsip - Diskarpus", KOLOM_EXPORT, getDataUntukExport());
  }

  if (loading) return <div>Loading arsip...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Koleksi Arsip"
        subtitle="Daftar arsip yang tersimpan di Diskarpus"
      />

      <div className="flex flex-wrap gap-3 items-center">
        <TableSearch
          value={query}
          onChange={setQuery}
          placeholder="Cari arsip..."
        />

        <TableFilter
          label="Jenis Bangunan"
          value={jenisBangunan}
          options={jenisBangunanOptions}
          onChange={setJenisBangunan}
        />

        <TableFilter
          label="Kurun Waktu"
          value={kurunWaktu}
          options={kurunWaktuOptions}
          onChange={setKurunWaktu}
        />

        <button
          onClick={() => setImportOpen(true)}
          className="ml-auto px-4 py-2 border rounded"
        >
          Import CSV
        </button>

        <button onClick={handleExportCsv} className="px-4 py-2 border rounded">
          Export Excel
        </button>

        <button onClick={handleCetakPdf} className="px-4 py-2 border rounded">
          Cetak PDF
        </button>

        <button
          onClick={openTambah}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Tambah arsip
        </button>
      </div>

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded px-4 py-2">
          <span className="text-sm text-blue-800">{selectedIds.size} dipilih</span>
          <button
            onClick={handleBulkDelete}
            className="text-sm text-red-600 hover:underline"
          >
            Hapus terpilih
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-sm text-gray-600 hover:underline ml-auto"
          >
            Batal pilih
          </button>
        </div>
      )}

      <ArsipTable
        data={paginatedData}
        onEdit={openEdit}
        onDelete={handleDelete}
        onViewFile={handleViewFile}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
      />

      <TablePagination
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />

      <ArsipFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingItem}
      />

      <ArsipImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        tambahArsip={tambahArsip}
      />
    </div>
  );
}

export default ArsipPage;