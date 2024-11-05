import { DataTypes } from 'sequelize';
import sequelize from '../Config/DB.js';

export const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName:'usuarios',
  timestamps:false,
});

export default User;
