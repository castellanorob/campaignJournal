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
    });

    return Users;
}