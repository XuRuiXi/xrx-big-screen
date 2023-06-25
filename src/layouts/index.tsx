import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import React from 'react';
import { Helmet } from 'react-helmet';
import EqRatioBox from '@/components/EqRatioBox';
import ProdErrorCatch from './ProdErrorCatch';

export interface LayoutProps {
  children: React.ReactElement;
}

/**
 * /layouts/index 会默认作为所有页面的容器
 */
export default (props: LayoutProps) => {
  const { children } = props;
  return (
    // antd配置
    <ConfigProvider locale={zhCN}>
      {/* 运行时错误拦截 */}
      <ProdErrorCatch {...props}>
        <Helmet>
          <title>城市运行管理中心</title>
        </Helmet>
        {/* 全局多级菜单布局 */}
        <EqRatioBox
        // 设计稿尺寸
          width={5120}
          height={1440}
          style={{
            // 开发者窗口尺寸
            width: '100%', // 开发先写死 2560,开发完成改回100%
            height: '100%', // 开发先写死 720,开发完成改回
            overflow: 'hidden',
            background: '#ccc',
          }}
        >
          {children}
        </EqRatioBox>
      </ProdErrorCatch>
    </ConfigProvider>
  );
};
