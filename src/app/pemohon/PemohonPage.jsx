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