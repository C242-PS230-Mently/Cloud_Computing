import { Sequelize } from "sequelize";


    const sequelize = new Sequelize("mentlydb", "root", "new_password", {
        host: "localhost",
        dialect: "mysql",
    });


// Table name


// sequelize.sync({ alter: true,force: false })
//     .then(() => console.log("Database diupdate"))
//     .catch((error) => console.error("sinkronisasi gagal", error));



export default sequelize;       