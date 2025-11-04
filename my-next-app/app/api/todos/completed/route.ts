import { NextResponse } from 'next/server';
import { getSequelize } from '@/lib/db/database';
import { getTodoModel } from '@/lib/db/models/Todo';

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

// DELETE /api/todos/completed - Delete all completed todos
export async function DELETE() {
    try {
        await initDatabase();
        const Todo = getTodoModel();
        const deletedCount = await Todo.destroy({
            where: {
                completed: true
            }
        });

        return NextResponse.json(
            { message: `Deleted ${deletedCount} completed todos` },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting completed todos:', error);
        return NextResponse.json(
            { error: 'Failed to delete completed todos' },
            { status: 500 }
        );
    }
}
