const config = {
  database: 'newBlog',
  user: 'root',
  password: '123456',
  options: {
    host: 'localhost', // 连接的 host 地址
    dialect: 'mysql', // 连接到 mysql
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true, // 
      freezeTableName: true // 表名默认不加 s
    },
    timezone: '+08:00'
  }
}



module.exports = config
