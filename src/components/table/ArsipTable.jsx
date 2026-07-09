function ArsipTable({
  data,
  onEdit,
  onDelete,
  onViewFile,
  sortField,
  sortDirection,
  onSort,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
}) {
  function renderHeader(label, field, align = "left") {
    const isActive = sortField === field;
    return (
      <th
        onClick={() => onSort(field)}
        className={`border px-3 py-2 font-medium cursor-pointer select-none hover:bg-gray-200 ${
          align === "right" ? "text-right" : "text-left"
        }`}
      >
        {label}
        {isActive && (sortDirection === "asc" ? " ▲" : " ▼")}
      </th>
    );
  }

  const allSelected =
    data.length > 0 && data.every((item) => selectedIds.has(item.id));

  return (
    <div className="overflow-x-auto border rounded bg-white">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2 w-10 text-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleSelectAll}
              />
            </th>
            {renderHeader("No Berkas", "no_berkas")}
            {renderHeader("Kode Klasifikasi", "kode_klasifikasi")}
            {renderHeader("Lokasi Bangunan", "lokasi_bangunan")}
            {renderHeader("Jenis Bangunan", "jenis_bangunan")}
            {renderHeader("Kurun Waktu", "kurun_waktu")}
            {renderHeader("Jumlah Arsip", "jumlah_arsip", "right")}
            {renderHeader("Tingkat Perkembangan", "tingkat_perkembangan")}
            {renderHeader("Keterangan Boks", "keterangan_boks")}
            <th className="border px-3 py-2 text-center">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={10} className="border px-3 py-4 text-center text-gray-500">
                Belum ada data arsip
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item.id)}
                    onChange={() => onToggleSelect(item.id)}
                  />
                </td>
                <td className="border px-3 py-2">{item.no_berkas}</td>
                <td className="border px-3 py-2">{item.kode_klasifikasi}</td>
                <td className="border px-3 py-2">{item.lokasi_bangunan}</td>
                <td className="border px-3 py-2">{item.jenis_bangunan}</td>
                <td className="border px-3 py-2">{item.kurun_waktu}</td>
                <td className="border px-3 py-2 text-right">{item.jumlah_arsip}</td>
                <td className="border px-3 py-2">{item.tingkat_perkembangan}</td>
                <td className="border px-3 py-2">{item.keterangan_boks}</td>
                <td className="border px-3 py-2 text-center space-x-3 whitespace-nowrap">
                  {item.file_path && (
                    <button
                      onClick={() => onViewFile(item)}
                      className="text-green-600 hover:underline text-sm"
                    >
                      Lihat file
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(item)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ArsipTable;