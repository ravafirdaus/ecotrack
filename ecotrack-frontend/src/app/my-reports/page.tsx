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

  pickup?: {
    id: number;
    pickup_date: string;
    pickup_address: string;
    notes: string | null;
    status: string;
  } | null;
}

export default function MyReports() {
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Anda belum login.");
      }

      const response = await fetch(
        "/api/waste-reports",
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Gagal mengambil laporan. Status: ${response.status}`
        );
      }

      const data = await response.json();

      setReports(data.data || []);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengambil laporan."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

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

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "border-yellow-200 bg-yellow-50 text-yellow-700";
      case "verified":
        return "border-blue-200 bg-blue-50 text-blue-700";
      case "scheduled":
        return "border-orange-200 bg-orange-50 text-orange-700";
      case "on_the_way":
        return "border-purple-200 bg-purple-50 text-purple-700";
      case "picked_up":
        return "border-green-200 bg-green-50 text-green-700";
      case "rejected":
        return "border-red-200 bg-red-50 text-red-700";
      default:
        return "border-gray-200 bg-gray-50 text-gray-700";
    }
  };

  const getPickupStatusLabel = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Terjadwal";
      case "on_the_way":
        return "Dalam Perjalanan";
      case "completed":
        return "Selesai";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  const getPickupStatusClass = (status: string) => {
    switch (status) {
      case "scheduled":
        return "border-orange-200 bg-orange-50 text-orange-700";
      case "on_the_way":
        return "border-purple-200 bg-purple-50 text-purple-700";
      case "completed":
        return "border-green-200 bg-green-50 text-green-700";
      case "cancelled":
        return "border-red-200 bg-red-50 text-red-700";
      default:
        return "border-gray-200 bg-gray-50 text-gray-700";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">

            {/* HEADER */}
            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
                  Riwayat Aktivitas
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Laporan Saya
                </h1>

                <p className="mt-2 text-gray-600">
                  Pantau seluruh laporan sampah dan proses pickup Anda.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={fetchReports}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <svg
                    className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 11a8 8 0 10-2.34 5.66M20 11V5m0 6h-6"
                    />
                  </svg>

                  Refresh
                </button>

                <Link
                  href="/report"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-200"
                >
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
                      d="M12 5v14M5 12h14"
                    />
                  </svg>

                  Buat Laporan
                </Link>
              </div>
            </div>

            {/* SUMMARY */}
            {!loading && !error && (
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <p className="text-sm font-medium text-gray-500">
                    Total Laporan
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {reports.length}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <p className="text-sm font-medium text-gray-500">
                    Sedang Diproses
                  </p>

                  <p className="mt-2 text-3xl font-bold text-blue-600">
                    {
                      reports.filter(
                        (report) =>
                          report.status === "pending" ||
                          report.status === "verified" ||
                          report.status === "scheduled" ||
                          report.status === "on_the_way"
                      ).length
                    }
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <p className="text-sm font-medium text-gray-500">
                    Sudah Diambil
                  </p>

                  <p className="mt-2 text-3xl font-bold text-green-600">
                    {
                      reports.filter(
                        (report) => report.status === "picked_up"
                      ).length
                    }
                  </p>
                </div>
              </div>
            )}

            {/* MAIN CARD */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

              {/* CARD HEADER */}
              <div className="border-b border-gray-100 bg-green-50 px-6 py-5 sm:px-8">
                <h2 className="text-xl font-bold text-gray-900">
                  Daftar Laporan
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  Berikut adalah riwayat laporan sampah yang Anda buat.
                </p>
              </div>

              {/* LOADING */}
              {loading ? (
                <div className="space-y-4 p-6 sm:p-8">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-40 animate-pulse rounded-2xl border border-gray-200 bg-gray-50"
                    />
                  ))}
                </div>
              ) : error ? (
                /* ERROR */
                <div className="px-6 py-16 text-center sm:px-8">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
                    <svg
                      className="h-8 w-8"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v4m0 4h.01M10.3 3.5l-7.2 12.5A2 2 0 004.8 19h14.4a2 2 0 001.73-3L13.73 3.5a2 2 0 00-3.46 0z"
                      />
                    </svg>
                  </div>

                  <h3 className="mt-4 font-semibold text-gray-900">
                    Gagal Memuat Laporan
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                    {error}
                  </p>

                  <button
                    onClick={fetchReports}
                    className="mt-5 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
                  >
                    Coba Lagi
                  </button>
                </div>
              ) : reports.length === 0 ? (
                /* EMPTY STATE */
                <div className="px-6 py-16 text-center sm:px-8">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                    <svg
                      className="h-8 w-8"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h6M9 16h4M7 4h7l3 3v13H7V4z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14 4v4h4"
                      />
                    </svg>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    Belum Ada Laporan
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                    Anda belum membuat laporan sampah. Buat laporan pertama
                    Anda untuk memulai proses pickup.
                  </p>

                  <Link
                    href="/report"
                    className="mt-5 inline-flex rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
                  >
                    Buat Laporan
                  </Link>
                </div>
              ) : (
                /* REPORT LIST */
                <div className="divide-y divide-gray-100">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="p-6 transition hover:bg-gray-50 sm:p-8"
                    >
                      {/* REPORT TOP */}
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 gap-4">
                          <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700 sm:flex">
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
                                d="M7 4h10v16H7V4z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 8h6M9 12h6M9 16h4"
                              />
                            </svg>
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                              Laporan #{report.id}
                            </p>

                            <h3 className="mt-1 text-lg font-bold text-gray-900">
                              {report.description || "Laporan Sampah"}
                            </h3>
                          </div>
                        </div>

                        <span
                          className={`inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                            report.status
                          )}`}
                        >
                          {getStatusLabel(report.status)}
                        </span>
                      </div>

                      {/* REPORT DETAILS */}
                      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="rounded-xl bg-gray-50 p-4">
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Lokasi Pickup
                          </p>

                          <p className="mt-1 font-medium text-gray-800">
                            {report.location}
                          </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-4">
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Berat Sampah
                          </p>

                          <p className="mt-1 font-medium text-gray-800">
                            {report.weight} kg
                          </p>
                        </div>
                      </div>

                      {/* PICKUP DETAIL */}
                      {report.pickup && (
                        <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-5">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
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
                                      d="M3 7h11v10H3V7zm11 3h4l3 3v4h-7v-7z"
                                    />
                                    <circle cx="7" cy="18" r="2" />
                                    <circle cx="18" cy="18" r="2" />
                                  </svg>
                                </div>

                                <h4 className="font-bold text-blue-900">
                                  Detail Pickup
                                </h4>
                              </div>

                              <p className="mt-2 text-sm text-blue-700">
                                Informasi jadwal pengambilan sampah.
                              </p>
                            </div>

                            <span
                              className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-xs font-semibold ${getPickupStatusClass(
                                report.pickup.status
                              )}`}
                            >
                              {getPickupStatusLabel(report.pickup.status)}
                            </span>
                          </div>

                          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="rounded-xl border border-blue-100 bg-white p-4">
                              <p className="text-xs font-medium text-gray-400">
                                Tanggal Pickup
                              </p>

                              <p className="mt-1 font-medium text-gray-800">
                                {formatDate(report.pickup.pickup_date)}
                              </p>
                            </div>

                            <div className="rounded-xl border border-blue-100 bg-white p-4">
                              <p className="text-xs font-medium text-gray-400">
                                Alamat Pickup
                              </p>

                              <p className="mt-1 font-medium text-gray-800">
                                {report.pickup.pickup_address}
                              </p>
                            </div>
                          </div>

                          {report.pickup.notes && (
                            <div className="mt-3 rounded-xl border border-blue-100 bg-white p-4">
                              <p className="text-xs font-medium text-gray-400">
                                Catatan
                              </p>

                              <p className="mt-1 text-sm text-gray-700">
                                {report.pickup.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BOTTOM INFO */}
            {!loading && !error && reports.length > 0 && (
              <div className="mt-5 rounded-xl border border-gray-200 bg-white px-5 py-4 text-center text-sm text-gray-500 shadow-sm">
                Menampilkan {reports.length} laporan sampah Anda.
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
