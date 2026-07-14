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
        className={`border px-3 py-2 font-medium cursor-pointer select-none hover:bg-[#EEE6D6] ${
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
              <td colSpan={10} className="border px-3 py-4 text-center text-[#5C6B63]">
                Belum ada data arsip
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
                <td className="border px-3 py-2">{item.no_berkas}</td>
                <td className="border px-3 py-2">{item.kode_klasifikasi}</td>
                <td className="border px-3 py-2">{item.lokasi_bangunan}</td>
                <td className="border px-3 py-2">{item.jenis_bangunan}</td>
                <td className="border px-3 py-2">{item.kurun_waktu}</td>
                <td className="border px-3 py-2 text-right">{item.jumlah_arsip}</td>
                <td className="border px-3 py-2">{item.tingkat_perkembangan}</td>
                <td className="border px-3 py-2">{item.keterangan_boks}</td>
                <td className="border px-3 py-2">
                  <div className="flex items-center justify-center gap-1">
                    {item.file_path && (
                      <button
                        onClick={() => onViewFile(item)}
                        title="Lihat file"
                        aria-label="Lihat file"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full text-[#5C8A3A] hover:bg-[#EFF7DC]"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(item)}
                      title="Edit"
                      aria-label="Edit"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-[#1B4B3A] hover:bg-[#F5F0E4]"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      title="Hapus"
                      aria-label="Hapus"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-red-600 hover:bg-red-50"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
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