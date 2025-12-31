"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Image, LogOut } from "lucide-react";

export function Header() {
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Image className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">
            Lens Library
          </h1>
        </div>
        <Button variant="ghost" size="icon" onClick={logout} aria-label="Logout">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
