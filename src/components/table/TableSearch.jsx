function TableSearch({ value, onChange, placeholder }) {
  return (
    <div className="mb-3">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full md:w-80 px-3 py-2 border rounded
                   focus:outline-none focus:ring focus:ring-blue-200"
      />
    </div>
  );
}

export default TableSearch;
