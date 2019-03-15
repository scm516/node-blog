// const db = require('../config/db1');
// const Sequelize = db.sequelize;
// const Article = Sequelize.import('../schema/article');
// const Like = Sequelize.import('../schema/like');
// const User = Sequelize.import('../schema/user');
// const Op = Sequelize.Op;
// const Comment = Sequelize.import('../schema/comment');

const { 
  article: Article,
  user: User,
  like: Like,
  comment: Comment,
  sequelize
} = require('../schema');
const Op = sequelize.Op;


// Comment.belongsTo(User, { foreignKey: 'user_id' })

class CommentModule {
  /**
   * 获取文章下评论列表
   * @param article_id 
   */
  static async getCommenList(id) {
    // let info = await Article.findById(id, {
    //   include: [{
    //    model: Comment,
    //    'order':['comment_id', 'DESC'],
    //    include: [{
    //     model: User,
    //    }]
    //   }]
    // })
    // return {
    //   article_id: info.id,
    //   list: info.comments.map(item => {
    //     return {
    //       createdAt: item.createdAt,
    //       updatedAt: item.updatedAt,
    //       comment_id: item.id,
    //       content: item.content,
    //       user_id: item.user_id,
    //       username: item.user.username
    //     }
    //   })
    // }

    // return info
    let info = await Comment.findAll({
      where: {
        article_id: id
      },
      include: [{
        model: User
      }],
      order: [
        ['updatedAt', 'DESC']
      ]
    })
    
    if (!info.length) return info
    let list = info.map(item => {
      return {
        id: item.id,
        updatedAt: item.updatedAt,
        createdAt: item.createdAt,
        content: item.content,
        username: item.user.username,
        user_id: item.user_id,
        avatar: item.user.avatar
      }
    })

    return list
  }

  /**
   * 添加评论
   */
  static async createComment(info) {
    const { article_id, user_id, content } = info
    let newComment =  await Comment.create({
      article_id,
      user_id,
      content
    })
    try {
      // 文章评论数加1
      let articleInfo = await Article.findById(article_id)
      let comment_count = articleInfo.comment_count
      comment_count++
      await Article.update({
        comment_count
      }, {
        where: {
          id: article_id
        }
      })
      return newComment
    } catch(e) {
      throw e
    }
  }
}


module.exports = CommentModule