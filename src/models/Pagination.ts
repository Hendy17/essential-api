export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'priority' | 'dueDate';
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface TaskFilters {
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  search?: string;
}