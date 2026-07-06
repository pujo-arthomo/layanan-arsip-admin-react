import { useEffect, useState, useCallback } from "react";
import { getArsip, createArsip } from "../services/arsipService";

export function useArsip() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArsip = useCallback(async () => {
    setLoading(true);

    const { data, error } = await getArsip();

    if (error) {
      setError(error);
    } else {
      setData(data);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchArsip();
  }, [fetchArsip]);

  async function tambahArsip(payload) {
    const { error } = await createArsip(payload);
    if (error) {
      return { error };
    }
    // refresh data setelah tambah
    await fetchArsip();
    return { error: null };
  }

  return { data, loading, error, tambahArsip };
}