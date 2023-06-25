import React from 'react';
import styles from './TitleNumberDetail.less';

interface TitleNumberDetailProps {
  img?: string;
  title: string;
  number: number | string;
  unit: string;
  numberClass?: string;
  className?: string;
  [propName: string]: unknown;
}

const TitleNumberDetail = (props: TitleNumberDetailProps) => {
  const { title, number, unit, numberClass = '', img, className = '', ...other } = props;
  return (
    <div className={`${styles.root} ${className}`} {...other}>
      {img && <img className={styles.img} src={img} />}
      {title}
      <span className={`${numberClass} ${styles.number}`}>{number}</span>
      {unit}
    </div>
  );
};

TitleNumberDetail.defaultProps = {
  numberClass: '',
  img: '',
  className: '',
};

export default TitleNumberDetail;
