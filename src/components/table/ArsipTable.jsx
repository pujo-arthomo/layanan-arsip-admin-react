function ArsipTable({ data }) {
  return (
    <div className="overflow-x-auto border rounded bg-white">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2 text-left">No Berkas</th>
            <th className="border px-3 py-2 text-left">Kode Klasifikasi</th>
            <th className="border px-3 py-2 text-left">Lokasi Bangunan</th>
            <th className="border px-3 py-2 text-left">Jenis Bangunan</th>
            <th className="border px-3 py-2 text-left">Kurun Waktu</th>
            <th className="border px-3 py-2 text-right">Jumlah Arsip</th>
            <th className="border px-3 py-2 text-left">Tingkat Perkembangan</th>
            <th className="border px-3 py-2 text-left">Keterangan Boks</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="border px-3 py-4 text-center text-gray-500"
              >
                Belum ada data arsip
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{item.no_berkas}</td>
                <td className="border px-3 py-2">{item.kode_klasifikasi}</td>
                <td className="border px-3 py-2">{item.lokasi_bangunan}</td>
                <td className="border px-3 py-2">{item.jenis_bangunan}</td>
                <td className="border px-3 py-2">{item.kurun_waktu}</td>
                <td className="border px-3 py-2 text-right">
                  {item.jumlah_arsip}
                </td>
                <td className="border px-3 py-2">
                  {item.tingkat_perkembangan}
                </td>
                <td className="border px-3 py-2">{item.keterangan_boks}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ArsipTable;
