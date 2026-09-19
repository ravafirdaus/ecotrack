<?php

namespace App\Http\Controllers;

use App\Models\WasteReport;
use Illuminate\Http\Request;

class WasteReportController extends Controller
{
    // Ambil laporan sampah
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            $reports = WasteReport::with([
                'user',
                'wasteType',
                'pickup'
            ])
            ->orderByDesc('created_at')
            ->get();
        } else {
            $reports = WasteReport::with([
                'user',
                'wasteType',
                'pickup'
            ])
            ->where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->get();
        }

        return response()->json([
            'success' => true,
            'data' => $reports
        ]);
    }


    // Tambah laporan sampah
    public function store(Request $request)
    {
        $request->validate([
            'waste_type_id' => 'required|exists:waste_types,id',
            'weight' => 'required|numeric',
            'description' => 'nullable|string',
            'location' => 'required|string',
        ]);

        $report = WasteReport::create([
            'user_id' => $request->user()->id,
            'waste_type_id' => $request->waste_type_id,
            'weight' => $request->weight,
            'description' => $request->description,
            'location' => $request->location,
        ]);

        $report->load([
            'user',
            'wasteType',
            'pickup'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Laporan sampah berhasil ditambahkan',
            'data' => $report
        ], 201);
    }


    // Ambil satu laporan
    public function show(Request $request, $id)
    {
        $user = $request->user();

        $report = WasteReport::with([
            'user',
            'wasteType',
            'pickup'
        ])->findOrFail($id);

        // User biasa hanya boleh melihat laporan sendiri
        if ($user->role !== 'admin' && $report->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses ke laporan ini'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $report
        ]);
    }


    // Update laporan
    public function update(Request $request, $id)
    {
        $report = WasteReport::findOrFail($id);
        $user = $request->user();

        // Pastikan hanya pemilik laporan atau admin yang bisa update
        if (
            $user->id !== $report->user_id &&
            $user->role !== 'admin'
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk mengubah laporan ini'
            ], 403);
        }

        // User biasa tidak boleh mengubah status
        if ($user->role !== 'admin' && $request->has('status')) {
            return response()->json([
                'success' => false,
                'message' => 'Hanya admin yang dapat mengubah status laporan'
            ], 403);
        }

        // Validasi dasar
        $rules = [
            'waste_type_id' => 'sometimes|exists:waste_types,id',
            'weight' => 'sometimes|numeric',
            'description' => 'nullable|string',
            'location' => 'sometimes|string',
        ];

        // Hanya admin yang boleh mengubah status
        if ($user->role === 'admin') {
            $rules['status'] =
                'sometimes|in:pending,verified,scheduled,on_the_way,picked_up,rejected';
        }

        $validated = $request->validate($rules);

        $report->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Laporan sampah berhasil diperbarui',
            'data' => $report
        ]);
    }


    // Hapus laporan
    public function destroy(Request $request, $id)
    {
        $report = WasteReport::findOrFail($id);

        // Pastikan hanya pemilik laporan atau admin yang bisa hapus
        if (
            $request->user()->id !== $report->user_id &&
            $request->user()->role !== 'admin'
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Anda tidak memiliki akses untuk menghapus laporan ini'
            ], 403);
        }

        $report->delete();

        return response()->json([
            'success' => true,
            'message' => 'Laporan sampah berhasil dihapus'
        ]);
    }
}