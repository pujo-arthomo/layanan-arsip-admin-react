function PemohonTable({ data }) {
  return (
    <div className="overflow-x-auto border rounded bg-white">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2 text-left">Waktu Pengajuan</th>
            <th className="border px-3 py-2 text-left">Nama</th>
            <th className="border px-3 py-2 text-left">Domisili</th>
            <th className="border px-3 py-2 text-left">No Rekomendasi</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="border px-3 py-4 text-center text-gray-500"
              >
                Belum ada data pemohon
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">
                  {new Date(item.waktu_pengajuan).toLocaleString()}
                </td>
                <td className="border px-3 py-2">{item.nama}</td>
                <td className="border px-3 py-2">{item.domisili}</td>
                <td className="border px-3 py-2">{item.no_rekomendasi}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PemohonTable;
