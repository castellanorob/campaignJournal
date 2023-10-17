module.exports = (sequelize, DataTypes) => {
    const journal_entries = sequelize.define("journal_entries", {
        journal_body: {
            type: DataTypes.STRING,
            allowNull: false
        },
    });

    return journal_entries;
};