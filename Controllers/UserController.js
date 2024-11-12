import User from '../Models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};

export const getUsersById = async (req, res)=>{
  try{
      const user = await User.findByPk(req.params.id);
      if(!user) return res.status(404).json({error: 'Usuario No Encontrado' })
        res.status(200).json(user)
  }catch(error){
      res.status(400).json({error: error.message})
  }
}

// Crear un nuevo usuario
export const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({ name, email, password });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'Error creating user' });
  }
};

// Actualizar un usuario
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  try {
    const user = await User.findByPk(id);
    if (user) {
      user.name = name;
      user.email = email;
      user.password = password;
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (user) {
      await user.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
};

const generateToken = (user) => {
  return jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET, {expiresIn: '1h'})
}

export const register = async (req, res) =>{
  const {name, email, password} = req.body;
  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({where: {email}});
    if (existingUser) {
      return res.status(400).json({error: 'Email already in use'});
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({name, email, password:hashedPassword});
    const token = generateToken(newUser);

    res.status(200).json({token})
  }

  catch(error){
    res.status(500).json({message: 'Error registering user'})
  }
}

export const login = async (req, res) =>{
  const {email, password} = req.body;
  try{
    //Buscar el usuario por el email
    const user = await User.findOne({where: {email}});
    if(!user){
      return res.status(404).json({error: 'Email o Contraseña son incorrectos'})
    }
    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if(!isValidPassword){
      return res.status(404).json({error: 'Email o Contraseña son incorrectos'})
    }
    const token = generateToken(user);
    res.json({token})
    
  }
    catch(error){
      res.status(500).json({message: 'Error en el servidor'})
    }
}
