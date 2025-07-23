<?php

namespace Tests\Feature;

use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_view_todo_app(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Welcome')
            ->has('tasks')
        );
    }

    public function test_can_create_task(): void
    {
        $taskData = [
            'title' => 'Test Task',
        ];

        $response = $this->post('/tasks', $taskData);

        $response->assertStatus(200);
        $this->assertDatabaseHas('tasks', [
            'title' => 'Test Task',
            'status' => 'pending',
        ]);
    }

    public function test_cannot_create_task_without_title(): void
    {
        $response = $this->post('/tasks', []);

        $response->assertStatus(302);
        $response->assertSessionHasErrors(['title']);
    }

    public function test_can_update_task_status(): void
    {
        $task = Task::factory()->pending()->create();

        $response = $this->patch("/tasks/{$task->id}", [
            'status' => 'completed'
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'status' => 'completed',
        ]);
    }

    public function test_can_toggle_task_from_completed_to_pending(): void
    {
        $task = Task::factory()->completed()->create();

        $response = $this->patch("/tasks/{$task->id}", [
            'status' => 'pending'
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'status' => 'pending',
        ]);
    }

    public function test_cannot_update_task_with_invalid_status(): void
    {
        $task = Task::factory()->create();

        $response = $this->patch("/tasks/{$task->id}", [
            'status' => 'invalid_status'
        ]);

        $response->assertStatus(302);
        $response->assertSessionHasErrors(['status']);
    }

    public function test_can_delete_task(): void
    {
        $task = Task::factory()->create();

        $response = $this->delete("/tasks/{$task->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('tasks', [
            'id' => $task->id,
        ]);
    }

    public function test_todo_page_displays_tasks_correctly(): void
    {
        $pendingTask = Task::factory()->pending()->create([
            'title' => 'Pending Task',
            'created_at' => now()->subMinute()
        ]);
        $completedTask = Task::factory()->completed()->create([
            'title' => 'Completed Task',
            'created_at' => now()
        ]);

        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Welcome')
            ->has('tasks', 2)
            ->where('tasks.0.title', $completedTask->title)
            ->where('tasks.0.status', 'completed')
            ->where('tasks.1.title', $pendingTask->title)
            ->where('tasks.1.status', 'pending')
        );
    }

    public function test_tasks_are_ordered_by_latest(): void
    {
        $oldTask = Task::factory()->create(['created_at' => now()->subDay()]);
        $newTask = Task::factory()->create(['created_at' => now()]);

        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Welcome')
            ->has('tasks', 2)
            ->where('tasks.0.id', $newTask->id)
            ->where('tasks.1.id', $oldTask->id)
        );
    }
}