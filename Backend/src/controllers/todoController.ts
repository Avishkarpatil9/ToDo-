import { Request, Response } from 'express';
import Todo from '../models/Todo';

export const getAllTodos = async (req: Request, res: Response): Promise<void> => {
    try {
        const todos = await Todo.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ error: 'Failed to fetch todos' });
    }
};

export const createTodo = async (req: Request, res: Response): Promise<void> => {
    try {
        const { text } = req.body;

        if (!text || typeof text !== 'string' || text.trim() === '') {
            res.status(400).json({ error: 'Text is required and must be a non-empty string' });
            return;
        }

        const todo = await Todo.create({
            text: text.trim(),
            completed: false
        });

        res.status(201).json(todo);
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).json({ error: 'Failed to create todo' });
    }
};

export const updateTodo = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { text, completed } = req.body;

        const todo = await Todo.findByPk(id);

        if (!todo) {
            res.status(404).json({ error: 'Todo not found' });
            return;
        }

        // Update only provided fields
        if (text !== undefined) {
            if (typeof text !== 'string' || text.trim() === '') {
                res.status(400).json({ error: 'Text must be a non-empty string' });
                return;
            }
            todo.text = text.trim();
        }

        if (completed !== undefined) {
            if (typeof completed !== 'boolean') {
                res.status(400).json({ error: 'Completed must be a boolean' });
                return;
            }
            todo.completed = completed;
        }

        await todo.save();

        res.status(200).json(todo);
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ error: 'Failed to update todo' });
    }
};

export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const todo = await Todo.findByPk(id);

        if (!todo) {
            res.status(404).json({ error: 'Todo not found' });
            return;
        }

        await todo.destroy();

        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ error: 'Failed to delete todo' });
    }
};

export const deleteCompletedTodos = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedCount = await Todo.destroy({
            where: {
                completed: true
            }
        });

        res.status(200).json({ message: `Deleted ${deletedCount} completed todos` });
    } catch (error) {
        console.error('Error deleting completed todos:', error);
        res.status(500).json({ error: 'Failed to delete completed todos' });
    }
};

