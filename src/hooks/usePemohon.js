import { useEffect, useState, useCallback } from "react";
import {
  getPemohon,
  createPemohon,
  updatePemohon,
  deletePemohon,
} from "../services/pemohonService";

export function usePemohon() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPemohon = useCallback(async () => {
    setLoading(true);

    const { data, error } = await getPemohon();

    if (error) {
      setError(error);
    } else {
      setData(data);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPemohon();
  }, [fetchPemohon]);

  async function tambahPemohon(payload) {
    const { error } = await createPemohon(payload);
    if (error) {
      return { error };
    }
    await fetchPemohon();
    return { error: null };
  }

  async function editPemohon(id, payload) {
    const { error } = await updatePemohon(id, payload);
    if (error) {
      return { error };
    }
    await fetchPemohon();
    return { error: null };
  }

  async function hapusPemohon(id) {
    const { error } = await deletePemohon(id);
    if (error) {
      return { error };
    }
    await fetchPemohon();
    return { error: null };
  }

  return {
    data,
    loading,
    error,
    tambahPemohon,
    editPemohon,
    hapusPemohon,
  };
}