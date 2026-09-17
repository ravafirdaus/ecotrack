<?php

namespace App\Http\Controllers;

use App\Models\Pickup;
use App\Models\WasteReport;
use Illuminate\Http\Request;

class PickupController extends Controller
{
    // Ambil semua pickup
    public function index()
    {
        $pickups = Pickup::with([
            'wasteReport.user',
            'wasteReport.wasteType'
        ])->get();

        return response()->json([
            'success' => true,
            'data' => $pickups
        ]);
    }


    // Buat jadwal pickup
    public function store(Request $request)
    {
        $request->validate([
            'waste_report_id' => 'required|exists:waste_reports,id',
            'pickup_date' => 'required|date',
            'pickup_address' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $report = WasteReport::findOrFail(
            $request->waste_report_id
        );

        if ($report->pickup()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Laporan ini sudah memiliki jadwal pickup'
            ], 400);
        }

        // Pastikan laporan sudah diverifikasi
        if ($report->status !== 'verified') {
            return response()->json([
                'success' => false,
                'message' => 'Laporan harus diverifikasi sebelum dijadwalkan'
            ], 400);
        }

        $pickup = Pickup::create([
            'waste_report_id' => $request->waste_report_id,
            'pickup_date' => $request->pickup_date,
            'pickup_address' => $request->pickup_address,
            'notes' => $request->notes,
            'status' => 'scheduled',
        ]);

        $pickup->load([
            'wasteReport.user',
            'wasteReport.wasteType'
        ]);

        // Update status laporan
        $report->update([
            'status' => 'scheduled'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pickup berhasil dijadwalkan',
            'data' => $pickup
        ], 201);
    }


    // Ambil satu pickup
    public function show($id)
    {
        $pickup = Pickup::with([
            'wasteReport.user',
            'wasteReport.wasteType'
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $pickup
        ]);
    }


    // Update pickup
    public function update(Request $request, $id)
    {
        $pickup = Pickup::findOrFail($id);

        $request->validate([
            'pickup_date' => 'sometimes|date',
            'pickup_address' => 'sometimes|string',
            'notes' => 'nullable|string',
            'status' => 'sometimes|in:scheduled,on_the_way,completed,cancelled',
        ]);

        // Kalau tidak ada perubahan status,
        // update data pickup biasa
        if (!$request->has('status')) {
            $pickup->update(
                $request->only([
                    'pickup_date',
                    'pickup_address',
                    'notes',
                ])
            );

            $pickup->load([
                'wasteReport.user',
                'wasteReport.wasteType'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Pickup berhasil diperbarui',
                'data' => $pickup
            ]);
        }

        $currentStatus = $pickup->status;
        $newStatus = $request->status;

        // Validasi perpindahan status
        $allowedTransitions = [
            'scheduled' => ['on_the_way', 'cancelled'],
            'on_the_way' => ['completed', 'cancelled'],
            'completed' => [],
            'cancelled' => [],
        ];

        if (
            !in_array(
                $newStatus,
                $allowedTransitions[$currentStatus] ?? []
            )
        ) {
            return response()->json([
                'success' => false,
                'message' =>
                    "Status pickup tidak dapat diubah dari {$currentStatus} menjadi {$newStatus}"
            ], 400);
        }

        $pickup->update([
            'status' => $newStatus,
        ]);

        // Kalau pickup selesai,
        // laporan sampah otomatis menjadi picked_up
        if ($newStatus === 'completed') {
            $pickup->wasteReport->update([
                'status' => 'picked_up'
            ]);
        }

        $pickup->load([
            'wasteReport.user',
            'wasteReport.wasteType'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pickup berhasil diperbarui',
            'data' => $pickup
        ]);
    }


    // Hapus pickup
    public function destroy($id)
    {
        $pickup = Pickup::findOrFail($id);

        $pickup->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pickup berhasil dihapus'
        ]);
    }
}