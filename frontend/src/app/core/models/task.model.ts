export interface Task {
  id?: string;
  _id?: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  tags?: string[];
  dueDate?: Date | string;
  userId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  tags?: string[];
  dueDate?: Date | string;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  completed?: boolean;
}

export interface TaskFilters {
  search?: string;
  status?: 'completed' | 'pending';
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  page?: number;
  limit?: number;
  sortBy?: 'title' | 'priority' | 'dueDate' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
}

export interface TasksResponse {
  status: string;
  message: string;
  data: Task[];
  count?: number;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
  byCategory: { [key: string]: number };
}