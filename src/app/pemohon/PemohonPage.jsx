import { useState, useMemo } from "react";
import { usePemohon } from "../../hooks/usePemohon";
import PemohonTable from "../../components/table/PemohonTable";
import PageHeader from "../../components/layout/PageHeader";
import TableSearch from "../../components/table/TableSearch";
import PemohonFormModal from "../../components/pemohon/PemohonFormModal";
import { useToast } from "../../components/ui/ToastProvider";

function PemohonPage() {
  const { data, loading, error, tambahPemohon, editPemohon, hapusPemohon } =
    usePemohon();
  const { showToast } = useToast();
  const [query, setQuery] = useState("");

  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const filteredData = useMemo(() => {
    if (!query) return data;

    const q = query.toLowerCase();

    return data.filter((item) =>
      [item.nama, item.domisili, item.no_rekomendasi]
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

  function handleSort(field) {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
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

      <TableSearch
        value={query}
        onChange={setQuery}
        placeholder="Cari nama, domisili, atau no rekomendasi..."
      />

      <PemohonTable
        data={sortedData}
        onEdit={openEdit}
        onDelete={handleDelete}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
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