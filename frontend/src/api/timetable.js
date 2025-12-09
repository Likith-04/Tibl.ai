export async function generateTimetable() {
  const resp = await fetch("http://127.0.0.1:8000/generate", {
    method: "POST",
  });

  if (!resp.ok) {
    throw new Error("Backend failed while generating timetable");
  }

  return resp.json(); // { filename, download_url }
}

export async function downloadFile(url, filename) {
  const resp = await fetch(url);

  if (!resp.ok) {
    throw new Error("Failed to download CSV");
  }

  const blob = await resp.blob();
  const link = document.createElement("a");
  const objectURL = URL.createObjectURL(blob);

  link.href = objectURL;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(objectURL);
}
