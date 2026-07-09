import { useArsip } from "../../hooks/useArsip";
import { usePemohon } from "../../hooks/usePemohon";
import PageHeader from "../../components/layout/PageHeader";

function DashboardPage() {
  const { data: arsipData, loading: arsipLoading } = useArsip();
  const { data: pemohonData, loading: pemohonLoading } = usePemohon();

  return (
    <div className="space-y-4">
      <PageHeader
        title="Dashboard"
        subtitle="Ringkasan data layanan arsip Diskarpus"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border rounded-lg p-5">
          <div className="text-sm text-gray-500">Total koleksi arsip</div>
          <div className="text-3xl font-semibold mt-1">
            {arsipLoading ? "..." : arsipData.length}
          </div>
        </div>

        <div className="bg-white border rounded-lg p-5">
          <div className="text-sm text-gray-500">Total pemohon</div>
          <div className="text-3xl font-semibold mt-1">
            {pemohonLoading ? "..." : pemohonData.length}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;