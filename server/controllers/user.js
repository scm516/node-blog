const userModule = require('../modules/user');
const jwt = require('jsonwebtoken');
const secret = require('../config/secret');
const bcrypt = require('bcryptjs');
const util = require('util')
const verify = util.promisify(jwt.verify)
const statusCode = require('../util/status-code')
const fs = require('fs')
const path = require('path')
const resourceIp = require('../util/ip')
const upload = require('../util/upload')
class UserController {
    /**
     * 创建用户
     * @param ctx
     * @returns {Promise<void>}
     */
    static async create(ctx) {
        const user = ctx.request.body;
        user.role = 'user'
        if (user.username && user.password) {
            // 查询用户名是否重复
            const existUser = await userModule.findUserByName(user.username)
            if (existUser) {
                // 反馈存在用户名
                ctx.body = statusCode.ERROR_203('用户已经存在')
                return
            } else {
                // 加密密码
                const salt = bcrypt.genSaltSync();
                const hash = bcrypt.hashSync(user.password, salt);
                user.password = hash;
                // 创建用户
                try {
                    await userModule.create(user);
                } catch (e) {
                    ctx.body = statusCode.ERROR_203(e.message)
                    return
                }
                try {
                    const newUser = await userModule.findUserByName(user.username)
                     // 签发token
                    const userToken = {
                        username: newUser.username,
                        id: newUser.id
                    }

                    // 储存token失效有效期1小时
                    const token = jwt.sign(userToken, secret.sign, {expiresIn: '12h'});
                    ctx.response.status = 200;
                    ctx.body = statusCode.SUCCESS_200('创建用户成功', token)
                } catch (e) {
                    ctx.body = statusCode.ERROR_203(e.message)
                }       
               
            }
        } else {
            ctx.body = statusCode.ERROR_401('创建失败，参数错误');
        }
    }

    /**
     * 查询用户信息
     * @param ctx
     * @returns {Promise<void>}
     */
    static async getUserInfo(ctx) {
        // 获取jwt
        const token = ctx.header.authorization;
        if (token) {
            let payload
            try {
                // 解密payload，获取用户名和ID
                payload = await verify(token.split(' ')[1], secret.sign)
                const uid = payload.id
                try {
                    const userInfo = await userModule.findById(uid)
                    let roles = []
                    roles.push(userInfo.role)
                    const info = {
                        id: userInfo.id,
                        username: userInfo.username,
                        token: token,
                        roles,
                        avatar: userInfo.avatar,
                        profession: userInfo.profession,
                        hobby: userInfo.hobby,
                    }
                    ctx.response.status = 200;
                    ctx.body = statusCode.SUCCESS_200('查询成功', info)
                } catch (err) {
                    ctx.response.status = 200;
                    ctx.body = statusCode.ERROR_203('用户查询失败， 请重新登录')
                }
                       
            } catch (err) {
                ctx.response.status = 200;
                ctx.body = statusCode.ERROR_401('查询失败，authorization error!')
            }
        }
    }

    /**
     * 删除用户
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async delete(ctx) {
        let id = ctx.request.body.id;
        if (!id) {
            ctx.body = statusCode.ERROR_203('用户Id不能为空')
        }
        try {
            await userModule.delete(id);
            ctx.body = statusCode.SUCCESS_200('删除用户成功')
        } catch(e) {
            ctx.body = statusCode.ERROR_203(e)
        }
    }

     /**
     * 编辑用户
     * @param username
     * @param role
     * @param id
     * @returns {Promise.<void>}
     */
   static async update(ctx) {
       let info = ctx.request.body;
       let files = ctx.request.files;
       
        if (files) {
            let file = files.file
            let id = info.id
            // 创建可读流
            // const reader = fs.createReadStream(file.path);
            // let dirPath = path.join(__dirname, '../', `/public/upload/${info.id}`);
            // let filePath = dirPath + `/${file.name}`;
            // if (!fs.existsSync(dirPath)) {
            //     fs.mkdirSync(dirPath)
            // }
            // // 创建可写流
            // const upStream = fs.createWriteStream(filePath)
            // // 可读流通过管道写入可写流
            // reader.pipe(upStream);
            let url = upload(file, id)
            let httpUrl = resourceIp + url
            let query = {
                id: info.id,
                avatar: `/upload/${info.id}/` + file.name
            }
            try {
                await userModule.updateUser(query)
                ctx.body = statusCode.SUCCESS_200('上传成功', { url: httpUrl });
                return;
            } catch(e) {
                ctx.body = statusCode.ERROR_203(e.message);
                return;
            }
 
        }

        if (info.username === '') {
            ctx.body = statusCode.ERROR_203('用户名不能为空') 
            return 
        }
        if (info.id === '') {
            ctx.body = statusCode.ERROR_203('用户id不能为空') 
            return 
        }
        if (info.role === '') {
            ctx.body = statusCode.ERROR_203('角色不能为空') 
            return
        }
       try {
           await userModule.updateUser(info);
           ctx.body = statusCode.SUCCESS_200('用户更新成功')
       } catch(e) {
           ctx.body = statusCode.ERROR_203(e)
       }
   }

    /**
     * 登录
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async login(ctx) {
        const data = ctx.request.body
        // 查询用户
        const user = await userModule.findUserByName(data.username)
        // 判断用户是否存在
        if (user) {
            // 判断前端传递的用户密码是否与数据库密码一致
            if (bcrypt.compareSync(data.password, user.password)) {
                // 用户token
                const userToken = {
                    username: user.username,
                    id: user.id
                }
                // 签发token
                const token = jwt.sign(userToken, secret.sign, {expiresIn: '7d'});

                ctx.body = statusCode.SUCCESS_200('登录成功', {
                    token
                })
            } else {
                ctx.body = statusCode.ERROR_203('用户名或密码错误');
            }
        } else {
            ctx.body = statusCode.ERROR_203('用户不存在');
        }
    }
    /**
     * admin登录
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async adminLogin(ctx) {
        const data = ctx.request.body
        // 查询用户
        const user = await userModule.findUserByName(data.username)
        // 判断用户是否存在
        if (user) {
            if (user.role !== 'admin') {
                ctx.body = statusCode.ERROR_203('用户名或密码错误');
                return;
            }
            // 判断前端传递的用户密码是否与数据库密码一致
            if (bcrypt.compareSync(data.password, user.password)) {
                // 用户token
                const userToken = {
                    username: user.username,
                    id: user.id
                }
                // 签发token
                const token = jwt.sign(userToken, secret.sign, {expiresIn: '7d'});

                ctx.body = statusCode.SUCCESS_200('登录成功', {
                    token
                })
            } else {
                ctx.body = statusCode.ERROR_203('用户名或密码错误');
                return;
            }
        } else {
            ctx.body = statusCode.ERROR_203('用户不存在');
        }
    }

    /**
     * 获取用户列表
     * @param username
     * @returns {Promise.<void>}
     */
    static async getUserList(ctx) {
        let username = ctx.query.username;

        try {
            const data = await userModule.findAllUserList(username);
            let info = data.map(item => {
                return {
                    id: item.id,
                    name: item.username,
                    role: item.role
                }
            })
            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('查询成功', info)
        } catch(e) {
            ctx.body = statusCode.ERROR_401(e)

        }
    }
}

module.exports = UserController