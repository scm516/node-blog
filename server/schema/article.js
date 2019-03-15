const moment = require('moment');
const Model = require('./index');
module.exports = function (sequelize, DataTypes) {
    const Article = sequelize.define('article', {
        // 文章ID
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // 文章标题
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'title',
        },
        // 文章作者
        author: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'author',
        },
        // 是否推荐
        recommend: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        // 文章介绍
        introduce: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'introduce'
        },
        // 文章分类
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'category'
        },
        // 文章封面
        banner: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'banner'
        },
        // 文章内容
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'content'
        },
         // 点赞个数
        like_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
          // 评论个数
        comment_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        // 浏览次数
        browser: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'browser',
            defaultValue: 0
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

    Article.associate = function(models) {
        // associations can be defined here
        Article.hasMany(models.like, { foreignKey: 'article_id' })
        Article.hasMany(models.comment, { foreignKey: 'article_id' })
        Article.belongsTo(models.user, { foreignKey: 'user_id' })
        Article.belongsTo(models.category, {as: 'Current', foreignKey: 'category_id'}); 
        // Article.sync({force: false});
      };
    return Article

}