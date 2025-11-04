import { Router } from 'express';
import {
    getAllTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    deleteCompletedTodos
} from '../controllers/todoController';

const router = Router();

router.get('/', getAllTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/completed', deleteCompletedTodos);
router.delete('/:id', deleteTodo);

export default router;

