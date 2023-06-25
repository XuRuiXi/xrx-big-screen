import { defineConfig } from 'umi';
import theme from './theme';

export default defineConfig({
  locale: {
    default: 'zh-CN',
    antd: true,
  },
  ignoreMomentLocale: true,
  theme,
  hash: true,
  proxy: {
    '/udc': {
      target: 'http://data-open-engine-be-daily.ingress.dayu.work/',
      changeOrigin: true,
      // pathRewrite: { '^/zhdp': '' },
    },
    '/citygis': {
      target: 'http://10.203.0.37',
      changeOrigin: true,
    },
    '/prod-api/profile/avatar': {
      target: 'http://10.203.0.106:7777',
      changeOrigin: true,
    },
  },
  chainWebpack(memo) {
    // 修改less-loader的css-modules的配置，添加文件名作为前缀
    memo.module
      .rule('less')
      .oneOf('css-modules')
      .use('css-loader')
      .options({
        modules: {
          localIdentName: '[name]__[local]__[hash:base64:5]',
        },
      });
  },
});
