import { useState, useMemo } from "react";
import { usePemohon } from "../../hooks/usePemohon";
import PemohonTable from "../../components/table/PemohonTable";
import PageHeader from "../../components/layout/PageHeader";
import TableSearch from "../../components/table/TableSearch";
import PemohonFormModal from "../../components/pemohon/PemohonFormModal";

function PemohonPage() {
  const { data, loading, error, tambahPemohon, editPemohon, hapusPemohon } =
    usePemohon();
  const [query, setQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // 🔍 Filter data pemohon (client-side)
  const filteredData = useMemo(() => {
    if (!query) return data;

    const q = query.toLowerCase();

    return data.filter((item) =>
      [item.nama, item.domisili, item.no_rekomendasi]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q))
    );
  }, [data, query]);

  function openTambah() {
    setEditingItem(null);
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditingItem(item);
    setModalOpen(true);
  }

  function handleModalSubmit(payload) {
    if (editingItem) {
      return editPemohon(editingItem.id, payload);
    }
    return tambahPemohon(payload);
  }

  async function handleDelete(item) {
    const konfirmasi = window.confirm(
      `Yakin mau hapus data pemohon "${item.nama}"? Data yang dihapus tidak bisa dikembalikan.`
    );
    if (!konfirmasi) return;

    const { error } = await hapusPemohon(item.id);
    if (error) {
      alert(`Gagal menghapus: ${error.message}`);
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

      <PemohonTable data={filteredData} onEdit={openEdit} onDelete={handleDelete} />

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