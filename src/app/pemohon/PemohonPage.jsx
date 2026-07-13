import { useState, useMemo, useEffect } from "react";
import { usePemohon } from "../../hooks/usePemohon";
import PemohonTable from "../../components/table/PemohonTable";
import PageHeader from "../../components/layout/PageHeader";
import TableSearch from "../../components/table/TableSearch";
import PemohonFormModal from "../../components/pemohon/PemohonFormModal";
import { useToast } from "../../components/ui/ToastProvider";
import { exportCsv, cetakPdf } from "../../utils/export";

const KOLOM_EXPORT = [
  { label: "Waktu Pengajuan", field: "waktu_pengajuan" },
  { label: "Nomor Layanan", field: "nomor_layanan" },
  { label: "Nama", field: "nama" },
  { label: "Domisili", field: "domisili" },
  { label: "Keterangan", field: "keterangan" },
  { label: "No Rekomendasi", field: "no_rekomendasi" },
  { label: "Status", field: "status" },
];

function PemohonPage() {
  const { data, loading, error, tambahPemohon, editPemohon, hapusPemohon } =
    usePemohon();
  const { showToast } = useToast();
  const [query, setQuery] = useState("");

  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [selectedIds, setSelectedIds] = useState(new Set());

  const filteredData = useMemo(() => {
    if (!query) return data;

    const q = query.toLowerCase();

    return data.filter((item) =>
      [item.nama, item.domisili, item.no_rekomendasi, item.keterangan, item.nomor_layanan]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q))
    );
  }, [data, query]);

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
    setSelectedIds(new Set());
  }, [query, sortField, sortDirection]);

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
        sortedData.length > 0 && sortedData.every((item) => prev.has(item.id));
      if (allSelected) return new Set();
      return new Set(sortedData.map((item) => item.id));
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
      ? await editPemohon(editingItem.id, payload)
      : await tambahPemohon(payload);

    if (!result.error) {
      showToast(
        editingItem ? "Data pemohon berhasil diubah" : "Pemohon berhasil ditambahkan",
        "success"
      );
    }

    return result;
  }

  async function handleDelete(item) {
    const konfirmasi = window.confirm(
      `Yakin mau hapus data pemohon "${item.nama}"? Data yang dihapus tidak bisa dikembalikan.`
    );
    if (!konfirmasi) return;

    const { error } = await hapusPemohon(item.id);
    if (error) {
      showToast(`Gagal menghapus: ${error.message}`, "error");
    } else {
      showToast("Data pemohon berhasil dihapus", "success");
    }
  }

  async function handleBulkDelete() {
    const konfirmasi = window.confirm(
      `Yakin mau hapus ${selectedIds.size} data pemohon terpilih? Data yang dihapus tidak bisa dikembalikan.`
    );
    if (!konfirmasi) return;

    let sukses = 0;
    for (const id of selectedIds) {
      const { error } = await hapusPemohon(id);
      if (!error) sukses++;
    }

    showToast(`${sukses} dari ${selectedIds.size} data berhasil dihapus`, "success");
    setSelectedIds(new Set());
  }

  async function handleStatusChange(item, newStatus) {
    const { error } = await editPemohon(item.id, { status: newStatus });
    if (error) {
      showToast(`Gagal ubah status: ${error.message}`, "error");
    } else {
      showToast(`Status diubah jadi "${newStatus}"`, "success");
    }
  }

  function getDataUntukExport() {
    const items =
      selectedIds.size > 0
        ? sortedData.filter((item) => selectedIds.has(item.id))
        : sortedData;

    return items.map((item) => ({
      ...item,
      waktu_pengajuan: new Date(item.waktu_pengajuan).toLocaleString("id-ID"),
    }));
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
    exportCsv("pemohon-arsip", rows);
  }

  function handleCetakPdf() {
    cetakPdf("Pemohon Arsip - Diskarpus", KOLOM_EXPORT, getDataUntukExport());
  }

  if (loading) return <div>Loading pemohon...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <PageHeader
          title="Pemohon Arsip"
          subtitle="Daftar permohonan layanan arsip"
        />
        <button
          onClick={openTambah}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Tambah pemohon
        </button>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <TableSearch
          value={query}
          onChange={setQuery}
          placeholder="Cari nama, domisili, atau no rekomendasi..."
        />

        <button
          onClick={handleExportCsv}
          className="ml-auto px-4 py-2 border rounded"
        >
          Export Excel
        </button>

        <button onClick={handleCetakPdf} className="px-4 py-2 border rounded">
          Cetak PDF
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

      <PemohonTable
        data={sortedData}
        onEdit={openEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
      />

      <PemohonFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingItem}
      />
    </div>
  );
}

export default PemohonPage;