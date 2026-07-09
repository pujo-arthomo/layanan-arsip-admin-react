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

// Edit arsip
export async function updateArsip(id, payload) {
  return await supabase
    .from("koleksi_arsip")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id);
}

// Hapus arsip
export async function deleteArsip(id) {
  return await supabase
    .from("koleksi_arsip")
    .delete()
    .eq("id", id);
}

// Upload file scan arsip
export async function uploadArsipFile(file) {
  const filePath = `${Date.now()}-${file.name}`;
  const { error } = await supabase.storage
    .from("arsip-files")
    .upload(filePath, file);

  if (error) {
    return { path: null, error };
  }

  return { path: filePath, error: null };
}

// Ambil link sementara buat lihat/download file (berlaku 5 menit)
export async function getArsipFileUrl(path) {
  return await supabase.storage
    .from("arsip-files")
    .createSignedUrl(path, 300);
}