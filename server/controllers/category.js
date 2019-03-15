const CategoryModule = require('../modules/category')
const statusCode = require('../util/status-code')

class categoryController {
    /**
     * 创建分类
     * @param ctx
     * @method post
     */
    static async create(ctx) {
        let req = ctx.request.body;
        if (req.name) {
            try {
                const ret = await CategoryModule.createCategory(req);
                const data = await CategoryModule.getCategoryDetail(ret.id);
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200('创建分类成功', data);

            } catch (err) {
                ctx.body = statusCode.ERROR_203({
                    msg: '创建分类失败',
                    err,
                })
            }
        } else {
            ctx.body = statusCode.ERROR_203({
                msg: '请检查参数！'
            })
        }

    }

    /**
     * 获取分类列表
     * @param name
     * @method get
     */
    static async list(ctx) {
        const cname = ctx.query.name || ''
        try {
            const list = await CategoryModule.getCategoryList(cname);
            ctx.response.status = 200;
            let data = {
                list
            }
            ctx.body = statusCode.SUCCESS_200('查询分类列表成功！', data);

        } catch (e) {
            ctx.body = statusCode.ERROR_401(e);
        }
    }

    /**
     * 查询ID分类下的所有文章
     * @method get
     */
    static async getCategoryArticle(ctx) {
        let id = ctx.params.id;
        if (id) {
            try {
                const data = await CategoryModule.getCategoryArticleList(id);
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200('查询成功！', data);

            } catch (e) {
                ctx.body = statusCode.ERROR_203(e.message);
            }
        } else {
            ctx.body = statusCode.ERROR_203({
                msg: '请检查参数！'
            })
        }
    }

    /**
     * 查询单条分类数据
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async detail(ctx) {
        let id = ctx.params.id;

        if (id) {
            try {
                let data = await CategoryModule.getCategoryDetail(id);
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200('查询成功！', {
                    data
                });

            } catch (err) {
                ctx.body = statusCode.ERROR_203({
                    mgs: '查询失败',
                    err,
                })
            }
        } else {
            ctx.body = statusCode.ERROR_203('分类ID必须传');
        }
    }


    /**
     * 删除分类数据
     * @param id
     * @method post
     * @returns {Promise.<void>}
     */
    static async delete(ctx) {
        let id = ctx.request.body.id;

        if (id && !isNaN(id)) {
            try {
                await CategoryModule.deleteCategory(id);
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200('删除分类成功！');

            } catch (err) {
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200({
                    msg: '删除分类失败',
                    err,
                });

            }
        } else {
            ctx.body = statusCode.ERROR_203('分类ID必须传！');
        }
    }

    /**
     * 更新分类数据
     * @method post
     * @param name
     * @returns {Promise.<void>}
     */
    static async update(ctx) {
        let req = ctx.request.body;

        if (req) {
            await CategoryModule.updateCategory(req);

            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('更新分类成功！');
        } else {
            ctx.body = statusCode.ERROR_203('更新分类失败！')
        }
    }
}

module.exports = categoryController
