<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\WasteTypeController;
use App\Http\Controllers\WasteReportController;
use App\Http\Controllers\PickupController;


// ====================
// AUTH
// ====================

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


// ====================
// USER LOGIN REQUIRED
// ====================

Route::middleware('auth:sanctum')->group(function () {

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);


    // Waste Reports
    Route::apiResource('waste-reports', WasteReportController::class);


    // ====================
    // ADMIN ONLY
    // ====================

    Route::middleware('admin')->group(function () {

        // Waste Types
        Route::apiResource('waste-types', WasteTypeController::class);

        // Pickups
        Route::apiResource('pickups', PickupController::class);

    });


});