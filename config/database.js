import { Sequelize, DataTypes } from "sequelize";


const sequelize = new Sequelize("mently", "root", "", {
    host: "localhost",
    dialect: "mysql",
});


// Table name
export const User = sequelize.define("User", {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    full_name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    token: { type: DataTypes.STRING },
    profile_photo: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
}, {
    tableName: "User",
});

export const UserOtp = sequelize.define("UserOtp", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, allowNull: false },
    otp: { type: DataTypes.STRING, allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
}, {
    tableName: "user_otp",
});

export const UserNotif = sequelize.define("UserNotif", {
    notif_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.STRING, allowNull: false },
    history_id: { type: DataTypes.INTEGER, allowNull: true },
    notif_type: { type: DataTypes.STRING, allowNull: false },
    notif_content: { type: DataTypes.TEXT, allowNull: false },
    is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
}, {
    tableName: "User_notif",
});

export const Question = sequelize.define("Question", {
    question_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    question_text: { type: DataTypes.TEXT, allowNull: false },
}, {
    tableName: "question",
});

export const UserResponse = sequelize.define("UserResponse", {
    response_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.STRING, allowNull: false },
    question_id: { type: DataTypes.INTEGER, allowNull: false },
    option_id: { type: DataTypes.INTEGER, allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
}, {
    tableName: "User_response",
});

export const UserHistory = sequelize.define("UserHistory", {
    history_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    response_id: { type: DataTypes.INTEGER, allowNull: false },
    model_result: { type: DataTypes.JSON },
    label: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
}, {
    tableName: "user_history",
});

// Define Associations
User.hasMany(UserNotif, { foreignKey: "user_id" });
UserNotif.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(UserResponse, { foreignKey: "user_id" });
UserResponse.belongsTo(User, { foreignKey: "user_id" });

Question.hasMany(UserResponse, { foreignKey: "question_id" });
UserResponse.belongsTo(Question, { foreignKey: "question_id" });

User.hasOne(UserOtp, { foreignKey: "email", sourceKey: "email" });
UserOtp.belongsTo(User, { foreignKey: "email", targetKey: "email" });

UserResponse.hasMany(UserHistory, { foreignKey: "response_id" });
UserHistory.belongsTo(UserResponse, { foreignKey: "response_id" });

UserHistory.hasMany(UserNotif, { foreignKey: "history_id" });
UserNotif.belongsTo(UserHistory, { foreignKey: "history_id" });

// Synchronize models with the database
// sequelize.sync({ alter: true })
//     .then(() => console.log("Database synchronized"))
//     .catch((error) => console.error("Synchronization error:", error));

// Default export sequelize instance for database connection

export default sequelize;