const Router = require('koa-router')
const UserController = require('../controllers/user')
const CategoryController = require('../controllers/category')
const ArticleController = require('../controllers/article')
const CommentController = require('../controllers/comment')
const LikeController = require('../controllers/like')
const router = new Router({
})

/**
 * 用户接口
 */
// 用户注册
router.post('/user/register', UserController.create);
// 用户登录
router.post('/user/login', UserController.login);
// 管理员登录
router.post('/admin/login', UserController.adminLogin);
// 编辑用户
router.post('/user/update', UserController.update);
// 删除用户
router.post('/user/delete', UserController.delete);
// 获取用户信息
router.get('/user/info', UserController.getUserInfo);
// 获取用户列表
router.get('/user/list', UserController.getUserList);

/**
 * 文章接口
 */
// 创建文章
router.post('/article/create', ArticleController.create);
// 获取文章详情
router.get('/article/detail/', ArticleController.detail);
// 删除文章
router.post('/article/delete', ArticleController.delete);
// 更改文章
router.post('/article/update', ArticleController.update);
// 获取文章列表
router.get('/article/list', ArticleController.list);
// 获取推荐文章
router.get('/article/recommend', ArticleController.getRecommendList);
// 文章搜索
router.post('/article/search', ArticleController.search)
// 文章图片
router.post('/article/image', ArticleController.addImage)

/**
 * 分类接口
 */
// 创建分类
router.post('/category/create', CategoryController.create);
// 获取分类详情
router.get('/category/detail', CategoryController.detail);
// 删除分类
router.post('/category/delete', CategoryController.delete);
// 更改分类
router.post('/category/update', CategoryController.update);
// 获取分类列表
router.get('/category/list', CategoryController.list);


/**
 * 用户点赞
 */
router.post('/like/update', LikeController.update)

/**
 * 评论
 */
router.post('/comment/add', CommentController.create)
router.get('/comment/articleComment', CommentController.articleComment)

module.exports = router
