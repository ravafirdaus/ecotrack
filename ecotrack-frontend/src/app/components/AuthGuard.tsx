"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function AuthGuard({
  children,
  adminOnly = false,
}: AuthGuardProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    // Belum login
    if (!token || !userData) {
      router.replace("/");
      return;
    }

    try {
      const user = JSON.parse(userData);

      // Halaman admin hanya untuk admin
      if (adminOnly && user.role !== "admin") {
        router.replace("/dashboard");
        return;
      }

      setChecking(false);
    } catch (error) {
      console.error("Data user tidak valid:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      router.replace("/");
    }
  }, [router, adminOnly]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          Memeriksa akses...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
