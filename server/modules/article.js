const resouceIp = require('../util/ip')
const { 
    article: Article,
    user: User,
    category: Category,
    like: Like,
    comment: Comment,
    sequelize
} = require('../schema');
const Op = sequelize.Op;

class ArticleModule {
    /**
     * 创建文章
     * @param data
     */
    static async createArticle(data) {
        return await Article.create(data)
    }

    /**
     * 更新文章数据
     * @param id  用户ID
     * @param data  事项的状态
     *
     */
    static async updateArticle(query) {
        return await Article.update(query, {
            where: {
                id: query.id
            }
        });
    }

    /**
     * 文章推荐列表
     * @param 
     */

    static async getRecommendList() {
        let list = await Article.findAll({
            limit: 2,
            order: [
                ['recommend', 'DESC'],
                ['createdAt', 'DESC']
            ]
        })
        list.forEach(item => {
            item.banner = resouceIp + item.banner;
        })
        return list;
    }

    /**
     * 获取文章列表
     */
    static async getArticleList(params) {
        
        let ret = null;
        let {page = 1, pageSize = 10, category, keyword } = params;
        page = Number(page)
        pageSize = Number(pageSize)
        let query = {}
        if (category && keyword && keyword !== '' && category !=='') { // 同事存在category和keyword
            query = {
                [Op.and]: [
                    {
                        category
                    },
                    {
                        [Op.or]: [
                            {
                                title: {
                                    // 模糊查询
                                    [Op.like]: '%' + params.keyword + '%'
                                }
                            },
                            {
                                author: {
                                    [Op.like]: '%' + params.keyword + '%'
                                }
                            }
                        ]
                    }

                ]
            }

        } else if (category && category !== '') {
            query = {
                category
            }
        } else if (keyword && keyword !== '') {
            query = {
                [Op.or]: [
                    {
                        title: {
                            // 模糊查询
                            [Op.like]: '%' + params.keyword + '%'
                        }
                    },
                    {
                        author: {
                            [Op.like]: '%' + params.keyword + '%'
                        }
                    }

                ]
            }
        }

        ret = await Article.findAndCountAll({
            limit: pageSize,//每页10条
            offset: (page - 1) * pageSize,
            where: query,
            include: [
                {
                    model: Like,
                    attributes: ['user_id']
                }
            ],
            'order': [
                ['recommend', 'DESC'],
                ['createdAt', 'DESC']
            ],
            attributes: {exclude: ['content']}
        });
        ret.rows.forEach(item => {
           item.banner = resouceIp + item.banner;
        })
        return {
            list: ret.rows,
            currentPage: page,
            pageSize,
            totalCount: ret.count,
            totalPages: Math.ceil(ret.count / pageSize),
        }
    }

    /**
     * 获取文章详情数据
     * @param id  文章ID
     * @returns {Promise<Module>}
     */
    static async getArticleDetail(id) {
        let result = await Article.findOne({
            where: {
                id
            },
            include: [{
                model: User
            }]
        })
        if (!result) return null
        
        let info = {}
        info.author = result.author
        info.banner = resouceIp + result.banner,
        info.id = result.id
        info.category_id = result.category_id
        info.category = result.category
        info.introduce = result.introduce
        info.content = result.content,
        info.title = result.title
        info.createdAt = result.createdAt
        info.updatedAt = result.updatedAt
        info.avatar = resouceIp + result.user.avatar
        info.recommend = result.recommend
        return info
    }

    /**
     * 删除文章
     * @param id listID
     *
     */
    static async deleteArticle(id) {
        let info = await Article.findById(id)
        if (!info) {
            throw '文章不存在'
        }
        return await Article.destroy({
            where: {
                id,
            }
        })
    }

}

module.exports = ArticleModule
