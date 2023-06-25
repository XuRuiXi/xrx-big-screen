import type { CSSProperties } from 'react';
import React, { useMemo, useRef } from 'react';
import { useSize } from 'ahooks';

export interface EqRatioBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  width: number;
  height: number;

  /*
    contain: 保持宽高比，使得内容完全显示在容器内，可能会有留白
    cover: 保持宽高比，使得内容完全覆盖容器，可能会有溢出
  */
  mode?: 'contain' | 'cover';
  xAlign?: 'left' | 'right' | 'center';
  yAlign?: 'top' | 'bottom' | 'center';
  scaleMode?: boolean;
}

const EqRatioBox = (props: EqRatioBoxProps) => {
  const {
    width,
    height,
    mode = 'contain',
    xAlign = 'center',
    yAlign = 'center',
    scaleMode = true,
    children,
    ...otherProps
  } = props;
  const rootRef = useRef<HTMLDivElement>(null);
  // useSize监听窗口变化
  const { width: containerWidth = width, height: containerHeight = height } = useSize(rootRef);

  const { ...style } = useMemo(() => {
    /*
      为了保持宽高比，需要在容器内部进行缩放。
      当mode为contain时，为了保证内容完全显示在容器内，需要缩放到宽高比最小的那个方向。
      当mode为cover时，为了保证内容完全覆盖容器，需要缩放到宽高比最大的那个方向。
    */
    const fn = mode === 'contain' ? Math.min : Math.max;
    const ratio = fn(containerWidth / width, containerHeight / height);

    // 这个尺寸表示内容缩放到合适的比例后的尺寸
    const realSize = {
      width: ratio * width,
      height: ratio * height,
    };

    // 如果是缩放模式，所以容器的宽高都可以是设计稿的尺寸，因为会缩放到合适的比例。
    const contentWidth = scaleMode ? width : realSize.width;
    const contentHeight = scaleMode ? height : realSize.height;

    // 计算内容的偏移量，取0.5是为了居中
    let left = 0.5 * (containerWidth - realSize.width);
    let top = 0.5 * (containerHeight - realSize.height);

    // 设置位置 * 2 是为了适配left: 50%这种情况
    if (xAlign === 'left') left = 0;
    if (xAlign === 'right') left *= 2;
    if (yAlign === 'top') top = 0;
    if (yAlign === 'bottom') top *= 2;

    return {
      // 如果父元素都没有设置relative，那么这里的绝对定位会以body为参考
      position: 'absolute',
      // 保持左上角为形变中心，默认是center
      transformOrigin: 'top left',
      transform: scaleMode ? `scale(${ratio})` : '',
      top,
      left,
      width: contentWidth,
      height: contentHeight,
    };
  }, [mode, containerWidth, width, containerHeight, height, scaleMode, xAlign, yAlign]);

  return (
    <div ref={rootRef} {...otherProps}>
      <div className="eq-ratio-box-content" style={style as CSSProperties}>
        {children}
      </div>
    </div>
  );
};

export default EqRatioBox;
