import { supabase } from "./supabaseClient";

// Ambil semua arsip
export async function getArsip() {
  return await supabase
    .from("koleksi_arsip")
    .select("*")
    .order("created_at", { ascending: false });
}

// Tambah arsip baru
export async function createArsip(payload) {
  return await supabase
    .from("koleksi_arsip")
    .insert([payload]);
}