module.exports = (sequelize, DataTypes) => {
    const JournalEntries = sequelize.define("JournalEntries", {
        journalBody: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        privateEntry: {
            type: DataTypes.BOOLEAN,
            allowNull: false, 
        },
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
    }); 

    return JournalEntries;
}