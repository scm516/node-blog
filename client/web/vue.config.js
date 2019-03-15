const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: './',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  chainWebpack: config => {

      config.module
      .rule('svgIcon')
      .test(/\.svg$/)
      .include
      .add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')  // 一定要添加use
      .loader('svg-sprite-loader')
      .tap(options => {
        // 修改它的选项...
        options = {
          symbolId: 'icon-[name]'
        } 
        return options
      })

      // const svgRule = config.module.rule('svg')
      // svgRule.uses.clear()
      config.module
        .rule('svg')
        .exclude
        .add(resolve('src/icons'))
        .end()
      
        
  }
}