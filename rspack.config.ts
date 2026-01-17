import { defineConfig } from "@rspack/cli";
import { rspack, type SwcLoaderOptions } from "@rspack/core";
import { ReactRefreshRspackPlugin } from "@rspack/plugin-react-refresh";
import path from 'path'

const isDev = process.env.NODE_ENV === "development";

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ["last 2 versions", "> 0.2%", "not dead", "Firefox ESR"];

export default defineConfig({
	entry: {
		main: "./src/main.tsx"
	},
	output: {
		publicPath: '/',
		filename: '[name].bundle.js',
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
			"@api": path.resolve(__dirname, "src/api"),
			"@stores": path.resolve(__dirname, "src/stores"),
			"@assets": path.resolve(__dirname, "src/assets"),
			"@layouts": path.resolve(__dirname, "src/layouts"),
			"@components": path.resolve(__dirname, "src/components"),
			"@views": path.resolve(__dirname, "src/views"),
		},
		extensions: ["...", ".ts", ".tsx", ".jsx"]
	},
	module: {
		rules: [
			{
				test: /\.svg$/,
				type: "asset"
			},
			{
				test: /\.(jsx?|tsx?)$/,
				use: [
					{
						loader: "builtin:swc-loader",
						options: {
							jsc: {
								parser: {
									syntax: "typescript",
									tsx: true
								},
								transform: {
									react: {
										runtime: "automatic",
										development: isDev,
										refresh: isDev
									}
								}
							},
							env: { targets }
						} satisfies SwcLoaderOptions
					}
				]
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					// 将 JS 字符串生成为 style 节点
					'style-loader',
					// 将 CSS 转化成 CommonJS 模块
					'css-loader',
					// 将 Sass 编译成 CSS
					'sass-loader',
				],
			},
		]
	},
	plugins: [
		new rspack.HtmlRspackPlugin({
			template: "./index.html"
		}),
		isDev ? new ReactRefreshRspackPlugin() : null
	],

	devServer: {
		historyApiFallback: true,
		hot: true,
		port: 3000,
		allowedHosts: [
            'localhost',
            '8.209.221.116', 
			'8.137.84.46', // 你的域名
        ],
		proxy: [{
			context: ['/newjersey'],
			target: 'https://www.cnblogs.com/newjersey',
			secure: true,//接受对方是https的接口
			changeOrigin: true,
			pathRewrite: { '^/newjersey': '' },
		}
		]
	},
	optimization: {
		minimizer: [
			new rspack.SwcJsMinimizerRspackPlugin(),
			new rspack.LightningCssMinimizerRspackPlugin({
				minimizerOptions: { targets }
			})
		],
		splitChunks: {
			chunks: 'all',
			cacheGroups: {
				default: false,
				// 禁用默认的 vendor 分割
				vendors: false,
				// 将所有模块打包到一个文件中
				common: {
					name: 'app',
					minChunks: 1,
					chunks: 'all',
					enforce: true
				}
			}
		},
		// 确保只有一个运行时 chunk
		runtimeChunk: false
	},
	experiments: {
		css: true
	},
});
