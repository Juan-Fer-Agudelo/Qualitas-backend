import express from 'express';
import dotenv from 'dotenv';
import sequelize from './Config/DB.js';
import UserRoutes from './Routes/UserRoutes.js'

//Initialization
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

//Settings
app.use(express.json());
app.use('/api/Users', UserRoutes);

// Run Server y Sincronizar la base de datos
sequelize.sync({}).then(() => {
    console.log('Database synced!');
    
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }).catch(error => {
    console.log('Error syncing database:', error);
    
  });