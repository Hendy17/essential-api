import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../config/database';
import { Task, CreateTaskInput, UpdateTaskInput } from '../models/Task';

export class TaskService {
  // Criar uma nova tarefa
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

    // Buscar a tarefa criada
    const createdTask = await this.getTaskById(result.insertId);
    if (!createdTask) {
      throw new Error('Failed to create task');
    }

    return createdTask;
  }

  // Buscar todas as tarefas
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

  // Buscar tarefa por ID
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

  // Atualizar uma tarefa
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
      return task; // Nenhuma atualização necessária
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

  // Deletar uma tarefa
  static async deleteTask(id: number): Promise<boolean> {
    const query = 'DELETE FROM tasks WHERE id = ?';
    const [result] = await pool.execute<ResultSetHeader>(query, [id]);
    
    return result.affectedRows > 0;
  }

  // Buscar tarefas por status
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

  // Buscar tarefas por prioridade
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