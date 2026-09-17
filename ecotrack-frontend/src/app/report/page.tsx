"use client";

import { FormEvent, useState } from "react";
import Navbar from "../components/Navbar";
import AuthGuard from "../components/AuthGuard";

export default function ReportPage() {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [weight, setWeight] = useState("");
  const [wasteTypeId, setWasteTypeId] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setMessage("");

    // Validasi frontend
    if (!wasteTypeId) {
      setMessageType("error");
      setMessage("Silakan pilih jenis sampah.");
      return;
    }

    if (!description.trim()) {
      setMessageType("error");
      setMessage("Deskripsi sampah wajib diisi.");
      return;
    }

    if (!location.trim()) {
      setMessageType("error");
      setMessage("Lokasi wajib diisi.");
      return;
    }

    const weightNumber = Number(weight);

    if (!weight || Number.isNaN(weightNumber) || weightNumber <= 0) {
      setMessageType("error");
      setMessage("Berat sampah harus lebih dari 0 kg.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessageType("error");
        setMessage("Anda belum login.");
        return;
      }

      const response = await fetch("/api/waste-reports", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            description: description.trim(),
            location: location.trim(),
            weight: weightNumber,
            waste_type_id: Number(wasteTypeId),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessageType("error");
        setMessage(data.message || "Gagal mengirim laporan.");
        return;
      }

      setMessageType("success");
      setMessage(
        "Laporan berhasil dikirim. Menunggu proses verifikasi admin."
      );

      // Reset form
      setDescription("");
      setLocation("");
      setWeight("");
      setWasteTypeId("");
    } catch (error) {
      console.error(error);

      setMessageType("error");
      setMessage("Gagal terhubung ke server Laravel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            {/* Header */}
            <div className="mb-8">
              <div className="mb-3 inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                Laporan Sampah
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Buat Laporan Sampah
              </h1>

              <p className="mt-2 max-w-2xl text-gray-600">
                Laporkan sampah yang ingin dijemput oleh tim EcoTrack.
                Pastikan informasi yang diberikan sudah sesuai.
              </p>
            </div>

            {/* Form Card */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              {/* Card Header */}
              <div className="border-b border-gray-100 bg-green-50 px-6 py-5 sm:px-8">
                <h2 className="text-lg font-bold text-gray-900">
                  Informasi Laporan
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  Isi seluruh informasi berikut untuk membuat laporan baru.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-6 p-6 sm:p-8"
              >
                {/* Jenis Sampah */}
                <div>
                  <label
                    htmlFor="wasteType"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Jenis Sampah
                  </label>

                  <select
                    id="wasteType"
                    value={wasteTypeId}
                    onChange={(e) => setWasteTypeId(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                    required
                  >
                    <option value="">Pilih jenis sampah</option>
                    <option value="1">Plastik</option>
                    <option value="2">Kertas</option>
                    <option value="3">Organik</option>
                  </select>

                  <p className="mt-2 text-xs text-gray-500">
                    Pilih kategori sampah yang paling sesuai.
                  </p>
                </div>

                {/* Deskripsi */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="description"
                      className="block text-sm font-semibold text-gray-800"
                    >
                      Deskripsi Sampah
                    </label>

                    <span className="text-xs text-gray-400">
                      {description.length}/500
                    </span>
                  </div>

                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => {
                      if (e.target.value.length <= 500) {
                        setDescription(e.target.value);
                      }
                    }}
                    placeholder="Contoh: Sampah botol plastik bekas minuman sebanyak beberapa buah"
                    rows={5}
                    maxLength={500}
                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                    required
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    Jelaskan jenis atau kondisi sampah secara singkat.
                  </p>
                </div>

                {/* Lokasi */}
                <div>
                  <label
                    htmlFor="location"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Lokasi Pickup
                  </label>

                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Contoh: Sawangan, Depok, Jawa Barat"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                    required
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    Masukkan lokasi tempat sampah akan dijemput.
                  </p>
                </div>

                {/* Berat */}
                <div>
                  <label
                    htmlFor="weight"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Perkiraan Berat
                  </label>

                  <div className="relative">
                    <input
                      id="weight"
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="Contoh: 5"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-14 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                      required
                    />

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
                      kg
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    Masukkan perkiraan berat sampah dalam kilogram.
                  </p>
                </div>

                {/* Message */}
                {message && (
                  <div
                    className={`rounded-xl border px-4 py-4 ${
                      messageType === "success"
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    <div className="font-semibold">
                      {messageType === "success"
                        ? "Laporan Berhasil"
                        : "Terjadi Kesalahan"}
                    </div>

                    <p className="mt-1 text-sm">{message}</p>
                  </div>
                )}

                {/* Submit */}
                <div className="border-t border-gray-100 pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-green-700 px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Mengirim laporan...
                      </span>
                    ) : (
                      "Kirim Laporan"
                    )}
                  </button>

                  <p className="mt-3 text-center text-xs text-gray-500">
                    Setelah dikirim, laporan akan menunggu verifikasi admin.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
