const path = require('path');
const fs = require('fs');
const url = require('url');

const envPublicUrl = process.env.PUBLIC_URL;
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const getPublicUrl = appPackageJson => envPublicUrl || require(appPackageJson).homepage;

function ensureSlash(path, needsSlash) {
    const hasSlash = path.endsWith('/');
    if (hasSlash && !needsSlash) {
        return path.substr(path, path.length - 1);
    } else if (!hasSlash && needsSlash) {
        return `${path}/`;
    } else {
        return path;
    }
}

function getServedPath(appPackageJson) {
    const publicUrl = getPublicUrl(appPackageJson);
    const servedUrl =
        envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
    return ensureSlash(servedUrl, true);
}


module.exports = {
    indexPath: path.resolve(__dirname, '../example/public/index.html'),
	assetsRoot: path.resolve(__dirname, '../build'),
	assetsDirectory: 'static',
	publicPath: '/',
    productionJsSourceMap: false,
    servedPath: getServedPath(resolveApp('package.json')),
    productionSourceMap: true,

    devServer: {
        port: 8800,
        open: true,
        compress: false, // gzip压缩,开发环境不开启,提升热更新速度
        hot: true, // 开启热更新，后面会讲react模块热替换具体配置
        historyApiFallback: true, // 解决history路由404问题
        static: {
            directory: path.join(__dirname, "../public"), //托管静态资源public文件夹
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
	}
};
