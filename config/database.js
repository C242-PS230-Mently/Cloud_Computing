import { Sequelize } from "sequelize";

// Database Detail
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbName = process.env.DB_NAME;

const sequelize = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    dialect: "mysql",
    
});



// sequelize.sync({ alter: true,force: false })
//     .then(() => console.log("Database diupdate"))
//     .catch((error) => console.error("sinkronisasi gagal", error));



export default sequelize;       