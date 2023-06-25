import React from 'react';
import styles from './Circle.less';

interface CircleProps extends React.AllHTMLAttributes<HTMLDivElement> {
  title?: string;
  titleColor?: string;
  dashedColor?: string;
  shadowColor?: string;
}

const Circle = (props: CircleProps) => {
  const { title, dashedColor, shadowColor = '', titleColor, ...otherProps } = props;
  return (
    <div
      className={styles.Circle}
      style={{ boxShadow: `0 0 26px 0 ${shadowColor}` }}
      {...otherProps}
    >
      <div className={styles.title} style={{ color: titleColor }}>
        {title}
      </div>
      <svg style={{ height: '100%', width: '100%' }}>
        <g stroke={dashedColor} fillOpacity="0" strokeWidth="14">
          <circle r="83" cx="90" cy="90" strokeDasharray="19,19" />
        </g>
      </svg>
    </div>
  );
};

Circle.defaultProps = {
  title: '',
  dashedColor: '#00E4FF',
  shadowColor: 'rgba(204,242,255,0.47)',
  titleColor: '#FFFFFF',
};

export default Circle;
