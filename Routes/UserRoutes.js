import express from 'express';
import { getUsers, createUser, updateUser, deleteUser, login, register, getUsersById } from '../Controllers/UserController.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser)
router.delete('/users/:id', deleteUser)
router.get('/users/:id', getUsersById)

router.post('/register',register);
router.post('/login',login);

export default router;