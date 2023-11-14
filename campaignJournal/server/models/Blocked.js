module.exports = (sequelize, DataTypes) => {
    const Blocked = sequelize.define("Blocked", {
        blockerId: {
            type: DataTypes.INTEGER,
            references: {
              model: "Users",
              key: 'id'
            },
            primaryKey: true
          },

        blockedId: {
            type: DataTypes.INTEGER,
            references: {
              model: "Users",
              key: 'id'
            },
            primaryKey: true
          },
        
        status: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
        }
    });

    return Blocked;
}