import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { TaskService } from '../services/taskService';
import { asyncHandler } from '../middleware/errorHandler';

export class TaskController {
  static createTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: 'error',
        message: 'Validation errors',
        errors: errors.array()
      });
      return;
    }

    const task = await TaskService.createTask(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Task created successfully',
      data: task
    });
  });

  static getAllTasks = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { 
      status, 
      priority, 
      search,
      page,
      limit,
      sortBy,
      sortOrder
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

      const result = await TaskService.getTasksPaginated(paginationOptions, filters);

      res.status(200).json({
        status: 'success',
        message: 'Tasks retrieved successfully',
        ...result
      });
      return;
    }

    let tasks;

    if (status === 'completed') {
      tasks = await TaskService.getTasksByStatus(true);
    } else if (status === 'pending') {
      tasks = await TaskService.getTasksByStatus(false);
    } else if (priority && ['low', 'medium', 'high'].includes(priority as string)) {
      tasks = await TaskService.getTasksByPriority(priority as 'low' | 'medium' | 'high');
    } else {
      tasks = await TaskService.getAllTasks();
    }

    res.status(200).json({
      status: 'success',
      message: 'Tasks retrieved successfully',
      data: tasks,
      count: tasks.length
    });
  });

  static getTaskById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({
        status: 'error',
        message: 'Task ID is required'
      });
      return;
    }

    const taskId = parseInt(id);

    if (isNaN(taskId)) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid task ID'
      });
      return;
    }

    const task = await TaskService.getTaskById(taskId);

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

  static updateTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({
        status: 'error',
        message: 'Task ID is required'
      });
      return;
    }

    const taskId = parseInt(id);

    if (isNaN(taskId)) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid task ID'
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

    const task = await TaskService.updateTask(taskId, req.body);

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

  static deleteTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({
        status: 'error',
        message: 'Task ID is required'
      });
      return;
    }

    const taskId = parseInt(id);

    if (isNaN(taskId)) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid task ID'
      });
      return;
    }

    const deleted = await TaskService.deleteTask(taskId);

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

  static completeTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({
        status: 'error',
        message: 'Task ID is required'
      });
      return;
    }

    const taskId = parseInt(id);

    if (isNaN(taskId)) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid task ID'
      });
      return;
    }

    const task = await TaskService.updateTask(taskId, { completed: true });

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

  static uncompleteTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    if (!id) {
      res.status(400).json({
        status: 'error',
        message: 'Task ID is required'
      });
      return;
    }

    const taskId = parseInt(id);

    if (isNaN(taskId)) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid task ID'
      });
      return;
    }

    const task = await TaskService.updateTask(taskId, { completed: false });

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
}