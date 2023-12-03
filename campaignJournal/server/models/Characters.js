module.exports = (sequelize, DataTypes) => {
    const Characters = sequelize.define("Characters", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: { len: [0, 500] }
        },
        campaignId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Campaigns",
                key: "id",
            }
        },
        playerId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "CampaignPlayers",
                key: "id",
            }
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: { len: [0, 75] }
        },
        icon: {
            type: DataTypes.STRING(45),
            defaultValue: 'elfIcon.png'
        },
    });

    return Characters;
}