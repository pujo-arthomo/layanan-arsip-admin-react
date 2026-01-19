import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

export function usePemohon() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPemohon() {
      setLoading(true);

      const { data, error } = await supabase
        .from("pemohon_arsip")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error);
      } else {
        setData(data);
      }

      setLoading(false);
    }

    fetchPemohon();
  }, []);

  return { data, loading, error };
}
