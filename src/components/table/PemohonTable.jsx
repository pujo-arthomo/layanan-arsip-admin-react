const STATUS_OPTIONS = ["Menunggu", "Diproses", "Selesai"];

function statusColor(status) {
  const styles = {
    Menunggu: "bg-yellow-100 text-yellow-800 border-yellow-300",
    Diproses: "bg-blue-100 text-blue-800 border-blue-300",
    Selesai: "bg-green-100 text-green-800 border-green-300",
  };
  return styles[status] || "bg-gray-100 text-gray-800 border-gray-300";
}

function PemohonTable({
  data,
  onEdit,
  onDelete,
  onStatusChange,
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
        className="border px-3 py-2 text-left font-medium cursor-pointer select-none hover:bg-[#EEE6D6]"
      >
        {label}
        {isActive && (sortDirection === "asc" ? " ▲" : " ▼")}
      </th>
    );
  }

  const allSelected =
    data.length > 0 && data.every((item) => selectedIds.has(item.id));

  return (
    <div className="overflow-x-auto border border-[#EEE6D6] rounded-lg bg-white">
      <table className="min-w-full border-collapse">
        <thead className="bg-[#F5F0E4] text-[#1B4B3A]">
          <tr>
            <th className="border px-3 py-2 w-10 text-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleSelectAll}
              />
            </th>
            {renderHeader("Waktu Pengajuan", "waktu_pengajuan")}
            {renderHeader("Nomor Layanan", "nomor_layanan")}
            {renderHeader("Nama", "nama")}
            {renderHeader("Domisili", "domisili")}
            {renderHeader("Keterangan", "keterangan")}
            {renderHeader("No Rekomendasi", "no_rekomendasi")}
            {renderHeader("Status", "status")}
            <th className="border px-3 py-2 text-center">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={9} className="border px-3 py-4 text-center text-[#5C6B63]">
                Belum ada data pemohon
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="hover:bg-[#FBF3E4]/50">
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
                <td className="border px-3 py-2 whitespace-nowrap">
                  {item.nomor_layanan}
                </td>
                <td className="border px-3 py-2">{item.nama}</td>
                <td className="border px-3 py-2">{item.domisili}</td>
                <td className="border px-3 py-2 max-w-xs truncate" title={item.keterangan}>
                  {item.keterangan}
                </td>
                <td className="border px-3 py-2">{item.no_rekomendasi}</td>
                <td className="border px-3 py-2">
                  <select
                    value={item.status || "Menunggu"}
                    onChange={(e) => onStatusChange(item, e.target.value)}
                    className={`text-xs font-medium rounded px-2 py-1 border ${statusColor(item.status)}`}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border px-3 py-2 text-center space-x-3">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-[#1B4B3A] hover:underline text-sm"
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