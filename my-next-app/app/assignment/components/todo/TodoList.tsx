import { memo } from 'react';
import { Todo } from '@/lib/types/todo';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoList = memo(({ todos, onToggle, onDelete }: TodoListProps) => {
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
    <div className="space-y-2" role="list" aria-label="Todo list">
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
});

TodoList.displayName = 'TodoList';

export default TodoList;
