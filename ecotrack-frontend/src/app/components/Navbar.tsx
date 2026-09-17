"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Data user tidak valid:", error);
      }
    }
  }, []);

  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/");
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navLinkClass = (path: string) => {
    return `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive(path)
        ? "bg-green-100 text-green-800"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* LOGO */}
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center"
          >
            <img
              src="/ecotrack-logo.png"
              alt="EcoTrack Logo"
              className="w-36 h-auto"
            />
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden items-center gap-1 md:flex">
            <Link
              href="/dashboard"
              className={navLinkClass("/dashboard")}
            >
              Dashboard
            </Link>

            <Link
              href="/my-reports"
              className={navLinkClass("/my-reports")}
            >
              Laporan Saya
            </Link>

            <Link
              href="/report"
              className={navLinkClass("/report")}
            >
              Buat Laporan
            </Link>

            {isAdmin && (
              <>
                <div className="mx-2 h-6 w-px bg-gray-200" />

                <Link
                  href="/admin/reports"
                  className={navLinkClass("/admin/reports")}
                >
                  Admin Laporan
                </Link>

                <Link
                  href="/admin/pickups"
                  className={navLinkClass("/admin/pickups")}
                >
                  Admin Pickup
                </Link>
              </>
            )}
          </div>

          {/* DESKTOP USER */}
          <div className="hidden items-center gap-4 md:flex">
            {user && (
              <div className="flex items-center gap-3">
                <div className="hidden text-right lg:block">
                  <p className="text-sm font-semibold text-gray-800">
                    {user.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    {isAdmin ? "Administrator" : "User"}
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              Logout
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6l12 12M18 6L6 18"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* MOBILE NAVIGATION */}
        {mobileOpen && (
          <div className="border-t border-gray-100 py-4 md:hidden">
            <div className="flex flex-col gap-1">

              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className={navLinkClass("/dashboard")}
              >
                Dashboard
              </Link>

              <Link
                href="/my-reports"
                onClick={() => setMobileOpen(false)}
                className={navLinkClass("/my-reports")}
              >
                Laporan Saya
              </Link>

              <Link
                href="/report"
                onClick={() => setMobileOpen(false)}
                className={navLinkClass("/report")}
              >
                Buat Laporan
              </Link>

              {isAdmin && (
                <>
                  <div className="my-2 border-t border-gray-100" />

                  <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Admin
                  </p>

                  <Link
                    href="/admin/reports"
                    onClick={() => setMobileOpen(false)}
                    className={navLinkClass("/admin/reports")}
                  >
                    Admin Laporan
                  </Link>

                  <Link
                    href="/admin/pickups"
                    onClick={() => setMobileOpen(false)}
                    className={navLinkClass("/admin/pickups")}
                  >
                    Admin Pickup
                  </Link>
                </>
              )}

              {user && (
                <div className="mt-3 border-t border-gray-100 pt-4">
                  <div className="mb-3 flex items-center gap-3 px-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {user.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {isAdmin ? "Administrator" : "User"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
