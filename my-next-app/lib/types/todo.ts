/**
 * Shared Todo type definition used across the entire application
 * This ensures type consistency between client and server
 */

export interface Todo {
    id: number;
    text: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
}

/**
 * Type for creating a new Todo (without id and timestamps)
 */
export interface TodoCreate {
    text: string;
    completed?: boolean;
}

/**
 * Type for updating an existing Todo (all fields optional)
 */
export interface TodoUpdate {
    text?: string;
    completed?: boolean;
}
