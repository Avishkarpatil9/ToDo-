import { NextRequest, NextResponse } from 'next/server';
import { getSequelize } from '@/lib/db/database';
import { getTodoModel } from '@/lib/db/models/Todo';
import { TodoCreate } from '@/lib/types/todo';

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

// GET /api/todos - Get all todos
export async function GET() {
    try {
        await initDatabase();
        const Todo = getTodoModel();
        const todos = await Todo.findAll({
            order: [['createdAt', 'DESC']]
        });
        return NextResponse.json(todos, { status: 200 });
    } catch (error) {
        console.error('Error fetching todos:', error);
        return NextResponse.json(
            { error: 'Failed to fetch todos' },
            { status: 500 }
        );
    }
}

// POST /api/todos - Create a new todo
export async function POST(request: NextRequest) {
    try {
        await initDatabase();
        const Todo = getTodoModel();
        const body: TodoCreate = await request.json();
        const { text } = body;

        if (!text || typeof text !== 'string' || text.trim() === '') {
            return NextResponse.json(
                { error: 'Text is required and must be a non-empty string' },
                { status: 400 }
            );
        }

        const todo = await Todo.create({
            text: text.trim(),
            completed: false
        });

        return NextResponse.json(todo, { status: 201 });
    } catch (error) {
        console.error('Error creating todo:', error);
        return NextResponse.json(
            { error: 'Failed to create todo' },
            { status: 500 }
        );
    }
}
