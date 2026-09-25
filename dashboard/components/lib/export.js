/**
 * Report export generators (JSON/CSV) + browser download handler. Stub data only.
 */

/**
 * @param {any[] | object} data
 * @returns {string}
 */
export function toJSON(data) {
  return JSON.stringify(data, null, 2);
}

/**
 * @param {object[]} rows
 * @param {string[]} columns
 * @returns {string}
 */
export function toCSV(rows, columns) {
  const esc = (v) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [columns.join(","), ...rows.map((r) => columns.map((c) => esc(r[c])).join(","))].join("\n");
}

/**
 * Triggers a client-side file download.
 * @param {string} filename
 * @param {string} content
 * @param {string} mime
 */
export function download(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
