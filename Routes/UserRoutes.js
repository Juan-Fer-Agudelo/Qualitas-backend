import express from 'express';
import { getUsers, createUser, updateUser, deleteUser, login, register } from '../Controllers/UserController.js';

const Router = express.Router();

Router.get('/Users', getUsers);
Router.post('/Users', createUser);
Router.put('/Users/:id', updateUser)
Router.delete('/Users/:id', deleteUser)

Router.post('/Register', register);
Router.post('/Login', login);
Router.post('/Login', login); // Por cuestiones dupliqué esta linea

export default Router;