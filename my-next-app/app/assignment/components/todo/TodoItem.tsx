import { memo } from 'react';
import { Todo } from '@/lib/types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoItem = memo(({ todo, onToggle, onDelete }: TodoItemProps) => {
  const handleToggle = () => onToggle(todo.id);
  const handleDelete = () => onDelete(todo.id);

  return (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:shadow-md transition group">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
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
        onClick={handleDelete}
        aria-label={`Delete "${todo.text}"`}
        className="px-3 py-1.5 rounded-md bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 opacity-0 group-hover:opacity-100 transition focus:outline-none focus:opacity-100"
      >
        Delete
      </button>
    </div>
  );
});

TodoItem.displayName = 'TodoItem';

export default TodoItem;
