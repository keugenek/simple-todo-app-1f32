<?php

namespace Database\Seeders;

use App\Models\Task;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create some sample tasks
        Task::factory()->pending()->create(['title' => 'Complete project documentation']);
        Task::factory()->pending()->create(['title' => 'Review code changes']);
        Task::factory()->completed()->create(['title' => 'Set up development environment']);
        Task::factory()->pending()->create(['title' => 'Write unit tests']);
        Task::factory()->completed()->create(['title' => 'Deploy to staging']);
    }
}