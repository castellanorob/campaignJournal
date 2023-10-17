module.exports = (sequelize, DataTypes) => {
    const campaign = sequelize.define("campaign", {
        campaign_title: {
            type: DataTypes.STRING,
            allowNull: false
        },
    });

    campaign.associate = (models) => {
        campaign.hasMany(models.journal_entries, {
            onDelete: "cascade",
        });
    }

    campaign.associate = (models) => {
        campaign.hasMany(models.journal_entries, {
            onDelete: "cascade",
        });
    }

    return campaign;
};