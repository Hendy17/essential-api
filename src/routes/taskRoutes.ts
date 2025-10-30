import { Router } from 'express';
import { TaskController } from '../controllers/taskController';
import { createTaskValidation, updateTaskValidation } from '../utils/validation';

const router = Router();

// @route   GET /api/tasks
// @desc    Buscar todas as tarefas
// @access  Public
router.get('/', TaskController.getAllTasks);

// @route   GET /api/tasks/:id
// @desc    Buscar tarefa por ID
// @access  Public
router.get('/:id', TaskController.getTaskById);

// @route   POST /api/tasks
// @desc    Criar nova tarefa
// @access  Public
router.post('/', createTaskValidation, TaskController.createTask);

// @route   PUT /api/tasks/:id
// @desc    Atualizar tarefa
// @access  Public
router.put('/:id', updateTaskValidation, TaskController.updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Deletar tarefa
// @access  Public
router.delete('/:id', TaskController.deleteTask);

// @route   PATCH /api/tasks/:id/complete
// @desc    Marcar tarefa como completa
// @access  Public
router.patch('/:id/complete', TaskController.completeTask);

// @route   PATCH /api/tasks/:id/uncomplete
// @desc    Marcar tarefa como pendente
// @access  Public
router.patch('/:id/uncomplete', TaskController.uncompleteTask);

export default router;