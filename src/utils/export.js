import Papa from "papaparse";

function timestampFilename(prefix, ext) {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
  return `${prefix}-${stamp}.${ext}`;
}

export function exportCsv(prefix, rows) {
  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = timestampFilename(prefix, "csv");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function cetakPdf(judul, kolom, rows) {
  const waktu = new Date().toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const tableHead = kolom.map((k) => `<th>${k.label}</th>`).join("");
  const tableRows = rows
    .map(
      (row) =>
        `<tr>${kolom
          .map((k) => `<td>${row[k.field] ?? ""}</td>`)
          .join("")}</tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>${judul}</title>
<style>
  body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
  h1 { font-size: 18px; margin-bottom: 2px; }
  p.waktu { font-size: 12px; color: #555; margin-top: 0; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; font-size: 11px; }
  th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
  th { background: #f0f0f0; }
</style>
</head>
<body>
  <h1>${judul}</h1>
  <p class="waktu">Dicetak pada: ${waktu}</p>
  <table>
    <thead><tr>${tableHead}</tr></thead>
    <tbody>${tableRows}</tbody>
  </table>
</body>
</html>`;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => {
    win.print();
  }, 250);
}