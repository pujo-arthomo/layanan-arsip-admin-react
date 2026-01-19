import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

export function useArsip() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchArsip() {
      setLoading(true);

      const { data, error } = await supabase
        .from("koleksi_arsip")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error);
      } else {
        setData(data);
      }

      setLoading(false);
    }

    fetchArsip();
  }, []);

  return { data, loading, error };
}
