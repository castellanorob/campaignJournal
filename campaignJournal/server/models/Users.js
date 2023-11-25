module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        icon: {
            type: DataTypes.STRING(45),
            defaultValue: 'default.jpg'
        },
        emailRegistrationDate:{
            type: DataTypes.STRING(45),
            allowNull: true, 
        },
        emailRegistrationToken:{
            type: DataTypes.STRING(45),
            allowNull: true, 
        },
        emailRegistrationExpires: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        resetPasswordToken: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
        resetPasswordExpires: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        playerInvitationToken: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
        playerInvitationExpiry: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        lastLoginDate: {
            type: DataTypes.DATE,
            allowNull: true,
        }
    });

    return Users;
}