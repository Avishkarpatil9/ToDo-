import { memo, FormEvent, ChangeEvent, KeyboardEvent } from 'react';
import { TODO_MAX_LENGTH } from '@/lib/constants/todo';

interface TodoFormProps {
  inputValue: string;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onAddTodo: () => void;
  disabled?: boolean;
}

const TodoForm = memo(({ inputValue, onInputChange, onAddTodo, disabled = false }: TodoFormProps) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAddTodo();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onAddTodo();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={inputValue}
        onChange={onInputChange}
        onKeyDown={handleKeyDown}
        placeholder="What needs to be done?"
        maxLength={TODO_MAX_LENGTH}
        disabled={disabled}
        aria-label="Add new todo"
        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button
        type="submit"
        disabled={disabled || inputValue.trim() === ''}
        aria-label="Add todo"
        className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Add
      </button>
    </form>
  );
});

TodoForm.displayName = 'TodoForm';

export default TodoForm;
