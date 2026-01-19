function TablePagination({ page, totalPages, onPrev, onNext }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-4">
      <button
        onClick={onPrev}
        disabled={page === 1}
        className="px-3 py-2 border rounded disabled:opacity-50"
      >
        ◀ Previous
      </button>

      <span className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </span>

      <button
        onClick={onNext}
        disabled={page === totalPages}
        className="px-3 py-2 border rounded disabled:opacity-50"
      >
        Next ▶
      </button>
    </div>
  );
}

export default TablePagination;
