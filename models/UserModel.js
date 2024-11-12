import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

export const User = sequelize.define("User", {
    id: { type: DataTypes.STRING, primaryKey: true },
    full_name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    token: { type: DataTypes.STRING },
    profile_photo: { type: DataTypes.STRING },

    age: { type: DataTypes.INTEGER },
    gender: {type: DataTypes.ENUM('Laki Laki','Perempuan')},
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
}, {
    tableName: "user",
});

export const UserOtp = sequelize.define("UserOtp", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, allowNull: false },
    otp: { type: DataTypes.STRING, allowNull: true },
    reset_token: { type: DataTypes.STRING, allowNull: false },
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

// Relasi with Constraints
User.hasMany(UserNotif, { foreignKey: { name: "user_id", allowNull: false }, onDelete: "CASCADE", onUpdate: "CASCADE" });
UserNotif.belongsTo(User, { foreignKey: { name: "user_id", allowNull: false }, onDelete: "CASCADE", onUpdate: "CASCADE" });

User.hasMany(UserResponse, { foreignKey: { name: "user_id", allowNull: false }, onDelete: "CASCADE", onUpdate: "CASCADE" });
UserResponse.belongsTo(User, { foreignKey: { name: "user_id", allowNull: false }, onDelete: "CASCADE", onUpdate: "CASCADE" });

Question.hasMany(UserResponse, { foreignKey: { name: "question_id", allowNull: false }, onDelete: "CASCADE", onUpdate: "CASCADE" });
UserResponse.belongsTo(Question, { foreignKey: { name: "question_id", allowNull: false }, onDelete: "CASCADE", onUpdate: "CASCADE" });

User.hasOne(UserOtp, { foreignKey: { name: "email", allowNull: false }, sourceKey: "email", onDelete: "CASCADE", onUpdate: "CASCADE" });
UserOtp.belongsTo(User, { foreignKey: { name: "email", allowNull: false }, targetKey: "email", onDelete: "CASCADE", onUpdate: "CASCADE" });

UserResponse.hasMany(UserHistory, { foreignKey: { name: "response_id", allowNull: false }, onDelete: "CASCADE", onUpdate: "CASCADE" });
UserHistory.belongsTo(UserResponse, { foreignKey: { name: "response_id", allowNull: false }, onDelete: "CASCADE", onUpdate: "CASCADE" });

UserHistory.hasMany(UserNotif, { foreignKey: { name: "history_id", allowNull: true }, onDelete: "SET NULL", onUpdate: "CASCADE" });
UserNotif.belongsTo(UserHistory, { foreignKey: { name: "history_id", allowNull: true }, onDelete: "SET NULL", onUpdate: "CASCADE" });
