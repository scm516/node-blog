const LikeModule = require('../modules/like')
const statusCode = require('../util/status-code')

class LikeController {
  /**
   * 用户点赞更新
   * @param user_id
   * @param article_id
   * 
   */

  static async update(ctx) {
    let req = ctx.request.body;

    try {
      let likeInfo = await LikeModule.isExist(req)
      if (likeInfo) {
        // 如果点过赞了
        ctx.body = statusCode.ERROR_203('你已经点过赞了')
        return
      }
      try {
        // 更新点赞表
        await LikeModule.addLike(req)
        await LikeModule.updateLikeCount(req)
        ctx.body = statusCode.SUCCESS_200('点赞成功')
      } catch(e) {
        ctx.body = statusCode.ERROR_401(e.message)
      }
    } catch(e) {
      ctx.body = statusCode.ERROR_401(e.message)
    }
  }
}

module.exports = LikeController