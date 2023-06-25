import { usePersistFn, usePrevious } from 'ahooks';
import { eq } from 'lodash-es';
import { useEffect } from 'react';
import loadScript from './LoadScript';

export interface ReactScriptProps {
  src: string | string[];
  onLoad?: () => void;
  onError?: (err: Error) => void;
}

const ReactScript = (props: ReactScriptProps) => {
  const { src, onError, onLoad } = props;
  const handleLoad = usePersistFn(() => {
    onLoad?.();
  });
  const handleError = usePersistFn((err) => {
    onError?.(err);
  });

  const prevSrc = usePrevious(src);

  useEffect(() => {
    if (!eq(src, prevSrc)) {
      const srcList = Array.isArray(src) ? src : [src];
      Promise.all(srcList.map(src => loadScript(src).catch(handleError))).then(handleLoad);
    }
  }, [src]);
  return null;
};

export default ReactScript;
