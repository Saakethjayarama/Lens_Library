"use client";

import { Button } from "@/components/ui/button";
import { Download, Loader2, X } from "lucide-react";

interface BatchActionsProps {
  selectedCount: number;
  onDownload: () => void;
  onDeselectAll: () => void;
  isDownloading: boolean;
}

export function BatchActions({
  selectedCount,
  onDownload,
  onDeselectAll,
  isDownloading,
}: BatchActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-4 rounded-full border bg-card p-2 pr-4 text-card-foreground shadow-lg transition-all animate-in slide-in-from-bottom-10">
        <span className="text-sm font-medium">
          {selectedCount} item{selectedCount > 1 ? "s" : ""} selected
        </span>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={onDownload}
            disabled={isDownloading}
            className="rounded-full"
          >
            {isDownloading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Download
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDeselectAll}
            className="rounded-full"
            aria-label="Deselect all"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
