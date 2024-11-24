import express from "express";
import router from "./routes/index.js";
import dotenv from 'dotenv';
import sequelize from "./config/database.js";
import axios from 'axios';
dotenv.config();
const PORT = process.env.PORT;


const app = express();


try {
    await sequelize.authenticate();
    console.log('Database terkonek');
    
} catch (error) {
    console.log(error);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

app.listen(PORT,() => {
    console.log(`Server is running on PORT ${PORT}`)
});