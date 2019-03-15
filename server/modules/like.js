// const db = require('../config/db1');
// const Sequelize = db.sequelize;
// const Op = Sequelize.Op;
// const Like = Sequelize.import('../schema/like')
// const Article = Sequelize.import('../schema/article')

const { 
  article: Article,
  like: Like,
  sequelize
} = require('../schema');
const Op = sequelize.Op;


class LikeModule {
  /**
   * 检测like表里面某个用户是否对特定的文章点过赞
   * @param req.user_id req.article_id
   */
  static async isExist(req) {
    let { user_id, article_id } = req
    let list = await Like.findAll({
      where: {
        user_id,
        article_id
      }
    })
    return list.length
  }
  static async addLike(req) {
    let { user_id, article_id } = req
    return Like.create({
        user_id,
        article_id
      })
  }
  static async updateLikeCount(req) {
    let { article_id } = req
    try {
      let info = await Article.findById(article_id)
      info.set('like_count', info.get('like_count') + 1)
      info.save()
      return info
    } catch(e) {
      throw e
    }
  }
}
module.exports = LikeModule