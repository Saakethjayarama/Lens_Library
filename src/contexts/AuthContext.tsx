"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const token = sessionStorage.getItem("authToken");
      if (token) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Could not access session storage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (token: string) => {
    try {
      sessionStorage.setItem("authToken", token);
      setIsAuthenticated(true);
      router.push("/");
    } catch (error) {
      console.error("Could not access session storage:", error);
    }
  };

  const logout = () => {
    try {
      sessionStorage.removeItem("authToken");
      setIsAuthenticated(false);
      router.push("/login");
    } catch (error) {
      console.error("Could not access session storage:", error);
    }
  };

  const value = { isAuthenticated, login, logout, isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
