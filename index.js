import express from "express";
import db from "./config/database.js"
import router from "./routes/index.js";
import dotenv from 'dotenv';
import sequelize from "./config/database.js";
dotenv.config();

const app = express();


try {
    await sequelize.authenticate();
    console.log('Database terkonek');
    
} catch (error) {
    console.log(error);
}

// db.sync()
//   .then(() => {
//     console.log('Database & tables created!');
//   })
//   .catch((error) => {
//     console.error('Error creating database:', error);
//   });

app.use(express.json());
app.use(router);

app.listen(5000,() => {
    console.log('The server running on port 5000')
})