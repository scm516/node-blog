const moment = require('moment');
module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        role: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultVlaue: 'user'
        },
        avatar: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultVlaue: ''
        },
        profession: {
            type: DataTypes.STRING(50),
            allowNull: true,
            defaultVlaue: ''
        },
        hobby: {
            type: DataTypes.STRING(50),
            allowNull: true,
            defaultVlaue: ''
        },
        createdAt: {
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD');
            }
        },
        updatedAt: {
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD');
            }
        }
    }, {
        // 如果为 true 则表的名称和 model 相同，即 user
        // 为 false MySQL创建的表名称会是复数 users
        // 如果指定的表名称本就是复数形式则不变
        freezeTableName: true
    })
    User.associate = function(models) {
        // associations can be defined here
        User.hasMany(models.article, { foreignKey: 'user_id' });
        User.hasMany(models.like, { foreignKey: 'user_id' });
        User.hasMany(models.comment, { foreignKey: 'user_id' });
        // User.sync({force: false});
      };
    return User
}
