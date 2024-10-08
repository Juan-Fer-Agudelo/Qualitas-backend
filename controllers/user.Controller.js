const connection = require('../database'); // Asegúrate de tener tu archivo de conexión a MySQL
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios
exports.getUsers = (req, res) => {
  const query = 'SELECT * FROM Usuarios';

  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching users' });
    }
    res.json(results);
  });
};

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Encriptar la contraseña
    const query = 'INSERT INTO Usuarios (nombre, email, contraseña) VALUES (?, ?, ?)';

    connection.query(query, [nombre, email, hashedPassword], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error creating user' });
      }
      res.status(201).json({ message: 'Usuario creado exitosamente' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
};

// Actualizar un usuario
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { nombre, email, password } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, 10); // Encriptar la nueva contraseña
    const query = 'UPDATE Usuarios SET nombre = ?, email = ?, contraseña = ? WHERE id = ?';

    connection.query(query, [nombre, email, hashedPassword, id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error updating user' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json({ message: 'Usuario actualizado exitosamente' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando el usuario' });
  }
};

// Eliminar un usuario
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  
  const query = 'DELETE FROM Usuarios WHERE id = ?';
  
  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting user' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(204).send(); // No se retorna contenido al eliminar
  });
};

// Función para generar el JWT
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Registro de usuario
exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    const queryCheck = 'SELECT * FROM Usuarios WHERE email = ?';
    connection.query(queryCheck, [email], async (err, results) => {
      if (results.length > 0) {
        return res.status(400).json({ message: 'El usuario ya existe' });
      }

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear el nuevo usuario
      const queryInsert = 'INSERT INTO Usuarios (email, contraseña) VALUES (?, ?)';
      connection.query(queryInsert, [email, hashedPassword], (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Error creando el usuario' });
        }

        const newUser = { id: results.insertId, email };
        const token = generateToken(newUser);

        res.status(200).json({ token });
      });
    });
  } catch (error) {
    res.status(500).json({ message: `Error en el servidor: ${error}` });
  }
};

// Inicio de sesión
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar el usuario por el email
    const query = 'SELECT * FROM Usuarios WHERE email = ?';
    connection.query(query, [email], async (err, results) => {
      if (results.length === 0) {
        return res.status(400).json({ message: 'Email o contraseña incorrectos' });
      }

      const user = results[0];

      // Verificar la contraseña
      const isPasswordValid = await bcrypt.compare(password, user.contraseña);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Email o contraseña incorrectos' });
      }

      const token = generateToken(user);
      res.json({ token });
    });
  } catch (error) {
    res.status(500).json({ message: `Error en el servidor: ${error}` });
  }
};
