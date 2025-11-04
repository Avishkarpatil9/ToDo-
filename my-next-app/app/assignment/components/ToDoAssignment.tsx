"use client"
import { Component } from 'react';
import todoApi, { Todo } from './todoApi';

interface TodoAppState {
    todos: Todo[];
    inputValue: string;
    filter: 'all' | 'active' | 'completed';
    loading: boolean;
    error: string | null;
}

class TodoApp extends Component<{}, TodoAppState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            todos: [],
            inputValue: '',
            filter: 'all',
            loading: false,
            error: null
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleAddTodo = this.handleAddTodo.bind(this);
        this.handleToggleTodo = this.handleToggleTodo.bind(this);
        this.handleDeleteTodo = this.handleDeleteTodo.bind(this);
        this.handleClearCompleted = this.handleClearCompleted.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.fetchTodos = this.fetchTodos.bind(this);
    }

    componentDidMount() {
        this.fetchTodos();
    }

    async fetchTodos() {
        this.setState({ loading: true, error: null });
        try {
            const todos = await todoApi.getAllTodos();
            this.setState({ todos, loading: false });
        } catch (error) {
            this.setState({ 
                error: error instanceof Error ? error.message : 'Failed to fetch todos',
                loading: false 
            });
        }
    }

    handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ inputValue: e.target.value });
    }

    handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            this.handleAddTodo();
        }
    }

    async handleAddTodo() {
        const { inputValue } = this.state;

        if (inputValue.trim() === '') return;

        this.setState({ loading: true, error: null });
        try {
            const newTodo = await todoApi.createTodo(inputValue.trim());
            this.setState((prev) => ({
                todos: [newTodo, ...prev.todos],
                inputValue: '',
                loading: false
            }));
        } catch (error) {
            this.setState({ 
                error: error instanceof Error ? error.message : 'Failed to create todo',
                loading: false 
            });
        }
    }

    async handleToggleTodo(id: number) {
        const todo = this.state.todos.find(t => t.id === id);
        if (!todo) return;

        this.setState({ error: null });
        try {
            const updatedTodo = await todoApi.updateTodo(id, { completed: !todo.completed });
            this.setState((prev) => ({
                todos: prev.todos.map(t => t.id === id ? updatedTodo : t)
            }));
        } catch (error) {
            this.setState({ 
                error: error instanceof Error ? error.message : 'Failed to update todo'
            });
        }
    }

    async handleDeleteTodo(id: number) {
        this.setState({ error: null });
        try {
            await todoApi.deleteTodo(id);
            this.setState((prev) => ({
                todos: prev.todos.filter(todo => todo.id !== id)
            }));
        } catch (error) {
            this.setState({ 
                error: error instanceof Error ? error.message : 'Failed to delete todo'
            });
        }
    }

    async handleClearCompleted() {
        this.setState({ error: null });
        try {
            await todoApi.deleteCompletedTodos();
            this.setState((prev) => ({
                todos: prev.todos.filter(todo => !todo.completed)
            }));
        } catch (error) {
            this.setState({ 
                error: error instanceof Error ? error.message : 'Failed to clear completed todos'
            });
        }
    }

    handleFilterChange(filter: 'all' | 'active' | 'completed') {
        this.setState({ filter });
    }

    private get filteredTodos(): Todo[] {
        const { todos, filter } = this.state;

        switch (filter) {
            case 'active':
                return todos.filter(todo => !todo.completed);
            case 'completed':
                return todos.filter(todo => todo.completed);
            default:
                return todos;
        }
    }

    private get stats() {
        const { todos } = this.state;
        return {
            total: todos.length,
            active: todos.filter(t => !t.completed).length,
            completed: todos.filter(t => t.completed).length
        };
    }

    render() {
        const { inputValue, filter, loading, error } = this.state;
        const stats = this.stats;

        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-8 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200/70 dark:border-gray-800 overflow-hidden">
                        
                        {/* Header */}
                        <div className="px-6 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700">
                            <h1 className="text-3xl font-bold text-white text-center">
                                📝 My Todo List
                            </h1>
                            <p className="text-blue-100 text-center mt-2 text-sm">
                                Stay organized and productive
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="px-6 py-3 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
                                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                                    <span>⚠️</span>
                                    <span>{error}</span>
                                    <button
                                        onClick={() => this.setState({ error: null })}
                                        className="ml-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Loading Indicator */}
                        {loading && (
                            <div className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
                                <div className="text-blue-600 dark:text-blue-400 text-sm text-center">
                                    ⏳ Loading...
                                </div>
                            </div>
                        )}

                        {/* Add Todo Form */}
                        <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-800">
                            <TodoForm
                                inputValue={inputValue}
                                onInputChange={this.handleInputChange}
                                onAddTodo={this.handleAddTodo}
                                onKeyPress={this.handleKeyPress}
                            />
                        </div>

                        {/* Stats */}
                        <TodoStats stats={stats} />

                        {/* Filter Buttons */}
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                            <FilterButtons
                                currentFilter={filter}
                                onFilterChange={this.handleFilterChange}
                            />
                        </div>

                        {/* Todo List */}
                        <div className="px-6 py-4 max-h-96 overflow-y-auto">
                            <TodoList
                                todos={this.filteredTodos}
                                onToggle={this.handleToggleTodo}
                                onDelete={this.handleDeleteTodo}
                            />
                        </div>

                        {/* Footer Actions */}
                        {stats.completed > 0 && (
                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800">
                                <button
                                    type="button"
                                    onClick={this.handleClearCompleted}
                                    className="w-full py-2.5 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
                                >
                                    Clear {stats.completed} Completed {stats.completed === 1 ? 'Task' : 'Tasks'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

interface TodoFormProps {
    inputValue: string;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAddTodo: () => void;
    onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

class TodoForm extends Component<TodoFormProps> {
    render() {
        const { inputValue, onInputChange, onAddTodo, onKeyPress } = this.props;

        return (
            <div className="flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={onInputChange}
                    onKeyPress={onKeyPress}
                    placeholder="What needs to be done?"
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition"
                />
                <button
                    type="button"
                    onClick={onAddTodo}
                    className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                >
                    Add
                </button>
            </div>
        );
    }
}

interface TodoStatsProps {
    stats: {
        total: number;
        active: number;
        completed: number;
    };
}

class TodoStats extends Component<TodoStatsProps> {
    render() {
        const { stats } = this.props;

        return (
            <div className="px-6 py-4 grid grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {stats.total}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Total
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {stats.active}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Active
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {stats.completed}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Completed
                    </div>
                </div>
            </div>
        );
    }
}

interface FilterButtonsProps {
    currentFilter: 'all' | 'active' | 'completed';
    onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
}

class FilterButtons extends Component<FilterButtonsProps> {
    render() {
        const { currentFilter, onFilterChange } = this.props;

        const baseBtn = "px-4 py-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900";
        const activeBtn = "bg-blue-600 text-white";
        const inactiveBtn = "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600";

        return (
            <div className="flex gap-2 justify-center">
                <button
                    type="button"
                    onClick={() => onFilterChange('all')}
                    className={`${baseBtn} ${currentFilter === 'all' ? activeBtn : inactiveBtn}`}
                >
                    All
                </button>
                <button
                    type="button"
                    onClick={() => onFilterChange('active')}
                    className={`${baseBtn} ${currentFilter === 'active' ? activeBtn : inactiveBtn}`}
                >
                    Active
                </button>
                <button
                    type="button"
                    onClick={() => onFilterChange('completed')}
                    className={`${baseBtn} ${currentFilter === 'completed' ? activeBtn : inactiveBtn}`}
                >
                    Completed
                </button>
            </div>
        );
    }
}

interface TodoListProps {
    todos: Todo[];
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}

class TodoList extends Component<TodoListProps> {
    render() {
        const { todos, onToggle, onDelete } = this.props;

        if (todos.length === 0) {
            return (
                <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                    <div className="text-5xl mb-3">📭</div>
                    <p className="text-lg">No tasks found</p>
                    <p className="text-sm mt-1">Add a task to get started!</p>
                </div>
            );
        }

        return (
            <div className="space-y-2">
                {todos.map(todo => (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={onToggle}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        );
    }
}

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}

class TodoItem extends Component<TodoItemProps> {
    constructor(props: TodoItemProps) {
        super(props);
        this.handleToggle = this.handleToggle.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleToggle() {
        this.props.onToggle(this.props.todo.id);
    }

    handleDelete() {
        this.props.onDelete(this.props.todo.id);
    }

    render() {
        const { todo } = this.props;

        return (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:shadow-md transition group">
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={this.handleToggle}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span
                    className={`flex-1 text-gray-900 dark:text-gray-100 ${
                        todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''
                    }`}
                >
                    {todo.text}
                </span>
                <button
                    type="button"
                    onClick={this.handleDelete}
                    className="px-3 py-1.5 rounded-md bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 opacity-0 group-hover:opacity-100 transition focus:outline-none focus:opacity-100"
                >
                    Delete
                </button>
            </div>
        );
    }
}

export default TodoApp;