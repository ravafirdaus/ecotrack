"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({
  children,
}: AdminGuardProps) {
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

      // Bukan admin
      if (user.role !== "admin") {
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
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Memeriksa akses admin...
      </div>
    );
  }

  return <>{children}</>;
}
