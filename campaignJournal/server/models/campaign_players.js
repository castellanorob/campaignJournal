module.exports = (sequelize, DataTypes) => {
    const campaign_users = sequelize.define("campaign_users", {
        campaign_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "campaign",
                key: "id",
            },
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
        },
    });


    return campaign_users;
};