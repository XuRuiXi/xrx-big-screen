/*
 * @Author: 听风
 * @Date: 2021-12-07 14:44:52
 * @Description: 待竖线的标题
 */
import React from 'react';
import cn from 'classnames';

import style from './LineTitle.less';

interface LineTitleProps extends React.HTMLAttributes<HTMLDivElement> {}

const LineTitle = (props: LineTitleProps) => {
  const { title, className, children, ...otherProps } = props;
  return (
    <div className={cn(style.root, className)} {...otherProps}>
      {children}
    </div>
  );
};

export default LineTitle;
