const Sequelize = require('sequelize');
require("dotenv").config()

const isProduction = process.env.NODE_ENV === 'production';

module.exports =  new Sequelize('sql6427869',!isProduction ? process.env.DB_USER : "null",!isProduction ? process.env.DB_PASSWORD: "null", {
    host: 'sql6.freesqldatabase.com',
    dialect: 'mysql',
    pool:{
        max: 5, 
        min: 0,
        idle: 10000                
      }
  });
