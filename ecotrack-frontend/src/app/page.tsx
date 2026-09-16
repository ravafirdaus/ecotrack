"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login gagal");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);

      setMessage(
        "Gagal terhubung ke server Laravel"
      );
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4 sm:p-6">

      <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-gray-100">

        <div className="grid md:grid-cols-2">

          {/* LEFT SIDE */}
          <div className="hidden md:flex relative overflow-hidden bg-green-700 p-10 lg:p-14 text-white flex-col justify-between">

            {/* Decorative circles */}
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-green-600 opacity-50" />
            <div className="absolute -bottom-32 -left-24 w-72 h-72 rounded-full bg-emerald-800 opacity-40" />

            <div className="relative z-10">

              <div className="flex items-center gap-3 mb-10">
                <div className="flex items-center justify-center mb-10">
                  <Image
                    src="/ecotrack-logo.png"
                    alt="EcoTrack Logo"
                    width={300}
                    height={100}
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                Kelola sampah.
                <br />
                Jaga lingkungan.
              </h2>

              <p className="mt-6 max-w-md text-green-100 leading-relaxed">
                Pantau laporan sampah, jadwal pickup,
                dan proses pengelolaan sampah dalam
                satu sistem yang terintegrasi.
              </p>

            </div>

            <div className="relative z-10">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                    ♻
                  </div>

                  <div>
                    <p className="font-semibold">
                      Bersama untuk lingkungan
                    </p>

                    <p className="text-sm text-green-100">
                      Mulai dari pengelolaan sampah yang lebih baik.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>


          {/* RIGHT SIDE */}
          <div className="p-7 sm:p-10 lg:p-14">

            {/* Mobile Logo */}
            <div className="md:hidden flex items-center gap-3 mb-8">

              <div className="md:hidden mb-8">
                <Image
                  src="/ecotrack-logo.png"
                  alt="EcoTrack"
                  width={180}
                  height={50}
                  priority
                  className="h-auto w-44 object-contain"
                />
              </div>

            </div>


            {/* Login Heading */}
            <div className="mb-8">

              <p className="text-sm font-semibold text-green-700 mb-2">
                SELAMAT DATANG
              </p>

              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Masuk ke akun Anda
              </h2>

              <p className="mt-3 text-gray-500">
                Login untuk mengakses dashboard EcoTrack.
              </p>

            </div>


            {/* Form */}
            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* Email */}
              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Email
                </label>

                <div className="relative">

                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z"
                      />
                      <path d="m22 6-10 7L2 6" />
                    </svg>
                  </div>

                  <input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                    required
                  />

                </div>

              </div>


              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Password
                </label>

                <div className="relative">
                  {/* Icon Lock */}
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="10"
                        rx="2"
                      />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>

                  {/* Password Input */}
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-12 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                    required
                  />

                  {/* Show / Hide Password */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 transition hover:text-gray-700"
                    aria-label={
                      showPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                  >
                    {showPassword ? (
                      // Eye Off
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M3 3l18 18" />
                        <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
                        <path d="M9.88 5.09A10.94 10.94 0 0 1 12 4.8c5 0 8.73 4.11 9.8 7.2a10.96 10.96 0 0 1-4.18 5.11" />
                        <path d="M6.61 6.61A11.05 11.05 0 0 0 2.2 12c1.07 3.09 4.8 7.2 9.8 7.2a10.9 10.9 0 0 0 4.39-.92" />
                      </svg>
                    ) : (
                      // Eye
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M2.2 12c1.07-3.09 4.8-7.2 9.8-7.2s8.73 4.11 9.8 7.2c-1.07 3.09-4.8 7.2-9.8 7.2S3.27 15.09 2.2 12Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>


              {/* Error */}
              {message && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8v5" />
                    <path d="M12 16h.01" />
                  </svg>

                  <span>{message}</span>

                </div>
              )}


              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 py-3.5 font-semibold text-white shadow-lg shadow-green-700/20 transition hover:bg-green-800 hover:shadow-green-700/30 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />

                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>

                    Sedang masuk...
                  </>
                ) : (
                  <>
                    Masuk ke EcoTrack

                    <span className="text-lg">
                      →
                    </span>
                  </>
                )}

              </button>

              <div className="mt-7 border-t border-gray-100 pt-6 text-center">
                <p className="text-sm text-gray-500">
                  Belum punya akun?{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-green-700 transition hover:text-green-800"
                  >
                    Daftar sekarang
                  </Link>
                </p>
              </div>

            </form>


            {/* Footer */}
            <div className="mt-8 border-t border-gray-100 pt-6 text-center">

              <p className="text-xs text-gray-400">
                EcoTrack • Waste Management System
              </p>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}
