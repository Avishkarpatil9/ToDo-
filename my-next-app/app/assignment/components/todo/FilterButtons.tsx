import { memo, useCallback } from 'react';
import { FilterType, FilterTypeValue } from '@/lib/constants/todo';

interface FilterButtonsProps {
  currentFilter: FilterTypeValue;
  onFilterChange: (filter: FilterTypeValue) => void;
}

const FilterButtons = memo(({ currentFilter, onFilterChange }: FilterButtonsProps) => {
  const handleFilterAll = useCallback(() => onFilterChange(FilterType.ALL), [onFilterChange]);
  const handleFilterActive = useCallback(() => onFilterChange(FilterType.ACTIVE), [onFilterChange]);
  const handleFilterCompleted = useCallback(() => onFilterChange(FilterType.COMPLETED), [onFilterChange]);

  const baseBtn = "px-4 py-2 rounded-lg font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900";
  const activeBtn = "bg-blue-600 text-white";
  const inactiveBtn = "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600";

  return (
    <div className="flex gap-2 justify-center" role="group" aria-label="Filter todos">
      <button
        type="button"
        onClick={handleFilterAll}
        aria-pressed={currentFilter === FilterType.ALL}
        className={`${baseBtn} ${currentFilter === FilterType.ALL ? activeBtn : inactiveBtn}`}
      >
        All
      </button>
      <button
        type="button"
        onClick={handleFilterActive}
        aria-pressed={currentFilter === FilterType.ACTIVE}
        className={`${baseBtn} ${currentFilter === FilterType.ACTIVE ? activeBtn : inactiveBtn}`}
      >
        Active
      </button>
      <button
        type="button"
        onClick={handleFilterCompleted}
        aria-pressed={currentFilter === FilterType.COMPLETED}
        className={`${baseBtn} ${currentFilter === FilterType.COMPLETED ? activeBtn : inactiveBtn}`}
      >
        Completed
      </button>
    </div>
  );
});

FilterButtons.displayName = 'FilterButtons';

export default FilterButtons;
