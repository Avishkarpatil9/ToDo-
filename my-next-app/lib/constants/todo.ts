/**
 * Filter types for todos
 */
export enum FilterType {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed'
}

/**
 * Filter type union for backward compatibility
 */
export type FilterTypeValue = 'all' | 'active' | 'completed';

/**
 * Todo statistics interface
 */
export interface TodoStats {
  total: number;
  active: number;
  completed: number;
}

/**
 * Maximum length for todo text
 */
export const TODO_MAX_LENGTH = 200;
