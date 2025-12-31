"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import * as imageService from "@/services/imageService";
import type { ImagePlaceholder } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/Header";
import { ImageCard } from "@/components/ImageCard";
import { BatchActions } from "@/components/BatchActions";
import { Frown, Loader2 } from "lucide-react";

const IMAGES_PER_PAGE = 12;

export default function HomePage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [images, setImages] = useState<ImagePlaceholder[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadImages();
    }
  }, [isAuthenticated]);

  const loadImages = async (currentPage = page) => {
    if (!hasMore && currentPage > 1) return;
    setIsLoading(true);
    try {
      const { images: newImages, hasMore: newHasMore } =
        await imageService.getImages(currentPage, IMAGES_PER_PAGE);
      setImages((prev) => (currentPage === 1 ? newImages : [...prev, ...newImages]));
      setHasMore(newHasMore);
      if (currentPage === 1) setPage(2);
      else setPage((p) => p + 1);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load images.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  
  const handleStartSelection = (id: string) => {
     setSelectedIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleDelete = async (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    
    const res = await imageService.deleteImage(id);
    if(res.success) {
        toast({
            title: "Image Deleted",
            description: "The image has been successfully removed.",
        });
    } else {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete image.",
        });
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    const res = await imageService.downloadImage(url, filename);
    if(res.success){
        toast({
          title: "Download Started",
          description: `${filename} is downloading.`,
        });
    } else {
        toast({
            variant: "destructive",
            title: "Download Failed",
            description: `Could not download ${filename}.`,
        });
    }
  };

  const handleBatchDownload = async () => {
    setIsDownloading(true);
    toast({
        title: "Starting Batch Download",
        description: `Preparing to download ${selectedIds.size} images.`,
    });

    for (const id of selectedIds) {
      const image = images.find((img) => img.id === id);
      if (image) {
        await imageService.downloadImage(image.imageUrl, `image-${image.id}.jpg`);
        await new Promise((resolve) => setTimeout(resolve, 500)); // Delay between downloads
      }
    }
    
    setIsDownloading(false);
    toast({
        title: "Batch Download Complete",
        description: "All selected images have been downloaded.",
    });
    handleDeselectAll();
  };

  if (isAuthLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isSelectionMode = selectedIds.size > 0;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {images.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {images.map((image) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  isSelected={selectedIds.has(image.id)}
                  isSelectionMode={isSelectionMode}
                  onToggleSelection={handleToggleSelection}
                  onStartSelection={handleStartSelection}
                  onDelete={handleDelete}
                  onDownload={handleDownload}
                />
              ))}
              {isLoading &&
                page > 1 &&
                Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="aspect-[3/2] w-full rounded-lg" />
                ))}
            </div>
          )}

          {isLoading && page === 1 && (
             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: IMAGES_PER_PAGE }).map((_, index) => (
                <Skeleton key={index} className="aspect-[3/2] w-full rounded-lg" />
              ))}
            </div>
          )}

          {!isLoading && images.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 py-24 text-center">
                <Frown className="h-16 w-16 text-muted-foreground/50" />
                <h2 className="mt-4 text-xl font-semibold">No Images Found</h2>
                <p className="mt-2 text-sm text-muted-foreground">It seems your gallery is empty.</p>
            </div>
          )}

          {hasMore && !isLoading && (
            <div className="mt-8 flex justify-center">
              <Button onClick={() => loadImages()} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Load More
              </Button>
            </div>
          )}
        </div>
      </main>
      <BatchActions
        selectedCount={selectedIds.size}
        onDownload={handleBatchDownload}
        onDeselectAll={handleDeselectAll}
        isDownloading={isDownloading}
      />
    </div>
  );
}
