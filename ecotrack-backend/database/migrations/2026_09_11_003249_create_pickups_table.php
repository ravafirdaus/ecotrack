<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pickups', function (Blueprint $table) {
            $table->id();

            $table->foreignId('waste_report_id')
                ->constrained('waste_reports')
                ->cascadeOnDelete();
            
            $table->date('pickup_date');
            $table->string('pickup_address');
            $table->text('notes')->nullable();

            $table->enum('status', [
                'scheduled',
                'on_the_way',
                'completed',
                'cancelled',
            ])->default('scheduled');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pickups');
    }
};
