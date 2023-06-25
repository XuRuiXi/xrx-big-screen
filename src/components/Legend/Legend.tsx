/*
 * @Author: 听风
 * @Date: 2022-01-07 14:38:12
 * @Description: 图例
 */

import React from 'react';
import { useSelector, useDispatch } from 'umi';
import cn from 'classnames';
import type { LegendItem, LegendList } from '@/types';
import icons from '@/assets/images/legend/icon';

import styles from './Legend.less';
import bgHeader from './assets/bg-header.png';

const Legend = () => {
  const dispatch = useDispatch();
  const { legendData } = useSelector(
    (store: {
      map: {
        legendData: LegendList[];
      };
    }) => store.map,
  );
  const handleLegendClick = (legendItem: LegendItem, moduleTitle: string) => {
    const { title, active } = legendItem;
    const nld = legendData.map((ld) => {
      if (ld.title === moduleTitle) {
        const nlt = ld.list.map((d) => {
          if (d.title === title) {
            return {
              ...d,
              active,
            };
          }
          return d;
        });
        return {
          ...ld,
          list: nlt,
        };
      }
      return ld;
    });
    dispatch({ type: 'map/sprinkleLegend', legendItem });
    dispatch({ type: 'map/setLegendData', legendData: nld });
  };
  return (
    <div className={styles.root}>
      <div className={styles.bg}>
        <img className={styles['bg-header']} src={bgHeader} width="300px" />
        <div className={styles['bg-main']} />
      </div>
      <div className={styles.content}>
        {legendData.map(ld => (
          <div className={styles.module} key={ld.title}>
            <div className={styles.title}>{ld.title}</div>
            <div className={styles.list}>
              {ld.list.map((ldl) => {
                const { title, count, active } = ldl;
                return (
                  <div
                    className={cn(styles.item, { [styles['item-active']]: active })}
                    key={title}
                    onClick={() => {
                      handleLegendClick({ ...ldl, active: !active }, ld.title);
                    }}
                  >
                    <img
                      src={icons[`${active ? 'selected' : 'noSelected'}/${title}`]}
                      className={styles.icon}
                    />
                    <div className={styles.name}>{title}</div>
                    {(count || count === 0) && <div className={styles.count}>{count}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend;
