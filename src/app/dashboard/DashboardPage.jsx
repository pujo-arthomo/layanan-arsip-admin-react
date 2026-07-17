import { useMemo } from "react";
import { useArsip } from "../../hooks/useArsip";
import { usePemohon } from "../../hooks/usePemohon";
import PageHeader from "../../components/layout/PageHeader";
import { formatRupiah } from "../../constants/arsip";

function statusColor(status) {
  const styles = {
    Menunggu: "bg-yellow-100 text-yellow-800",
    Diproses: "bg-blue-100 text-blue-800",
    Selesai: "bg-green-100 text-green-800",
  };
  return styles[status] || "bg-gray-100 text-gray-800";
}

function BarStat({ label, value, total, color }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-[#1B4B3A] font-medium">{label}</span>
        <span className="text-[#5C6B63]">
          {value} ({pct}%)
        </span>
      </div>
      <div className="w-full bg-[#F5F0E4] rounded-full h-3">
        <div
          className="h-3 rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function DashboardPage() {
  const { data: arsipData, loading: arsipLoading } = useArsip();
  const { data: pemohonData, loading: pemohonLoading } = usePemohon();

  const statusCounts = useMemo(() => {
    const counts = { Menunggu: 0, Diproses: 0, Selesai: 0 };
    pemohonData.forEach((item) => {
      const s = item.status || "Menunggu";
      if (counts[s] !== undefined) counts[s]++;
    });
    return counts;
  }, [pemohonData]);

  const tingkatCounts = useMemo(() => {
    const counts = { Asli: 0, Salinan: 0, Duplikat: 0 };
    arsipData.forEach((item) => {
      const t = item.tingkat_perkembangan;
      if (counts[t] !== undefined) counts[t]++;
    });
    return counts;
  }, [arsipData]);

  const totalRetribusi = useMemo(() => {
    return arsipData.reduce((sum, item) => sum + (Number(item.retribusi) || 0), 0);
  }, [arsipData]);

  const pemohonTerbaru = useMemo(() => {
    return [...pemohonData]
      .sort((a, b) => new Date(b.waktu_pengajuan) - new Date(a.waktu_pengajuan))
      .slice(0, 5);
  }, [pemohonData]);

  const totalPemohon = pemohonData.length;
  const totalArsip = arsipData.length;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Dashboard"
        subtitle="Ringkasan data layanan arsip Diskarpus"
      />

      {/* Kartu ringkasan */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EEE6D6] rounded-2xl p-5">
          <div className="text-sm text-[#5C6B63]">Total arsip</div>
          <div className="text-3xl font-bold mt-1 text-[#1B4B3A]">
            {arsipLoading ? "..." : totalArsip}
          </div>
        </div>

        <div className="bg-white border border-[#EEE6D6] rounded-2xl p-5">
          <div className="text-sm text-[#5C6B63]">Total pemohon</div>
          <div className="text-3xl font-bold mt-1 text-[#1B4B3A]">
            {pemohonLoading ? "..." : totalPemohon}
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
          <div className="text-sm text-yellow-800">Pemohon menunggu</div>
          <div className="text-3xl font-bold mt-1 text-yellow-800">
            {pemohonLoading ? "..." : statusCounts.Menunggu}
          </div>
        </div>

        <div className="bg-white border border-[#EEE6D6] rounded-2xl p-5">
          <div className="text-sm text-[#5C6B63]">Total retribusi</div>
          <div className="text-2xl font-bold mt-1 text-[#1B4B3A]">
            {arsipLoading ? "..." : formatRupiah(totalRetribusi)}
          </div>
        </div>
      </div>

      {/* Grafik */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-[#EEE6D6] rounded-2xl p-5">
          <p className="font-semibold text-[#1B4B3A] mb-4">Status Pemohon</p>
          <div className="space-y-3">
            <BarStat
              label="Menunggu"
              value={statusCounts.Menunggu}
              total={totalPemohon}
              color="#EAB308"
            />
            <BarStat
              label="Diproses"
              value={statusCounts.Diproses}
              total={totalPemohon}
              color="#3B82F6"
            />
            <BarStat
              label="Selesai"
              value={statusCounts.Selesai}
              total={totalPemohon}
              color="#22C55E"
            />
          </div>
        </div>

        <div className="bg-white border border-[#EEE6D6] rounded-2xl p-5">
          <p className="font-semibold text-[#1B4B3A] mb-4">
            Tingkat Perkembangan Arsip
          </p>
          <div className="space-y-3">
            <BarStat
              label="Asli"
              value={tingkatCounts.Asli}
              total={totalArsip}
              color="#1B4B3A"
            />
            <BarStat
              label="Salinan"
              value={tingkatCounts.Salinan}
              total={totalArsip}
              color="#8BC53F"
            />
            <BarStat
              label="Duplikat"
              value={tingkatCounts.Duplikat}
              total={totalArsip}
              color="#8A8168"
            />
          </div>
        </div>
      </div>

      {/* Pemohon terbaru */}
      <div className="bg-white border border-[#EEE6D6] rounded-2xl p-5">
        <p className="font-semibold text-[#1B4B3A] mb-3">Pemohon Terbaru</p>
        {pemohonTerbaru.length === 0 ? (
          <p className="text-sm text-[#5C6B63]">Belum ada pemohon.</p>
        ) : (
          <div className="space-y-2">
            {pemohonTerbaru.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-sm border-b border-[#F5F0E4] pb-2 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium text-[#1B4B3A]">{item.nama}</p>
                  <p className="text-[#5C6B63] text-xs">
                    {new Date(item.waktu_pengajuan).toLocaleDateString("id-ID")}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${statusColor(item.status)}`}
                >
                  {item.status || "Menunggu"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;