import React from 'react';
import type { ReactNode } from 'react';
import style from './ModuleTitle.less';

export interface ModuleTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  LeftTitle: ReactNode;
  rigtTitle?: ReactNode;
  size?: 'big' | 'normal';
}

const SIZE_MAP = {
  big: {
    leftTilteFontSize: '28px',
    height: '66px',
  },
  normal: {
    leftTilteFontSize: '28px',
    height: '60px',
  },
};

const ModuleTitle = (props: ModuleTitleProps) => {
  const { LeftTitle, rigtTitle, className = '', size = 'normal', style: sty, ...others } = props;
  return (
    <div
      className={`${style.root} ${className}`}
      style={{
        ...sty,
        fontSize: SIZE_MAP[size].leftTilteFontSize as unknown as string,
        height: SIZE_MAP[size].height as unknown as string,
      }}
      {...others}
    >
      <div className={style.leftTitle}>{LeftTitle}</div>
      <div className={style.rightTitle}>{rigtTitle}</div>
    </div>
  );
};

ModuleTitle.defaultProps = {
  rigtTitle: '',
};

export default ModuleTitle;
