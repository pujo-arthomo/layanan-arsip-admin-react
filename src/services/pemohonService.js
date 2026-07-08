import { supabase } from "./supabaseClient";

// Ambil semua pemohon
export async function getPemohon() {
  return await supabase
    .from("pemohon_arsip")
    .select("*")
    .order("created_at", { ascending: false });
}

// Tambah pemohon baru
export async function createPemohon(payload) {
  return await supabase
    .from("pemohon_arsip")
    .insert([payload]);
}

// Edit pemohon
export async function updatePemohon(id, payload) {
  return await supabase
    .from("pemohon_arsip")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id);
}

// Hapus pemohon
export async function deletePemohon(id) {
  return await supabase
    .from("pemohon_arsip")
    .delete()
    .eq("id", id);
}