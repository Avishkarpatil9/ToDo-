import { Todo, TodoUpdate } from '@/lib/types/todo';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class TodoApiService {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    async getAllTodos(): Promise<Todo[]> {
        try {
            const response = await fetch(`${this.baseUrl}/todos`);
            if (!response.ok) {
                throw new Error(`Failed to fetch todos: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching todos:', error);
            throw error;
        }
    }

    async createTodo(text: string): Promise<Todo> {
        try {
            const response = await fetch(`${this.baseUrl}/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });
            if (!response.ok) {
                throw new Error(`Failed to create todo: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error creating todo:', error);
            throw error;
        }
    }

    async updateTodo(id: number, updates: TodoUpdate): Promise<Todo> {
        try {
            const response = await fetch(`${this.baseUrl}/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });
            if (!response.ok) {
                throw new Error(`Failed to update todo: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error updating todo:', error);
            throw error;
        }
    }

    async deleteTodo(id: number): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/todos/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`Failed to delete todo: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error deleting todo:', error);
            throw error;
        }
    }

    async deleteCompletedTodos(): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/todos/completed`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`Failed to delete completed todos: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error deleting completed todos:', error);
            throw error;
        }
    }
}

export default new TodoApiService();
