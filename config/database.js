import { Sequelize } from "sequelize";


    const sequelize = new Sequelize("mentlydb", "mently", "db123", {
        host: "34.101.175.228",
        dialect: "mysql",
    });


// Table name


// sequelize.sync({ alter: true,force: false })
//     .then(() => console.log("Database diupdate"))
//     .catch((error) => console.error("sinkronisasi gagal", error));



export default sequelize;       