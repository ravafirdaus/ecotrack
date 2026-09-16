<?php

namespace App\Http\Controllers;

use App\Models\WasteType;
use Illuminate\Http\Request;

class WasteTypeController extends Controller
{
    // Ambil semua jenis sampah
    public function index()
    {
        $wasteTypes = WasteType::all();

        return response()->json([
            'success' => true,
            'data' => $wasteTypes
        ]);
    }

    // Tambah jenis sampah
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        $wasteType = WasteType::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Jenis sampah berhasil ditambahkan',
            'data' => $wasteType
        ], 201);
    }

    // Ambil detail jenis sampah
    public function show($id)
    {
        $wasteType = WasteType::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $wasteType
        ]);
    }

    // Update jenis sampah
    public function update(Request $request, $id)
    {
        $wasteType = WasteType::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string'
        ]);

        $wasteType->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Jenis sampah berhasil diperbarui',
            'data' => $wasteType
        ]);
    }

    // Hapus jenis sampah
    public function destroy($id)
    {
        $wasteType = WasteType::findOrFail($id);

        $wasteType->delete();

        return response()->json([
            'success' => true,
            'message' => 'Jenis sampah berhasil dihapus'
        ]);
    }
}