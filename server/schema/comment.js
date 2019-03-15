const moment = require('moment');
const Model = require('./index');
module.exports = function (sequelize, DataTypes) {
    const Comment = sequelize.define('comment', {
        // 评论id
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: true,
            autoIncrement: true,
        },
        // 文章内容id
        // article_id: {
        //   type: DataTypes.INTEGER,
        //   allowNull: false
        // },
        // // 用户id
        // user_id: {
        //   type: DataTypes.INTEGER,
        //   allowNull: false
        // },
        content:{
            type: DataTypes.STRING,
            allowNull: false,
            getDataValue: ''
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

    Comment.associate = function(models) {
        // associations can be defined here
        Comment.belongsTo(models.user, { foreignKey: 'user_id' })
        // Comment.sync({force: false});
    };

    return Comment
}