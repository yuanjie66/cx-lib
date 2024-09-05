const { merge } = require("webpack-merge");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const portfinder = require('portfinder');

const baseConfig = require("./webpack.base.js");
const config = require("./config");

// 合并公共配置,并添加开发环境配置
const devWebpackConfig = merge(baseConfig, {
    mode: "development", // 开发模式,打包更加快速,省了代码优化步骤
    devtool: "eval-cheap-module-source-map", // 源码调试模式,后面会讲
    devServer: {
        ...config.devServer
    },
    plugins: [
        // 开启react模块热替换插件
        new ReactRefreshWebpackPlugin(),
        // new ReactRefreshWebpackPlugin({ overlay: false }), // ? 关闭304报错
    ],
    optimization: {
        runtimeChunk: 'single'
    }
});


module.exports = new Promise((resolve, reject) => {
    // 如果默认端口被占用，自动查找可用端口
    portfinder.basePort = config.devServer.port;
    portfinder.getPort((err, port) => {
        if (err) reject(err)
        else {
            devWebpackConfig.devServer.port = port;
        }
        resolve(devWebpackConfig)
    })
})
