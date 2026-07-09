import { useState, useMemo, useEffect } from "react";
import { useArsip } from "../../hooks/useArsip";
import ArsipTable from "../../components/table/ArsipTable";
import PageHeader from "../../components/layout/PageHeader";
import TableSearch from "../../components/table/TableSearch";
import TableFilter from "../../components/table/TableFilter";
import TablePagination from "../../components/table/TablePagination";
import ArsipFormModal from "../../components/arsip/ArsipFormModal";
import { getArsipFileUrl } from "../../services/arsipService";
import { useToast } from "../../components/ui/ToastProvider";

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
  }, [query, jenisBangunan, kurunWaktu, sortField, sortDirection]);

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

  async function handleViewFile(item) {
    const { data, error } = await getArsipFileUrl(item.file_path);
    if (error) {
      showToast(`Gagal membuka file: ${error.message}`, "error");
      return;
    }
    window.open(data.signedUrl, "_blank");
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
          onClick={openTambah}
          className="ml-auto px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Tambah arsip
        </button>
      </div>

      <ArsipTable
        data={paginatedData}
        onEdit={openEdit}
        onDelete={handleDelete}
        onViewFile={handleViewFile}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
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
    </div>
  );
}

export default ArsipPage;