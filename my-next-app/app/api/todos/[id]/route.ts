import { NextRequest, NextResponse } from 'next/server';
import { getSequelize } from '@/lib/db/database';
import { getTodoModel } from '@/lib/db/models/Todo';
import { TodoUpdate } from '@/lib/types/todo';

// Initialize database connection
async function initDatabase() {
    try {
        const sequelize = getSequelize();
        getTodoModel(); // Initialize the model
        await sequelize.authenticate();
        await sequelize.sync({ alter: false });
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
}

// PUT /api/todos/:id - Update a todo
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await initDatabase();
        const Todo = getTodoModel();
        const { id } = await params;
        const body: TodoUpdate = await request.json();
        const { text, completed } = body;

        const todo = await Todo.findByPk(id);

        if (!todo) {
            return NextResponse.json(
                { error: 'Todo not found' },
                { status: 404 }
            );
        }

        // Update only provided fields
        if (text !== undefined) {
            if (typeof text !== 'string' || text.trim() === '') {
                return NextResponse.json(
                    { error: 'Text must be a non-empty string' },
                    { status: 400 }
                );
            }
            todo.text = text.trim();
        }

        if (completed !== undefined) {
            if (typeof completed !== 'boolean') {
                return NextResponse.json(
                    { error: 'Completed must be a boolean' },
                    { status: 400 }
                );
            }
            todo.completed = completed;
        }

        await todo.save();

        return NextResponse.json(todo, { status: 200 });
    } catch (error) {
        console.error('Error updating todo:', error);
        return NextResponse.json(
            { error: 'Failed to update todo' },
            { status: 500 }
        );
    }
}

// DELETE /api/todos/:id - Delete a todo
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await initDatabase();
        const Todo = getTodoModel();
        const { id } = await params;

        const todo = await Todo.findByPk(id);

        if (!todo) {
            return NextResponse.json(
                { error: 'Todo not found' },
                { status: 404 }
            );
        }

        await todo.destroy();

        return NextResponse.json(
            { message: 'Todo deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting todo:', error);
        return NextResponse.json(
            { error: 'Failed to delete todo' },
            { status: 500 }
        );
    }
}
