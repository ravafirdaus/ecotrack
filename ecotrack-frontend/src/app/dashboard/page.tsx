"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AuthGuard from "../components/AuthGuard";

interface WasteReport {
  id: number;
  description: string;
  location: string;
  weight: string;
  status: string;
  waste_type?: {
    id: number;
    name: string;
  } | null;
}

interface Pickup {
  id: number;
  pickup_date: string;
  pickup_address: string;
  status: string;
  waste_report?: {
    id: number;
    description: string;
    location: string;
    weight: string;
  } | null;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token login tidak ditemukan.");
      }

      const reportsResponse = await fetch(
        "/api/waste-reports",
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!reportsResponse.ok) {
        throw new Error(
          `Gagal mengambil laporan. Status: ${reportsResponse.status}`
        );
      }

      const reportsData = await reportsResponse.json();

      setReports(reportsData.data || []);

      if (isAdmin) {
        const pickupsResponse = await fetch(
          "/api/pickups",
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!pickupsResponse.ok) {
          throw new Error(
            `Gagal mengambil pickup. Status: ${pickupsResponse.status}`
          );
        }

        const pickupsData = await pickupsResponse.json();

        setPickups(pickupsData.data || []);
      } else {
        setPickups([]);
      }
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengambil data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboard();
    }
  }, [user]);

  const totalReports = reports.length;

  const pendingReports = reports.filter(
    (report) => report.status === "pending"
  ).length;

  const processingReports = reports.filter(
    (report) =>
      report.status === "verified" ||
      report.status === "scheduled" ||
      report.status === "on_the_way"
  ).length;

  const pickedUpReports = reports.filter(
    (report) => report.status === "picked_up"
  ).length;

  const scheduledPickups = pickups.filter(
    (pickup) => pickup.status === "scheduled"
  ).length;

  const onTheWayPickups = pickups.filter(
    (pickup) => pickup.status === "on_the_way"
  ).length;

  const completedPickups = pickups.filter(
    (pickup) => pickup.status === "completed"
  ).length;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Menunggu Verifikasi";
      case "verified":
        return "Terverifikasi";
      case "scheduled":
        return "Pickup Terjadwal";
      case "on_the_way":
        return "Dalam Perjalanan";
      case "picked_up":
        return "Sudah Diambil";
      case "rejected":
        return "Ditolak";
      default:
        return status;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return "border-amber-200 bg-amber-50 text-amber-700";

      case "verified":
        return "border-blue-200 bg-blue-50 text-blue-700";

      case "scheduled":
        return "border-purple-200 bg-purple-50 text-purple-700";

      case "on_the_way":
        return "border-orange-200 bg-orange-50 text-orange-700";

      case "picked_up":
        return "border-green-200 bg-green-50 text-green-700";

      case "rejected":
        return "border-red-200 bg-red-50 text-red-700";

      default:
        return "border-gray-200 bg-gray-50 text-gray-600";
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <AuthGuard>
      <Navbar />

      <main className="min-h-screen bg-[#f5faf7]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

          {/* HERO */}
          <section className="relative mb-6 overflow-hidden rounded-[2rem] bg-[#166534] px-6 py-6 text-white shadow-sm sm:px-8 sm:py-7 lg:px-10">

            {/* decorative shapes */}
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#22c55e]/30" />
            <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[#0f5132]/40" />

            <div className="relative z-10 max-w-3xl">
              <div className="mb-3 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-green-50">
                {isAdmin ? "Admin Panel" : "EcoTrack"}
              </div>

              <h1 className="max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl">  {isAdmin
                  ? `Halo, ${user?.name || "Admin"}`
                  : `Halo, ${user?.name || "Pengguna"}`}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-green-50/90 sm:text-base">  {isAdmin
                  ? "Pantau dan kelola seluruh aktivitas pengelolaan sampah dalam satu sistem."
                  : "Kelola laporan sampah dan pantau proses pickup Anda dengan mudah."}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                {isAdmin ? (
                  <Link
                    href="/admin/reports"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#166534] shadow-sm transition hover:bg-green-50"
                  >
                    Kelola Laporan
                    <span>→</span>
                  </Link>
                ) : (
                  <Link
                    href="/report"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#166534] shadow-sm transition hover:bg-green-50"
                  >
                    Buat Laporan
                    <span>→</span>
                  </Link>
                )}

                <Link
                  href="/my-reports"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Lihat Aktivitas
                </Link>
              </div>
            </div>
          </section>

          {/* ERROR */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
              <span className="mt-0.5">!</span>

              <div>
                <p className="font-semibold">
                  Data belum dapat dimuat
                </p>

                <p className="mt-1 text-red-600">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* STATISTICS */}
          <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* TOTAL */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Laporan
                  </p>

                  <p className="mt-3 text-4xl font-black text-gray-900">
                    {loading ? "—" : totalReports}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-[#166534]">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 4h8a2 2 0 012 2v14H6V6a2 2 0 012-2z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 9h6M9 13h6M9 17h4"
                    />
                  </svg>
                </div>
              </div>

              <p className="mt-5 text-xs text-gray-500">
                {isAdmin
                  ? "Seluruh laporan dalam sistem"
                  : "Seluruh laporan yang Anda buat"}
              </p>
            </div>

            {/* PENDING */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Menunggu Verifikasi
                  </p>

                  <p className="mt-3 text-4xl font-black text-amber-600">
                    {loading ? "—" : pendingReports}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="12" cy="12" r="8.5" />
                    <path
                      strokeLinecap="round"
                      d="M12 7v5l3 2"
                    />
                  </svg>
                </div>
              </div>

              <p className="mt-5 text-xs text-gray-500">
                Laporan yang membutuhkan verifikasi
              </p>
            </div>

            {/* PROCESSING / PICKUP */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {isAdmin ? "Pickup Terjadwal" : "Sedang Diproses"}
                  </p>

                  <p className="mt-3 text-4xl font-black text-blue-600">
                    {loading
                      ? "—"
                      : isAdmin
                      ? scheduledPickups
                      : processingReports}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 7h11v10H3z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 10h4l3 3v4h-7z"
                    />
                    <circle cx="7" cy="19" r="1.5" />
                    <circle cx="18" cy="19" r="1.5" />
                  </svg>
                </div>
              </div>

              <p className="mt-5 text-xs text-gray-500">
                {isAdmin
                  ? "Pickup yang menunggu proses"
                  : "Laporan yang sedang dalam proses"}
              </p>
            </div>

            {/* COMPLETED */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {isAdmin ? "Sampah Diambil" : "Sudah Diambil"}
                  </p>

                  <p className="mt-3 text-4xl font-black text-green-600">
                    {loading
                      ? "—"
                      : isAdmin
                      ? completedPickups
                      : pickedUpReports}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 6L9 17l-5-5"
                    />
                  </svg>
                </div>
              </div>

              <p className="mt-5 text-xs text-gray-500">
                {isAdmin
                  ? "Pickup yang sudah selesai"
                  : "Laporan yang sudah selesai diambil"}
              </p>
            </div>
          </section>

          {/* ADMIN PICKUP ACTIVITY */}
          {isAdmin && (
            <section className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#166534]">
                    Operasional
                  </p>

                  <h2 className="mt-1 text-xl font-black text-gray-900">
                    Aktivitas Pickup
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Ringkasan proses pengambilan sampah.
                  </p>
                </div>

                <Link
                  href="/admin/pickups"
                  className="text-sm font-bold text-[#166534] hover:text-green-800"
                >
                  Kelola Pickup →
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#fff8ed] p-5">
                  <p className="text-sm font-medium text-orange-600">
                    Terjadwal
                  </p>

                  <p className="mt-2 text-3xl font-black text-orange-600">
                    {loading ? "—" : scheduledPickups}
                  </p>

                  <p className="mt-1 text-xs text-orange-700/70">
                    Menunggu keberangkatan
                  </p>
                </div>

                <div className="rounded-2xl bg-[#f7f0ff] p-5">
                  <p className="text-sm font-medium text-purple-600">
                    Dalam Perjalanan
                  </p>

                  <p className="mt-2 text-3xl font-black text-purple-600">
                    {loading ? "—" : onTheWayPickups}
                  </p>

                  <p className="mt-1 text-xs text-purple-700/70">
                    Pickup sedang berjalan
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* RECENT REPORTS */}
          <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-gray-100 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#166534]">
                  Aktivitas
                </p>

                <h2 className="mt-1 text-xl font-black text-gray-900">
                  Laporan Terbaru
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Aktivitas laporan sampah terbaru dalam sistem.
                </p>
              </div>

              <Link
                href={isAdmin ? "/admin/reports" : "/my-reports"}
                className="text-sm font-bold text-[#166534] hover:text-green-800"
              >
                Lihat Semua →
              </Link>
            </div>

            {loading ? (
              <div className="px-6 py-12 text-center text-sm text-gray-500">
                Memuat laporan...
              </div>
            ) : reports.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-[#166534]">
                  ♻
                </div>

                <p className="mt-4 font-semibold text-gray-800">
                  Belum ada laporan
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Mulai dengan membuat laporan sampah baru.
                </p>

                {!isAdmin && (
                  <Link
                    href="/report"
                    className="mt-5 inline-flex rounded-xl bg-[#166534] px-5 py-2.5 text-sm font-bold text-white hover:bg-green-800"
                  >
                    Buat Laporan
                  </Link>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {reports.slice(0, 5).map((report) => (
                  <div
                    key={report.id}
                    className="flex flex-col gap-4 px-6 py-5 transition hover:bg-green-50/40 sm:flex-row sm:items-center sm:justify-between sm:px-7"
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-[#166534]">
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 4h12v16H6z"
                          />
                          <path
                            strokeLinecap="round"
                            d="M9 8h6M9 12h6M9 16h4"
                          />
                        </svg>
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          Laporan #{report.id}
                        </p>

                        <h3 className="mt-1 truncate font-bold text-gray-900">
                          {report.description || "Laporan sampah"}
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                          <span>⌖ {report.location}</span>
                          <span>▣ {report.weight} kg</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span
                        className={`rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                          report.status
                        )}`}
                      >
                        {getStatusLabel(report.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* FOOTER MESSAGE */}
          <div className="py-8 text-center">
            <p className="text-xs text-gray-400">
              EcoTrack • Waste Management System
            </p>
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}
