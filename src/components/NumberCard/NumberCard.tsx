/*
 * @Author: Gavin
 * @Date: 2021-05-25 13:46:33
 * @LastEditTime: 2021-05-29 21:55:37
 * @FilePath: /data-screen-fe/src/components/NumberCard/NumberCard.tsx
 * @Description:
 */
import React from 'react';
import DigitalFlop from '@/components/DigitalFlop';
import styles from './NumberCard.less';

export interface NumberCardProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number;
  height?: number;
  count: number;
  unit?: string;
  title: string;
  decimals: number;
}

const NumberCard = (props: NumberCardProps) => {
  const { width = 255, height = 191, style, count, title, decimals, unit, ...otherProps } = props;

  return (
    <div style={{ width, height, ...style }} className={styles.root} {...otherProps}>
      <div className={styles.numWrapper}>
        <DigitalFlop
          value={count}
          color="#52FF9A"
          decimals={decimals}
          numStyle={{ fontFamily: 'Helvetica', fontSize: 64, letterSpacing: '5.33px' }}
        />
        <div className={styles.unit}>{unit}</div>
      </div>
      <div className={styles.title}>{title}</div>
    </div>
  );
};

export default NumberCard;
