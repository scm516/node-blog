const CommentModule = require('../modules/comment')
const statusCode = require('../util/status-code')
// const db = require('../config/db1');
// const Sequelize = db.sequelize;
// const Comment = Sequelize.import('../schema/comment')

const { comment: Comment } = require('../schema')

class CommentController {

  /**
   * 文章评论
   * @param ctx.article_id
   * @param ctx.user_id
   * @param ctx.content
   */
  static async create(ctx) {
    let info = ctx.request.body

    try {
      let result = await CommentModule.createComment(info)
      ctx.body = statusCode.SUCCESS_200(result)
    } catch(e) {
      ctx.body = statusCode.ERROR_401(e.message)
    }
  }

  /**
   * 文章评论列表
   * @param ctx.article_id
   */
  static async articleComment(ctx) {
    let req = ctx.query
    let { article_id } = req
    try {
      let info = await CommentModule.getCommenList(article_id)
      let result = {
        list: info
      }
      ctx.body = statusCode.SUCCESS_200('查询文章列表成功', result)
    } catch(e) {
      ctx.body = statusCode.ERROR_401(e.message)
    }
  }
}

module.exports = CommentController