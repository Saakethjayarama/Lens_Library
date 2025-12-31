export type ImagePlaceholder = {
  id: string;
  imageUrl: string;
};

const API_BASE_URL = "http://192.168.0.107:8000";

/**
 * GET /images
 */
export const getImages = async (
  page: number,
  limit: number
): Promise<{ images: ImagePlaceholder[]; hasMore: boolean }> => {
  const response = await fetch(
    `${API_BASE_URL}/images?page=${page}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch images: ${response.status}`);
  }

  return response.json();
};

/**
 * DELETE /images/{id}
 */
export const deleteImage = async (
  id: string
): Promise<{ success: boolean }> => {
  const response = await fetch(
    `${API_BASE_URL}/images/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete image: ${response.status}`);
  }

  return response.json();
};

/**
 * GET /images/download/{id}
 * Forces browser download
 */
export const downloadImage = async (
  id: string
): Promise<{ success: boolean }> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/images/download/${encodeURIComponent(id)}`
    );

    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = id;
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};
