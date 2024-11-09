import { Sequelize } from "sequelize";


const sequelize = new Sequelize("mently", "root", "", {
    host: "localhost",
    dialect: "mysql",
});


// Table name

// Synchronize models with the database
// sequelize.sync({ alter: true })
//     .then(() => console.log("Database synchronized"))
//     .catch((error) => console.error("Synchronization error:", error));

// Default export sequelize instance for database connection

export default sequelize;