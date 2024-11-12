import express from 'express';
import dotenv from 'dotenv';
import sequelize from './Config/DB.js';
import cors from 'cors';
import UserRoutes from './Routes/UserRoutes.js';

dotenv.config();

//Initialization
const app = express();
const port = process.env.PORT || 3001;
app.use(cors());

//Settings
app.use(express.json());
app.use('/api', UserRoutes);

// Run Server y Sincronizar la base de datos
sequelize.sync().then(() => {
    console.log('Database synced!');
    
    app.listen(port, () => {
      console.log(`Server running on port http://localhost:3001`);
    });
  }).catch(error => {
    console.log('Error syncing database:', error);
    
  });