<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\WasteReport;

class Pickup extends Model
{
    protected $fillable = [
        'waste_report_id',
        'pickup_date',
        'pickup_address',
        'notes',
        'status',
    ];

    protected $casts = [
        'pickup_date' => 'date',
    ];

    public function wasteReport()
    {
        return $this->belongsTo(WasteReport::class);
    }
}