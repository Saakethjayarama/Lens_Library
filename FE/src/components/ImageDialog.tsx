"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import type { ImagePlaceholder } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

interface ImageDialogProps {
  image: ImagePlaceholder;
  onClose: () => void;
  onDownload: (url: string, filename: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

export function ImageDialog({
  image,
  onClose,
  onDownload,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
}: ImageDialogProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="truncate">{image.description}</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-video group">
          <img
            src={`http://localhost:8000{image.imageUrl}`}
            alt={image.description || ""}
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 66vw"
          />

          {hasPrevious && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
              onClick={onPrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          )}

          {hasNext && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
              onClick={onNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          )}
        </div>
        <DialogFooter className="p-4 pt-0">
          <Button
            onClick={() => onDownload(image.id, `image-${image.id}.jpg`)}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
