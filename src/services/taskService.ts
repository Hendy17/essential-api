import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../config/database';
import { Task, CreateTaskInput, UpdateTaskInput } from '../models/Task';
import { PaginationOptions, PaginatedResponse, TaskFilters } from '../models/Pagination';

export class TaskService {
  static async createTask(taskData: CreateTaskInput): Promise<Task> {
    const {
      title,
      description = null,
      priority = 'medium',
      dueDate = null
    } = taskData;

    const query = `
      INSERT INTO tasks (title, description, priority, due_date)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await pool.execute<ResultSetHeader>(
      query,
      [title, description, priority, dueDate]
    );

    const createdTask = await this.getTaskById(result.insertId);
    if (!createdTask) {
      throw new Error('Failed to create task');
    }

    return createdTask;
  }

  static async getAllTasks(): Promise<Task[]> {
    const query = `
      SELECT 
        id,
        title,
        description,
        completed,
        priority,
        due_date as dueDate,
        created_at as createdAt,
        updated_at as updatedAt
      FROM tasks
      ORDER BY created_at DESC
    `;

    const [rows] = await pool.execute<RowDataPacket[]>(query);
    return rows as Task[];
  }

  // Buscar tarefas com paginação e filtros
  static async getTasksPaginated(
    options: PaginationOptions = {},
    filters: TaskFilters = {}
  ): Promise<PaginatedResponse<Task>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = options;

    const { completed, priority, search } = filters;

    // Construir condições WHERE
    const whereConditions: string[] = [];
    const queryParams: any[] = [];

    if (completed !== undefined) {
      whereConditions.push('completed = ?');
      queryParams.push(completed);
    }

    if (priority) {
      whereConditions.push('priority = ?');
      queryParams.push(priority);
    }

    if (search) {
      whereConditions.push('(title LIKE ? OR description LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    // Mapear campos de ordenação
    const sortFields: Record<string, string> = {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      title: 'title',
      priority: 'priority',
      dueDate: 'due_date'
    };

    const orderByField = sortFields[sortBy] || 'created_at';

    // Query para contar total de registros
    const countQuery = `
      SELECT COUNT(*) as total
      FROM tasks
      ${whereClause}
    `;

    // Query para buscar dados paginados
    const dataQuery = `
      SELECT 
        id,
        title,
        description,
        completed,
        priority,
        due_date as dueDate,
        created_at as createdAt,
        updated_at as updatedAt
      FROM tasks
      ${whereClause}
      ORDER BY ${orderByField} ${sortOrder}
      LIMIT ? OFFSET ?
    `;

    // Executar query de contagem
    const [countResult] = await pool.execute<RowDataPacket[]>(countQuery, queryParams);
    const total = (countResult[0] as any).total || 0;

    // Calcular offset
    const offset = (page - 1) * limit;
    
    // Executar query de dados
    const dataParams = [...queryParams, limit, offset];
    const [rows] = await pool.execute<RowDataPacket[]>(dataQuery, dataParams);

    // Calcular metadados de paginação
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      data: rows as Task[],
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

  static async getTaskById(id: number): Promise<Task | null> {
    const query = `
      SELECT 
        id,
        title,
        description,
        completed,
        priority,
        due_date as dueDate,
        created_at as createdAt,
        updated_at as updatedAt
      FROM tasks
      WHERE id = ?
    `;

    const [rows] = await pool.execute<RowDataPacket[]>(query, [id]);
    
    if (rows.length === 0) {
      return null;
    }

    return rows[0] as Task;
  }

  static async updateTask(id: number, updateData: UpdateTaskInput): Promise<Task | null> {
    const task = await this.getTaskById(id);
    if (!task) {
      return null;
    }

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (updateData.title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(updateData.title);
    }

    if (updateData.description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(updateData.description);
    }

    if (updateData.completed !== undefined) {
      updateFields.push('completed = ?');
      updateValues.push(updateData.completed);
    }

    if (updateData.priority !== undefined) {
      updateFields.push('priority = ?');
      updateValues.push(updateData.priority);
    }

    if (updateData.dueDate !== undefined) {
      updateFields.push('due_date = ?');
      updateValues.push(updateData.dueDate);
    }

    if (updateFields.length === 0) {
      return task; 
    }

    updateValues.push(id);

    const query = `
      UPDATE tasks
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;

    await pool.execute<ResultSetHeader>(query, updateValues);

    return await this.getTaskById(id);
  }

  static async deleteTask(id: number): Promise<boolean> {
    const query = 'DELETE FROM tasks WHERE id = ?';
    const [result] = await pool.execute<ResultSetHeader>(query, [id]);
    
    return result.affectedRows > 0;
  }

  static async getTasksByStatus(completed: boolean): Promise<Task[]> {
    const query = `
      SELECT 
        id,
        title,
        description,
        completed,
        priority,
        due_date as dueDate,
        created_at as createdAt,
        updated_at as updatedAt
      FROM tasks
      WHERE completed = ?
      ORDER BY created_at DESC
    `;

    const [rows] = await pool.execute<RowDataPacket[]>(query, [completed]);
    return rows as Task[];
  }

  static async getTasksByPriority(priority: 'low' | 'medium' | 'high'): Promise<Task[]> {
    const query = `
      SELECT 
        id,
        title,
        description,
        completed,
        priority,
        due_date as dueDate,
        created_at as createdAt,
        updated_at as updatedAt
      FROM tasks
      WHERE priority = ?
      ORDER BY created_at DESC
    `;

    const [rows] = await pool.execute<RowDataPacket[]>(query, [priority]);
    return rows as Task[];
  }
}