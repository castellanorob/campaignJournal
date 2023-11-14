module.exports = (sequelize, DataTypes) => {
    const Friends = sequelize.define("Friends", {
        userId: {
            type: DataTypes.INTEGER,
            references: {
              model: "Users",
              key: 'id'
            },
            primaryKey: true
          },

        friendId: {
            type: DataTypes.INTEGER,
            references: {
              model: "Users",
              key: 'id'
            },
            primaryKey: true
          },
    });

    return Friends;
}