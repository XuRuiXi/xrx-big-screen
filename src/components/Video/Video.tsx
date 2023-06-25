import React from 'react';
import styles from './Video.less';

interface Props {
  url: string;
  // authorization: string;
  // personId: string;
  // deviceId: string;
}

const Video = (props: Props) => {
  const {
    url = 'http://10.203.0.9/application/gov-embedded-video',
    // eslint-disable-next-line max-len
    // authorization = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJkem1jeSIsInVzZXJOYW1lIjoi5a6a5Lit6Zeo5Z-O6L-QIiwib3JnSWQiOiLlkLTnpZbmupAiLCJvcmdOYW1lIjoiMTg2OTYyMzU1NDMiLCJjcmVhdGVUaW1lIjoxNjQwMzI5NjQzNzU2LCJleHAiOjQxMDI0MTYwMDAwMDB9.JVGwC46uJOkMGKRQnVOcGvGTBg4Uuloe75v_8hEhKmA',
    // personId = '420606199104222514',
    // deviceId = '42060000211310055083',
  } = props;

  return (
    <div className={styles.root}>
      <iframe
        // src={`${url}?authorization=${authorization}&personId=${personId}&deviceId=${deviceId}`}
        src={url}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          zIndex: '-1',
          border: 'none',
        }}
      />
    </div>
  );
};

export default Video;
