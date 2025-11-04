import { memo } from 'react';
import { TodoStats as TodoStatsType } from '@/lib/constants/todo';

interface TodoStatsProps {
  stats: TodoStatsType;
}

const TodoStats = memo(({ stats }: TodoStatsProps) => {
  return (
    <div
      className="px-6 py-4 grid grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800"
      role="status"
      aria-label="Todo statistics"
    >
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
});

TodoStats.displayName = 'TodoStats';

export default TodoStats;
