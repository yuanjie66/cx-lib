import { readFileSync } from 'node:fs'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import babel from '@rollup/plugin-babel'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import path from 'path'

const pkg = JSON.parse(readFileSync('./package.json'))

export default {
    input: './src/index.ts', // 入口文件
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            sourcemap: true,
        },
        {
            file: pkg.module,
            format: 'esm',
            sourcemap: true,
        },
    ],
    plugins: [
        peerDepsExternal(),
        resolve(),
        commonjs(),
        typescript({
            tsconfig: './tsconfig.json',
            declaration: true,
            declarationDir: 'types',
            outDir: 'dist',
          }),
        babel({
            exclude: 'node_modules/**',
            babelHelpers: 'bundled',
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
        }),
        postcss({
            extract: false, // 如果需要输出单独的CSS文件，可以设置为true
            modules: true,
            use: ['less'],
        })
    ],
}
