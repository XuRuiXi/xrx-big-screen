/*
 * @Author: 听风
 * @Date: 2022-01-10 21:17:37
 * @Description: 模块卡片
 */
import React from 'react';
import ModuleTitle from '@/components/ModuleTitle';
import type { ModuleTitleProps } from '@/components/ModuleTitle';

import styles from './ModuleCard.less';

interface ModuleCardProps {
  width: number;
  title: ModuleTitleProps;
  children?: React.ReactNode;
}

const ModuleCard = ({ width, title, children }: ModuleCardProps) => (
  <div className={styles.root} style={{ width }}>
    <ModuleTitle {...title} />
    <div className={styles.main}>{children}</div>
  </div>
);

ModuleCard.defaultProps = {
  children: '',
};

export default ModuleCard;
