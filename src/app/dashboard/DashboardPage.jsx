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
        <div className="bg-white border border-[#EEE6D6] rounded-2xl p-5">
          <div className="text-sm text-[#5C6B63]">Total koleksi arsip</div>
          <div className="text-3xl font-bold mt-1 text-[#1B4B3A]">
            {arsipLoading ? "..." : arsipData.length}
          </div>
        </div>

        <div className="bg-white border border-[#EEE6D6] rounded-2xl p-5">
          <div className="text-sm text-[#5C6B63]">Total pemohon</div>
          <div className="text-3xl font-bold mt-1 text-[#1B4B3A]">
            {pemohonLoading ? "..." : pemohonData.length}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;