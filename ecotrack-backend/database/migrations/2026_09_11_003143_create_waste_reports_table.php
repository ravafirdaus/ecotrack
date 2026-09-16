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
            Schema::create('waste_reports', function (Blueprint $table) {
                $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('waste_type_id')
                ->constrained('waste_types')
                ->cascadeOnDelete();

            $table->decimal('weight', 8, 2);

            $table->text('description')->nullable();

            $table->string('location');

            $table->enum('status', [
                'pending',
                'verified',
                'scheduled',
                'picked_up',
                'rejected'
            ])->default('pending');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('waste_reports');
    }
};
