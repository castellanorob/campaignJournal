module.exports = (sequelize, DataTypes) => {
    const CampaignPlayers = sequelize.define("CampaignPlayers", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Users",
                key: "id",
            }
        },
        campaignId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Campaigns",
                key: "id",
            }
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false, 
        }        
    });

    return CampaignPlayers;
}