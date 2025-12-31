import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";

export const getImages = async (
  page: number,
  limit: number
): Promise<{ images: ImagePlaceholder[]; hasMore: boolean }> => {
  const start = (page - 1) * limit;
  const end = page * limit;
  const images = PlaceHolderImages.slice(start, end);
  const hasMore = end < PlaceHolderImages.length;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ images, hasMore });
    }, 500); // Simulate network delay
  });
};

export const deleteImage = async (id: string): Promise<{ success: boolean }> => {
  // This is a mock API call. In a real app, you would make a request to your backend.
  console.log(`Deleting image with id: ${id}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 300);
  });
};

export const downloadImage = async (imageUrl: string, filename: string): Promise<{ success: boolean }> => {
  try {
    // We use a proxy to get around CORS issues with picsum.photos if any.
    // In a real app, your image storage (like S3/GCS) should have CORS configured.
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Network response was not ok, status: ${response.status}`);
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    return { success: true };
  } catch (error) {
    console.error("Error downloading image:", error);
    return { success: false };
  }
};
