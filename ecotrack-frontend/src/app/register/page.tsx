"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    setMessage("");
    setSuccess(false);

    if (!name || !email || !password || !passwordConfirmation) {
      setMessage("Semua field wajib diisi.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password minimal 8 karakter.");
      return;
    }

    if (password !== passwordConfirmation) {
      setMessage("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const firstError = Object.values(data.errors)[0];

          if (Array.isArray(firstError)) {
            setMessage(firstError[0]);
          } else {
            setMessage("Data yang dimasukkan tidak valid.");
          }
        } else {
          setMessage(data.message || "Registrasi gagal.");
        }

        setLoading(false);
        return;
      }

      setSuccess(true);
      setMessage("Registrasi berhasil. Silakan login.");

      setName("");
      setEmail("");
      setPassword("");
      setPasswordConfirmation("");
    } catch (error) {
      console.error(error);
      setMessage("Gagal terhubung ke server Laravel.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#f5faf7] px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center">

        {/* MAIN CARD */}
        <div className="flex w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl">

          {/* ========================================= */}
          {/* LEFT PANEL */}
          {/* ========================================= */}

          <div className="relative hidden w-1/2 overflow-hidden bg-[#008f3f] lg:flex">

            {/* DECORATIVE CIRCLE */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#009c43]" />

            <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[#007d38]" />

            <div className="relative z-10 flex w-full flex-col justify-between px-14 py-14">

              {/* LOGO */}
              <div>
                <div className="inline-flex rounded-2xl bg-white px-6 py-4 shadow-md">
                  <img
                    src="/ecotrack-logo.png"
                    alt="EcoTrack Logo"
                    className="w-72 h-auto"
                  />
                </div>
              </div>

              {/* TEXT */}
              <div className="my-auto max-w-xl py-12">

                <h1 className="text-5xl font-bold leading-tight tracking-tight text-white">
                  Mulai bersama
                  <br />
                  EcoTrack.
                </h1>

                <p className="mt-6 max-w-lg text-lg leading-8 text-green-50">
                  Bergabung untuk membantu menciptakan
                  lingkungan yang lebih bersih dan terkelola.
                </p>

                {/* STEPS */}
                <div className="mt-10 flex gap-4">

                  <div className="flex-1 rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
                    <p className="text-2xl font-bold text-white">
                      01
                    </p>

                    <p className="mt-1 text-sm font-medium text-green-50">
                      Daftar
                    </p>
                  </div>

                  <div className="flex-1 rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
                    <p className="text-2xl font-bold text-white">
                      02
                    </p>

                    <p className="mt-1 text-sm font-medium text-green-50">
                      Laporkan
                    </p>
                  </div>

                  <div className="flex-1 rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
                    <p className="text-2xl font-bold text-white">
                      03
                    </p>

                    <p className="mt-1 text-sm font-medium text-green-50">
                      Pantau
                    </p>
                  </div>

                </div>
              </div>

              {/* FOOTER */}
              <p className="text-sm text-green-100">
                Waste Management System
              </p>

            </div>
          </div>

          {/* ========================================= */}
          {/* RIGHT PANEL */}
          {/* ========================================= */}

          <div className="flex w-full items-center justify-center bg-white px-6 py-10 sm:px-10 lg:w-1/2 lg:px-14">

            <div className="w-full max-w-md">

              {/* MOBILE LOGO */}
              <div className="mb-8 flex justify-center lg:hidden">
                <div className="rounded-2xl bg-white px-5 py-3 shadow-md">
                  <Image
                    src="/ecotrack-logo.png"
                    alt="EcoTrack"
                    width={190}
                    height={55}
                    priority
                    className="h-auto w-auto"
                  />
                </div>
              </div>

              {/* HEADER */}
              <div className="mb-8">

                <p className="text-sm font-bold text-green-600">
                  ECOTRACK
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                  Buat akun Anda
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Daftar untuk mulai menggunakan EcoTrack.
                </p>

              </div>

              {/* FORM */}
              <form
                onSubmit={handleRegister}
                className="space-y-5"
              >

                {/* NAME */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Nama
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Email
                  </label>

                  <div className="relative">

                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="14"
                          rx="2"
                        />
                        <path d="m3 7 9 6 9-6" />
                      </svg>
                    </span>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                    />

                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Password
                  </label>

                  <div className="relative">

                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <rect
                          x="5"
                          y="10"
                          width="14"
                          height="10"
                          rx="2"
                        />
                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                      </svg>
                    </span>

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Minimal 8 karakter"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                      aria-label={
                        showPassword
                          ? "Sembunyikan password"
                          : "Tampilkan password"
                      }
                    >
                      {showPassword ? (
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M3 3l18 18" />
                          <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                          <path d="M9.9 5.1A10.8 10.8 0 0 1 12 4.9c5.4 0 8.6 4.9 9.5 7.1a14.5 14.5 0 0 1-3.1 4" />
                          <path d="M6.2 6.2C3.9 7.8 2.7 10.1 2.5 12c.9 2.2 4.1 7.1 9.5 7.1 1.4 0 2.7-.3 3.8-.8" />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M2.5 12s3.3-7 9.5-7 9.5 7 9.5 7-3.3 7-9.5 7-9.5-7-9.5-7Z" />
                          <circle
                            cx="12"
                            cy="12"
                            r="2.5"
                          />
                        </svg>
                      )}
                    </button>

                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Konfirmasi Password
                  </label>

                  <div className="relative">

                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <rect
                          x="5"
                          y="10"
                          width="14"
                          height="10"
                          rx="2"
                        />
                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                      </svg>
                    </span>

                    <input
                      type={
                        showConfirmation
                          ? "text"
                          : "password"
                      }
                      value={passwordConfirmation}
                      onChange={(e) =>
                        setPasswordConfirmation(
                          e.target.value
                        )
                      }
                      placeholder="Ulangi password"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmation(
                          !showConfirmation
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                      aria-label={
                        showConfirmation
                          ? "Sembunyikan password"
                          : "Tampilkan password"
                      }
                    >
                      {showConfirmation ? (
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M3 3l18 18" />
                          <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                          <path d="M9.9 5.1A10.8 10.8 0 0 1 12 4.9c5.4 0 8.6 4.9 9.5 7.1a14.5 14.5 0 0 1-3.1 4" />
                          <path d="M6.2 6.2C3.9 7.8 2.7 10.1 2.5 12c.9 2.2 4.1 7.1 9.5 7.1 1.4 0 2.7-.3 3.8-.8" />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M2.5 12s3.3-7 9.5-7 9.5 7 9.5 7-3.3 7-9.5 7-9.5-7-9.5-7Z" />
                          <circle
                            cx="12"
                            cy="12"
                            r="2.5"
                          />
                        </svg>
                      )}
                    </button>

                  </div>
                </div>

                {/* MESSAGE */}
                {message && (
                  <div
                    className={`rounded-xl border px-4 py-3 text-sm ${
                      success
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-red-200 bg-red-50 text-red-600"
                    }`}
                  >
                    {message}
                  </div>
                )}

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center rounded-xl bg-[#008f3f] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#007d38] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <svg
                        className="mr-2 h-5 w-5 animate-spin"
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
                          d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
                        />
                      </svg>

                      Membuat akun...
                    </>
                  ) : (
                    "Buat Akun"
                  )}
                </button>

              </form>

              {/* LOGIN LINK */}
              <div className="mt-7 border-t border-gray-100 pt-6 text-center">

                <p className="text-sm text-gray-500">
                  Sudah punya akun?{" "}
                  <Link
                    href="/"
                    className="font-semibold text-green-700 transition hover:text-green-800"
                  >
                    Login di sini
                  </Link>
                </p>

              </div>

              {/* FOOTER */}
              <div className="mt-7 border-t border-gray-100 pt-5 text-center">
                <p className="text-xs text-gray-400">
                  EcoTrack · Waste Management System
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
