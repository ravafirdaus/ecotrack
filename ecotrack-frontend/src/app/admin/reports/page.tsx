"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import AuthGuard from "../../components/AuthGuard";

interface WasteReport {
  id: number;
  description: string;
  location: string;
  weight: string;
  status: string;

  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export default function AdminReports() {
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [showPickup, setShowPickup] = useState<number | null>(null);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [pickupNotes, setPickupNotes] = useState("");

  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchReports = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token admin tidak ditemukan.");
      }

      const response = await fetch("/api/waste-reports", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Gagal mengambil data. Status: ${response.status}`
        );
      }

      const data = await response.json();

      setReports(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengambil laporan."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const verifyReport = async (id: number) => {
    try {
      setActionLoading(id);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token admin tidak ditemukan.");
      }

      const response = await fetch(`/api/waste-reports/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: "verified",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal melakukan verifikasi laporan."
        );
      }

      setSuccess(`Laporan #${id} berhasil diverifikasi.`);

      await fetchReports();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Gagal melakukan verifikasi laporan."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const createPickup = async (reportId: number) => {
    if (!pickupDate || !pickupAddress.trim()) {
      setError("Tanggal dan alamat pickup wajib diisi.");
      return;
    }

    try {
      setActionLoading(reportId);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token admin tidak ditemukan.");
      }

      const response = await fetch("/api/pickups", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            waste_report_id: reportId,
            pickup_date: pickupDate,
            pickup_address: pickupAddress.trim(),
            notes: pickupNotes.trim() || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal menjadwalkan pickup."
        );
      }

      setSuccess(`Pickup untuk laporan #${reportId} berhasil dijadwalkan.`);

      closePickupForm();

      await fetchReports();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Gagal menjadwalkan pickup."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const closePickupForm = () => {
    setShowPickup(null);
    setPickupDate("");
    setPickupAddress("");
    setPickupNotes("");
  };

  const openPickupForm = (report: WasteReport) => {
    setShowPickup(report.id);
    setPickupAddress(report.location);
    setPickupDate("");
    setPickupNotes("");
    setError("");
    setSuccess("");
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Menunggu Verifikasi";
      case "verified":
        return "Terverifikasi";
      case "scheduled":
        return "Terjadwal";
      case "on_the_way":
        return "Dalam Perjalanan";
      case "picked_up":
        return "Sudah Diambil";
      case "rejected":
        return "Ditolak";
      case "cancelled":
        return "Dibatalkan";
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
      case "cancelled":
        return "border-gray-200 bg-gray-100 text-gray-600";
      default:
        return "border-gray-200 bg-gray-50 text-gray-700";
    }
  };

  const totalReports = reports.length;

  const pendingReports = reports.filter(
    (report) => report.status === "pending"
  ).length;

  const scheduledReports = reports.filter(
    (report) => report.status === "scheduled"
  ).length;

  const completedReports = reports.filter(
    (report) => report.status === "picked_up"
  ).length;

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <AuthGuard adminOnly>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">

            {/* HEADER */}
            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
                  Admin Panel
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Manajemen Laporan
                </h1>

                <p className="mt-2 text-gray-600">
                  Kelola verifikasi laporan dan jadwal pickup sampah.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => fetchReports(true)}
                  disabled={refreshing || loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <svg
                    className={`h-4 w-4 ${
                      refreshing ? "animate-spin" : ""
                    }`}
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
                  href="/admin/pickups"
                  className="inline-flex items-center justify-center rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
                >
                  Kelola Pickup
                </Link>
              </div>
            </div>

            {/* SUCCESS */}
            {success && (
              <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-green-700">
                <p className="font-semibold">Berhasil</p>
                <p className="mt-1 text-sm">{success}</p>
              </div>
            )}

            {/* ERROR */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
                <p className="font-semibold">Terjadi Kesalahan</p>
                <p className="mt-1 text-sm">{error}</p>
              </div>
            )}

            {/* STATISTICS */}
            {!loading && (
              <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-gray-500">
                    Total Laporan
                  </p>

                  <p className="mt-3 text-4xl font-bold text-gray-900">
                    {totalReports}
                  </p>

                  <p className="mt-2 text-xs text-gray-500">
                    Seluruh laporan dalam sistem
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-gray-500">
                    Menunggu Verifikasi
                  </p>

                  <p className="mt-3 text-4xl font-bold text-yellow-600">
                    {pendingReports}
                  </p>

                  <p className="mt-2 text-xs text-gray-500">
                    Membutuhkan tindakan admin
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-gray-500">
                    Pickup Terjadwal
                  </p>

                  <p className="mt-3 text-4xl font-bold text-orange-600">
                    {scheduledReports}
                  </p>

                  <p className="mt-2 text-xs text-gray-500">
                    Siap diproses untuk pickup
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-gray-500">
                    Sudah Diambil
                  </p>

                  <p className="mt-3 text-4xl font-bold text-green-600">
                    {completedReports}
                  </p>

                  <p className="mt-2 text-xs text-gray-500">
                    Laporan yang sudah selesai
                  </p>
                </div>

              </div>
            )}

            {/* REPORTS */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

              <div className="border-b border-gray-100 bg-green-50 px-6 py-5 sm:px-8">
                <h2 className="text-xl font-bold text-gray-900">
                  Daftar Laporan
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  Verifikasi laporan dan jadwalkan pickup dari halaman ini.
                </p>
              </div>

              {/* LOADING */}
              {loading ? (
                <div className="space-y-4 p-6 sm:p-8">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-48 animate-pulse rounded-2xl border border-gray-200 bg-gray-50"
                    />
                  ))}
                </div>
              ) : reports.length === 0 ? (
                /* EMPTY */
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

                  <p className="mt-2 text-sm text-gray-500">
                    Belum ada laporan sampah yang masuk ke sistem.
                  </p>
                </div>
              ) : (
                /* REPORT LIST */
                <div className="divide-y divide-gray-100">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="p-6 transition hover:bg-gray-50 sm:p-8"
                    >
                      <div className="flex flex-col gap-5">

                        {/* TOP */}
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

                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                Laporan #{report.id}
                              </p>

                              <h3 className="mt-1 text-lg font-bold text-gray-900">
                                {report.description || "Laporan Sampah"}
                              </h3>
                            </div>
                          </div>

                          <span
                            className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                              report.status
                            )}`}
                          >
                            {getStatusLabel(report.status)}
                          </span>
                        </div>

                        {/* DETAILS */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                          {/* PELAPOR */}
                          <div className="rounded-xl bg-green-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-green-600">
                              Pelapor
                            </p>

                            <div className="mt-2 flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                                {report.user?.name?.charAt(0).toUpperCase() || "U"}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate font-semibold text-gray-800">
                                  {report.user?.name || "User tidak diketahui"}
                                </p>

                                <p className="truncate text-xs text-gray-500">
                                  {report.user?.email || "-"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* LOKASI */}
                          <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                              Lokasi
                            </p>

                            <p className="mt-1 font-medium text-gray-800">
                              {report.location || "-"}
                            </p>
                          </div>

                          {/* BERAT */}
                          <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                              Berat
                            </p>

                            <p className="mt-1 font-medium text-gray-800">
                              {report.weight ? `${report.weight} kg` : "-"}
                            </p>
                          </div>

                        </div>

                        {/* ACTIONS */}
                        {(report.status === "pending" ||
                          report.status === "verified") && (
                          <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row">

                            {report.status === "pending" && (
                              <button
                                onClick={() =>
                                  verifyReport(report.id)
                                }
                                disabled={
                                  actionLoading === report.id
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {actionLoading === report.id ? (
                                  <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Memproses...
                                  </>
                                ) : (
                                  <>
                                    <svg
                                      className="h-4 w-4"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 12l4 4L19 6"
                                      />
                                    </svg>

                                    Verifikasi Laporan
                                  </>
                                )}
                              </button>
                            )}

                            {report.status === "verified" && (
                              <button
                                onClick={() =>
                                  showPickup === report.id
                                    ? closePickupForm()
                                    : openPickupForm(report)
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                              >
                                <svg
                                  className="h-4 w-4"
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

                                {showPickup === report.id
                                  ? "Tutup Form Pickup"
                                  : "Jadwalkan Pickup"}
                              </button>
                            )}
                          </div>
                        )}

                        {/* PICKUP FORM */}
                        {showPickup === report.id && (
                          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 sm:p-6">

                            <div className="mb-5">
                              <h4 className="text-lg font-bold text-gray-900">
                                Jadwalkan Pickup
                              </h4>

                              <p className="mt-1 text-sm text-gray-600">
                                Tentukan jadwal dan alamat pengambilan untuk
                                laporan #{report.id}.
                              </p>
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                              {/* DATE */}
                              <div>
                                <label
                                  htmlFor={`pickup-date-${report.id}`}
                                  className="mb-2 block text-sm font-semibold text-gray-800"
                                >
                                  Tanggal Pickup
                                </label>

                                <input
                                  id={`pickup-date-${report.id}`}
                                  type="date"
                                  value={pickupDate}
                                  min={new Date()
                                    .toISOString()
                                    .split("T")[0]}
                                  onChange={(e) =>
                                    setPickupDate(e.target.value)
                                  }
                                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                  required
                                />
                              </div>

                              {/* ADDRESS */}
                              <div>
                                <label
                                  htmlFor={`pickup-address-${report.id}`}
                                  className="mb-2 block text-sm font-semibold text-gray-800"
                                >
                                  Alamat Pickup
                                </label>

                                <input
                                  id={`pickup-address-${report.id}`}
                                  type="text"
                                  value={pickupAddress}
                                  onChange={(e) =>
                                    setPickupAddress(e.target.value)
                                  }
                                  placeholder="Masukkan alamat pickup"
                                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                  required
                                />
                              </div>

                              {/* NOTES */}
                              <div className="sm:col-span-2">
                                <label
                                  htmlFor={`pickup-notes-${report.id}`}
                                  className="mb-2 block text-sm font-semibold text-gray-800"
                                >
                                  Catatan
                                  <span className="ml-1 font-normal text-gray-400">
                                    (opsional)
                                  </span>
                                </label>

                                <textarea
                                  id={`pickup-notes-${report.id}`}
                                  value={pickupNotes}
                                  onChange={(e) =>
                                    setPickupNotes(e.target.value)
                                  }
                                  placeholder="Contoh: Hubungi user sebelum datang."
                                  rows={3}
                                  maxLength={500}
                                  className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />

                                <p className="mt-1 text-right text-xs text-gray-400">
                                  {pickupNotes.length}/500
                                </p>
                              </div>

                            </div>

                            {/* FORM ACTION */}
                            <div className="mt-5 flex flex-col-reverse gap-3 border-t border-blue-100 pt-5 sm:flex-row sm:justify-end">

                              <button
                                type="button"
                                onClick={closePickupForm}
                                disabled={actionLoading === report.id}
                                className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
                              >
                                Batal
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  createPickup(report.id)
                                }
                                disabled={
                                  actionLoading === report.id
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {actionLoading === report.id ? (
                                  <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Menjadwalkan...
                                  </>
                                ) : (
                                  "Jadwalkan Pickup"
                                )}
                              </button>

                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!loading && reports.length > 0 && (
              <div className="mt-5 text-center text-sm text-gray-500">
                Menampilkan {reports.length} laporan dalam sistem.
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
