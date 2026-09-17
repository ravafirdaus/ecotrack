"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import AuthGuard from "../../components/AuthGuard";

interface Pickup {
  id: number;
  waste_report_id: number;
  pickup_date: string;
  pickup_address: string;
  notes: string | null;
  status: string;

  waste_report: {
    id: number;
    user_id: number;
    waste_type_id: number;
    weight: string;
    description: string;
    location: string;
    status: string;

    user: {
      id: number;
      name: string;
      email: string;
      role: string;
    } | null;

    waste_type?: {
      id: number;
      name: string;
    } | null;
  } | null;
}

export default function AdminPickups() {
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchPickups = async (isRefresh = false) => {
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

      const response = await fetch("/api/pickups", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Gagal mengambil pickup. Status: ${response.status}`
        );
      }

      const data = await response.json();

      setPickups(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengambil data pickup."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updatePickupStatus = async (
    id: number,
    status: "on_the_way" | "completed"
  ) => {
    try {
      const pickup = pickups.find((item) => item.id === id);
      const allowedStatus =
        pickup?.status === "scheduled"
          ? "on_the_way"
          : pickup?.status === "on_the_way"
          ? "completed"
          : null;

      if (allowedStatus !== status) {
        setError(
          pickup?.status === "completed"
            ? "Pickup ini sudah selesai."
            : pickup?.status === "cancelled"
            ? "Pickup ini sudah dibatalkan."
            : "Perubahan status pickup tidak valid. Silakan refresh data."
        );
        return;
      }

      setActionLoading(id);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token admin tidak ditemukan.");
      }

      const response = await fetch(`/api/pickups/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Gagal mengubah status pickup. Status: ${response.status}`
        );
      }

      if (status === "on_the_way") {
        setSuccess(
          `Pickup #${id} berhasil diubah menjadi "Dalam Perjalanan".`
        );
      } else {
        setSuccess(
          `Pickup #${id} berhasil diselesaikan.`
        );
      }

      await fetchPickups();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Gagal mengubah status pickup."
      );
    } finally {
      setActionLoading(null);
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
        return "border-blue-200 bg-blue-50 text-blue-700";
      case "on_the_way":
        return "border-yellow-200 bg-yellow-50 text-yellow-700";
      case "completed":
        return "border-green-200 bg-green-50 text-green-700";
      case "cancelled":
        return "border-red-200 bg-red-50 text-red-700";
      default:
        return "border-gray-200 bg-gray-50 text-gray-700";
    }
  };

  const formatPickupDate = (date: string | null | undefined) => {
    if (!date) {
      return "-";
    }

    const datePart = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
    const parsedDate = datePart
      ? new Date(
          Date.UTC(
            Number(datePart[1]),
            Number(datePart[2]) - 1,
            Number(datePart[3])
          )
        )
      : new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  const scheduledCount = pickups.filter(
    (pickup) => pickup.status === "scheduled"
  ).length;

  const onTheWayCount = pickups.filter(
    (pickup) => pickup.status === "on_the_way"
  ).length;

  const completedCount = pickups.filter(
    (pickup) => pickup.status === "completed"
  ).length;

  useEffect(() => {
    fetchPickups();
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
                  Manajemen Pickup
                </h1>

                <p className="mt-2 text-gray-600">
                  Kelola jadwal dan proses pengambilan sampah.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={() => fetchPickups(true)}
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
                  href="/admin/reports"
                  className="inline-flex items-center justify-center rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
                >
                  Kelola Laporan
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
              <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-gray-500">
                    Terjadwal
                  </p>

                  <p className="mt-3 text-4xl font-bold text-blue-600">
                    {scheduledCount}
                  </p>

                  <p className="mt-2 text-xs text-gray-500">
                    Menunggu keberangkatan
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-gray-500">
                    Dalam Perjalanan
                  </p>

                  <p className="mt-3 text-4xl font-bold text-yellow-600">
                    {onTheWayCount}
                  </p>

                  <p className="mt-2 text-xs text-gray-500">
                    Sedang menuju lokasi
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="text-sm font-medium text-gray-500">
                    Selesai
                  </p>

                  <p className="mt-3 text-4xl font-bold text-green-600">
                    {completedCount}
                  </p>

                  <p className="mt-2 text-xs text-gray-500">
                    Pickup telah diselesaikan
                  </p>
                </div>

              </div>
            )}

            {/* PICKUP LIST */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

              <div className="border-b border-gray-100 bg-green-50 px-6 py-5 sm:px-8">
                <h2 className="text-xl font-bold text-gray-900">
                  Daftar Pickup
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  Pantau dan perbarui status setiap proses pickup.
                </p>
              </div>

              {/* LOADING */}
              {loading ? (
                <div className="space-y-4 p-6 sm:p-8">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="h-64 animate-pulse rounded-2xl border border-gray-200 bg-gray-50"
                    />
                  ))}
                </div>
              ) : pickups.length === 0 ? (
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
                        d="M3 7h11v10H3V7zm11 3h4l3 3v4h-7v-7z"
                      />
                      <circle cx="7" cy="18" r="2" />
                      <circle cx="18" cy="18" r="2" />
                    </svg>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    Belum Ada Pickup
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Belum ada jadwal pickup yang dibuat.
                  </p>

                  <Link
                    href="/admin/reports"
                    className="mt-5 inline-flex rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
                  >
                    Lihat Laporan
                  </Link>
                </div>
              ) : (
                /* LIST */
                <div className="divide-y divide-gray-100">
                  {pickups.map((pickup) => (
                    <div
                      key={pickup.id}
                      className="p-6 transition hover:bg-gray-50 sm:p-8"
                    >
                      <div className="flex flex-col gap-6">

                        {/* HEADER PICKUP */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                          <div className="flex min-w-0 gap-4">
                            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700 sm:flex">
                              <svg
                                className="h-6 w-6"
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

                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                Pickup #{pickup.id}
                              </p>

                              <h3 className="mt-1 text-xl font-bold text-gray-900">
                                {pickup.waste_report?.description ||
                                  "Pengambilan Sampah"}
                              </h3>
                            </div>
                          </div>

                          <span
                            className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-xs font-semibold ${getPickupStatusClass(
                              pickup.status
                            )}`}
                          >
                            {getPickupStatusLabel(pickup.status)}
                          </span>
                        </div>

                        {/* PICKUP INFORMATION */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

                          <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                              Tanggal Pickup
                            </p>

                            <p className="mt-1 font-medium text-gray-800">
                              {formatPickupDate(
                                pickup.pickup_date
                              )}
                            </p>
                          </div>

                          <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                              Alamat Pickup
                            </p>

                            <p className="mt-1 font-medium text-gray-800">
                              {pickup.pickup_address || "-"}
                            </p>
                          </div>

                          <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                              Berat Sampah
                            </p>

                            <p className="mt-1 font-medium text-gray-800">
                              {pickup.waste_report?.weight
                                ? `${pickup.waste_report.weight} kg`
                                : "-"}
                            </p>
                          </div>

                        </div>

                        {/* WASTE REPORT DETAIL */}
                        <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
                          <h4 className="font-bold text-gray-900">
                            Detail Laporan Sampah
                          </h4>

                          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

                            {/* ID LAPORAN */}
                            <div>
                              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                ID Laporan
                              </p>

                              <p className="mt-1 text-sm font-semibold text-gray-800">
                                {pickup.waste_report?.id
                                  ? `#${pickup.waste_report.id}`
                                  : "-"}
                              </p>
                            </div>

                            {/* PELAPOR */}
                            <div>
                              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                Pelapor
                              </p>

                              <div className="mt-1 flex items-center gap-2">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                                  {pickup.waste_report?.user?.name
                                    ?.charAt(0)
                                    .toUpperCase() || "U"}
                                </div>

                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold text-gray-800">
                                    {pickup.waste_report?.user?.name ||
                                      "User tidak diketahui"}
                                  </p>

                                  <p className="truncate text-xs text-gray-500">
                                    {pickup.waste_report?.user?.email || "-"}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* LOKASI LAPORAN */}
                            <div>
                              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                Lokasi Laporan
                              </p>

                              <p className="mt-1 text-sm font-semibold text-gray-800">
                                {pickup.waste_report?.location || "-"}
                              </p>
                            </div>

                            {/* DESKRIPSI SAMPAH */}
                            <div>
                              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                Deskripsi Sampah
                              </p>

                              <p className="mt-1 text-sm font-semibold text-gray-800">
                                {pickup.waste_report?.description || "-"}
                              </p>
                            </div>

                          </div>

                          {/* CATATAN PICKUP */}
                          {pickup.notes && (
                            <div className="mt-4 rounded-xl border border-green-100 bg-white p-4">
                              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                Catatan Pickup
                              </p>

                              <p className="mt-1 text-sm text-gray-700">
                                {pickup.notes}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* ACTION */}
                        {pickup.status === "scheduled" && (
                          <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                            <button
                              onClick={() =>
                                updatePickupStatus(
                                  pickup.id,
                                  "on_the_way"
                                )
                              }
                              disabled={
                                actionLoading === pickup.id
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {actionLoading === pickup.id ? (
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
                                      d="M5 12h14M13 6l6 6-6 6"
                                    />
                                  </svg>

                                  Mulai Pickup
                                </>
                              )}
                            </button>
                          </div>
                        )}

                        {pickup.status === "on_the_way" && (
                          <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                            <button
                              onClick={() =>
                                updatePickupStatus(
                                  pickup.id,
                                  "completed"
                                )
                              }
                              disabled={
                                actionLoading === pickup.id
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {actionLoading === pickup.id ? (
                                <>
                                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                  Menyelesaikan...
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

                                  Selesaikan Pickup
                                </>
                              )}
                            </button>
                          </div>
                        )}

                        {/* COMPLETED INFO */}
                        {pickup.status === "completed" && (
                          <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
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
                            </div>

                            <p className="text-sm font-medium text-green-800">
                              Pickup telah selesai dan laporan terkait
                              telah ditandai sebagai sampah yang sudah
                              diambil.
                            </p>
                          </div>
                        )}

                        {pickup.status === "cancelled" && (
                          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                            <p className="text-sm font-medium text-red-800">
                              Pickup Dibatalkan
                            </p>
                          </div>
                        )}

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!loading && pickups.length > 0 && (
              <div className="mt-5 text-center text-sm text-gray-500">
                Menampilkan {pickups.length} pickup dalam sistem.
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
