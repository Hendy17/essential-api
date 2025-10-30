import { Router } from 'express';
import { TaskMongoController } from '../controllers/taskMongoController';
import { authenticate } from '../middleware/auth';
import { createTaskValidation, updateTaskValidation } from '../utils/validation';

const router = Router();

router.use(authenticate);

router.get('/', TaskMongoController.getAllTasks);

router.get('/stats', TaskMongoController.getTaskStats);

router.get('/overdue', TaskMongoController.getOverdueTasks);

router.get('/:id', TaskMongoController.getTaskById);

router.post('/', createTaskValidation, TaskMongoController.createTask);

router.put('/:id', updateTaskValidation, TaskMongoController.updateTask);

router.delete('/:id', TaskMongoController.deleteTask);

router.patch('/:id/complete', TaskMongoController.completeTask);

router.patch('/:id/uncomplete', TaskMongoController.uncompleteTask);

export default router;