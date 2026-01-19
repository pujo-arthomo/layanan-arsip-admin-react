import { useState, useMemo } from "react";
import { usePemohon } from "../../hooks/usePemohon";
import PemohonTable from "../../components/table/PemohonTable";
import PageHeader from "../../components/layout/PageHeader";
import TableSearch from "../../components/table/TableSearch";

function PemohonPage() {
  const { data, loading, error } = usePemohon();
  const [query, setQuery] = useState("");

  // 🔍 Filter data pemohon (client-side)
  const filteredData = useMemo(() => {
    if (!query) return data;

    const q = query.toLowerCase();

    return data.filter((item) =>
      [
        item.nama,
        item.domisili,
        item.no_rekomendasi,
      ]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q))
    );
  }, [data, query]);

  if (loading) return <div>Loading pemohon...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Pemohon Arsip"
        subtitle="Daftar permohonan layanan arsip"
      />

      <TableSearch
        value={query}
        onChange={setQuery}
        placeholder="Cari nama, domisili, atau no rekomendasi..."
      />

      <PemohonTable data={filteredData} />
    </div>
  );
}

export default PemohonPage;
