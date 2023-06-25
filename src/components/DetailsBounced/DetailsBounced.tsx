import React from 'react';
import upperBounced from '@/assets/images/upperBounced.png';
import bouncedDown from '@/assets/images/bouncedDown.png';
import close from '@/assets/images/close.png';
import titleHorizontal from '@/assets/images/titleHorizontal.png';
import decoration from '@/assets/images/decoration.png';
import styles from './DetailsBounced.less';

const DetailsBounced = (props) => {
  const { children, title = '案件详情', handleCloese } = props;
  return (
    <div className={styles.root}>
      <img src={upperBounced} alt="" className={styles.upperBounced} />
      <div className={styles.content}>
        <div className={styles.titleClose}>
          <span className={styles.title}>
            <img src={decoration} alt="" className={styles.decoration} />
            <span className={styles.titleTitle}>{title}</span>
          </span>
          <img src={close} alt="" className={styles.close} onClick={handleCloese} />
        </div>
        <img src={titleHorizontal} alt="" className={styles.titleHorizontal} />
        {children}
      </div>
      <img src={bouncedDown} alt="" className={styles.bouncedDown} />
    </div>
  );
};

export default DetailsBounced;
