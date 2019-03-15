const {
    article: Article,
    category: Category,
    user: User,
    sequelize
} = require('../schema')
const serverIp = require('../util/ip')
const upload = require('../util/upload')
const ArticleModule = require('../modules/article')
const statusCode = require('../util/status-code')
const fs = require('fs')
const path = require('path')

class articleController {
    /**
     * 创建文章
     * @param ctx
     */
    static async create(ctx) {
        let info = ctx.request.body;
        let files = ctx.request.files;

        if (info.title === '') {
            ctx.body = statusCode.ERROR_203('标题不能为空') 
            return 
        }
        if (info.author === '') {
            ctx.body = statusCode.ERROR_203('作者不能为空')
            return 
        }
        if (info.introduce === '') {
            ctx.body = statusCode.ERROR_203('简介不能为空') 
            return
        }
        if (info.content === '') {
            ctx.body = statusCode.ERROR_203('内容不能为空') 
            return
        }
        if (info.category === '') {
            ctx.body = statusCode.ERROR_203('请选择分类') 
            return
        }
        
        let query = {          
            user_id: info.user_id,
            category_id: info.category_id,
            title: info.title,
            author: info.author,
            introduce: info.introduce,
            content: info.content,
            recommend: info.recommend,
            banner: `/upload/` + 'banner.jpg'
        }
        
        let categoryInfo = await Category.findById(info.category_id)

        if (!categoryInfo) {
            ctx.body = statusCode.ERROR_203('分类不存在')
        }
        // 将category的name存入article
        query.category = categoryInfo.name

        if (files) {
            let file = files.file;
            let user_id = info.user_id;
            let url = upload(file, user_id)
            query.banner = url
        }
        try {
            
            await ArticleModule.createArticle(query)
            ctx.body = statusCode.SUCCESS_200('添加文章成功');
            return;
        } catch(e) {
            ctx.body = statusCode.ERROR_203(e.message);
            return;
        }

    }


    /**
     * 
     * @param user_id
     */
    static async addImage(ctx) {
        let info = ctx.request.body;
        let files = ctx.request.files;
        // if ()
        if (files) {
            let file = files.image
            try {
                const url = upload(file, info.user_id)
                const httpUrl = serverIp + url
                let result = {
                    url: httpUrl
                }
                ctx.body = statusCode.SUCCESS_200('图片上传成功', { url: httpUrl })
            } catch(e) {
                ctx.body = statusCode.ERROR_203(e.message);
            }
        }
    }

    static async getRecommendList(ctx) {
        try {
            let data = await ArticleModule.getRecommendList();
            if (data) {
                ctx.response.status = 200;
                let result = {
                    list: data
                }
                ctx.body = statusCode.SUCCESS_200('查询文章成功！', result)
            } else {
                ctx.body = statusCode.ERROR_204('未找到改文章')
            }
            
        } catch (e) {
            ctx.body = statusCode.ERROR_203(e.message);
        }
    }

    /**
     * 获取文章列表
     * @param title
     * @param category
     * @param author
     */
    static async list(ctx) {
        let params = ctx.query;
        try {
            const data = await ArticleModule.getArticleList(params);
            
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('查询文章列表成功！', data)
        } catch (e) {
            ctx.body = statusCode.ERROR_401(e.message);
        }
    }

    /**
     * 查询单条文章数据
     * @param ctx
     */
    static async detail(ctx) {
        let id = ctx.query.id;

        if (id) {
            try {
                let data = await ArticleModule.getArticleDetail(id);
                if (data) {
                    ctx.response.status = 200;
                    ctx.body = statusCode.SUCCESS_200('查询成功！', data);
                } else {
                    ctx.body = statusCode.ERROR_203('查询失败，未找到改文章');
                }

            } catch (err) {
                ctx.body = statusCode.ERROR_204(err.message)
            }
        } else {
            ctx.body = statusCode.ERROR_204('文章ID必须传');
        }
    }


    /**
     * 删除文章数据
     * @param ctx
     */
    static async delete(ctx) {
        let id = ctx.request.body.id;

        if (id && !isNaN(id)) {
            try {
                await ArticleModule.deleteArticle(id);
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200('删除文章成功！');

            } catch (err) {
                ctx.response.status = 200;
                ctx.body = statusCode.SUCCESS_200({
                    msg: '删除失败',
                    err,
                });

            }
        } else {
            ctx.body = statusCode.ERROR_203('文章ID必须传！');
        }
    }

    /**
     * // 搜索文章标题
     * @param keyword
     */
    static async search(ctx) {
        let info = ctx.request.body
        ctx.body = 'ssss'
        try {
            let list = await ArticleModule.search(info)
            let result = {
                list
            }
            ctx.body = statusCode.SUCCESS_200('查询成功', result)
        } catch(e) {
            ctx.body = statusCode.ERROR_203(e.message)
        }
    }


    /**
     * 更新文章数据
     * @param ctx
     */
    static async update(ctx) {
        let info = ctx.request.body
        let files = ctx.request.files
        let query = {
            id: info.id,
            user_id: info.user_id,
            category_id: info.category_id,
            title: info.title,
            author: info.author,
            introduce: info.introduce,
            content: info.content,
            recommend: info.recommend
        }

        let categoryInfo = await Category.findById(info.category_id)

        if (!categoryInfo) {
            ctx.body = statusCode.ERROR_203('分类不存在')
        }
        // 将category的name存入article
        query.category = categoryInfo.name

        if (files) {
            let file = files.file
            let user_id = info.user_id
            let url = upload(file, user_id)
            query.banner = url
        }
        try {
            await ArticleModule.updateArticle(query);
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('更新文章成功!');
        } catch(e) {
            ctx.body = statusCode.ERROR_203(e.message)
        }
    }
}

module.exports = articleController
