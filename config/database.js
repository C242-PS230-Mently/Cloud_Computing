import { Sequelize } from "sequelize";


const sequelize = new Sequelize("mently", "root", "", {
    host: "localhost",
    dialect: "mysql",
});


// Table name


// sequelize.sync({ alter: true })
//     .then(() => console.log("Database diupdate"))
//     .catch((error) => console.error("sinkronisasi gagal", error));



export default sequelize;