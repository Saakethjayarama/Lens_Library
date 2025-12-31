"use client";

import Image from "next/image";
import { Check, Download, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ImagePlaceholder } from "@/lib/placeholder-images";
import useLongPress from "@/hooks/useLongPress";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { MouseEvent, TouchEvent } from "react";

interface ImageCardProps {
  image: ImagePlaceholder;
  isSelected: boolean;
  isSelectionMode: boolean;
  onToggleSelection: (id: string) => void;
  onStartSelection: (id: string) => void;
  onViewImage: (image: ImagePlaceholder) => void;
  onDelete: (id: string) => void;
  onDownload: (url: string, filename: string) => void;
}

export function ImageCard({
  image,
  isSelected,
  isSelectionMode,
  onToggleSelection,
  onStartSelection,
  onViewImage,
  onDelete,
  onDownload,
}: ImageCardProps) {
  const handleLongPress = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    if (!isSelectionMode) {
      onStartSelection(image.id);
    }
  };

  const handleClick = (event: MouseEvent | TouchEvent) => {
    if (isSelectionMode) {
      event.preventDefault();
      onToggleSelection(image.id);
    } else {
      onViewImage(image);
    }
  };

  const longPressEvents = useLongPress(handleLongPress, handleClick, { delay: 300 });

  return (
    <Card
      {...longPressEvents}
      className={cn(
        "group relative overflow-hidden rounded-lg shadow-sm transition-all duration-300 ease-in-out cursor-pointer",
        "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background",
        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
    >
      <CardContent className="p-0">
        <img
          src={`http://192.168.0.107:8000${image.imageUrl}`}
          alt={image.description}
          width={600}
          height={400}
          className="aspect-[3/2] w-full object-cover transition-transform duration-300 group-hover:scale-105 animate-in fade-in"
          data-ai-hint={image.imageHint}
        />
        
        <div
          className={cn(
            "absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300",
            (isSelectionMode || isSelected) ? "group-hover:opacity-100" : "group-hover:opacity-50",
            isSelected && "opacity-100"
          )}
          aria-hidden="true"
        />

        {/* Selection Checkbox */}
        <div
          onClick={(e) => {
            e.stopPropagation(); // prevent card click
            onToggleSelection(image.id)
          }}
          className={cn(
            "absolute left-3 top-3 z-10 h-6 w-6 cursor-pointer rounded-full border-2 border-white bg-white/30 backdrop-blur-sm transition-all",
            "flex items-center justify-center",
            isSelectionMode ? "opacity-100 scale-100" : "opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100",
            isSelected && "bg-primary border-primary"
          )}
          aria-label={isSelected ? "Deselect image" : "Select image"}
          role="checkbox"
          aria-checked={isSelected}
        >
          {isSelected && <Check className="h-4 w-4 text-primary-foreground" />}
        </div>

        {/* Action Buttons */}
         <div className={cn(
            "absolute right-3 top-3 z-10 flex flex-col gap-2 transition-opacity duration-300",
            isSelectionMode ? "opacity-0" : "opacity-0 group-hover:opacity-100"
          )}>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onDownload(image.id, `image-${image.id}.jpg`);
            }}
            aria-label="Download image"
          >
            <Download className="h-4 w-4" />
          </Button>
          {/* <Button
            variant="destructive"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(image.id);
            }}
            aria-label="Delete image"
          >
            <Trash2 className="h-4 w-4" />
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
}
