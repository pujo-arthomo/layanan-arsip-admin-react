function TableFilter({ label, value, options, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border rounded bg-white
                   focus:outline-none focus:ring focus:ring-blue-200"
      >
        <option value="">Semua</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export default TableFilter;
