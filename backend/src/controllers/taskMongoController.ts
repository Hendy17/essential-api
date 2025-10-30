import { Response } from 'express';
import { validationResult } from 'express-validator';
import { TaskMongoService } from '../services/taskMongoService';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export class TaskMongoController {
  static createTask = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
      return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: 'error',
        message: 'Validation errors',
        errors: errors.array()
      });
      return;
    }

    try {
      const task = await TaskMongoService.createTask(req.user.id, req.body);

      res.status(201).json({
        status: 'success',
        message: 'Task created successfully',
        data: task
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to create task'
      });
    }
  });

  static getAllTasks = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
      return;
    }

    const { 
      status, 
      priority, 
      search,
      page,
      limit,
      sortBy,
      sortOrder,
      category
    } = req.query;

    if (page || limit) {
      const paginationOptions = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
        sortBy: sortBy as any || 'createdAt',
        sortOrder: sortOrder as any || 'DESC'
      };

      const filters: any = {};
      
      if (status === 'completed') {
        filters.completed = true;
      } else if (status === 'pending') {
        filters.completed = false;
      }
      
      if (priority && ['low', 'medium', 'high'].includes(priority as string)) {
        filters.priority = priority as 'low' | 'medium' | 'high';
      }
      
      if (search) {
        filters.search = search as string;
      }

      const result = await TaskMongoService.getTasksPaginated(
        req.user.id, 
        paginationOptions, 
        filters
      );

      res.status(200).json({
        status: 'success',
        message: 'Tasks retrieved successfully',
        ...result
      });
      return;
    }

    let tasks;

    if (status === 'completed') {
      tasks = await TaskMongoService.getTasksByStatus(req.user.id, true);
    } else if (status === 'pending') {
      tasks = await TaskMongoService.getTasksByStatus(req.user.id, false);
    } else if (priority && ['low', 'medium', 'high'].includes(priority as string)) {
      tasks = await TaskMongoService.getTasksByPriority(req.user.id, priority as 'low' | 'medium' | 'high');
    } else if (category) {
      tasks = await TaskMongoService.getTasksByCategory(req.user.id, category as string);
    } else {
      tasks = await TaskMongoService.getAllTasks(req.user.id);
    }

    res.status(200).json({
      status: 'success',
      message: 'Tasks retrieved successfully',
      data: tasks,
      count: tasks.length
    });
  });

  static getTaskById = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
      return;
    }

    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({
        status: 'error',
        message: 'Task ID is required'
      });
      return;
    }

    const task = await TaskMongoService.getTaskById(req.user.id, id);

    if (!task) {
      res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Task retrieved successfully',
      data: task
    });
  });

  static updateTask = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
      return;
    }

    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({
        status: 'error',
        message: 'Task ID is required'
      });
      return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: 'error',
        message: 'Validation errors',
        errors: errors.array()
      });
      return;
    }

    const task = await TaskMongoService.updateTask(req.user.id, id, req.body);

    if (!task) {
      res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Task updated successfully',
      data: task
    });
  });

  static deleteTask = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
      return;
    }

    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({
        status: 'error',
        message: 'Task ID is required'
      });
      return;
    }

    const deleted = await TaskMongoService.deleteTask(req.user.id, id);

    if (!deleted) {
      res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Task deleted successfully'
    });
  });

  static completeTask = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
      return;
    }

    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({
        status: 'error',
        message: 'Task ID is required'
      });
      return;
    }

    const task = await TaskMongoService.updateTask(req.user.id, id, { completed: true });

    if (!task) {
      res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Task marked as completed',
      data: task
    });
  });

  static uncompleteTask = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
      return;
    }

    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({
        status: 'error',
        message: 'Task ID is required'
      });
      return;
    }

    const task = await TaskMongoService.updateTask(req.user.id, id, { completed: false });

    if (!task) {
      res.status(404).json({
        status: 'error',
        message: 'Task not found'
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Task marked as pending',
      data: task
    });
  });

  static getOverdueTasks = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
      return;
    }

    const tasks = await TaskMongoService.getOverdueTasks(req.user.id);

    res.status(200).json({
      status: 'success',
      message: 'Overdue tasks retrieved successfully',
      data: tasks,
      count: tasks.length
    });
  });

  static getTaskStats = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
      return;
    }

    const stats = await TaskMongoService.getTaskStats(req.user.id);

    res.status(200).json({
      status: 'success',
      message: 'Task statistics retrieved successfully',
      data: stats
    });
  });
}