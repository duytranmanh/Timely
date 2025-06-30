export type CategoryBase = {
    name: string,
    is_default: boolean,
    description?: string,
    color: string,
    
}

/**
 * Category type used for reading from Backend Responses
 */
export type CategoryRead = CategoryBase & {
    id: number,
    user: number
}

/**
 * Category type used for sending request
 */
export type CategoryCreate = CategoryBase