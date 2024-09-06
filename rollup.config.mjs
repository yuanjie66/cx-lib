import {readFileSync} from 'node:fs';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import dts from 'rollup-plugin-dts';

const pkg = JSON.parse(readFileSync('./package.json'));

export default [
	{
		input: './src/index.ts', // 入口文件
		output: [
			{
				file: pkg.main,
				format: 'cjs',
				sourcemap: false,
			},
			{
				file: pkg.module,
				format: 'esm',
				sourcemap: false,
			},
		],
		external: ['react', 'react-dom'],
		plugins: [
			peerDepsExternal(), // 确保 peerDependencies 不会打包进库中
			resolve(), // 允许 Rollup 解析 node_modules 中的模块
			commonjs(), // 支持 CommonJS 格式的模块
			babel({
				extensions: ['.js', '.jsx', '.ts', '.tsx'],
				babelHelpers: 'runtime', // 改为 'runtime'
				plugins: [
					['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }, 'antd'],
					'@babel/plugin-transform-runtime', // 添加 runtime 插件
				  ],
			}),
			typescript({
				tsconfig: './tsconfig.prod.json',
				declaration: true,
				declarationDir: 'types',
				outDir: 'dist',
			}),
			postcss({
				use: [
					['less', { javascriptEnabled: true}]
				],
				extensions: ['.css', '.less'], // 处理 Less 文件
				extract: 'dist/styles.css', // 将样式提取到单独文件
			}),
		]
	},
	{
		input: './dist/esm/types/index.d.ts',
		output: [{file: './dist/index.d.ts', format: 'esm'}],
		plugins: [dts()],
		external: [/\.(css|less|scss)$/],
	},
];
