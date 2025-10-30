import { Task, ITask } from '../models/TaskMongo';
import { User } from '../models/User';
import { PaginationOptions, PaginatedResponse, TaskFilters } from '../models/Pagination';
import mongoose from 'mongoose';

export interface CreateTaskMongoInput {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  category?: string;
  tags?: string[];
}

export interface UpdateTaskMongoInput {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  category?: string;
  tags?: string[];
}

export class TaskMongoService {
  static async createTask(userId: string, taskData: CreateTaskMongoInput): Promise<ITask> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const task = new Task({
      ...taskData,
      userId: new mongoose.Types.ObjectId(userId),
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined
    });

    await task.save();
    await task.populate('userId', 'name email');
    
    return task;
  }

  static async getAllTasks(userId: string): Promise<ITask[]> {
    const tasks = await Task.find({ userId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    return tasks;
  }

  static async getTasksPaginated(
    userId: string,
    options: PaginationOptions = {},
    filters: TaskFilters = {}
  ): Promise<PaginatedResponse<ITask>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = options;

    const { completed, priority, search } = filters;

    const query: any = { userId };

    if (completed !== undefined) {
      query.completed = completed;
    }

    if (priority) {
      query.priority = priority;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const sortFields: Record<string, string> = {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      title: 'title',
      priority: 'priority',
      dueDate: 'dueDate'
    };

    const sortField = sortFields[sortBy] || 'createdAt';
    const sortDirection = sortOrder === 'ASC' ? 1 : -1;

    const total = await Task.countDocuments(query);

    const offset = (page - 1) * limit;

    const tasks = await Task.find(query)
      .populate('userId', 'name email')
      .sort({ [sortField]: sortDirection })
      .limit(limit)
      .skip(offset);

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      data: tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev
      }
    };
  }

  static async getTaskById(userId: string, taskId: string): Promise<ITask | null> {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return null;
    }

    const task = await Task.findOne({ 
      _id: taskId, 
      userId 
    }).populate('userId', 'name email');
    
    return task;
  }

  static async updateTask(
    userId: string, 
    taskId: string, 
    updateData: UpdateTaskMongoInput
  ): Promise<ITask | null> {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return null;
    }

    const updatePayload: any = { ...updateData };
    if (updateData.dueDate) {
      updatePayload.dueDate = new Date(updateData.dueDate);
    }

    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      updatePayload,
      { 
        new: true, 
        runValidators: true 
      }
    ).populate('userId', 'name email');

    return task;
  }

  static async deleteTask(userId: string, taskId: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return false;
    }

    const result = await Task.deleteOne({ 
      _id: taskId, 
      userId 
    });
    
    return result.deletedCount > 0;
  }

  static async getTasksByStatus(userId: string, completed: boolean): Promise<ITask[]> {
    const tasks = await Task.find({ 
      userId, 
      completed 
    })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    return tasks;
  }

  static async getTasksByPriority(
    userId: string, 
    priority: 'low' | 'medium' | 'high'
  ): Promise<ITask[]> {
    const tasks = await Task.find({ 
      userId, 
      priority 
    })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    return tasks;
  }

  static async getTasksByCategory(userId: string, category: string): Promise<ITask[]> {
    const tasks = await Task.find({ 
      userId, 
      category 
    })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    return tasks;
  }

  static async getOverdueTasks(userId: string): Promise<ITask[]> {
    const now = new Date();
    
    const tasks = await Task.find({
      userId,
      dueDate: { $lt: now },
      completed: false
    })
      .populate('userId', 'name email')
      .sort({ dueDate: 1 });
    
    return tasks;
  }

  static async getTaskStats(userId: string) {
    const stats = await Task.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { 
            $sum: { $cond: [{ $eq: ['$completed', true] }, 1, 0] } 
          },
          pending: { 
            $sum: { $cond: [{ $eq: ['$completed', false] }, 1, 0] } 
          },
          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$completed', false] },
                    { $lt: ['$dueDate', new Date()] }
                  ]
                },
                1,
                0
              ]
            }
          },
          highPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] }
          },
          mediumPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] }
          },
          lowPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] }
          }
        }
      }
    ]);

    return stats[0] || {
      total: 0,
      completed: 0,
      pending: 0,
      overdue: 0,
      highPriority: 0,
      mediumPriority: 0,
      lowPriority: 0
    };
  }
}