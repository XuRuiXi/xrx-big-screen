/*
 * @Author: 听风
 * @Date: 2021-12-07 15:02:14
 * @Description: 数据文字
 */

import React from 'react';
import cn from 'classnames';

import styles from './DataFont.less';

export interface DataFontProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: 'base' | 'red';
  size?: number;
}

const DataFont = ({ children, color = 'base', size = 72, style, className }: DataFontProps) => (
  <div className={cn(styles.font1, styles[color], className)} style={{ fontSize: size, ...style }}>
    {children}
  </div>
);

DataFont.defaultProps = {
  color: 'base',
  size: 72,
};

export default DataFont;
