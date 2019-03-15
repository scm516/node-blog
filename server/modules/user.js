const resouceIp = require('../util/ip')
const { 
    article: Article,
    user: User,
    like: Like,
    comment: Comment,
    sequelize
} = require('../schema');
const Op = sequelize.Op;

class UserModel {
    /**
     * 创建用户
     * @param user
     */
    static async create(user) {
        let {username, password, role} = user;
        return await User.create({
            username,
            password,
            role
        })
    }

    /**
     * 更新用户
     * @param info
     */
    static async updateUser(info) {
        return await User.update(info, {
            where: {
                id: info.id
            }
        })
    }

    /**
     * 删除用户
     * @param id listID
     */
    static async delete(id) {
        let info = await User.findById(id)
        if (!info) {
            throw '用户不存在'
        }
        return await User.destroy({
            where: {
                id,
            }
        })
    }

    /**
     * 查询用户列表
     */
    static async findAllUserList(username) {
        if (username) {
            return await User.findAll({
                where: {
                    role: 'user',
                    username: {
                        [Op.like]: '%' + username + '%'
                    }
                }
            })
        } else {
            return  await User.findAll({
                where: {
                    role: 'user'
                }
            })
        }
        
    }

    /**
     * 查询用户信息
     * @param username  姓名
     * @returns {Promise.<*>}
     */
    static async findUserByName(username) {
        let info =  await User.findOne({
            where: {
                username
            }
        })
        return info
    }

    /**
     * 查询用户信息
     * @param id  姓名
     * @returns {Promise.<*>}
     */
    static async findById(id) {
        let info =  await User.findById(id)
        info.avatar = resouceIp + info.avatar
        return info
    }
}

module.exports = UserModel
