import { Router } from 'express';
import { TaskController } from '../controllers/taskController';
import { createTaskValidation, updateTaskValidation } from '../utils/validation';

const router = Router();


router.get('/', TaskController.getAllTasks);

router.get('/:id', TaskController.getTaskById);

router.post('/', createTaskValidation, TaskController.createTask);

router.put('/:id', updateTaskValidation, TaskController.updateTask);

router.delete('/:id', TaskController.deleteTask);

router.patch('/:id/complete', TaskController.completeTask);

router.patch('/:id/uncomplete', TaskController.uncompleteTask);

export default router;