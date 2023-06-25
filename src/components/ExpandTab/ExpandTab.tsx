/*
 * @Author: Gavin
 * @Date: 2021-05-25 13:46:33
 * @LastEditTime: 2021-06-01 15:43:18
 * @FilePath: /data-screen-fe/src/components/ExpandTab/ExpandTab.tsx
 * @Description:
 */
import React, { useState, useRef } from 'react';
// import { useDebounceFn } from 'ahooks';
import { Tabs } from 'antd';
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import styles from './ExpandTab.less';

export interface ExpandTabProps extends React.HTMLAttributes<HTMLDivElement> {
  data: unknown;
  onTabChange: () => unknown;
}

const { TabPane } = Tabs;

const ExpandTab = (props: ExpandTabProps) => {
  const { data, activeKey, onTabChange } = props;

  const tabsRef = useRef();
  const [parentWidth, setParentWidth] = useState(0);
  const [tabsListRef, setTabsListRef] = useState(null);

  const onTabScroll = (direction) => {
    if (!tabsRef.current) {
      return;
    }
    let newListRef = tabsListRef;
    let newParentWidth = parentWidth;
    if (!tabsListRef) {
      try {
        // eslint-disable-next-line prefer-destructuring
        newListRef = tabsRef.current.children[0].children[0].children[1].children[0];
        newParentWidth = tabsRef.current.children[0].children[0].children[1].clientWidth;
        if (newListRef.clientWidth < newParentWidth) {
          return;
        }
        setTabsListRef(newListRef);
        setParentWidth(newParentWidth);
      } catch (error) {}
    }
    // eslint-disable-next-line prefer-destructuring
    const scrollLeftTemp = newListRef.style.cssText
      .split('transform: translate(')[1]
      .split('px, 0px);')[0];
    const { clientWidth } = newListRef;
    const maxScrollLeft = newParentWidth - clientWidth;

    let newScrollLeft = 0;
    if (direction === 'left') {
      newScrollLeft = scrollLeftTemp - 90 <= maxScrollLeft ? maxScrollLeft : scrollLeftTemp - 90;
    } else {
      newScrollLeft = Number(scrollLeftTemp) + 90 >= 0 ? 0 : Number(scrollLeftTemp) + 90;
    }
    newListRef.style.transform = `translate(${newScrollLeft}px, 0px)`;
  };

  const OperationsSlot = {
    left: (
      <div className={styles.operationWrapper} onClick={() => onTabScroll('left')}>
        <CaretLeftOutlined />
      </div>
    ),
    right: (
      <div className={styles.operationWrapper} onClick={() => onTabScroll('right')}>
        <CaretRightOutlined />
      </div>
    ),
  };

  return (
    <div className={styles.root} ref={tabsRef}>
      <Tabs
        tabBarExtraContent={OperationsSlot}
        type="card"
        activeKey={String(activeKey)}
        onChange={onTabChange}
      >
        {(data || []).map(item => (
          <TabPane tab={item.departmentName} key={item.departmentId} />
        ))}
      </Tabs>
    </div>
  );
};

export default ExpandTab;
