module.exports = (sequelize, DataTypes) => {
    const Campaign = sequelize.define("Campaign", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gameMaster: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "Users",
                key: "id",
            }
        }
    });

    return Campaign;
}