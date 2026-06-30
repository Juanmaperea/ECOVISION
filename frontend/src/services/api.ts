const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

export async function sendFrameForDetection(frame: Blob) {
  const formData = new FormData();
  formData.append("frame", frame, "frame.jpg");

  const response = await fetch(`${API_BASE_URL}/detect`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("No se pudo procesar la imagen");
  }

  return response.json();
}
