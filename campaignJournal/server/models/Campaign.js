module.exports = (sequelize, DataTypes) => {
    const Campaign = sequelize.define("Campaign", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    return Campaign;
}