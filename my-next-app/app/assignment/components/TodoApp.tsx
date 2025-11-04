"use client"
import todoApi from '@/lib/api/todoApi';
import { FilterType, FilterTypeValue, TodoStats as TodoStatsType } from '@/lib/constants/todo';
import { Todo } from '@/lib/types/todo';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import FilterButtons from './todo/FilterButtons';
import TodoForm from './todo/TodoForm';
import TodoList from './todo/TodoList';
import TodoStats from './todo/TodoStats';

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<FilterTypeValue>(FilterType.ALL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTodos = await todoApi.getAllTodos();
      setTodos(fetchedTodos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleAddTodo = useCallback(async () => {
    if (inputValue.trim() === '') return;

    setLoading(true);
    setError(null);
    try {
      const newTodo = await todoApi.createTodo(inputValue.trim());
      setTodos(prev => [newTodo, ...prev]);
      setInputValue('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo');
    } finally {
      setLoading(false);
    }
  }, [inputValue]);

  const handleToggleTodo = useCallback(async (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    // Optimistic update
    setTodos(prev => prev.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));

    setError(null);
    try {
      const updatedTodo = await todoApi.updateTodo(id, { completed: !todo.completed });
      setTodos(prev => prev.map(t => t.id === id ? updatedTodo : t));
    } catch (err) {
      // Rollback on error
      setTodos(prev => prev.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  }, [todos]);

  const handleDeleteTodo = useCallback(async (id: number) => {
    // Optimistic update
    const todoToDelete = todos.find(t => t.id === id);
    setTodos(prev => prev.filter(todo => todo.id !== id));

    setError(null);
    try {
      await todoApi.deleteTodo(id);
    } catch (err) {
      // Rollback on error
      if (todoToDelete) {
        setTodos(prev => [...prev, todoToDelete].sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      }
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
    }
  }, [todos]);

  const handleClearCompleted = useCallback(async () => {
    if (!window.confirm('Are you sure you want to delete all completed tasks?')) {
      return;
    }

    // Optimistic update
    const completedTodos = todos.filter(todo => todo.completed);
    setTodos(prev => prev.filter(todo => !todo.completed));

    setError(null);
    try {
      await todoApi.deleteCompletedTodos();
    } catch (err) {
      // Rollback on error
      setTodos(prev => [...prev, ...completedTodos].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
      setError(err instanceof Error ? err.message : 'Failed to clear completed todos');
    }
  }, [todos]);

  const handleFilterChange = useCallback((newFilter: FilterTypeValue) => {
    setFilter(newFilter);
  }, []);

  const handleDismissError = useCallback(() => {
    setError(null);
  }, []);

  // Memoized filtered todos
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case FilterType.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case FilterType.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  // Memoized stats
  const stats: TodoStatsType = useMemo(() => ({
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
  }), [todos]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200/70 dark:border-gray-800 overflow-hidden">

          {/* Header */}
          <header className="px-6 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700">
            <h1 className="text-3xl font-bold text-white text-center">
              📝 My Todo List
            </h1>
            <p className="text-blue-100 text-center mt-2 text-sm">
              Stay organized and productive
            </p>
          </header>

          {/* Error Message */}
          {error && (
            <div
              className="px-6 py-3 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800"
              role="alert"
              aria-live="assertive"
            >
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                <span aria-hidden="true">⚠️</span>
                <span>{error}</span>
                <button
                  onClick={handleDismissError}
                  aria-label="Dismiss error"
                  className="ml-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div
              className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800"
              role="status"
              aria-live="polite"
            >
              <div className="text-blue-600 dark:text-blue-400 text-sm text-center">
                <span aria-hidden="true">⏳</span> Loading...
              </div>
            </div>
          )}

          {/* Add Todo Form */}
          <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-800">
            <TodoForm
              inputValue={inputValue}
              onInputChange={handleInputChange}
              onAddTodo={handleAddTodo}
              disabled={loading}
            />
          </div>

          {/* Stats */}
          <TodoStats stats={stats} />

          {/* Filter Buttons */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <FilterButtons
              currentFilter={filter}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Todo List */}
          <div className="px-6 py-4 max-h-96 overflow-y-auto">
            <TodoList
              todos={filteredTodos}
              onToggle={handleToggleTodo}
              onDelete={handleDeleteTodo}
            />
          </div>

          {/* Footer Actions */}
          {stats.completed > 0 && (
            <footer className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800">
              <button
                type="button"
                onClick={handleClearCompleted}
                aria-label={`Clear ${stats.completed} completed ${stats.completed === 1 ? 'task' : 'tasks'}`}
                className="w-full py-2.5 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
              >
                Clear {stats.completed} Completed {stats.completed === 1 ? 'Task' : 'Tasks'}
              </button>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
