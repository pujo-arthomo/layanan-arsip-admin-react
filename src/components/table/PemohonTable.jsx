function PemohonTable({
  data,
  onEdit,
  onDelete,
  sortField,
  sortDirection,
  onSort,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
}) {
  function renderHeader(label, field) {
    const isActive = sortField === field;
    return (
      <th
        onClick={() => onSort(field)}
        className="border px-3 py-2 text-left font-medium cursor-pointer select-none hover:bg-gray-200"
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
            {renderHeader("Waktu Pengajuan", "waktu_pengajuan")}
            {renderHeader("Nama", "nama")}
            {renderHeader("Domisili", "domisili")}
            {renderHeader("No Rekomendasi", "no_rekomendasi")}
            <th className="border px-3 py-2 text-center">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={6} className="border px-3 py-4 text-center text-gray-500">
                Belum ada data pemohon
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
                <td className="border px-3 py-2">
                  {new Date(item.waktu_pengajuan).toLocaleString()}
                </td>
                <td className="border px-3 py-2">{item.nama}</td>
                <td className="border px-3 py-2">{item.domisili}</td>
                <td className="border px-3 py-2">{item.no_rekomendasi}</td>
                <td className="border px-3 py-2 text-center space-x-3">
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

export default PemohonTable;