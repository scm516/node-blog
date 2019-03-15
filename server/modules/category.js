// const db = require('../config/db1');
// const Sequelize = db.sequelize;
// const Category = Sequelize.import('../schema/category');
// const Article = Sequelize.import('../schema/article');

const { 
    article: Article,
    category: Category,
} = require('../schema');

class CategoryModule {
    /**
     * 创建分类
     * @param data
     */
    static async createCategory(data) {
        return await Category.create({
            name: data.name
        })
    }

    /**
     * 更新分类数据
     * @param id  分类ID
     * @param data  事项的状态
     */
    static async updateCategory(data) {
        let { id, name } = data

        // 找到该分类下所有的文章更新



        try { 
            await Article.update({
                category: name
            }, {
                where: {
                    category_id: id
                }
            })
        } catch(e) {
            
        }

        return await Category.update({
            name
        }, {
            where: {
                id
            }
        });
    }

    /**
     * 获取分类列表
     * @returns {Promise<*>}
     */
    static async getCategoryList(name) {
        let options = {
            attributes: ['id', 'name'],
        }
        if (name) {
            options = Object.assign({}, options, {
                where: {
                    name
                }
            })
        }
        return await Category.findAll(options)
    }

    // 查询ID分类下的所有文章
    static async getCategoryArticleList(id) {
        return await Category.findAll({
            where: {
                id,
            },
            include: [{
                model: Article
            }]
        })
    }

    /**
     * 获取分类详情数据
     * @param id  文章ID
     * @returns {Promise<Module>}
     */
    static async getCategoryDetail(id) {
        return await Category.findOne({
            where: {
                id,
            },
        })
    }

    /**
     * 删除分类
     * @param id
     * 
     */
    static async deleteCategory(id) {
        let info = await Category.findById(id)
        if (!info) {
            throw '分类不存在'
        }
        return await Category.destroy({
            where: {
                id,
            }
        })
    }

}

module.exports = CategoryModule
