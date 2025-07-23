import React, { useState } from 'react';
import { type SharedData } from '@/types';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface Task {
    id: number;
    title: string;
    status: 'pending' | 'completed';
    created_at: string;
    updated_at: string;
}

interface Props {
    tasks: Task[];
    [key: string]: unknown;
}

export default function Welcome({ tasks = [] }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTaskTitle.trim()) {
            router.post(route('tasks.store'), 
                { title: newTaskTitle }, 
                {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => setNewTaskTitle('')
                }
            );
        }
    };

    const handleToggleTask = (task: Task) => {
        const newStatus = task.status === 'pending' ? 'completed' : 'pending';
        router.patch(route('tasks.update', task.id), 
            { status: newStatus }, 
            {
                preserveState: true,
                preserveScroll: true
            }
        );
    };

    const handleDeleteTask = (task: Task) => {
        router.delete(route('tasks.destroy', task.id), {
            preserveState: true,
            preserveScroll: true
        });
    };

    const pendingTasks = tasks.filter(task => task.status === 'pending');
    const completedTasks = tasks.filter(task => task.status === 'completed');

    return (
        <>
            <Head title="Todo App">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-4xl text-sm">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <div className="w-full max-w-4xl">
                    <main className="rounded-lg bg-white p-8 shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] dark:bg-[#161615] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                        <div className="mb-8 text-center">
                            <h1 className="mb-2 text-3xl font-bold text-[#1b1b18] dark:text-[#EDEDEC]">
                                Todo App
                            </h1>
                            <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                Manage your tasks efficiently
                            </p>
                        </div>

                        {/* Add new task form */}
                        <form onSubmit={handleAddTask} className="mb-8 flex gap-2">
                            <Input
                                type="text"
                                placeholder="Add a new task..."
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                className="flex-1"
                            />
                            <Button type="submit" disabled={!newTaskTitle.trim()}>
                                Add Task
                            </Button>
                        </form>

                        {/* Tasks list */}
                        <div className="space-y-6">
                            {/* Pending tasks */}
                            {pendingTasks.length > 0 && (
                                <div>
                                    <h2 className="mb-3 text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
                                        Pending Tasks ({pendingTasks.length})
                                    </h2>
                                    <div className="space-y-2">
                                        {pendingTasks.map((task) => (
                                            <div
                                                key={task.id}
                                                className="flex items-center gap-3 rounded-md border border-[#19140035] p-3 dark:border-[#3E3E3A]"
                                            >
                                                <Checkbox
                                                    checked={false}
                                                    onCheckedChange={() => handleToggleTask(task)}
                                                />
                                                <span className="flex-1 text-[#1b1b18] dark:text-[#EDEDEC]">
                                                    {task.title}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDeleteTask(task)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Completed tasks */}
                            {completedTasks.length > 0 && (
                                <div>
                                    <h2 className="mb-3 text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
                                        Completed Tasks ({completedTasks.length})
                                    </h2>
                                    <div className="space-y-2">
                                        {completedTasks.map((task) => (
                                            <div
                                                key={task.id}
                                                className="flex items-center gap-3 rounded-md border border-[#19140035] p-3 opacity-75 dark:border-[#3E3E3A]"
                                            >
                                                <Checkbox
                                                    checked={true}
                                                    onCheckedChange={() => handleToggleTask(task)}
                                                />
                                                <span className="flex-1 text-[#706f6c] line-through dark:text-[#A1A09A]">
                                                    {task.title}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDeleteTask(task)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Empty state */}
                            {tasks.length === 0 && (
                                <div className="py-12 text-center">
                                    <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                        No tasks yet. Add your first task above!
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Summary */}
                        {tasks.length > 0 && (
                            <div className="mt-8 rounded-md bg-[#f8f8f7] p-4 text-center dark:bg-[#1a1a19]">
                                <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                    Total: {tasks.length} tasks • 
                                    Pending: {pendingTasks.length} • 
                                    Completed: {completedTasks.length}
                                </p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </>
    );
}