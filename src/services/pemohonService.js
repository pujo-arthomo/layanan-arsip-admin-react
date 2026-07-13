import { supabase } from "./supabaseClient";

function buatNomorLayanan() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
  return `LYN-${stamp}`;
}

export async function getPemohon() {
  return await supabase
    .from("pemohon_arsip")
    .select("*")
    .order("created_at", { ascending: false });
}

export async function createPemohon(payload) {
  return await supabase
    .from("pemohon_arsip")
    .insert([{ ...payload, nomor_layanan: buatNomorLayanan() }]);
}

export async function updatePemohon(id, payload) {
  return await supabase
    .from("pemohon_arsip")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id);
}

export async function deletePemohon(id) {
  return await supabase
    .from("pemohon_arsip")
    .delete()
    .eq("id", id);
}