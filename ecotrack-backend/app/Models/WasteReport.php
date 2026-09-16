<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\WasteType;
use App\Models\Pickup;

class WasteReport extends Model
{
    protected $fillable = [
        'user_id',
        'waste_type_id',
        'weight',
        'description',
        'location',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function wasteType()
    {
        return $this->belongsTo(WasteType::class);
    }

    public function pickup()
    {
        return $this->hasOne(Pickup::class);
    }
}
