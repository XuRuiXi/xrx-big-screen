import React from 'react';
import { Table as AntTable, Pagination } from 'antd';
import type { ColumnsType } from 'antd/lib/table/Table';
import styles from './Table.less';

interface Props {
  columns: ColumnsType<Record<string, unknown>> | undefined;
  data: Record<string, unknown>[];
  onRowClick<T>(record: T): void;
  onChange: (page: string) => void;
  total: number;
}

const Table = (props: Props) => {
  const { columns, data, onRowClick, onChange, total } = props;

  const _onChange = (page) => {
    onChange(page);
  };

  return (
    <div className={styles.root} id="area">
      <AntTable
        pagination={false}
        dataSource={data}
        columns={columns}
        rowClassName={(record, index) => {
          if (index % 2 === 0) {
            return styles.oldRow;
          }
          return styles.evenRow;
        }}
        onRow={record => ({
          onClick: (event) => {
            if (onRowClick) {
              onRowClick(record);
            }
          },
        })}
      />
      <Pagination
        showQuickJumper
        showSizeChanger={false}
        pageSize={10}
        defaultCurrent={1}
        total={total}
        onChange={_onChange}
      />
      {/* <div className={styles.leftTop} />
      <div className={styles.rightTop} />
      <div className={styles.leftBottom} />
      <div className={styles.rightBottom} /> */}
    </div>
  );
};

Table.defaultProps = {
  onRowClick: () => {},
};

export default Table;
