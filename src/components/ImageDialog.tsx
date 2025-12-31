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
import { Download } from "lucide-react";
import type { ImagePlaceholder } from "@/lib/placeholder-images";

interface ImageDialogProps {
  image: ImagePlaceholder;
  onClose: () => void;
  onDownload: (url: string, filename: string) => void;
}

export function ImageDialog({ image, onClose, onDownload }: ImageDialogProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="truncate">{image.description}</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-video">
          <Image
            src={image.imageUrl}
            alt={image.description}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <DialogFooter className="p-4 pt-0">
          <Button
            onClick={() => onDownload(image.imageUrl, `image-${image.id}.jpg`)}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
